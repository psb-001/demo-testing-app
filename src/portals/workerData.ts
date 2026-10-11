/**
 * Structured demo data for the authenticated Worker Portal.
 * Typed models keep every screen backend-ready: swap these seeds for API
 * responses later without touching UI components. All illustrative values
 * are rendered with the shared <DemoTag /> badge.
 */

import type { Notice } from './Notifications';

/* ----------------------------- job lifecycle ----------------------------- */

export type JobStatus = 'available' | 'pending' | 'accepted' | 'arrived' | 'inprogress' | 'completed';
export type JobRuntimeStatus = 'upcoming' | 'arrived' | 'inprogress' | 'completed';
export type PaymentStatus = 'pending' | 'paid';

export interface WorkerJob {
  id: string;
  service: string;
  customerRequest: string;
  trade: string;
  customer: string;
  address: string;
  area: string;
  distanceKm: number;
  date: string;
  time: string;
  /** Total service value shown to the customer. */
  gross: number;
  /** Worker's transparent payout (92% share). */
  payout: number;
  /** Cooperative/welfare contribution (8% share). */
  coopShare: number;
  skills: string[];
  coop: string;
  emergency?: boolean;
  pendingOffer?: boolean;
}

/** Seeded lifecycle state per demo job. State lives in the portal, seeded here. */
export const INITIAL_JOB_STATUS: Record<string, JobStatus> = {
  'job-101': 'available',
  'job-102': 'available',
  'job-103': 'available',
  'job-104': 'available',
  'job-105': 'completed',
  'job-106': 'available',
  'job-107': 'pending',
  'job-108': 'accepted',
  'job-109': 'accepted',
};

export const JOB_LIFECYCLE: { label: string; desc: string }[] = [
  { label: 'Recommended', desc: 'AI matched' },
  { label: 'Accepted', desc: 'Schedule set' },
  { label: 'Navigate', desc: 'Route to customer' },
  { label: 'Arrived', desc: 'On-site' },
  { label: 'In progress', desc: 'Work underway' },
  { label: 'Completed', desc: 'Customer confirms' },
  { label: 'Payment', desc: '92% to you' },
];

export const DEMO_JOBS: WorkerJob[] = [
  {
    id: 'job-101', service: 'Fan & Light Fitting', customerRequest: 'Fan and light installation',
    trade: 'electrician', customer: 'A. Deshmukh', address: 'Flat 402, Rohan Viti, Kothrud', area: 'Kothrud',
    distanceKm: 2.1, date: 'Today', time: '4:00 PM', gross: 299, payout: 249, coopShare: 50,
    skills: ['Ceiling fan installation', 'Light installation', 'Electrical testing'],
    coop: 'Pune Electricians Cooperative Society Ltd.',
  },
  {
    id: 'job-102', service: 'MCB Tripping Repair', customerRequest: 'MCB keeps tripping on heavy load',
    trade: 'electrician', customer: 'R. Iyer', address: 'B-7, Shivaji Nagar', area: 'Shivaji Nagar',
    distanceKm: 3.4, date: 'Today', time: '6:30 PM', gross: 349, payout: 299, coopShare: 50,
    skills: ['MCB repair', 'Load inspection', 'Electrical testing'],
    coop: 'Pune Central Labour Cooperative Union',
  },
  {
    id: 'job-103', service: 'Pipe Leakage Fix', customerRequest: 'Kitchen sink pipe leaking',
    trade: 'plumber', customer: 'S. Nair', address: 'Plot 12, Baner Road', area: 'Baner',
    distanceKm: 5.8, date: 'Tomorrow', time: '10:00 AM', gross: 329, payout: 279, coopShare: 50,
    skills: ['Pipe pressure testing', 'Joint sealing'],
    coop: 'Pimpri-Pune Plumbers Guild Cooperative',
  },
  {
    id: 'job-104', service: 'Switchboard Wiring', customerRequest: 'New switchboard wiring for two rooms',
    trade: 'electrician', customer: 'K. Joshi', address: 'Lane 5, Aundh', area: 'Aundh',
    distanceKm: 4.2, date: 'Tomorrow', time: '11:30 AM', gross: 399, payout: 349, coopShare: 50,
    skills: ['Switchboard wiring', 'Electrical testing'],
    coop: 'Pune Electricians Cooperative Society Ltd.',
  },
  {
    id: 'job-105', service: 'Deep Kitchen Cleaning', customerRequest: 'Deep clean kitchen and chimney area',
    trade: 'cleaner', customer: 'P. Rao', address: 'Sr. No. 44, Hadapsar', area: 'Hadapsar',
    distanceKm: 7.5, date: 'Yesterday', time: '9:00 AM', gross: 279, payout: 229, coopShare: 50,
    skills: ['Degreasing', 'Deep scrubbing'],
    coop: 'Shramik Mahila Sanitation Cooperative',
  },
  {
    id: 'job-106', service: 'Water Leakage Repair', customerRequest: 'Bathroom pipe burst, water flooding',
    trade: 'plumber', customer: 'M. Khan', address: 'House 9, Karve Nagar', area: 'Karve Nagar',
    distanceKm: 1.8, date: 'Today', time: 'Immediate', gross: 449, payout: 399, coopShare: 50,
    skills: ['Emergency pipe repair', 'Leak sealing'],
    coop: 'Pimpri-Pune Plumbers Guild Cooperative',
    emergency: true,
  },
  {
    id: 'job-107', service: 'Inverter Installation', customerRequest: 'New inverter + battery setup for flat',
    trade: 'electrician', customer: 'Cooperative desk', address: 'To be assigned', area: 'Wakad',
    distanceKm: 6.1, date: 'Tomorrow', time: '2:00 PM', gross: 449, payout: 399, coopShare: 50,
    skills: ['Inverter installation', 'Battery wiring', 'Load calculation'],
    coop: 'Pune Electricians Cooperative Society Ltd.',
    pendingOffer: true,
  },
  {
    id: 'job-108', service: 'AC Service & Gas Check', customerRequest: 'Annual AC service plus gas pressure check',
    trade: 'ac-technician', customer: 'V. Kulkarni', address: 'C-14, Paulo Coelho Lane, Aundh', area: 'Aundh',
    distanceKm: 3.2, date: 'Today', time: '5:00 PM', gross: 849, payout: 699, coopShare: 150,
    skills: ['AC jet service', 'Gas pressure check', 'Filter deep clean'],
    coop: 'Pune Central Labour Cooperative Union',
  },
  {
    id: 'job-109', service: 'Exhaust Fan Replacement', customerRequest: 'Replace noisy bathroom exhaust fan',
    trade: 'electrician', customer: 'S. Pawar', address: 'House 21, Baner Road', area: 'Baner',
    distanceKm: 1.6, date: 'Today', time: '7:00 PM', gross: 649, payout: 550, coopShare: 99,
    skills: ['Exhaust fan fitting', 'Vent sealing', 'Electrical testing'],
    coop: 'Pune Electricians Cooperative Society Ltd.',
  },
];

