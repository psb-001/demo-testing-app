import type { WorkerProfile } from '../types';

/**
 * Shared job-suitability scoring, used by the public matching section and
 * every authenticated portal (customer recommendations, worker job ranking,
 * cooperative matching). Single implementation — no duplicated logic.
 *
 * Demo-ready, client-side indicator composed ONLY from real worker
 * attributes. It is NOT a general popularity ranking. Replace with backend
 * matching when available.
 */
export function jobMatchScore(w: WorkerProfile): number {
  const ratingPts = (w.rating / 5) * 50;
  const expPts = (Math.min(w.experienceYears, 15) / 15) * 20;
  const availPts = w.availableToday ? 12 : 6;
  const verifiedPts = w.verified ? 10 : 0;
  const distPts = Math.max(0, 8 - Math.min(w.distanceKm, 8));
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
export function matchFactors(w: WorkerProfile, requiredSkill?: string): MatchFactors {
  const skillText = `${w.tradeLabel} ${w.specialty} ${w.skills.join(' ')}`.toLowerCase();
  const skillFit = !requiredSkill
    ? 80
    : skillText.includes(requiredSkill.toLowerCase())
      ? 95
      : 55;
  return {
    skillFit,
    experience: Math.round((Math.min(w.experienceYears, 15) / 15) * 100),
    location: Math.round(Math.max(20, 100 - w.distanceKm * 10)),
    availability: w.availableToday ? 100 : 55,
    workload: workloadLevel(w) === 'Low' ? 95 : workloadLevel(w) === 'Medium' ? 70 : 40,
    certification: w.verified ? 100 : 45,
  };
}
