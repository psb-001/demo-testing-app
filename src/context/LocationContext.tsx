import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toGeoPoint } from '../services/locationService';
import type { GeoPoint } from '../services/mapService';
import type { ServiceLocation } from '../types';

/**
 * Service-location store — ported from
 * workconnect/src/context/LocationContext.tsx.
 *
 * The public shape is unchanged, so consumers written against the web version
 * work here. One adaptation was unavoidable:
 *
 *   web     `useState<ServiceLocation>(() => readStore(KEY, null) ?? DEMO_LOCATION)`
 *           localStorage is synchronous, so the first render already has the
 *           stored location and there is no flash.
 *
 *   mobile  AsyncStorage is asynchronous. A lazy `useState` initialiser would
 *           always start from DEMO_LOCATION and then overwrite the stored value
 *           with the demo placeholder on the first persistence effect — losing
 *           the user's real address. So reads happen in a mount effect behind a
 *           `hydrated` flag, and the write-back effect is gated on it.
 *
 * `AppState.tsx` already uses exactly this pattern for bookings and favourites,
 * so this is consistent with the rest of the app rather than a new convention.
 */

export const LOCATION_KEY = 'rozgar.location.v1';
export const ADDRESSES_KEY = 'rozgar.location.addresses.v1';

/**
 * Seeded placeholder. Shown as "Demo location" in the UI so it is never
 * presented as the user's real address.
 */
export const DEMO_LOCATION: ServiceLocation = {
  label: 'Pune (demo)',
  locality: 'Shivajinagar',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411005',
  formattedAddress: 'Shivajinagar, Pune, Maharashtra 411005',
  latitude: 18.5308,
  longitude: 73.8478,
  source: 'manual',
  isDemo: true,
  // Epoch sentinel so the UI can detect "never really set".
  updatedAt: new Date(0).toISOString(),
};

/** Runtime guard on the hydrated record; corrupt storage falls back to demo. */
function isUsableLocation(v: unknown): v is ServiceLocation {
  if (!v || typeof v !== 'object') return false;
  const loc = v as ServiceLocation;
  if (loc.source !== 'manual' && loc.source !== 'gps') return false;
  if (typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') return false;
  return Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude);
}

function isUsableAddressList(v: unknown): v is ServiceLocation[] {
  return Array.isArray(v) && v.every((entry) => typeof entry === 'object' && entry !== null);
}

export interface LocationContextValue {
  location: ServiceLocation;
  geoPoint: GeoPoint | null;
  hasLocation: boolean;
  isDemoLocation: boolean;
  setLocation: (next: ServiceLocation) => void;
  updateLocation: (patch: Partial<ServiceLocation>) => void;
  clearLocation: () => void;
  resetToDemo: () => void;
  savedAddresses: ServiceLocation[];
  saveAddress: (next: ServiceLocation) => ServiceLocation;
  updateAddress: (id: string, patch: Partial<ServiceLocation>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<ServiceLocation>(DEMO_LOCATION);
  const [savedAddresses, setSavedAddresses] = useState<ServiceLocation[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydration ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawLocation, rawAddresses] = await Promise.all([
          AsyncStorage.getItem(LOCATION_KEY),
          AsyncStorage.getItem(ADDRESSES_KEY),
        ]);
        if (cancelled) return;
        if (rawLocation) {
          const parsed: unknown = JSON.parse(rawLocation);
          if (isUsableLocation(parsed)) setLocationState(parsed);
        }
        if (rawAddresses) {
          const parsed: unknown = JSON.parse(rawAddresses);
          if (isUsableAddressList(parsed)) setSavedAddresses(parsed);
        }
      } catch {
        /* corrupt or unavailable storage — keep the demo default */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Persistence (gated, so hydration is never clobbered) ──────────────
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location)).catch(() => {});
  }, [location, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(savedAddresses)).catch(() => {});
  }, [savedAddresses, hydrated]);

  const setLocation = useCallback((next: ServiceLocation) => {
    setLocationState({ ...next, isDemo: false, updatedAt: new Date().toISOString() });
  }, []);

  const updateLocation = useCallback((patch: Partial<ServiceLocation>) => {
    setLocationState((prev) => ({
      ...prev,
      ...patch,
      // Any real edit retires the demo flag.
      isDemo: patch.isDemo ?? false,
    }));
  }, []);

  const clearLocation = useCallback(() => {
    // A minimal stub rather than null: `location` is never null downstream.
    setLocationState({ source: 'manual', isDemo: true, formattedAddress: '' });
  }, []);

  const resetToDemo = useCallback(() => setLocationState(DEMO_LOCATION), []);

  const saveAddress = useCallback((next: ServiceLocation): ServiceLocation => {
    const stored: ServiceLocation = {
      ...next,
      id: next.id ?? `addr-${Date.now().toString(36)}`,
      isDemo: false,
      updatedAt: new Date().toISOString(),
    };
    setSavedAddresses((prev) => {
      const existing = prev.findIndex((a) => a.id === stored.id);
      const list = existing >= 0
        ? prev.map((a, i) => (i === existing ? stored : a))
        : [...prev, stored];
      // Exactly one default: only honour the flag on the incoming record.
      return stored.isDefault
        ? list.map((a) => (a.id === stored.id ? a : { ...a, isDefault: false }))
        : list;
    });
    return stored;
  }, []);

  const updateAddress = useCallback((id: string, patch: Partial<ServiceLocation>) => {
    setSavedAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const geoPoint = useMemo(() => toGeoPoint(location), [location]);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      geoPoint,
      hasLocation: geoPoint !== null,
      isDemoLocation: !!location.isDemo,
      setLocation,
      updateLocation,
      clearLocation,
      resetToDemo,
      savedAddresses,
      saveAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
    }),
    [
      location, geoPoint, setLocation, updateLocation, clearLocation, resetToDemo,
      savedAddresses, saveAddress, updateAddress, removeAddress, setDefaultAddress,
    ],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

/**
 * Access the service-location store.
 * Throws outside the provider: every consumer needs a real location, and a
 * silent fallback would surface as "Pune" with no indication anything is wrong.
 */
export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}