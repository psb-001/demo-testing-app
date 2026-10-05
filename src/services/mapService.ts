import type { WorkerProfile } from '../types';

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

export const PUNE_CENTER: GeoPoint = {
  lat: 18.5204,
  lng: 73.8567,
  label: 'Shivaji Nagar, Pune',
};

export const DEFAULT_MAP_ZOOM = 12;

export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Approximate coordinates for hero city selector strings → real map center. */
export const CITY_COORDS: Record<string, GeoPoint> = {
  Pune: { lat: 18.5204, lng: 73.8567, label: 'Pune, Maharashtra' },
  'Pimpri-Chinchwad': { lat: 18.6298, lng: 73.7997, label: 'Pimpri-Chinchwad, Maharashtra' },
  'Mumbai Suburban': { lat: 19.0896, lng: 72.8656, label: 'Mumbai Suburban, Maharashtra' },
  Nagpur: { lat: 21.1458, lng: 79.0882, label: 'Nagpur, Maharashtra' },
  Nashik: { lat: 19.9975, lng: 73.7898, label: 'Nashik, Maharashtra' },
  Bengaluru: { lat: 12.9716, lng: 77.5946, label: 'Bengaluru, Karnataka' },
  'New Delhi': { lat: 28.6139, lng: 77.209, label: 'New Delhi, Delhi NCR' },
};

export function resolveCityCoords(cityLabel: string): GeoPoint {
  for (const key of Object.keys(CITY_COORDS)) {
    if (cityLabel.includes(key)) return CITY_COORDS[key];
  }
  return PUNE_CENTER;
}

/** Haversine distance in km between two geographic points. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type WorkerWithDistance = WorkerProfile & { computedDistanceKm: number };

/**
 * Attach real geographic distance (from user location to each worker's
 * stored lat/lng) and sort nearest-first. Keeps existing matching logic
 * separate — the map only visualizes / supplies distance.
 */
export function withComputedDistance(
  workers: WorkerProfile[],
  userLocation: GeoPoint,
): WorkerWithDistance[] {
  return workers
    .map((w) => ({
      ...w,
      computedDistanceKm: Math.round(haversineKm(userLocation, { lat: w.lat, lng: w.lng }) * 10) / 10,
    }))
    .sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);
}

/**
 * Load only relevant nearby workers (perf: avoids rendering hundreds of
 * heavy DOM markers). If the dataset grows large, swap this window for a
 * marker-clustering layer — call site stays unchanged.
 */
export function filterNearby(
  workers: WorkerWithDistance[],
  maxKm = 30,
  limit = 60,
): WorkerWithDistance[] {
  return workers.filter((w) => w.computedDistanceKm <= maxKm).slice(0, limit);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
