import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Booking, SupportedLanguage } from '../types';
import type { GeoPoint } from '../services/mapService';
import { PUNE_CENTER } from '../services/mapService';
import { DEMO_CUSTOMER_BOOKINGS } from '../portals/customerDemo';
import { INITIAL_JOB_STATUS, type JobStatus } from '../portals/workerData';

const BOOKINGS_KEY = 'rozgar.customer.bookings.v1';
const FAVORITES_KEY = 'rozgar.customer.favorites.v1';
const JOB_STATUS_KEY = 'rozgar.worker.job-status.v1';

interface AppStateValue {
  language: SupportedLanguage;
  setLanguage: (l: SupportedLanguage) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedServiceSlug: string | null;
  setSelectedServiceSlug: (s: string | null) => void;
  userArea: string;
  setUserArea: (a: string) => void;
  userLocation: GeoPoint;
  setUserLocation: (g: GeoPoint) => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  rateBooking: (id: string, rating: number, feedback: string) => void;
  favoriteWorkerIds: string[];
  toggleFavorite: (id: string) => void;
  jobStatuses: Record<string, JobStatus>;
  updateJobStatus: (id: string, status: JobStatus) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [userArea, setUserArea] = useState('Pune');
  const [userLocation, setUserLocation] = useState<GeoPoint>({
    ...PUNE_CENTER,
    label: 'Shivaji Nagar, Pune (Default)',
  });
  const [bookings, setBookings] = useState<Booking[]>(() => DEMO_CUSTOMER_BOOKINGS.map((booking) => ({ ...booking })));
  const [favoriteWorkerIds, setFavoriteWorkerIds] = useState<string[]>([]);
  const [jobStatuses, setJobStatuses] = useState<Record<string, JobStatus>>({ ...INITIAL_JOB_STATUS });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      AsyncStorage.getItem(BOOKINGS_KEY),
      AsyncStorage.getItem(FAVORITES_KEY),
      AsyncStorage.getItem(JOB_STATUS_KEY),
    ]).then(([storedBookings, storedFavorites, storedJobStatuses]) => {
      if (!mounted) return;
      if (storedBookings) {
        try {
          setBookings(JSON.parse(storedBookings) as Booking[]);
        } catch {
          setBookings(DEMO_CUSTOMER_BOOKINGS.map((booking) => ({ ...booking })));
        }
      }
      if (storedFavorites) {
        try {
          setFavoriteWorkerIds(JSON.parse(storedFavorites) as string[]);
        } catch {
          setFavoriteWorkerIds([]);
        }
      }
      if (storedJobStatuses) {
        try {
          setJobStatuses({ ...INITIAL_JOB_STATUS, ...(JSON.parse(storedJobStatuses) as Record<string, JobStatus>) });
        } catch {
          setJobStatuses({ ...INITIAL_JOB_STATUS });
        }
      }
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteWorkerIds));
  }, [favoriteWorkerIds, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(JOB_STATUS_KEY, JSON.stringify(jobStatuses));
  }, [jobStatuses, hydrated]);

  const addBooking = (booking: Booking) => setBookings((previous) => [booking, ...previous]);

  const updateBooking = (id: string, patch: Partial<Booking>) => {
    setBookings((previous) => previous.map((booking) => (booking.id === id ? { ...booking, ...patch } : booking)));
  };

  const cancelBooking = (id: string) => updateBooking(id, { status: 'cancelled' });

  const rateBooking = (id: string, rating: number, feedback: string) => {
    updateBooking(id, { rating, feedback: feedback.trim() || undefined });
  };

  const toggleFavorite = (id: string) => {
    setFavoriteWorkerIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobStatuses((previous) => ({ ...previous, [id]: status }));
  };

  return (
    <AppStateContext.Provider
      value={{
        language, setLanguage, searchQuery, setSearchQuery,
        selectedServiceSlug, setSelectedServiceSlug,
        userArea, setUserArea, userLocation, setUserLocation,
        bookings, addBooking, updateBooking, cancelBooking, rateBooking,
        favoriteWorkerIds, toggleFavorite,
        jobStatuses, updateJobStatus,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