/* ------------------------------- payments ------------------------------- */

export interface PayRecord {
  id: string;
  job: string;
  date: string;
  gross: number;
  share: number;
  status: PaymentStatus;
  invoice: string;
}

/** Seeded ledger for the earnings screen. Session completions append rows live. */
export const PRIOR_PAYMENTS: PayRecord[] = [
  { id: 'pay-1', job: 'Fan installation · Kothrud', date: 'Today', gross: 299, share: 249, status: 'paid', invoice: 'INV-2026-3101' },
  { id: 'pay-2', job: 'MCB repair · Shivaji Nagar', date: 'Today', gross: 349, share: 299, status: 'paid', invoice: 'INV-2026-3102' },
  { id: 'pay-3', job: 'Pipe leakage · Baner', date: 'Yesterday', gross: 329, share: 279, status: 'pending', invoice: 'INV-2026-3098' },
  { id: 'pay-4', job: 'Switchboard wiring · Aundh', date: 'Last week', gross: 399, share: 349, status: 'paid', invoice: 'INV-2026-3087' },
];

/** Seeded prior-41-jobs base used to give the earnings screen a realistic month. */
export const SIMULATED_LEDGER_BASE = 18450;

/* ------------------------------- ratings -------------------------------- */

export interface RatingEntry {
  text: string;
  stars: number;
  when: string;
}

export const RATING_BREAKDOWN = [
  { label: 'Quality', stars: 5 },
  { label: 'Reliability', stars: 5 },
  { label: 'Punctuality', stars: 4 },
  { label: 'Professionalism', stars: 5 },
];

export const FEEDBACK_ENTRIES: RatingEntry[] = [
  { text: 'Arrived on time and completed the work properly.', stars: 5, when: 'This week' },
  { text: 'Professional service.', stars: 5, when: 'Last week' },
  { text: 'Good work, slight delay reaching on one visit.', stars: 4, when: 'Last month' },
];

/* ----------------------------- cooperative ------------------------------ */

export interface CoopAnnouncement {
  title: string;
  meta: string;
}

export interface TrainingProgram {
  title: string;
  meta: string;
}

