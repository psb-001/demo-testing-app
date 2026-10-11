import type { ServiceLocation, WorkerProfile } from '../types';
import { haversineKm, type GeoPoint } from './mapService';
import { rankWorkersByLocation, toGeoPoint, type GeoRankedWorker } from './locationService';

/**
 * Shared job-suitability scoring, used by the public matching section and
 * every authenticated portal (customer recommendations, worker job ranking,
 * cooperative matching). Single implementation — no duplicated logic.
 *
 * Demo-ready, client-side indicator composed ONLY from real worker
 * attributes. It is NOT a general popularity ranking. Replace with backend
 * matching when available.
 *
 * Location handling was upgraded to match workconnect/src/services/matchingService.ts.
 * Previously `distanceKm` was a static field baked into each mock profile, so
 * every worker's score was identical no matter where the customer actually was.
 * The website passes a real `ServiceLocation`/`GeoPoint` into these functions
 * and scores against computed distance plus the worker's own service radius,
 * which is what makes "in range" meaningful. `JobMatchInput` carries that
 * optional location so existing call sites keep working unchanged.
 */

/** Optional location context for scoring. Omit to fall back to profile data. */
export type JobMatchInput = ServiceLocation | GeoPoint | null;

interface ResolvedLocation {
  point: GeoPoint | null;
  withinRadius: boolean | null;
}

/**
 * Normalise the two accepted location shapes and work out whether the worker is
 * inside its own service radius. Returns nulls when no location is supplied, so
 * callers behave exactly as before.
 */
function resolveLocation(input: JobMatchInput, worker: WorkerProfile): ResolvedLocation {
  const point = toGeoPoint(input);
  if (!point || worker.lat == null || worker.lng == null) {
    return { point: null, withinRadius: null };
  }
  const distanceKm = haversineKm(point, { lat: worker.lat, lng: worker.lng });
  const radiusKm = worker.serviceRadiusKm ?? 8;
  return { point, withinRadius: distanceKm <= radiusKm };
}

/** Distance-aware suitability score. */
export function jobMatchScore(w: WorkerProfile, input?: JobMatchInput): number {
  const ratingPts = (w.rating / 5) * 50;
  const expPts = (Math.min(w.experienceYears, 15) / 15) * 20;
  const availPts = w.availableToday ? 12 : 6;
  const verifiedPts = w.verified ? 10 : 0;

  const { point, withinRadius } = resolveLocation(input ?? null, w);
  const distanceKm = point
    ? haversineKm(point, { lat: w.lat, lng: w.lng })
    : w.distanceKm;
  // Closer is better, and a worker the customer is outside the radius of loses
  // the distance points entirely rather than being silently ranked as "near".
  const distPts = withinRadius === false ? 0 : Math.max(0, 8 - Math.min(distanceKm, 8));

  return Math.round(Math.min(97, ratingPts + expPts + availPts + verifiedPts + distPts));
}

/** Demo-ready workload band derived from completed-job volume. */
export function workloadLevel(w: WorkerProfile): 'Low' | 'Medium' | 'High' {
  if (w.reviewCount >= 200) return 'High';
  if (w.reviewCount >= 100) return 'Medium';
  return 'Low';
}

export interface MatchFactors {
  skillFit: number;
  experience: number;
  location: number;
  availability: number;
  workload: number;
  certification: number;
}

/** Explainable factor breakdown (0–100 each) for "why this worker matched". */
export function matchFactors(
  w: WorkerProfile,
  requiredSkill?: string,
  input?: JobMatchInput,
): MatchFactors {
  const skillText = `${w.tradeLabel} ${w.specialty} ${w.skills.join(' ')}`.toLowerCase();
  const skillFit = !requiredSkill
    ? 80
    : skillText.includes(requiredSkill.toLowerCase())
      ? 95
      : 55;

  const { point, withinRadius } = resolveLocation(input ?? null, w);
  const distanceKm = point ? haversineKm(point, { lat: w.lat, lng: w.lng }) : w.distanceKm;

  return {
    skillFit,
    experience: Math.round((Math.min(w.experienceYears, 15) / 15) * 100),
    // 0 when the customer is outside the worker's service radius.
    location: withinRadius === false ? 0 : Math.round(Math.max(20, 100 - distanceKm * 10)),
    availability: w.availableToday ? 100 : 55,
    workload: workloadLevel(w) === 'Low' ? 95 : workloadLevel(w) === 'Medium' ? 70 : 40,
    certification: w.verified ? 100 : 45,
  };
}

/**
 * Rank workers against a real customer location: in-radius first, then by
 * actual distance. Re-exported from locationService so callers have one import
 * for the whole location-aware matching story.
 */
export { rankWorkersByLocation, type GeoRankedWorker };