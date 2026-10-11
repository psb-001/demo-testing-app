import type { ServiceLocation, LocationSource, WorkerProfile } from '../types';
import { haversineKm, type GeoPoint } from './mapService';
import type { ReverseGeocodeDetails } from './geocodingService';

/**
 * Shared service-location logic: the ONE place that validates, formats,
 * projects and geo-ranks customer locations. Every surface (homepage search,
 * customer portal, booking, emergency, saved addresses, maps, matching)
 * goes through these helpers so behaviour and wording never diverge.
 */

/** Indian PIN codes are exactly 6 digits, first digit 1–9. */
export const PIN_PATTERN = /^[1-9][0-9]{5}$/;

/** Fallback service radius when a worker has not declared one. */
export const DEFAULT_SERVICE_RADIUS_KM = 8;

/** Radius options offered as "Expand Search Radius". */
export const RADIUS_LADDER_KM = [5, 10, 15, 25, 40];

/**
 * Cooperative service coverage. A real network operates in defined clusters —
 * this is configuration, not a hardcoded user location. The user's own
 * location is never assumed to be any of these.
 */
export interface ServiceArea {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  coverageRadiusKm: number;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { id: 'pune', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, coverageRadiusKm: 35 },
  { id: 'pimpri', city: 'Pimpri-Chinchwad', state: 'Maharashtra', lat: 18.6298, lng: 73.7997, coverageRadiusKm: 20 },
  { id: 'mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, coverageRadiusKm: 30 },
  { id: 'nashik', city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, coverageRadiusKm: 25 },
  { id: 'nagpur', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, coverageRadiusKm: 25 },
  { id: 'delhi', city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209, coverageRadiusKm: 35 },
  { id: 'bengaluru', city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, coverageRadiusKm: 30 },
];

export interface CoverageResult {
  covered: boolean;
  area?: ServiceArea;
  /** Distance to the nearest cooperative cluster, when known. */
  distanceToAreaKm?: number;
}

/** Is this customer position inside a cooperative service cluster? */
export function checkServiceCoverage(loc: ServiceLocation | null): CoverageResult {
  if (!loc) return { covered: false };
  if (loc.latitude == null || loc.longitude == null) {
    const city = (loc.city ?? '').trim().toLowerCase();
    const named = SERVICE_AREAS.find(
      (a) => city.includes(a.city.toLowerCase()) || (loc.locality ?? '').trim().toLowerCase() === a.city.toLowerCase(),
    );
    return named ? { covered: true, area: named } : { covered: false };
  }

  let best: ServiceArea | undefined;
  let bestKm = Number.POSITIVE_INFINITY;
  for (const area of SERVICE_AREAS) {
    const d = haversineKm({ lat: loc.latitude, lng: loc.longitude }, { lat: area.lat, lng: area.lng });
    if (d < bestKm) {
      bestKm = d;
      best = area;
    }
  }
  if (!best) return { covered: false };
  return {
    covered: bestKm <= best.coverageRadiusKm,
    area: bestKm <= best.coverageRadiusKm ? best : undefined,
    distanceToAreaKm: Math.round(bestKm * 10) / 10,
  };
}

/** Does this worker cover a customer at `distanceKm`? */
export function workerCoversDistance(worker: WorkerProfile, distanceKm: number): boolean {
  const radius = worker.serviceRadiusKm ?? DEFAULT_SERVICE_RADIUS_KM;
  return distanceKm <= radius;
}

export function workerServiceRadius(worker: WorkerProfile): number {
  return worker.serviceRadiusKm ?? DEFAULT_SERVICE_RADIUS_KM;
}

export interface GeoRankedWorker extends WorkerProfile {
  /** Real distance from the confirmed customer location, in km. */
  distanceKmFromCustomer: number;
  /** Mirror of the distance under the legacy name used by the map components. */
  computedDistanceKm: number;
  withinServiceRadius: boolean;
  serviceRadiusKm: number;
}

/**
 * Geo-spatial worker ranking for a confirmed customer location.
 *
 * Workers are ordered by real distance and annotated with whether the
 * customer sits inside their declared service radius — an out-of-radius
 * worker is never presented as a normal nearby match.
 */
export function rankWorkersByLocation(
  workers: WorkerProfile[],
  location: ServiceLocation | GeoPoint | null,
): GeoRankedWorker[] {
  const point = toGeoPoint(location);
  if (!point) {
    return workers.map((w) => ({
      ...w,
      distanceKmFromCustomer: Number.NaN,
      computedDistanceKm: w.distanceKm,
      withinServiceRadius: false,
      serviceRadiusKm: workerServiceRadius(w),
    }));
  }
  return workers
    .map((w) => {
      const d = Math.round(haversineKm(point, { lat: w.lat, lng: w.lng }) * 10) / 10;
      return {
        ...w,
        distanceKmFromCustomer: d,
        computedDistanceKm: d,
        withinServiceRadius: workerCoversDistance(w, d),
        serviceRadiusKm: workerServiceRadius(w),
      };
    })
    .sort((a, b) => {
      if (a.withinServiceRadius !== b.withinServiceRadius) return a.withinServiceRadius ? -1 : 1;
      return a.distanceKmFromCustomer - b.distanceKmFromCustomer;
    });
}

// ── Validation ────────────────────────────────────────────────────────────────

export type LocationField =
  | 'locality'
  | 'city'
  | 'pincode'
  | 'apartmentNumber'
  | 'latitude';

export type LocationErrors = Partial<Record<LocationField, string>>;

export interface ValidateOptions {
  /** Require a map pin (coordinates) — manual form without a pin can't be matched. */
  requireCoordinates?: boolean;
  /** Apartment/flat number is only mandatory when a building name is given. */
  requireApartmentWithBuilding?: boolean;
}

/**
 * Validate a customer-entered service location. Returns message KEYS, not
 * prose, so every surface translates them consistently.
 */
export function validateServiceLocation(
  loc: ServiceLocation | null,
  options: ValidateOptions = {},
): LocationErrors {
  const errors: LocationErrors = {};
  if (!loc) return { locality: 'errLocalityRequired' };

  if (!loc.locality?.trim() && !loc.city?.trim() && !loc.formattedAddress?.trim()) {
    errors.locality = 'errLocalityRequired';
  }
  if (!loc.city?.trim() && !loc.formattedAddress?.trim()) {
    errors.city = 'errCityRequired';
  }
  if (loc.pincode?.trim()) {
    if (!PIN_PATTERN.test(loc.pincode.trim())) errors.pincode = 'errInvalidPin';
  }
  if (options.requireApartmentWithBuilding && loc.buildingName?.trim() && !loc.apartmentNumber?.trim()) {
    errors.apartmentNumber = 'errApartmentRequired';
  }
  if (options.requireCoordinates && (loc.latitude == null || loc.longitude == null)) {
    errors.latitude = 'errPinLocationRequired';
  }
  return errors;
}

export function hasLocationErrors(errors: LocationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ── Formatting ───────────────────────────────────────────────────────────────

/** Multi-line postal address, omitting anything the customer left blank. */
export function formatAddressLines(loc: ServiceLocation | null): string[] {
  if (!loc) return [];
  const lines: string[] = [];
  const flat = [loc.apartmentNumber, loc.buildingName].filter(Boolean).join(', ');
  if (flat) lines.push(flat);
  if (loc.addressLine1) lines.push(loc.addressLine1);
  if (loc.street) lines.push(loc.street);
  if (loc.landmark) lines.push(`Near ${loc.landmark}`);
  const areaCity = [loc.locality, loc.city].filter(Boolean).join(', ');
  if (areaCity) lines.push(areaCity);
  const region = [loc.city, loc.state, loc.pincode].filter(Boolean).join(' - ');
  if (region && region !== areaCity) lines.push(region);
  if (loc.floorNumber) lines.push(loc.floorNumber);
  if (loc.additionalDirections) lines.push(loc.additionalDirections);
  return lines;
}

/** One-line address used for bookings, invoices and pins. */
export function formatOneLine(loc: ServiceLocation | null): string {
  if (!loc) return '';
  if (loc.formattedAddress) {
    const lines = formatAddressLines(loc);
    return lines.length > 0 ? lines.join(', ') : loc.formattedAddress;
  }
  return formatAddressLines(loc).join(', ');
}

/** Short chip label — "Shivajinagar, Pune". Never a hardcoded city. */
export function shortLocationLabel(loc: ServiceLocation | null): string {
  if (!loc) return '';
  if (loc.label && loc.locality) return `${loc.locality}`;
  const parts = [loc.locality, loc.city].filter(Boolean).slice(0, 2);
  if (parts.length) return parts.join(', ');
  if (loc.formattedAddress) return loc.formattedAddress.split(',').slice(0, 2).join(',').trim();
  if (loc.latitude != null && loc.longitude != null) {
    return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  }
  return '';
}

// ── Projections ──────────────────────────────────────────────────────────────

export function toGeoPoint(
  loc: ServiceLocation | GeoPoint | null | undefined,
): GeoPoint | null {
  if (!loc) return null;
  // GeoPoint uses lat/lng; ServiceLocation uses latitude/longitude.
  if ('lat' in loc || 'lng' in loc) {
    const p = loc as GeoPoint;
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return null;
    return { lat: p.lat, lng: p.lng, label: p.label };
  }
  const s = loc as ServiceLocation;
  if (s.latitude == null || s.longitude == null) return null;
  return {
    lat: s.latitude,
    lng: s.longitude,
    label: shortLocationLabel(s) || undefined,
  };
}

export function hasCoordinates(loc: ServiceLocation | null | undefined): boolean {
  return !!loc && loc.latitude != null && loc.longitude != null;
}

export function emptyLocationDraft(source: LocationSource = 'manual'): ServiceLocation {
  return { source, formattedAddress: '' };
}

/**
 * Build a ServiceLocation from a raw map/GPS point plus optional structured
 * reverse-geocoding. Preserves whatever the customer already typed.
 */
export function locationFromDetails(
  lat: number,
  lng: number,
  details: ReverseGeocodeDetails | null,
  source: LocationSource,
  base?: ServiceLocation,
): ServiceLocation {
  const round = (n: number) => Math.round(n * 100000) / 100000;
  const merged: ServiceLocation = {
    ...(base ?? emptyLocationDraft(source)),
    source,
    latitude: round(lat),
    longitude: round(lng),
    updatedAt: new Date().toISOString(),
  };
  if (details) {
    merged.formattedAddress = details.formattedAddress;
    merged.street = details.road ?? merged.street;
    merged.locality = details.suburb ?? details.neighbourhood ?? details.city ?? details.town ?? details.village ?? merged.locality;
    merged.city = details.city ?? details.town ?? details.village ?? merged.city;
    merged.state = details.state ?? merged.state;
    merged.pincode = details.postcode ?? merged.pincode;
    if (details.houseNumber && !merged.apartmentNumber) {
      merged.addressLine1 = merged.addressLine1 ?? details.houseNumber;
    }
  } else {
    merged.formattedAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  return merged;
}

/** Attach fresh coordinates to an existing draft (used by "Select on map"). */
export function withCoordinates(
  loc: ServiceLocation,
  lat: number,
  lng: number,
  details?: ReverseGeocodeDetails | null,
): ServiceLocation {
  return locationFromDetails(
    lat,
    lng,
    details ?? null,
    loc.source,
    loc,
  );
}

export const locationSourceLabel = (loc: ServiceLocation | null | undefined): 'gps' | 'manual' | '' => {
  if (!loc) return '';
  return loc.source === 'gps' ? 'gps' : 'manual';
};

/** Rough ETA model used for emergency triage (clearly an estimate). */
export function estimateEtaMinutes(distanceKm: number, isEmergency: boolean): number {
  const base = isEmergency ? 8 : 25;
  return Math.max(isEmergency ? 5 : 15, Math.round(base + distanceKm * (isEmergency ? 3.2 : 2.4)));
}

export interface CoverageAreaSummary {
  key: string;
  cooperativeName: string;
  area: string;
  lat: number;
  lng: number;
  workers: number;
  availableNow: number;
  verified: number;
  /** Union of member service radii, capped for display sanity. */
  maxRadiusKm: number;
  trades: string[];
}

/**
 * Aggregate worker availability into service-coverage areas.
 *
 * Shared by the cooperative and federation portals so coverage maps read the
 * same location model as the customer side. Only the worker's base operating
 * locality is used — never a residential address.
 */
export function buildCoverageAreas(workers: WorkerProfile[]): CoverageAreaSummary[] {
  const groups = new Map<string, WorkerProfile[]>();
  for (const w of workers) {
    const key = `${w.cooperativeName}|${w.area}`;
    const list = groups.get(key);
    if (list) list.push(w);
    else groups.set(key, [w]);
  }
  return Array.from(groups.values()).map((group) => {
    const lat = group.reduce((a, w) => a + w.lat, 0) / group.length;
    const lng = group.reduce((a, w) => a + w.lng, 0) / group.length;
    return {
      key: `${group[0].cooperativeName}|${group[0].area}`,
      cooperativeName: group[0].cooperativeName,
      area: group[0].area,
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
      workers: group.length,
      availableNow: group.filter((w) => w.availableToday).length,
      verified: group.filter((w) => w.verified).length,
      maxRadiusKm: Math.min(40, Math.max(...group.map((w) => workerServiceRadius(w)))),
      trades: Array.from(new Set(group.map((w) => w.tradeLabel))),
    };
  });
}
