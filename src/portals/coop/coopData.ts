import type { Booking } from '../../types';

/**
 * Cooperative Portal — shared operational dataset (demo, deterministic).
 *
 * Every screen of the cooperative portal reads from this single store so
 * numbers stay CONSISTENT across modules: bookings appear in Jobs &
 * Bookings, Payments and Analytics; worker earnings match transactions;
 * verification status drives Workers, Passports and Verification Center.
 *
 * Swap the seed arrays for API responses later — components only consume
 * these typed records.
 */

/* Deterministic pseudo-random generator so the demo is stable on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260923);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

/* ─────────────────────────── Geography ──────────────────────────────── */

export const PUNE_AREAS: { name: string; lat: number; lng: number }[] = [
  { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
  { name: 'Shivaji Nagar', lat: 18.5314, lng: 73.8446 },
  { name: 'Baner', lat: 18.5596, lng: 73.7799 },
  { name: 'Aundh', lat: 18.558, lng: 73.807 },
  { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
  { name: 'Hadapsar', lat: 18.5089, lng: 73.9259 },
  { name: 'Kharadi', lat: 18.5412, lng: 73.9358 },
  { name: 'Karve Nagar', lat: 18.4907, lng: 73.8126 },
  { name: 'Deccan Gymkhana', lat: 18.5204, lng: 73.8419 },
  { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
  { name: 'Wakad', lat: 18.5832, lng: 73.7734 },
  { name: 'Tingre Nagar', lat: 18.565, lng: 73.903 },
  { name: 'Bibwewadi', lat: 18.4688, lng: 73.8605 },
  { name: 'Katraj', lat: 18.4515, lng: 73.8627 },
];
export const areaCoords = (area: string) =>
  PUNE_AREAS.find((a) => area.startsWith(a.name)) ?? PUNE_AREAS[0];

/* ─────────────────────────── Trades ─────────────────────────────────── */

export const COOP_TRADES: { slug: string; label: string }[] = [
  { slug: 'electrician', label: 'Electrician' },
  { slug: 'plumber', label: 'Plumber' },
  { slug: 'carpenter', label: 'Carpenter' },
  { slug: 'cleaner', label: 'Cleaner' },
  { slug: 'wall-painter', label: 'Wall Painter' },
  { slug: 'ac-technician', label: 'AC Technician' },
  { slug: 'caregiver', label: 'Caregiver' },
  { slug: 'driver', label: 'Driver' },
  { slug: 'gardener', label: 'Gardener' },
  { slug: 'domestic-helper', label: 'Domestic Helper' },
];

const SKILL_SETS: Record<string, string[]> = {
  electrician: ['Wiring & switchboard', 'Fan & light fitting', 'MCB / fuse repair', 'Inverter installation', 'Earthing check'],
  plumber: ['Pipe leakage repair', 'Tap / flush fitting', 'Tank float valve', 'Drain unclogging', 'CPVC joins'],
  carpenter: ['Door lock fitting', 'Modular cabinet repair', 'Furniture assembly', 'Laminate repair', 'Window shutter fix'],
  cleaner: ['Deep kitchen cleaning', 'Bathroom descaling', 'Floor scrubbing', 'Chimney degreasing', 'Sofa shampoo'],
  'wall-painter': ['Interior putty & paint', 'Patch touch-up', 'Waterproofing coat', 'Texture painting', 'Ceiling repair'],
  'ac-technician': ['Split AC jet cleaning', 'Gas refill (R32/R410A)', 'PCB & sensor repair', 'Drain tray fix', 'Annual service'],
  caregiver: ['Elderly care', 'Bed-bound assistance', 'Medicine reminders', 'Physio support', 'Home monitoring'],
  driver: ['Local / outstation', 'Airport transfers', 'AC sedan / SUV', 'Trip safety', 'Daily commute'],
  gardener: ['Lawn mowing', 'Plant care & potting', 'Pruning', 'Pest treatment', 'Terrace garden setup'],
  'domestic-helper': ['Daily housekeeping', 'Cooking support', 'Dusting & mopping', 'Utensil care', 'Elderly companion'],
};

const SPECIALTIES: Record<string, string[]> = {
  electrician: ['Fan & light fitting', 'MCB / fuse repair', 'Switchboard wiring', 'Inverter setup'],
  plumber: ['Pipe leakage', 'Tap & flush fitting', 'Drain unclogging', 'Tank repair'],
  carpenter: ['Modular kitchen & locks', 'Furniture assembly', 'Door repair'],
  cleaner: ['Deep cleaning', 'Kitchen & bathroom', 'Housekeeping'],
  'wall-painter': ['Interior painting', 'Patch touch-ups', 'Waterproofing'],
  'ac-technician': ['Split AC service', 'Gas refill', 'Installation'],
  caregiver: ['Elderly care', 'Home nursing', 'Companion care'],
  driver: ['Local trips', 'Airport transfers', 'Full-day hire'],
  gardener: ['Lawn & garden care', 'Planting', 'Terrace garden'],
  'domestic-helper': ['Housekeeping', 'Cooking', 'Full-day support'],
};

/* ─────────────────────────── Worker store ───────────────────────────── */

export type WorkloadBand = 'Underutilized' | 'Balanced' | 'Busy' | 'Overloaded';
export type AvailabilityState = 'Available' | 'Busy' | 'Offline' | 'On Leave' | 'En Route';
export type VerificationStatus = 'Verified' | 'Pending' | 'Under Review' | 'Rejected';

export interface WorkerInsurance {
  provider: string;
  policyId: string;
  coverage: string;
  start: string;
  expiry: string;
  status: 'Active' | 'Expiring' | 'Lapsed' | 'None';
}

export interface CoopWorker {
  id: string;
  name: string;
  avatarUrl?: string;
  trade: string;
  tradeLabel: string;
  specialty: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  experienceYears: number;
  skills: string[];
  certification: {
    name: string;
    issuer: string;
    id: string;
    issued: string;
    expiry: string;
    status: 'Verified' | 'Expiring' | 'Expired' | 'Pending';
  };
  verification: {
    identity: boolean;
    skills: boolean;
    experience: boolean;
    certification: boolean;
    membership: boolean;
    passportIssued: boolean;
    status: VerificationStatus;
  };
  availability: AvailabilityState;
  availableToday: boolean;
  jobsThisWeek: number;
  workload: WorkloadBand;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  earningsMonth: number;
  serviceRadiusKm: number;
  maxJobsPerDay: number;
  emergencyReady: boolean;
  insurance: WorkerInsurance;
  welfareEnrolled: boolean;
  joinDate: string;
  training: { last: string; next: string; recommended: string[] };
}

const FIRST = ['Ramesh', 'Sunita', 'Imran', 'Balwant', 'Priya', 'Arun', 'Suresh', 'Manoj', 'Kavita', 'Vikram', 'Santosh', 'Reena', 'Anil', 'Deepa', 'Prakash', 'Nitin', 'Asha', 'Ganesh', 'Urmila', 'Rohit', 'Shabana', 'Dinesh', 'Meena', 'Ajay', 'Sneha', 'Farhan', 'Jyoti', 'Sanjay', 'Pooja', 'Kiran', 'Vijay', 'Savita', 'Mahesh', 'Lata', 'Raju', 'Anita', 'Harish', 'Nalini', 'Sachin', 'Vandana'];
const LAST = ['Kadam', 'Patil', 'Shaikh', 'Singh', 'Shinde', 'Sharma', 'Pawar', 'Deshmukh', 'Joshi', 'Gupta', 'More', 'Kulkarni', 'Naik', 'Chavan', 'Jadhav', 'Gaikwad', 'Bhosale', 'Kale', 'Bansode', 'Thorat', 'Sayyad', 'Ingle', 'Salunkhe', 'Auti', 'Kamble', 'Momin', 'Wagh', 'Zende', 'Tandale', 'Bagul', 'Nikam', 'Gadgil', 'Patole', 'Kirdat', 'Sable', 'Pardeshi', 'Lonkar', 'Mhaske', 'Suryawanshi', 'Dhumal'];

function workloadFor(jobsThisWeek: number): WorkloadBand {
  if (jobsThisWeek <= 2) return 'Underutilized';
  if (jobsThisWeek <= 5) return 'Balanced';
  if (jobsThisWeek <= 8) return 'Busy';
  return 'Overloaded';
}

/** Deterministic 40-worker cooperative roster across the 10 service trades. */
export function buildWorkers(): CoopWorker[] {
  const workers: CoopWorker[] = [];
  let idx = 0;
  for (let i = 0; i < 40; i++) {
    const trade = COOP_TRADES[i % COOP_TRADES.length];
    const areaObj = PUNE_AREAS[Math.floor(rnd() * PUNE_AREAS.length)];
    const name = `${FIRST[Math.floor(rnd() * FIRST.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`;
    const exp = 2 + Math.floor(rnd() * 15);
    const jobsThisWeek = Math.floor(rnd() * 9);
    const verified = rnd() > 0.16;
    const availRoll = rnd();
    const availability: AvailabilityState =
      availRoll < 0.5 ? 'Available' : availRoll < 0.68 ? 'Busy' : availRoll < 0.8 ? 'En Route' : availRoll < 0.9 ? 'Offline' : 'On Leave';
    const expiringCert = rnd() < 0.18;
    const insuranceRoll = rnd();
    const expiryYear = expiringCert ? 2026 : 2027 + Math.floor(rnd() * 3);
    const policyExpiring = insuranceRoll < 0.67 ? insuranceRoll < 0.5 ? 'Active' : 'Expiring' : insuranceRoll < 0.9 ? 'Lapsed' : 'None';
    const certStatus: CoopWorker['certification']['status'] = verified
      ? expiringCert
        ? 'Expiring'
        : 'Verified'
      : 'Pending';
    idx++;
    workers.push({
      id: `cw-${String(idx).padStart(3, '0')}`,
      name,
      avatarUrl: `https://i.pravatar.cc/96?img=${20 + (idx % 50)}`,
      trade: trade.slug,
      tradeLabel: trade.label,
      specialty: pick(SPECIALTIES[trade.slug]),
      area: areaObj.name,
      lat: areaObj.lat + (rnd() - 0.5) * 0.015,
      lng: areaObj.lng + (rnd() - 0.5) * 0.015,
      phone: `+91 98${String(10000000 + Math.floor(rnd() * 89999999))}`,
      experienceYears: exp,
      skills: SKILL_SETS[trade.slug].slice(0, 3 + Math.floor(rnd() * 3)),
      certification: {
        name: `${trade.label} trade certification`,
        issuer: 'NCCT / MSLBC',
        id: `NCCT-MH-${trade.slug.slice(0, 2).toUpperCase()}-2024-${String(1000 + Math.floor(rnd() * 8999))}`,
        issued: '2024',
        expiry: `${expiryYear}-${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}-15`,
        status: certStatus,
      },
      verification: {
        identity: verified || rnd() > 0.35,
        skills: verified || rnd() > 0.3,
        experience: verified || rnd() > 0.25,
        certification: verified || rnd() > 0.4,
        membership: verified,
        passportIssued: verified,
        status: verified ? 'Verified' : rnd() < 0.5 ? 'Pending' : 'Under Review',
      },
      availability,
      availableToday: availability === 'Available' || availability === 'En Route',
      jobsThisWeek,
      workload: workloadFor(jobsThisWeek),
      rating: Math.round((3.6 + rnd() * 1.4) * 10) / 10,
      reviewCount: Math.floor(rnd() * 240),
      jobsCompleted: 40 + Math.floor(rnd() * 400),
      earningsMonth: 4200 + Math.floor(rnd() * 26000),
      serviceRadiusKm: 6 + Math.floor(rnd() * 6),
      maxJobsPerDay: 2 + Math.floor(rnd() * 3),
      emergencyReady: rnd() > 0.45,
      insurance: {
        provider: 'PM-JAY + Coop Accident Cover',
        policyId: `PM-JAY-COOP-${String(100000 + Math.floor(rnd() * 899999))}`,
        coverage: '₹5L health + ₹2L accident + tool cover',
        start: `2025-${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}-01`,
        expiry: `2026-${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}-30`,
        status: policyExpiring,
      },
      welfareEnrolled: rnd() > 0.14,
      joinDate: `${2016 + Math.floor(rnd() * 9)}`,
      training: {
        last: 'Quarterly safety refresher · ' + (2025 + Math.floor(rnd() * 2)),
        next: expiringCert ? 'Certification renewal (30 days)' : 'Advanced trade workshop',
        recommended: expiringCert ? ['Safety & certification renewal'] : [],
      },
    });
  }
  return workers;
}

export const COP_WORKERS = buildWorkers();

/* Aggregate helpers used by multiple screens to stay consistent. */
export const workerById = (id?: string) => COP_WORKERS.find((w) => w.id === id);
export const workersByTrade = (slug: string) => COP_WORKERS.filter((w) => w.trade === slug);

export const WORKER_METRICS = {
  total: COP_WORKERS.length,
  verified: COP_WORKERS.filter((w) => w.verification.status === 'Verified').length,
  pendingVerification: COP_WORKERS.filter((w) => w.verification.status === 'Pending' || w.verification.status === 'Under Review').length,
  availableToday: COP_WORKERS.filter((w) => w.availableToday).length,
  onJobs: COP_WORKERS.filter((w) => w.availability === 'Busy' || w.availability === 'En Route').length,
  onLeave: COP_WORKERS.filter((w) => w.availability === 'On Leave').length,
  offline: COP_WORKERS.filter((w) => w.availability === 'Offline').length,
  emergencyReady: COP_WORKERS.filter((w) => w.emergencyReady).length,
  overloaded: COP_WORKERS.filter((w) => w.workload === 'Overloaded').length,
  underutilized: COP_WORKERS.filter((w) => w.workload === 'Underutilized').length,
  balanced: COP_WORKERS.filter((w) => w.workload === 'Balanced').length,
  busyBand: COP_WORKERS.filter((w) => w.workload === 'Busy').length,
};

/* ───────────────────────── Service requests ─────────────────────────── */

export type RequestStatus =
  | 'New' | 'Matching' | 'Matched' | 'Assigned' | 'In Progress'
  | 'Completed' | 'Cancelled' | 'Payment Pending' | 'Settled';

export interface ServiceRequest {
  id: string;
  service: string;
  trade: string;
  customer: string;
  location: string;
  lat: number;
  lng: number;
  preferredDate: string;
  preferredTime: string;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  priceRange: string;
  status: RequestStatus;
  matchType: 'AI matched' | 'Manual' | '—';
  workerId?: string;
  payment: '—' | 'Pending' | 'Authorized' | 'Settled' | 'Refunded';
  createdAt: string;
  instructions?: string;
}

const REQ_SERVICES: { trade: string; service: string; price: string }[] = [
  { trade: 'electrician', service: 'Electrical repair', price: '₹299–₹499' },
  { trade: 'electrician', service: 'Inverter installation', price: '₹449–₹799' },
  { trade: 'plumber', service: 'Pipe leakage fix', price: '₹279–₹449' },
  { trade: 'plumber', service: 'Bathroom fitting', price: '₹329–₹549' },
  { trade: 'carpenter', service: 'Door lock repair', price: '₹299–₹449' },
  { trade: 'cleaner', service: 'Deep cleaning', price: '₹229–₹399' },
  { trade: 'cleaner', service: 'Kitchen deep clean', price: '₹279–₹429' },
  { trade: 'wall-painter', service: 'Room painting patch', price: '₹349–₹899' },
  { trade: 'ac-technician', service: 'AC service & gas check', price: '₹399–₹699' },
  { trade: 'caregiver', service: 'Elderly care shift', price: '₹499–₹999' },
  { trade: 'gardener', service: 'Garden maintenance', price: '₹249–₹449' },
  { trade: 'electrician', service: 'MCB / fuse repair', price: '₹299–₹449' },
  { trade: 'plumber', service: 'Drain unclogging', price: '₹279–₹499' },
];

const CUST = ['A. Deshmukh', 'R. Iyer', 'S. Nair', 'K. Joshi', 'P. Rao', 'M. Khan', 'V. Kulkarni', 'S. Fernandes', 'D. Bhandari', 'N. Agrawal', 'T. Mane', 'J. D Souza', 'F. Irani', 'B. Wagh', 'L. Rane'];
const CUSTCLEAN = CUST.map((c) => c);
const REQ_ORDER: RequestStatus[] = ['New', 'Matching', 'Matched', 'Assigned', 'In Progress', 'Completed', 'Payment Pending', 'Settled', 'Cancelled'];

export function buildRequests(): ServiceRequest[] {
  const reqs: ServiceRequest[] = [];
  for (let i = 0; i < 34; i++) {
    const svc = REQ_SERVICES[i % REQ_SERVICES.length];
    const areaObj = PUNE_AREAS[Math.floor(rnd() * PUNE_AREAS.length)];
    const status = REQ_ORDER[Math.floor(rnd() * REQ_ORDER.length)];
    const urgency = status === 'Cancelled' ? 'Normal' : rnd() < 0.12 ? 'Emergency' : rnd() < 0.3 ? 'Urgent' : 'Normal';
    // Prefer workers of the matching trade where the status implies assignment.
    const candidates = COP_WORKERS.filter((w) => w.trade === svc.trade);
    const worker = status !== 'New' && status !== 'Matching' && candidates.length ? pick(candidates) : undefined;
    const price = svc.price;
    const reqId = 10251 + i;
    reqs.push({
      id: `REQ-${reqId}`,
      service: svc.service,
      trade: svc.trade,
      customer: CUSTCLEAN[Math.floor(rnd() * CUSTCLEAN.length)],
      location: areaObj.name,
      lat: areaObj.lat,
      lng: areaObj.lng,
      preferredDate: status === 'Completed' || status === 'Settled' ? 'Yesterday' : Math.floor(rnd() * 3) === 0 ? 'Tomorrow' : 'Today',
      preferredTime: pick(['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM', '6:30 PM', 'Flexible']),
      urgency,
      priceRange: price,
      status,
      matchType: worker && rnd() > 0.25 ? 'AI matched' : 'Manual',
      workerId: worker?.id,
      payment: status === 'Settled' ? 'Settled' : status === 'Cancelled' ? 'Refunded' : status === 'In Progress' || status === 'Completed' ? 'Authorized' : status === 'Payment Pending' ? 'Pending' : '—',
      createdAt: `${pick(['Today', 'Today', 'Today', 'Yesterday', 'Yesterday', '2 days ago'])} ${pick(['09:12', '10:04', '12:31', '14:22', '16:48', '18:05', '20:17'])}`,
      instructions: Math.floor(rnd() * 3) === 0 ? pick(['Customer asked for early morning slot', 'Society gate entry — ask at security', 'Materials onsite, tools needed', 'Flat on 3rd floor, no lift']) : undefined,
    });
  }
  return reqs.sort((a, b) => REQ_ORDER.indexOf(a.status) - REQ_ORDER.indexOf(b.status));
}

export const COP_REQUESTS = buildRequests();
export const requestsByStatus = (s: RequestStatus) => COP_REQUESTS.filter((r) => r.status === s);
export const requestById = (id: string) => COP_REQUESTS.find((r) => r.id === id);

/* Live pipeline derived from the request store. */
export const PIPELINE = REQ_ORDER.map((s) => ({ status: s, count: requestsByStatus(s).length }));

/* ───────────────────────── Transactions ─────────────────────────────── */

export interface CoopTransaction {
  id: string;
  bookingId: string;
  customer: string;
  workerId: string;
  workerName: string;
  service: string;
  date: string;
  gross: number;
  workerShare: number;
  coopShare: number;
  welfareFund: number;
  gatewayFee: number;
  payout: number;
  status: 'Paid' | 'Pending' | 'Settled' | 'Refunded' | 'Disputed';
}

function txFor(req: ServiceRequest): CoopTransaction | undefined {
  const worker = workerById(req.workerId);
  if (!worker || req.status === 'New' || req.status === 'Matching' || req.status === 'Cancelled') return undefined;
  const [lo, hi] = req.priceRange.replace(/₹|[,–-]/g, ' ').trim().split(/\s+/).map(Number);
  const gross = Math.round(((lo || 299) + (hi || lo || 299)) / 2 / 10) * 10;
  const workerShare = Math.round(gross * 0.92);
  const gatewayFee = gross <= 500 ? 5 : Math.round(gross * 0.012);
  const coopShare = Math.round(gross * 0.06);
  const welfareFund = gross - workerShare - coopShare - gatewayFee;
  return {
    id: `TX-${req.id.replace('REQ-', '')}`,
    bookingId: `BK-${req.id.replace('REQ-', '')}`,
    customer: req.customer,
    workerId: worker.id,
    workerName: worker.name,
    service: req.service,
    date: req.preferredDate === 'Yesterday' ? '22 Sep' : '23 Sep',
    gross,
    workerShare,
    coopShare,
    welfareFund,
    gatewayFee,
    payout: workerShare - gatewayFee,
    status:
      req.status === 'Settled' ? 'Settled'
      : req.status === 'Payment Pending' ? 'Pending'
      : req.status === 'In Progress' ? 'Pending'
      : req.status === 'Completed' ? 'Pending'
      : req.payment === 'Refunded' ? 'Refunded'
      : 'Pending',
  };
}

export const COP_TRANSACTIONS: CoopTransaction[] = COP_REQUESTS.map(txFor).filter((t): t is CoopTransaction => !!t);

export const PAYMENT_METRICS = {
  totalGross: COP_TRANSACTIONS.reduce((s, t) => s + t.gross, 0),
  totalPayout: COP_TRANSACTIONS.reduce((s, t) => s + t.payout, 0),
  totalWorker: COP_TRANSACTIONS.reduce((s, t) => s + t.workerShare, 0),
  totalCoop: COP_TRANSACTIONS.reduce((s, t) => s + t.coopShare, 0),
  totalWelfare: COP_TRANSACTIONS.reduce((s, t) => s + t.welfareFund, 0),
  totalFees: COP_TRANSACTIONS.reduce((s, t) => s + t.gatewayFee, 0),
  pending: COP_TRANSACTIONS.filter((t) => t.status === 'Pending').length,
  settled: COP_TRANSACTIONS.filter((t) => t.status === 'Settled').length,
};

/* ───────────────────────── Welfare & insurance ──────────────────────── */

export interface WelfarePolicy {
  id: string;
  workerId: string;
  workerName: string;
  scheme: string;
  type: 'Health' | 'Accident' | 'Tool' | 'Life';
  provider: string;
  coverage: string;
  start: string;
  expiry: string;
  status: 'Active' | 'Expiring' | 'Lapsed' | 'None';
}

export const COP_POLICIES: WelfarePolicy[] = COP_WORKERS.filter((w) => w.insurance.status !== 'None').map((w) => ({
  id: w.insurance.policyId,
  workerId: w.id,
  workerName: w.name,
  scheme: w.insurance.status === 'Expiring' ? 'PM-JAY renewal due' : 'PM-JAY + Coop Accident Cover',
  type: w.insurance.status === 'Lapsed' ? 'Tool' : 'Health',
  provider: 'Coop Welfare Trust · PM-JAY empanelled',
  coverage: w.insurance.coverage,
  start: w.insurance.start,
  expiry: w.insurance.expiry,
  status: w.insurance.status,
}));

export interface WelfareClaim {
  id: string;
  workerId: string;
  workerName: string;
  type: string;
  amount: string;
  date: string;
  status: 'Under Review' | 'Approved' | 'Paid' | 'Rejected';
}

export const COP_CLAIMS: WelfareClaim[] = [
  { id: 'CL-241', workerId: 'cw-004', workerName: workerById('cw-004')?.name ?? 'Member', type: 'Accident — tool injury', amount: '₹18,400', date: '20 Sep', status: 'Approved' },
  { id: 'CL-240', workerId: 'cw-011', workerName: workerById('cw-011')?.name ?? 'Member', type: 'Health — hospitalization', amount: '₹42,000', date: '17 Sep', status: 'Under Review' },
  { id: 'CL-239', workerId: 'cw-019', workerName: workerById('cw-019')?.name ?? 'Member', type: 'Training stipend', amount: '₹2,500', date: '12 Sep', status: 'Paid' },
  { id: 'CL-238', workerId: 'cw-027', workerName: workerById('cw-027')?.name ?? 'Member', type: 'Tool replacement', amount: '₹6,100', date: '9 Sep', status: 'Approved' },
  { id: 'CL-237', workerId: 'cw-033', workerName: workerById('cw-033')?.name ?? 'Member', type: 'Medical follow-up', amount: '₹3,900', date: '5 Sep', status: 'Rejected' },
];

/* ───────────────────────── Ratings & complaints ─────────────────────── */

export interface Complaint {
  id: string;
  workerId?: string;
  workerName: string;
  category: string;
  title: string;
  detail: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export const COP_COMPLAINTS: Complaint[] = [
  { id: 'CP-152', workerId: 'cw-014', workerName: workerById('cw-014')?.name ?? 'Member', category: 'Punctuality', title: 'Late arrival', detail: 'Customer reported 40 min delay without prior notice.', status: 'Under Review', date: '22 Sep', priority: 'Medium' },
  { id: 'CP-151', workerId: 'cw-026', workerName: workerById('cw-026')?.name ?? 'Member', category: 'Quality', title: 'Incomplete work', detail: 'Socket replacement reported incomplete; cooperative re-dispatch arranged.', status: 'Open', date: '21 Sep', priority: 'High' },
  { id: 'CP-150', workerName: 'Unassigned', category: 'Pricing', title: 'Quote mismatch', detail: 'Customer disputes final amount vs estimate.', status: 'Resolved', date: '18 Sep', priority: 'Medium' },
  { id: 'CP-149', workerId: 'cw-009', workerName: workerById('cw-009')?.name ?? 'Member', category: 'Behaviour', title: 'Professionalism note', detail: 'Soft complaint — communication during job. Coop counselled the member.', status: 'Resolved', date: '15 Sep', priority: 'Low' },
  { id: 'CP-148', workerName: 'Unassigned', category: 'Billing', title: 'Duplicate charge', detail: 'Refund issued after verification.', status: 'Resolved', date: '12 Sep', priority: 'Medium' },
];

export interface FeedbackEntry {
  id: string;
  workerId: string;
  workerName: string;
  customer: string;
  rating: number;
  category: string;
  text: string;
  date: string;
}

export const COP_FEEDBACK: FeedbackEntry[] = [
  { id: 'FB-1', workerId: 'cw-001', workerName: workerById('cw-001')?.name ?? 'Member', customer: 'A. Deshmukh', rating: 5, category: 'Electrician', text: 'Arrived on time, explained the fix, very professional.', date: '23 Sep' },
  { id: 'FB-2', workerId: 'cw-006', workerName: workerById('cw-006')?.name ?? 'Member', customer: 'R. Iyer', rating: 4, category: 'Plumber', text: 'Good work, came slightly late but completed properly.', date: '22 Sep' },
  { id: 'FB-3', workerId: 'cw-012', workerName: workerById('cw-012')?.name ?? 'Member', customer: 'S. Nair', rating: 5, category: 'Cleaner', text: 'Deep clean done excellently. Will book again.', date: '21 Sep' },
  { id: 'FB-4', workerId: 'cw-018', workerName: workerById('cw-018')?.name ?? 'Member', customer: 'K. Joshi', rating: 3, category: 'AC Technician', text: 'Work OK but left some dust behind.', date: '20 Sep' },
  { id: 'FB-5', workerId: 'cw-023', workerName: workerById('cw-023')?.name ?? 'Member', customer: 'P. Rao', rating: 5, category: 'Carpenter', text: 'Clean finish on the wardrobe door.', date: '19 Sep' },
  { id: 'FB-6', workerId: 'cw-029', workerName: workerById('cw-029')?.name ?? 'Member', customer: 'M. Khan', rating: 4, category: 'Electrician', text: 'Fast and neat work.', date: '17 Sep' },
];

export const RATING_METRICS = {
  average: 4.7,
  p5: 68,
  p4: 24,
  p3: 6,
  p2: 1.5,
  p1: 0.5,
};

/* ───────────────────────── Demand & forecasting ─────────────────────── */

export interface DemandRow {
  trade: string;
  label: string;
  today: number;
  tomorrow: number;
  nextWeek: number;
  capacity: number;
  gap: number;
}

export const DEMAND_ROWS: DemandRow[] = COOP_TRADES.map((t, i) => {
  const base = [82, 68, 44, 61, 35, 55, 28, 40, 24, 33][i] ?? 40;
  const today = base + Math.floor(rnd() * 8) - 4;
  const tomorrow = Math.round(today * (1 + (rnd() * 0.18 - 0.05)));
  const nextWeek = Math.round(tomorrow * (1 + (rnd() * 0.22 - 0.02)));
  const capacity = workersByTrade(t.slug).filter((w) => w.availableToday).length * 6;
  return { trade: t.slug, label: t.label, today, tomorrow, nextWeek, capacity, gap: nextWeek - capacity };
});

export interface AreaDemand {
  area: string;
  trade: string;
  level: 'High' | 'Medium' | 'Low';
  note?: string;
}

export const AREA_DEMAND: AreaDemand[] = [
  { area: 'Kothrud', trade: 'electrician', level: 'High', note: 'High electrician demand' },
  { area: 'Shivaji Nagar', trade: 'plumber', level: 'High', note: 'High plumber demand' },
  { area: 'Aundh', trade: 'cleaner', level: 'Medium', note: 'Low worker coverage' },
  { area: 'Baner', trade: 'electrician', level: 'Medium' },
  { area: 'Viman Nagar', trade: 'ac-technician', level: 'High', note: 'AC service surge' },
  { area: 'Hadapsar', trade: 'cleaner', level: 'Medium' },
  { area: 'Kharadi', trade: 'carpenter', level: 'Medium' },
  { area: 'Karve Nagar', trade: 'domestic-helper', level: 'High', note: 'High helper demand' },
  { area: 'Pimpri-Chinchwad', trade: 'plumber', level: 'Medium' },
];

export const DEMAND_INSIGHTS = [
  { trade: 'Plumber', text: 'Plumbing demand expected to increase 18% this weekend (festive repairs).', confidence: 87 },
  { trade: 'electrician', text: 'Electrical repair demand rising in western Pune over the next 7 days.', confidence: 82 },
  { trade: 'AC Technician', text: 'AC service demand surges in Viman Nagar before the heat wave.', confidence: 78 },
  { trade: 'cleaner', text: 'Kothrud has high cleaner demand — 3 more workers recommended.', confidence: 74 },
  { trade: 'Domestic Helper', text: 'Karve Nagar shows recurring helper demand across 5 societies.', confidence: 71 },
];

/* ───────────────────────── Alerts & notifications ───────────────────── */

export interface CoopAlert {
  id: string;
  severity: 'info' | 'warn' | 'danger';
  title: string;
  body: string;
  tab: string;
}

const pendingVerifications = WORKER_METRICS.pendingVerification;
export const COP_ALERTS: CoopAlert[] = [
  { id: 'a1', severity: 'warn', title: `${pendingVerifications} worker profiles pending verification`, body: 'Identity and skill documents await review.', tab: 'verification' },
  { id: 'a2', severity: 'warn', title: `${COP_POLICIES.filter((p) => p.status === 'Expiring').length} insurance policies expiring`, body: 'Renew before coverage lapses.', tab: 'welfareInsurance' },
  { id: 'a3', severity: 'danger', title: `${COP_COMPLAINTS.filter((c) => c.status === 'Open').length} customer complaints unresolved`, body: 'Respond and resolve to protect consumer trust.', tab: 'ratingsComplaints' },
  { id: 'a4', severity: 'warn', title: `${requestsByStatus('New').length + requestsByStatus('Matching').length} jobs awaiting worker assignment`, body: 'New customer requests need matching.', tab: 'requests' },
  { id: 'a5', severity: 'warn', title: `${COP_TRANSACTIONS.filter((t) => t.status === 'Pending').length} payments awaiting settlement`, body: 'Settle worker payouts to keep earnings on time.', tab: 'paymentsPayouts' },
  { id: 'a6', severity: 'danger', title: `${WORKER_METRICS.overloaded} workers approaching excessive workload`, body: 'AI suggests rebalancing assignments.', tab: 'matching' },
];

export interface CoopNotice {
  id: string;
  category: 'request' | 'verification' | 'booking' | 'payment' | 'welfare' | 'insurance' | 'emergency' | 'ai' | 'certification';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const COP_NOTICES: CoopNotice[] = [
  { id: 'n1', category: 'request', title: 'New service request', body: 'Pipe leakage fix · Shivaji Nagar · needs plumber today.', time: '12m', read: false },
  { id: 'n2', category: 'verification', title: '3 verifications submitted', body: 'Documents uploaded for 3 new member applications.', time: '45m', read: false },
  { id: 'n3', category: 'emergency', title: '🚨 Emergency request', body: 'Electrical fault · Karve Nagar · received 2 min ago.', time: '2m', read: false },
  { id: 'n4', category: 'ai', title: 'AI insight', body: 'AC service demand +18% in Viman Nagar this week.', time: '1h', read: false },
  { id: 'n5', category: 'payment', title: 'Payout batch scheduled', body: '23 worker payouts totalling ₹1.2L ready for settlement.', time: '2h', read: false },
  { id: 'n6', category: 'insurance', title: 'Policy expiring', body: '4 PM-JAY policies expire within 30 days.', time: '5h', read: true },
  { id: 'n7', category: 'certification', title: 'Certification renewal', body: '4 workers need NCCT certification renewal this month.', time: 'Yesterday', read: true },
  { id: 'n8', category: 'welfare', title: 'Welfare claim approved', body: 'Accident cover claim ₹18,400 approved for tool injury.', time: 'Yesterday', read: true },
  { id: 'n9', category: 'booking', title: 'Booking confirmed', body: 'Deep cleaning · Hadapsar · confirmed by customer.', time: 'Yesterday', read: true },
];

/* ───────────────────────── Emergency ────────────────────────────────── */

export interface EmergencyRequest {
  id: string;
  issue: string;
  trade: string;
  location: string;
  lat: number;
  lng: number;
  receivedAgo: string;
  customer: string;
  nearest: { workerId: string; km: number }[];
}

export const COP_EMERGENCIES: EmergencyRequest[] = [
  {
    id: 'EM-901', issue: 'Electrical fault (sparking switchboard)', trade: 'electrician',
    location: 'Shivaji Nagar', lat: 18.5314, lng: 73.8446, receivedAgo: '2 minutes ago', customer: 'R. Iyer',
    nearest: [
      { workerId: 'cw-002', km: 1.2 },
      { workerId: 'cw-006', km: 1.8 },
      { workerId: 'cw-010', km: 2.4 },
    ],
  },
  {
    id: 'EM-902', issue: 'Burst water pipe — bathroom flooding', trade: 'plumber',
    location: 'Karve Nagar', lat: 18.4907, lng: 73.8126, receivedAgo: '11 minutes ago', customer: 'M. Khan',
    nearest: [
      { workerId: 'cw-005', km: 0.9 },
      { workerId: 'cw-013', km: 1.6 },
      { workerId: 'cw-021', km: 2.1 },
    ],
  },
  {
    id: 'EM-903', issue: 'AC sparking / burning smell', trade: 'ac-technician',
    location: 'Viman Nagar', lat: 18.5679, lng: 73.9143, receivedAgo: '26 minutes ago', customer: 'S. Nair',
    nearest: [
      { workerId: 'cw-008', km: 1.1 },
      { workerId: 'cw-016', km: 2.0 },
      { workerId: 'cw-024', km: 2.8 },
    ],
  },
];

export const EMERGENCY_METRICS = {
  active: COP_EMERGENCIES.length,
  avgDispatch: '16 min',
  cmdCoverage: '92%',
};

/* ───────────────────────── Reports series ───────────────────────────── */

export interface ReportDay {
  day: string;
  revenue: number;
  jobs: number;
  utilization: number;
  satisfaction: number;
}

const DAY_NAMES = ['1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep', '8 Sep', '9 Sep', '10 Sep', '11 Sep', '12 Sep', '13 Sep', '14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep'];
export function buildReportSeries(): ReportDay[] {
  return DAY_NAMES.map((day, i) => ({
    day,
    revenue: 42000 + Math.floor(rnd() * 30000) + i * 700,
    jobs: 48 + Math.floor(rnd() * 30) + Math.floor(i * 1.4),
    utilization: Math.round(52 + rnd() * 38),
    satisfaction: Math.round((4.4 + rnd() * 0.5) * 10) / 10,
  }));
}
export const COP_REPORT_SERIES = buildReportSeries();

export const REPORT_METRICS = {
  avgUtilization: Math.round(COP_REPORT_SERIES.reduce((s, d) => s + d.utilization, 0) / COP_REPORT_SERIES.length),
  completionRate: 94,
  cancellationRate: 2.6,
  avgMatchTime: '4.2 min',
  avgAssignTime: '12 min',
  avgEmergencyResponse: '16 min',
  repeatCustomers: 38,
};

/* ───────────────────────── Federation ───────────────────────────────── */

export interface FederationSociety {
  id: string;
  name: string;
  reg: string;
  trade: string;
  area: string;
  established: string;
  workers: number;
  verified: number;
  jobsMonth: number;
  revenueMonth: number;
  welfareFund: number;
  rating: number;
  coverageZones: string[];
  fundsDisbursed: string;
}

export const FED_SOCIETIES: FederationSociety[] = [
  { id: 'fs1', name: 'Pune Electricians Cooperative Society Ltd.', reg: 'MH/PUN/COOP/2018/EL-04', trade: 'Electrician', area: 'Pune Urban & Suburban', established: '2018', workers: 410, verified: 378, jobsMonth: 1240, revenueMonth: 482000, welfareFund: 28920, rating: 4.8, coverageZones: ['Kothrud', 'Baner', 'Aundh', 'Shivaji Nagar'], fundsDisbursed: '₹82,40,000' },
  { id: 'fs2', name: 'Pimpri-Pune Plumbers Guild Cooperative', reg: 'MH/PUN/COOP/2020/PL-09', trade: 'Plumber', area: 'PCMC & Pimpri Chinchwad', established: '2020', workers: 340, verified: 305, jobsMonth: 890, revenueMonth: 335000, welfareFund: 20100, rating: 4.6, coverageZones: ['Pimpri-Chinchwad', 'Wakad'], fundsDisbursed: '₹68,10,000' },
  { id: 'fs3', name: 'Maharashtra Woodcraft & Carpenters Cooperative', reg: 'MH/PUN/COOP/2014/CP-03', trade: 'Carpenter', area: 'Western Maharashtra Federation', established: '2014', workers: 280, verified: 262, jobsMonth: 610, revenueMonth: 248000, welfareFund: 14880, rating: 4.7, coverageZones: ['Kharadi', 'Viman Nagar'], fundsDisbursed: '₹54,90,000' },
  { id: 'fs4', name: 'Shramik Mahila Sanitation Cooperative', reg: 'MH/PUN/COOP/2019/CLN-14', trade: 'Cleaner / Domestic Helper', area: 'Pune Metro Cluster', established: '2019', workers: 520, verified: 471, jobsMonth: 1680, revenueMonth: 512000, welfareFund: 30720, rating: 4.9, coverageZones: ['Hadapsar', 'Bibwewadi', 'Katraj'], fundsDisbursed: '₹1,12,00,000' },
  { id: 'fs5', name: 'Pune Central Labour Cooperative Union', reg: 'MH/PUN/COOP/2016/GEN-11', trade: 'Multi-trade', area: 'Apex Pune District Federation', established: '2016', workers: 850, verified: 742, jobsMonth: 2140, revenueMonth: 796000, welfareFund: 47760, rating: 4.7, coverageZones: ['Deccan', 'Karve Nagar', 'Aundh'], fundsDisbursed: '₹1,02,60,000' },
];

/* ───────────────────────── Training ─────────────────────────────────── */

export interface TrainingProgram {
  id: string;
  title: string;
  meta: string;
  seats: number;
  duration: string;
  certification: string;
}

export const COP_TRAINING_PROGRAMS: TrainingProgram[] = [
  { id: 'tr1', title: 'Advanced Electrical Safety & Certification', meta: 'NCCT accredited', seats: 30, duration: '2 days', certification: 'NCCT Advanced Safety' },
  { id: 'tr2', title: 'Pipe Leak Detection & Pressure Testing', meta: 'Plumbers guild', seats: 24, duration: '1 day', certification: 'Guild Practical' },
  { id: 'tr3', title: 'AC Refrigerant Handling (R32/R410A)', meta: 'HVAC guild', seats: 18, duration: '2 days', certification: 'EPA-style practical' },
  { id: 'tr4', title: 'Customer Communication & Digital Payments', meta: 'Coop academy', seats: 40, duration: 'Half day', certification: 'Coop Certificate' },
  { id: 'tr5', title: 'Senior Caregiver Certification', meta: 'Caregiver federation', seats: 25, duration: '5 days', certification: 'NCCT Caregiver Level 1' },
];

export const SKILL_GAPS = [
  { trade: 'Electrician', gap: 26, note: 'Recruit/train 15 additional electricians or expand service radius.' },
  { trade: 'Plumber', gap: -17, note: 'Surplus capacity 17 — rebalance into weekend surge.' },
  { trade: 'AC Technician', gap: 14, note: 'Train 10–14 technicians before heat wave.' },
  { trade: 'Caregiver', gap: 9, note: 'Growing society contracts — certified caregivers needed.' },
  { trade: 'Cleaner', gap: 6, note: 'Kothrud & Aundh shortfall in afternoon slots.' },
];

export const CERT_EXPIRY_SOON = COP_WORKERS.filter((w) => w.certification.status === 'Expiring').slice(0, 8);

/* ───────────────────────── Roles (RBAC display) ─────────────────────── */

export const COOP_ROLES = [
  { name: 'Federation Admin', modules: ['All modules across societies'], tone: 'green' as const },
  { name: 'Cooperative Admin', modules: ['All cooperative modules'], tone: 'green' as const },
  { name: 'Operations Manager', modules: ['Service Requests', 'Jobs & Bookings', 'Coverage Map', 'Emergency', 'Availability'], tone: 'blue' as const },
  { name: 'Verification Officer', modules: ['Workers', 'Verification Center', 'Skill Passports'], tone: 'amber' as const },
  { name: 'Finance Officer', modules: ['Payments & Payouts', 'Invoices', 'Reports & Analytics'], tone: 'slate' as const },
  { name: 'Welfare Officer', modules: ['Welfare & Insurance', 'Training & Skills', 'Worker benefits'], tone: 'green' as const },
  { name: 'Support Staff', modules: ['Service Requests', 'Ratings & Complaints', 'Notifications'], tone: 'slate' as const },
];

/* ───────────────────────── Demo export helpers ─────────────────────── */

// Expo Go / React Native: no DOM download — return CSV text for Share/Alert callers.
export function downloadCsv(filename: string, rows: string[][]): string {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  void filename;
  return csv;
}

export const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const formatLakh = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

/* ───────────────────────── Shared store contract ────────────────────── */

export type PortalLang = 'en' | 'hi' | 'mr';

/**
 * The single mutable store the CooperativePortal owns and hands to every
 * screen. Mutations here stay consistent across modules (verification →
 * passports → matching → jobs → payments).
 */
export interface CoopStore {
  lang: PortalLang;
  go: (tab: string) => void;
  showToast: (msg: string) => void;
  onOpenAI: () => void;
  workers: CoopWorker[];
  approveWorker: (id: string) => void;
  rejectWorker: (id: string) => void;
  setWorkerUnderReview: (id: string) => void;
  toggleAvailability: (id: string) => void;
  requests: ServiceRequest[];
  setRequestStatus: (id: string, status: RequestStatus) => void;
  assignWorkerToRequest: (requestId: string, workerId: string) => void;
  /** Confirmed bookings created from the Customer Portal (single source of truth). */
  customerBookings: Booking[];
}