export const COOP_ANNOUNCEMENTS: CoopAnnouncement[] = [
  { title: 'Electrical Safety Training', meta: 'Saturday · 10 AM · Society hall' },
  { title: 'New welfare scheme available', meta: 'Enroll before month-end' },
];

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  { title: 'Advanced MCB & Load Safety', meta: '2 days · NCCT certified' },
  { title: 'Customer Communication Basics', meta: '1 day · Society hall' },
  { title: 'Solar panel installation refresher', meta: '3 days · Practical workshop' },
];

export const COOP_CONTACT = {
  phone: '+91 98500 12345',
  email: 'support@pecs.coop',
  office: 'Cooperative House, Baner Road, Pune 411045',
  hours: 'Mon–Sat, 10 AM – 6 PM',
};

/* --------------------------- demand intelligence ------------------------ */

export interface DemandInsight {
  trade: string;
  requests: number;
}

export const DEMAND_INSIGHTS: DemandInsight[] = [
  { trade: 'Electrical Repair', requests: 4 },
  { trade: 'AC Service', requests: 2 },
  { trade: 'Switchboard Repair', requests: 3 },
];

export const DEMAND_INSIGHT_NOTE =
  'Workers with evening availability are currently receiving more electrical service requests in your area.';

export const AVAILABILITY_AI_INSIGHT = {
  summary: 'Electrical service demand is currently higher between 4 PM and 8 PM in your service area.',
  recommended: '4 PM – 8 PM',
};

/* ------------------------- welfare & insurance -------------------------- */

export interface InsurancePolicy {
  id: string;
  name: string;
  status: 'Active';
  coverage: string;
  policyId: string;
  note: string;
}

export const INSURANCE_POLICIES: InsurancePolicy[] = [
  {
    id: 'ins-1',
    name: 'Accident Insurance',
    status: 'Active',
    coverage: '₹2,00,000',
    policyId: 'PM-JAY-COOP-449219',
    note: 'Workplace accidents & hospitalisation, routed through your cooperative.',
  },
  {
    id: 'ins-2',
    name: 'Tool Insurance',
    status: 'Active',
    coverage: '₹25,000',
    policyId: 'TOOL-COOP-88124',
    note: 'Loss or damage coverage for the issued tool kit.',
  },
];

export const WELFARE_BENEFITS = [
  'Welfare fund from the 8% cooperative share, not from your payout',
  'Quarterly NCCT refresher training sessions',
  'Certification & exam fee support',
  'Emergency assistance helpline via your society',
  'Maternity / sick-day cooperative support',
];

export interface WelfareClaim {
  id: string;
  type: string;
  date: string;
  status: string;
}

export const WELFARE_CLAIMS: WelfareClaim[] = [];

export const WELFARE_HELPLINE = '+91 98500 12345 (Welfare desk)';

/* ------------------------------- disputes ------------------------------- */

export const DISPUTED_JOBS = [
  {
    id: 'job-090',
    service: 'Socket Replacement',
    area: 'Deccan',
    reason: 'Customer reported incomplete testing. Cooperative reviewing with both sides.',
    status: 'Under review',
  },
];

/* --------------------------- profile / passport ------------------------- */

export const WORKER_LANGUAGES = ['Marathi', 'Hindi', 'English'];

export const PROFILE_VERIFICATION = [
  { label: 'Identity verified', status: 'done' as const },
  { label: 'Skills verified', status: 'done' as const },
  { label: 'Certification verified', status: 'done' as const },
  { label: 'Cooperative verified', status: 'done' as const },
];

/* ----------------------------- notifications ---------------------------- */

export const NOTIFICATION_SEEDS: Notice[] = [
  { id: 'n1', title: 'New job matched', body: 'Fan & Light Fitting · Kothrud · 88% AI match · ₹249', time: 'Just now' },
  { id: 'n2', title: 'Booking accepted', body: 'Customer confirmed AC Service · Aundh · 5:00 PM today', time: '1h ago' },
  { id: 'n3', title: 'Emergency opportunity', body: 'Water Leakage Repair · Karve Nagar · 1.8 km away', time: '2h ago' },
  { id: 'n4', title: 'Payment received', body: 'Yesterday’s earnings credited — 92% worker share.', time: 'Yesterday' },
  { id: 'n5', title: 'Cooperative announcement', body: 'Electrical Safety Training · Saturday · 10 AM', time: 'Yesterday' },
  { id: 'n6', title: 'Insurance update', body: 'Tool insurance renewed for the current quarter.', time: 'This week' },
  { id: 'n7', title: 'Training reminder', body: 'Advanced MCB & Load Safety · enroll before Friday', time: 'This week' },
];