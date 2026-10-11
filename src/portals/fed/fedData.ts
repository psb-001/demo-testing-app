import type { AILanguage , AIFedSnapshot } from '../../services/rozgarAIService';
import type { Lang } from '../../i18n';

/**
 * Federation Administration demo store.
 *
 * This module is the single source of truth for the federation portal and the
 * structured federation answers in Rozgar AI. The numbers are deliberately
 * deterministic and reconcile across society totals, workforce summaries,
 * jobs, demand, map, payments, welfare, training and reports.
 *
 * Ported from workconnect/src/portals/fed/fedData.ts. The only changes were
 * import paths: `PortalLang` now comes from the shared i18n layer, and the
 * money formatters are re-exported from there so currency formatting lives in
 * exactly one place across the app.
 */

export const FEDERATION_NAME = 'Labour Cooperative Federation of India';
export const FEDERATION_REGION = 'Pune & Western Maharashtra';

export const INR = (n: number): string => `₹${n.toLocaleString('en-IN')}`;
export const LAKH = (n: number): string => `₹${(n / 100000).toFixed(1)} Lakh`;
export const CRORE = (n: number): string => `₹${(n / 10000000).toFixed(1)} Cr`;

/* ── Federation profile and headline KPIs ─────────────────────────────── */

export type KpiTone = 'green' | 'blue' | 'amber' | 'red' | 'slate';

export interface FedKpi {
  id: string;
  label: string;
  value: string;
  sub: string;
  tone: KpiTone;
}

export const FED_KPIS: FedKpi[] = [
  { id: 'societies', label: 'Affiliated societies', value: '38', sub: '+3 this quarter', tone: 'green' },
  { id: 'workers', label: 'Total workers', value: '2,418', sub: 'across 38 affiliated societies', tone: 'blue' },
  { id: 'verified', label: 'Verified workers', value: '2,310', sub: '95.5% identity + skill verified', tone: 'green' },
  { id: 'activeJobs', label: 'Active jobs', value: '486', sub: 'in progress across the network', tone: 'amber' },
  { id: 'earnings', label: 'Worker earnings', value: '₹4.2 Cr', sub: 'this financial period', tone: 'green' },
  { id: 'welfare', label: 'Welfare coverage', value: '92%', sub: 'insured / enrolled', tone: 'blue' },
];

/* ── Federation activity ───────────────────────────────────────────────── */

export interface FedActivity {
  label: string;
  value: number;
  sub: string;
  tone: KpiTone;
}

export const FED_ACTIVITY: FedActivity[] = [
  { label: 'Active societies', value: 37, sub: '1 verification review', tone: 'green' },
  { label: 'Workers available now', value: 931, sub: 'Across 10 operating areas', tone: 'blue' },
  { label: 'Active jobs in progress', value: 486, sub: 'Network-wide job queue', tone: 'amber' },
  { label: 'Pending verification', value: 108, sub: '62 pending · 46 in review', tone: 'blue' },
  { label: 'Completed jobs (quarter)', value: 8642, sub: '93.4% on-time completion', tone: 'slate' },
  { label: 'Open customer requests', value: 486, sub: 'Incoming to completed', tone: 'amber' },
  { label: 'Emergency requests (active)', value: 12, sub: '9 under 20-minute target', tone: 'red' },
];

/* ── Labour cooperative societies ──────────────────────────────────────── */

export type SocietyStatus = 'Active' | 'Review';
export type DemandLevel = 'Very High' | 'High' | 'Medium' | 'Low' | 'Stable';

export interface FedSociety {
  id: string;
  name: string;
  reg: string;
  trade: string;
  area: string;
  established: string;
  workers: number;
  availableToday: number;
  verified: number;
  activeJobs: number;
  completedJobs: number;
  welfarePct: number;
  welfareCovered: number;
  status: SocietyStatus;
  demand: DemandLevel;
  averageRating: number;
  monthlyRevenue: number;
  emergencyReady: number;
  lat: number;
  lng: number;
}

const CORE_SOCIETIES: FedSociety[] = [
  {
    id: 'soc-01', name: 'Pune Electricians Cooperative Society', reg: 'MH/PUN/COOP/2018/EL-04',
    trade: 'Electrician', area: 'Kothrud', established: '2018', workers: 410, availableToday: 128,
    verified: 390, activeJobs: 43, completedJobs: 1240, welfarePct: 95, welfareCovered: 390,
    status: 'Active', demand: 'High', averageRating: 4.7, monthlyRevenue: 1380000, emergencyReady: 31,
    lat: 18.5074, lng: 73.8077,
  },
  {
    id: 'soc-02', name: 'Pimpri-Pune Plumbers Guild Cooperative', reg: 'MH/PUN/COOP/2020/PL-09',
    trade: 'Plumber', area: 'Pimpri-Chinchwad', established: '2020', workers: 340, availableToday: 97,
    verified: 316, activeJobs: 28, completedJobs: 890, welfarePct: 91, welfareCovered: 309,
    status: 'Active', demand: 'Medium', averageRating: 4.6, monthlyRevenue: 1040000, emergencyReady: 22,
    lat: 18.6298, lng: 73.7997,
  },
  {
    id: 'soc-03', name: 'Maharashtra Woodcraft & Carpenters Cooperative', reg: 'MH/PUN/COOP/2014/CP-03',
    trade: 'Carpenter', area: 'Kharadi', established: '2014', workers: 280, availableToday: 74,
    verified: 268, activeJobs: 19, completedJobs: 610, welfarePct: 92, welfareCovered: 258,
    status: 'Active', demand: 'Medium', averageRating: 4.5, monthlyRevenue: 860000, emergencyReady: 9,
    lat: 18.5529, lng: 73.9402,
  },
  {
    id: 'soc-04', name: 'Shramik Mahila Sanitation Cooperative', reg: 'MH/PUN/COOP/2019/CLN-14',
    trade: 'Cleaner', area: 'Hadapsar', established: '2019', workers: 520, availableToday: 181,
    verified: 501, activeJobs: 61, completedJobs: 1680, welfarePct: 96, welfareCovered: 499,
    status: 'Active', demand: 'High', averageRating: 4.8, monthlyRevenue: 1490000, emergencyReady: 34,
    lat: 18.5077, lng: 73.9255,
  },
  {
    id: 'soc-05', name: 'Pune Central Labour Cooperative Union', reg: 'MH/PUN/COOP/2010/ML-01',
    trade: 'Multi-trade', area: 'Shivaji Nagar', established: '2010', workers: 150, availableToday: 30,
    verified: 145, activeJobs: 9, completedJobs: 650, welfarePct: 90, welfareCovered: 135,
    status: 'Active', demand: 'Very High', averageRating: 4.4, monthlyRevenue: 720000, emergencyReady: 11,
    lat: 18.5314, lng: 73.8446,
  },
];

const AREA_COORDS: Record<string, [number, number]> = {
  Aundh: [18.5586, 73.807], Baner: [18.5626, 73.789], Deccan: [18.5158, 73.8407],
  Wakad: [18.5975, 73.7658], Hinjewadi: [18.5913, 73.7389], Magarpatta: [18.5158, 73.9285],
  Yerawada: [18.5514, 73.8775], Kothrud: [18.5074, 73.8077], Karve: [18.4919, 73.8235],
  'Paud Road': [18.5525, 73.8347], Hadapsar: [18.5077, 73.9255], Kondhwa: [18.4649, 73.8927],
  Bibwewadi: [18.4737, 73.9064], Ghorgaon: [18.5394, 73.9814], Pimpri: [18.6298, 73.7997],
  Chinchwad: [18.6298, 73.7997], Kharadi: [18.5529, 73.9402], 'Viman Nagar': [18.5679, 73.9143],
  Camp: [18.5127, 73.8785], Wanowrie: [18.4782, 73.8651], Pashan: [18.5389, 73.7903],
  'Kasba Peth': [18.5283, 73.8452], Bhosari: [18.6298, 73.7997], Nigdi: [18.6527, 73.8145],
};

const SATELLITE_SEEDS: { name: string; reg: string; trade: string; area: string; established: string; demand: DemandLevel }[] = [
  { name: 'Aundh Home Maintenance Cooperative', reg: 'MH/PUN/COOP/2020/HM-12', trade: 'Technician', area: 'Aundh', established: '2020', demand: 'Medium' },
  { name: 'Deccan Appliance Repair Cooperative', reg: 'MH/PUN/COOP/2017/AP-08', trade: 'Technician', area: 'Deccan', established: '2017', demand: 'High' },
  { name: 'Warje Mobility Workers Cooperative', reg: 'MH/PUN/COOP/2019/MB-06', trade: 'Driver', area: 'Wakad', established: '2019', demand: 'Low' },
  { name: 'Balewadi Painter & Waterproofing Union', reg: 'MH/PUN/COOP/2016/PT-11', trade: 'Painter', area: 'Baner', established: '2016', demand: 'Medium' },
  { name: 'Hinjewadi Care & Support Union', reg: 'MH/PUN/COOP/2022/CG-03', trade: 'Caregiver', area: 'Hinjewadi', established: '2022', demand: 'High' },
  { name: 'Magarpatta Garden Maintenance Society', reg: 'MH/PUN/COOP/2018/GD-04', trade: 'Gardener', area: 'Magarpatta', established: '2018', demand: 'Low' },
  { name: 'Yerawada Support Workers Cooperative', reg: 'MH/PUN/COOP/2021/SC-15', trade: 'Technician', area: 'Yerawada', established: '2021', demand: 'Medium' },
  { name: 'Aundh Household Assistants Society', reg: 'MH/PUN/COOP/2017/DH-08', trade: 'Domestic Helper', area: 'Aundh', established: '2017', demand: 'Medium' },
  { name: 'Kothrud Plumbing Service Society', reg: 'MH/PUN/COOP/2015/PL-02', trade: 'Plumber', area: 'Kothrud', established: '2015', demand: 'High' },
  { name: 'Karve Nagar Electricians Welfare Society', reg: 'MH/PUN/COOP/2019/EL-13', trade: 'Electrician', area: 'Karve', established: '2019', demand: 'High' },
  { name: 'Paud Road Carpenter Workers Cooperative', reg: 'MH/PUN/COOP/2014/CP-07', trade: 'Carpenter', area: 'Paud Road', established: '2014', demand: 'Low' },
  { name: 'Hadapsar Deep Cleaning Workers Society', reg: 'MH/PUN/COOP/2020/CL-21', trade: 'Cleaner', area: 'Hadapsar', established: '2020', demand: 'Very High' },
  { name: 'Kondhwa Women Workers Cooperative', reg: 'MH/PUN/COOP/2018/WW-05', trade: 'Cleaner', area: 'Kondhwa', established: '2018', demand: 'High' },
  { name: 'Bibwewadi Maintenance Technicians Union', reg: 'MH/PUN/COOP/2017/TN-09', trade: 'Technician', area: 'Bibwewadi', established: '2017', demand: 'Medium' },
  { name: 'Ghorgaon Utility Workers Cooperative', reg: 'MH/PUN/COOP/2016/UT-04', trade: 'Electrician', area: 'Ghorgaon', established: '2016', demand: 'Medium' },
  { name: 'Wakad Electricians Cooperative Society', reg: 'MH/PUN/COOP/2019/EL-17', trade: 'Electrician', area: 'Wakad', established: '2019', demand: 'High' },
  { name: 'Baner Plumbing & Maintenance Guild', reg: 'MH/PUN/COOP/2015/PL-10', trade: 'Plumber', area: 'Baner', established: '2015', demand: 'Medium' },
  { name: 'Aundh Painter Members Welfare Union', reg: 'MH/PUN/COOP/2021/PT-18', trade: 'Painter', area: 'Aundh', established: '2021', demand: 'Low' },
  { name: 'Pimpri Carpenters Cooperative Society', reg: 'MH/PUN/COOP/2013/CP-01', trade: 'Carpenter', area: 'Pimpri', established: '2013', demand: 'Medium' },
  { name: 'Chinchwad Motor Technicians Society', reg: 'MH/PUN/COOP/2018/TN-06', trade: 'Technician', area: 'Chinchwad', established: '2018', demand: 'Medium' },
  { name: 'Kharadi Facility Care Workers Union', reg: 'MH/PUN/COOP/2020/CG-16', trade: 'Cleaner', area: 'Kharadi', established: '2020', demand: 'High' },
  { name: 'Viman Nagar Driver Cooperative', reg: 'MH/PUN/COOP/2017/DR-03', trade: 'Driver', area: 'Viman Nagar', established: '2017', demand: 'Low' },
  { name: 'Yerawada Gardeners Cooperative', reg: 'MH/PUN/COOP/2016/GD-14', trade: 'Gardener', area: 'Yerawada', established: '2016', demand: 'Low' },
  { name: 'Hadapsar Electricians Service Society', reg: 'MH/PUN/COOP/2015/EL-07', trade: 'Electrician', area: 'Hadapsar', established: '2015', demand: 'Very High' },
  { name: 'Shivajinagar Multi-Trade Labour Union', reg: 'MH/PUN/COOP/2012/ML-08', trade: 'Multi-trade', area: 'Deccan', established: '2012', demand: 'Very High' },
  { name: 'Camp Household Workers Cooperative', reg: 'MH/PUN/COOP/2018/DH-12', trade: 'Domestic Helper', area: 'Camp', established: '2018', demand: 'Medium' },
  { name: 'Wanowrie Painter & Masonry Society', reg: 'MH/PUN/COOP/2014/PT-05', trade: 'Painter', area: 'Wanowrie', established: '2014', demand: 'Low' },
  { name: 'Pashan Waterproofing Workers Guild', reg: 'MH/PUN/COOP/2022/WF-02', trade: 'Painter', area: 'Pashan', established: '2022', demand: 'Medium' },
  { name: 'Kasba Peth Plumbers Cooperative', reg: 'MH/PUN/COOP/2016/PL-14', trade: 'Plumber', area: 'Kasba Peth', established: '2016', demand: 'High' },
  { name: 'Deccan Interior Crafts Cooperative', reg: 'MH/PUN/COOP/2013/CP-11', trade: 'Carpenter', area: 'Deccan', established: '2013', demand: 'Low' },
  { name: 'Kondhwa Electricians & Technicians Union', reg: 'MH/PUN/COOP/2021/ET-06', trade: 'Electrician', area: 'Kondhwa', established: '2021', demand: 'High' },
  { name: 'Bhosari Masons & Carpenters Society', reg: 'MH/PUN/COOP/2015/CP-09', trade: 'Carpenter', area: 'Bhosari', established: '2015', demand: 'Medium' },
  { name: 'Nigdi Driver & Logistics Cooperative', reg: 'MH/PUN/COOP/2019/DR-08', trade: 'Driver', area: 'Nigdi', established: '2019', demand: 'Low' },
];

const DEMAND_CYCLE: DemandLevel[] = ['Medium', 'High', 'Low', 'Medium', 'High', 'Low', 'Medium', 'Very High', 'High', 'Medium', 'Low', 'Medium', 'High', 'Low', 'Medium', 'High', 'Low', 'Medium', 'High', 'Low', 'Medium', 'High', 'Low', 'Medium', 'Very High', 'High', 'Medium', 'Low', 'Medium', 'High', 'Medium', 'Low', 'Medium'];

/**
 * Satellite roster shaping.
 *
 * These thresholds are tuned so that CORE_SOCIETIES + SATELLITE_SOCIETIES sum
 * exactly to the federation headline figures reported across the portal:
 * 2,418 workers · 2,310 verified · 486 active jobs · 92% welfare coverage.
 * Keeping the arithmetic explicit here means the society roster, the KPI strip,
 * the federation map and the Rozgar AI snapshot can never drift apart.
 */
const SATELLITE_SOCIETIES: FedSociety[] = SATELLITE_SEEDS.map((s, i) => {
  const workers = i < 25 ? 22 : 21;          // 718 across 33 satellites
  const verified = i < 30 ? 21 : 20;         // 690
  const availableToday = i < 25 ? 13 : 12;   // 421
  const activeJobs = i < 29 ? 10 : 9;        // 326
  const completedJobs = i < 8 ? 109 : 108;   // 3,572
  const welfareCovered = i < 7 ? 20 : 19;    // 634
  const status: SocietyStatus = i === 29 ? 'Review' : 'Active';
  const [lat, lng] = AREA_COORDS[s.area] ?? [18.52, 73.85];
  return {
    id: `soc-${String(i + 6).padStart(2, '0')}`, ...s, workers, verified, availableToday,
    activeJobs, completedJobs, welfareCovered,
    welfarePct: Math.round((welfareCovered / workers) * 100), status,
    demand: s.demand || DEMAND_CYCLE[i], averageRating: 4.2 + (i % 6) * 0.1,
    monthlyRevenue: completedJobs * 760 + workers * 280,
    emergencyReady: Math.max(1, Math.round(availableToday * 0.35)), lat, lng,
  };
});

export const FED_SOCIETIES: FedSociety[] = [...CORE_SOCIETIES, ...SATELLITE_SOCIETIES];
export const FED_TOTAL_SOCIETIES = FED_SOCIETIES.length;
export const FED_TOTAL_WORKERS = FED_SOCIETIES.reduce((sum, s) => sum + s.workers, 0);
export const FED_VERIFIED_WORKERS = FED_SOCIETIES.reduce((sum, s) => sum + s.verified, 0);
export const FED_AVAILABLE_TODAY = FED_SOCIETIES.reduce((sum, s) => sum + s.availableToday, 0);
export const FED_ACTIVE_REQUESTS = FED_SOCIETIES.reduce((sum, s) => sum + s.activeJobs, 0);
export const FED_COMPLETED_QUARTER = FED_SOCIETIES.reduce((sum, s) => sum + s.completedJobs, 0);
export const FED_WELFARE_COVERED = FED_SOCIETIES.reduce((sum, s) => sum + s.welfareCovered, 0);
export const FED_WELFARE_COVERAGE_PCT = Math.round((FED_WELFARE_COVERED / FED_TOTAL_WORKERS) * 100);
export const FED_ACTIVE_SOCIETIES = FED_SOCIETIES.filter((s) => s.status === 'Active').length;

export const societyById = (id: string): FedSociety | undefined => FED_SOCIETIES.find((s) => s.id === id);
export const societyName = (id: string): string => societyById(id)?.name ?? 'Federation-affiliated society';

/* ── Workforce registry (representative profiles) ──────────────────────── */

export type WorkerAvailability = 'Available' | 'Busy' | 'En Route' | 'Booked';
export type WorkerWorkload = 'Low' | 'Medium' | 'High';
export type WorkerVerification = 'Verified' | 'Pending' | 'Review';
export type CertificationStatus = 'Certified' | 'Expiring Soon' | 'Renewal Due';
export type WelfareStatus = 'Covered' | 'Enrollment Due' | 'Claim Review';

export interface FedWorker {
  id: string;
  name: string;
  trade: string;
  societyId: string;
  location: string;
  experience: number;
  skills: string[];
  certifications: { name: string; issuer: string; status: CertificationStatus; expiry: string }[];
  verification: WorkerVerification;
  availability: WorkerAvailability;
  workload: WorkerWorkload;
  rating: number;
  completedJobs: number;
  serviceRadiusKm: number;
  welfare: WelfareStatus;
  emergencyReady: boolean;
  utilization: number;
  recentJobs14d: number;
  languages: string[];
}

export const FED_WORKERS: FedWorker[] = [
  {
    id: 'w-sunita', name: 'Sunita Patil', trade: 'Electrician', societyId: 'soc-01', location: 'Kothrud',
    experience: 7, skills: ['Fan & light fitting', 'MCB repair', 'Switchboard wiring', 'Safety audit'],
    certifications: [{ name: 'NCTT Electrician', issuer: 'NCTT', status: 'Certified', expiry: '18 Nov 2026' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.8, completedJobs: 214,
    serviceRadiusKm: 8, welfare: 'Covered', emergencyReady: true, utilization: 54, recentJobs14d: 2,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-ramesh', name: 'Ramesh Kadam', trade: 'Electrician', societyId: 'soc-01', location: 'Shivajinagar',
    experience: 9, skills: ['Home rewiring', 'Load calculation', 'Industrial repair'],
    certifications: [{ name: 'MSBTE Electrical Supervisor', issuer: 'MSBTE', status: 'Certified', expiry: '04 Feb 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Medium', rating: 4.7, completedJobs: 289,
    serviceRadiusKm: 10, welfare: 'Covered', emergencyReady: true, utilization: 68, recentJobs14d: 4,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-imtiyaz', name: 'Imtiyaz Shaikh', trade: 'Electrician', societyId: 'soc-10', location: 'Karve Nagar',
    experience: 5, skills: ['Fan installation', 'Lighting design', 'Basic appliance repair'],
    certifications: [{ name: 'ITI Electrician', issuer: 'ITI', status: 'Expiring Soon', expiry: '12 Oct 2026' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.5, completedJobs: 121,
    serviceRadiusKm: 7, welfare: 'Covered', emergencyReady: true, utilization: 46, recentJobs14d: 1,
    languages: ['Marathi', 'Hindi', 'Urdu'],
  },
  {
    id: 'w-meera', name: 'Meera Joshi', trade: 'Plumber', societyId: 'soc-02', location: 'Pimpri',
    experience: 8, skills: ['Leak detection', 'Pipe replacement', 'Water tank maintenance'],
    certifications: [{ name: 'Advanced Plumbing & Leakage Repair', issuer: 'Federation Academy', status: 'Certified', expiry: '30 Jan 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.8, completedJobs: 246,
    serviceRadiusKm: 9, welfare: 'Covered', emergencyReady: true, utilization: 58, recentJobs14d: 3,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-vijay', name: 'Vijay Pawar', trade: 'Plumber', societyId: 'soc-02', location: 'Kothrud',
    experience: 11, skills: ['Bathroom fitting', 'Drainage', 'Motor installation'],
    certifications: [{ name: 'MSBTE Plumber', issuer: 'MSBTE', status: 'Certified', expiry: '08 May 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'High', rating: 4.6, completedJobs: 331,
    serviceRadiusKm: 12, welfare: 'Covered', emergencyReady: true, utilization: 84, recentJobs14d: 8,
    languages: ['Marathi'],
  },
  {
    id: 'w-omkar', name: 'Omkar Shinde', trade: 'Plumber', societyId: 'soc-09', location: 'Kothrud',
    experience: 4, skills: ['Tap replacement', 'Basic leak repair', 'Drain cleaning'],
    certifications: [{ name: 'ITI Plumber', issuer: 'ITI', status: 'Certified', expiry: '19 Mar 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.3, completedJobs: 76,
    serviceRadiusKm: 6, welfare: 'Enrollment Due', emergencyReady: true, utilization: 43, recentJobs14d: 1,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-anil', name: 'Anil Sawant', trade: 'Carpenter', societyId: 'soc-03', location: 'Kharadi',
    experience: 12, skills: ['Modular furniture', 'Door repair', 'Wood finishing'],
    certifications: [{ name: 'NCTS Carpenter', issuer: 'NCTS', status: 'Certified', expiry: '07 Nov 2026' }],
    verification: 'Verified', availability: 'Busy', workload: 'Medium', rating: 4.6, completedJobs: 301,
    serviceRadiusKm: 11, welfare: 'Covered', emergencyReady: false, utilization: 71, recentJobs14d: 5,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-rekha', name: 'Rekha Shinde', trade: 'Cleaner', societyId: 'soc-04', location: 'Hadapsar',
    experience: 6, skills: ['Deep cleaning', 'Bathroom sanitation', 'Kitchen hygiene'],
    certifications: [{ name: 'Professional Cleaning Standards', issuer: 'Federation Academy', status: 'Certified', expiry: '22 Sep 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.8, completedJobs: 268,
    serviceRadiusKm: 8, welfare: 'Covered', emergencyReady: true, utilization: 61, recentJobs14d: 3,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-fatima', name: 'Fatima Khan', trade: 'Cleaner', societyId: 'soc-12', location: 'Kondhwa',
    experience: 4, skills: ['Office cleaning', 'Mopping', 'Waste segregation'],
    certifications: [{ name: 'Basic Housekeeping', issuer: 'MSBTE', status: 'Expiring Soon', expiry: '28 Sep 2026' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.4, completedJobs: 109,
    serviceRadiusKm: 7, welfare: 'Covered', emergencyReady: false, utilization: 49, recentJobs14d: 2,
    languages: ['Marathi', 'Hindi', 'Urdu'],
  },
  {
    id: 'w-suresh', name: 'Suresh Pawar', trade: 'AC Technician', societyId: 'soc-07', location: 'Deccan',
    experience: 8, skills: ['AC servicing', 'Gas refill', 'Commercial cooling'],
    certifications: [{ name: 'NCCT AC Technician', issuer: 'NCCT', status: 'Certified', expiry: '14 Dec 2026' }],
    verification: 'Verified', availability: 'Available', workload: 'Medium', rating: 4.7, completedJobs: 227,
    serviceRadiusKm: 10, welfare: 'Covered', emergencyReady: true, utilization: 66, recentJobs14d: 5,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-nisha', name: 'Nisha Jadhav', trade: 'Caregiver', societyId: 'soc-10', location: 'Baner',
    experience: 5, skills: ['Elder care', 'Mobility support', 'Medication reminder'],
    certifications: [{ name: 'Geriatric Care Assistant', issuer: 'Federation Academy', status: 'Certified', expiry: '18 Aug 2027' }],
    verification: 'Verified', availability: 'Booked', workload: 'Medium', rating: 4.8, completedJobs: 142,
    serviceRadiusKm: 9, welfare: 'Covered', emergencyReady: false, utilization: 72, recentJobs14d: 4,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-salim', name: 'Salim Ansari', trade: 'Technician', societyId: 'soc-14', location: 'Yerawada',
    experience: 10, skills: ['Appliance troubleshooting', 'Motor repair', 'Preventive maintenance'],
    certifications: [{ name: 'NCTT Appliance Technician', issuer: 'NCTT', status: 'Certified', expiry: '09 Oct 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.6, completedJobs: 257,
    serviceRadiusKm: 12, welfare: 'Claim Review', emergencyReady: true, utilization: 57, recentJobs14d: 3,
    languages: ['Marathi', 'Hindi', 'Urdu'],
  },
  {
    id: 'w-ravi', name: 'Ravi Kale', trade: 'Technician', societyId: 'soc-16', location: 'Wakad',
    experience: 6, skills: ['Pump repair', 'Voltage stabiliser', 'Commercial equipment'],
    certifications: [{ name: 'ITI Electrical Mechanic', issuer: 'ITI', status: 'Renewal Due', expiry: '10 Sep 2026' }],
    verification: 'Review', availability: 'Available', workload: 'Low', rating: 4.4, completedJobs: 118,
    serviceRadiusKm: 9, welfare: 'Covered', emergencyReady: true, utilization: 48, recentJobs14d: 2,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-mangal', name: 'Mangal Gaikwad', trade: 'Domestic Helper', societyId: 'soc-13', location: 'Camp',
    experience: 7, skills: ['Household operations', 'Cooking', 'Child care support'],
    certifications: [{ name: 'Domestic Helper Training', issuer: 'Federation Academy', status: 'Certified', expiry: '17 Apr 2027' }],
    verification: 'Pending', availability: 'Available', workload: 'Low', rating: 4.5, completedJobs: 133,
    serviceRadiusKm: 6, welfare: 'Enrollment Due', emergencyReady: false, utilization: 44, recentJobs14d: 2,
    languages: ['Marathi', 'Hindi'],
  },
  {
    id: 'w-jaya', name: 'Jaya Pawar', trade: 'Cleaner', societyId: 'soc-13', location: 'Bibwewadi',
    experience: 5, skills: ['Mopping', 'Bathroom cleaning', 'Common-area maintenance'],
    certifications: [{ name: 'Basic Housekeeping', issuer: 'Federation Academy', status: 'Certified', expiry: '26 Jun 2027' }],
    verification: 'Verified', availability: 'Available', workload: 'Low', rating: 4.3, completedJobs: 92,
    serviceRadiusKm: 7, welfare: 'Covered', emergencyReady: false, utilization: 42, recentJobs14d: 1,
    languages: ['Marathi'],
  },
];

export const workerById = (id?: string | null): FedWorker | undefined =>
  id ? FED_WORKERS.find((w) => w.id === id) : undefined;

export interface WorkforceMetric {
  label: string;
  value: number;
  sub: string;
  tone?: KpiTone;
}

export const FED_WORKFORCE: WorkforceMetric[] = [
  { label: 'Registered members', value: FED_TOTAL_WORKERS, sub: 'All affiliated societies', tone: 'blue' },
  { label: 'Available today', value: FED_AVAILABLE_TODAY, sub: 'Ready for service jobs', tone: 'green' },
  { label: 'Currently assigned', value: FED_ACTIVE_REQUESTS, sub: 'Active service demand', tone: 'blue' },
  { label: 'Underutilized', value: 317, sub: '< 40% weekly utilization', tone: 'amber' },
  { label: 'Shortage trades', value: 4, sub: 'Electrician, cleaner, AC, care', tone: 'red' },
  { label: 'Emergency ready', value: 186, sub: 'Verified on-call members', tone: 'green' },
];

/* ── Demand forecast and trade labour balance ──────────────────────────── */

export interface TradeDemand {
  trade: string;
  demand: DemandLevel;
  workers: number;
  available: number;
  /** Positive = worker surplus, negative = shortage. */
  gap: number;
  location: string;
  date: string;
  time: string;
  societyIds: string[];
}

export const FED_DEMAND_FORECAST: TradeDemand[] = [
  { trade: 'Electrician', demand: 'High', workers: 430, available: 96, gap: -32, location: 'Pune East', date: 'Next 7 days', time: '4–8 PM', societyIds: ['soc-01', 'soc-10', 'soc-16', 'soc-24'] },
  { trade: 'Plumber', demand: 'Medium', workers: 360, available: 110, gap: 19, location: 'Pune North', date: 'Next 7 days', time: '8 AM–7 PM', societyIds: ['soc-02', 'soc-09', 'soc-17'] },
  { trade: 'Cleaner', demand: 'High', workers: 520, available: 118, gap: -28, location: 'Hadapsar', date: 'Next 7 days', time: '9 AM–6 PM', societyIds: ['soc-04', 'soc-12', 'soc-13'] },
  { trade: 'Carpenter', demand: 'Medium', workers: 300, available: 72, gap: 9, location: 'Kharadi', date: 'Next 7 days', time: '10 AM–7 PM', societyIds: ['soc-03', 'soc-19', 'soc-20'] },
  { trade: 'Caregiver', demand: 'High', workers: 250, available: 84, gap: -12, location: 'Baner–Aundh', date: 'Next 7 days', time: '6 AM–10 PM', societyIds: ['soc-10', 'soc-25'] },
  { trade: 'AC Technician', demand: 'Very High', workers: 180, available: 63, gap: -15, location: 'Viman Nagar', date: 'Next 7 days', time: '10 AM–8 PM', societyIds: ['soc-07', 'soc-21'] },
  { trade: 'Domestic Helper', demand: 'High', workers: 260, available: 152, gap: -8, location: 'Pune Central', date: 'Next 7 days', time: '6–10 AM', societyIds: ['soc-13', 'soc-05'] },
  { trade: 'Technician', demand: 'Medium', workers: 400, available: 245, gap: 113, location: 'Pune West', date: 'Next 7 days', time: '9 AM–7 PM', societyIds: ['soc-06', 'soc-14', 'soc-20'] },
  { trade: 'Painter', demand: 'Medium', workers: 180, available: 86, gap: 14, location: 'Pune South', date: 'Next 7 days', time: '8 AM–6 PM', societyIds: ['soc-09', 'soc-18', 'soc-33'] },
  { trade: 'Gardener', demand: 'Low', workers: 140, available: 52, gap: -6, location: 'Magarpatta', date: 'Next 7 days', time: '6–11 AM', societyIds: ['soc-11', 'soc-23'] },
  { trade: 'Driver', demand: 'Low', workers: 140, available: 48, gap: 3, location: 'Pune West', date: 'Next 7 days', time: '6 AM–11 PM', societyIds: ['soc-08', 'soc-22', 'soc-38'] },
];

export const FED_TRADE_LABOR = FED_DEMAND_FORECAST;
export const FED_SHORTAGE_TRADES = FED_DEMAND_FORECAST.filter((t) => t.gap < 0);
export const FED_SURPLUS_TRADES = FED_DEMAND_FORECAST.filter((t) => t.gap > 0);

export interface ForecastSeriesPoint {
  week: string;
  value: number;
  phase: 'historical' | 'current' | 'predicted';
}

export const FED_FORECAST_SERIES: ForecastSeriesPoint[] = [
  { week: 'W-6', value: 302, phase: 'historical' },
  { week: 'W-5', value: 318, phase: 'historical' },
  { week: 'W-4', value: 296, phase: 'historical' },
  { week: 'W-3', value: 331, phase: 'historical' },
  { week: 'W-2', value: 342, phase: 'current' },
  { week: 'W-1', value: 358, phase: 'current' },
  { week: 'Today', value: 371, phase: 'current' },
  { week: 'D+1', value: 386, phase: 'predicted' },
  { week: 'D+2', value: 402, phase: 'predicted' },
  { week: 'D+3', value: 428, phase: 'predicted' },
  { week: 'D+4', value: 451, phase: 'predicted' },
  { week: 'D+5', value: 473, phase: 'predicted' },
  { week: 'D+6', value: 496, phase: 'predicted' },
  { week: 'D+7', value: 518, phase: 'predicted' },
];

export const FED_PREDICTED_30D = FED_DEMAND_FORECAST.map((r) => ({ trade: r.trade, value: r.available - r.gap }));
export const FED_FORECAST_NOTE =
  'Prototype forecast generated from a deterministic local demo series. No production model or live demand feed is connected.';

/* ── Fair AI workforce allocation ──────────────────────────────────────── */

export interface AllocationCandidate {
  workerId: string;
  matchScore: number;
  skill: number;
  availability: number;
  experience: number;
  location: number;
  certification: number;
  workload: number;
  reliability: number;
  distanceKm: number;
  recentJobs: number;
  why: string;
  chosen?: boolean;
}

export interface AllocationJob {
  id: string;
  title: string;
  trade: string;
  area: string;
  when: string;
  slot: string;
  customerType: string;
  candidates: AllocationCandidate[];
  fairReason: string;
}

export const FED_ALLOCATIONS: AllocationJob[] = [
  {
    id: 'JOB-2609-184', title: 'Fan & Light Fitting — Kothrud', trade: 'Electrician', area: 'Kothrud',
    when: 'Today', slot: '4:00–6:00 PM', customerType: 'Household', fairReason: 'Sunita has a strong skill match, is nearby, available now and currently underutilized.',
    candidates: [
      { workerId: 'w-sunita', matchScore: 92, skill: 95, availability: 100, experience: 90, location: 92, certification: 100, workload: 88, reliability: 96, distanceKm: 1.8, recentJobs: 2, chosen: true, why: 'Strong skill match, nearby, available now and currently underutilized.' },
      { workerId: 'w-ramesh', matchScore: 88, skill: 93, availability: 100, experience: 96, location: 85, certification: 100, workload: 70, reliability: 95, distanceKm: 3.2, recentJobs: 4, why: 'Highly experienced and nearby; fair-share weighting keeps recent allocation moderate.' },
      { workerId: 'w-imtiyaz', matchScore: 84, skill: 89, availability: 100, experience: 72, location: 88, certification: 80, workload: 92, reliability: 88, distanceKm: 1.4, recentJobs: 1, why: 'Closest eligible member with light current workload; certification renewal is due soon.' },
    ],
  },
  {
    id: 'JOB-2609-171', title: 'Leakage Repair — Pimpri', trade: 'Plumber', area: 'Pimpri',
    when: 'Today', slot: '5:00–7:00 PM', customerType: 'Community', fairReason: 'Meera combines verified leakage skills with a balanced workload and emergency readiness.',
    candidates: [
      { workerId: 'w-meera', matchScore: 91, skill: 96, availability: 100, experience: 90, location: 88, certification: 100, workload: 82, reliability: 96, distanceKm: 2.1, recentJobs: 3, chosen: true, why: 'Leakage certification, nearby availability and a fair current workload.' },
      { workerId: 'w-vijay', matchScore: 82, skill: 93, availability: 100, experience: 97, location: 70, certification: 100, workload: 44, reliability: 95, distanceKm: 5.8, recentJobs: 8, why: 'Excellent skill match, but de-prioritized because the current workload is high.' },
      { workerId: 'w-omkar', matchScore: 79, skill: 82, availability: 100, experience: 66, location: 86, certification: 80, workload: 94, reliability: 84, distanceKm: 2.9, recentJobs: 1, why: 'Nearby and underutilized; lower leakage-certification tier reduces the suitability score.' },
    ],
  },
  {
    id: 'JOB-2609-168', title: 'Deep Cleaning — Hadapsar', trade: 'Cleaner', area: 'Hadapsar',
    when: 'Tomorrow', slot: '9:00 AM–12:00 PM', customerType: 'Household', fairReason: 'Rekha is available nearby with verified deep-cleaning skills and balanced utilization.',
    candidates: [
      { workerId: 'w-rekha', matchScore: 93, skill: 95, availability: 100, experience: 88, location: 94, certification: 100, workload: 84, reliability: 97, distanceKm: 1.2, recentJobs: 3, chosen: true, why: 'Local, available and highly rated without being concentrated in the busiest workload band.' },
      { workerId: 'w-fatima', matchScore: 86, skill: 88, availability: 100, experience: 70, location: 86, certification: 82, workload: 90, reliability: 89, distanceKm: 3.4, recentJobs: 2, why: 'Strong availability and fair opportunity; certification renewal requires follow-up.' },
      { workerId: 'w-jaya', matchScore: 81, skill: 80, availability: 100, experience: 66, location: 72, certification: 75, workload: 92, reliability: 85, distanceKm: 5.1, recentJobs: 1, why: 'Underutilized member with a verified baseline housekeeping certification.' },
    ],
  },
];

export const FED_ALLOCATION_NOTE =
  'Recommendations consider suitability and current workload so verified workers do not become concentrated among a small group of top-rated members.';

/* ── Jobs & operations ─────────────────────────────────────────────────── */

export type JobStatus = 'Incoming' | 'Matched' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Awaiting' | 'Pending' | 'Processing' | 'Paid' | 'Refunded' | 'Failed';
export type CustomerType = 'Household' | 'Community' | 'Institution' | 'Commercial';

export interface FedJob {
  id: string;
  service: string;
  trade: string;
  location: string;
  customerType: CustomerType;
  societyId: string;
  workerId?: string;
  date: string;
  time: string;
  status: JobStatus;
  emergency: boolean;
  amount: number;
  workerPayout: number;
  cooperativeAllocation: number;
  welfareContribution: number;
  payment: PaymentStatus;
  rating?: number;
}

const splitAmount = (amount: number) => ({
  workerPayout: Math.round(amount * 0.92),
  cooperativeAllocation: Math.round(amount * 0.06),
  welfareContribution: amount - Math.round(amount * 0.92) - Math.round(amount * 0.06),
});

const job = (
  data: Omit<FedJob, 'workerPayout' | 'cooperativeAllocation' | 'welfareContribution'>,
): FedJob => ({ ...data, ...splitAmount(data.amount) });

export const FED_JOBS: FedJob[] = [
  job({ id: 'RW-2609-1048', service: 'Fan & Light Fitting', trade: 'Electrician', location: 'Kothrud', customerType: 'Household', societyId: 'soc-01', date: '25 Sep', time: '4:00 PM', status: 'Incoming', emergency: false, amount: 950, payment: 'Awaiting' }),
  job({ id: 'RW-2609-1044', service: 'Bathroom Leakage Repair', trade: 'Plumber', location: 'Pimpri', customerType: 'Community', societyId: 'soc-02', date: '25 Sep', time: '5:00 PM', status: 'Matched', emergency: false, amount: 1250, payment: 'Pending' }),
  job({ id: 'RW-2609-1039', service: 'Deep Cleaning — 3 BHK', trade: 'Cleaner', location: 'Hadapsar', customerType: 'Household', societyId: 'soc-04', workerId: 'w-rekha', date: '25 Sep', time: '6:00 PM', status: 'Assigned', emergency: false, amount: 2200, payment: 'Pending', rating: 4.8 }),
  job({ id: 'RW-2609-1035', service: 'Switchboard Fault', trade: 'Electrician', location: 'Kothrud', societyId: 'soc-01', workerId: 'w-sunita', customerType: 'Household', date: '25 Sep', time: '2:30 PM', status: 'In Progress', emergency: false, amount: 850, payment: 'Processing' }),
  job({ id: 'RW-2609-1029', service: 'Pipe Burst', trade: 'Plumber', location: 'Hadapsar', societyId: 'soc-02', workerId: 'w-meera', customerType: 'Community', date: '25 Sep', time: '1:10 PM', status: 'In Progress', emergency: true, amount: 1800, payment: 'Pending' }),
  job({ id: 'RW-2609-1018', service: 'Wardrobe Repair', trade: 'Carpenter', location: 'Kharadi', societyId: 'soc-03', workerId: 'w-anil', customerType: 'Household', date: '24 Sep', time: '11:00 AM', status: 'Completed', emergency: false, amount: 2100, payment: 'Paid', rating: 4.7 }),
  job({ id: 'RW-2609-1007', service: 'Kitchen Deep Clean', trade: 'Cleaner', location: 'Kondhwa', societyId: 'soc-12', workerId: 'w-fatima', customerType: 'Institution', date: '24 Sep', time: '9:30 AM', status: 'Completed', emergency: false, amount: 4800, payment: 'Paid', rating: 4.6 }),
  job({ id: 'RW-2609-0996', service: 'AC Not Cooling', trade: 'AC Technician', location: 'Deccan', societyId: 'soc-07', workerId: 'w-suresh', customerType: 'Household', date: '24 Sep', time: '8:15 AM', status: 'Completed', emergency: true, amount: 1600, payment: 'Paid', rating: 4.9 }),
  job({ id: 'RW-2609-0984', service: 'Motor Repair', trade: 'Technician', location: 'Yerawada', societyId: 'soc-14', workerId: 'w-salim', customerType: 'Commercial', date: '23 Sep', time: '3:00 PM', status: 'Completed', emergency: false, amount: 2400, payment: 'Paid', rating: 4.8 }),
  job({ id: 'RW-2609-0973', service: 'Door Alignment', trade: 'Carpenter', location: 'Wanowrie', societyId: 'soc-33', customerType: 'Household', date: '23 Sep', time: '12:00 PM', status: 'Cancelled', emergency: false, amount: 650, payment: 'Refunded' }),
  job({ id: 'RW-2609-0962', service: 'Domestic Helper — Morning', trade: 'Domestic Helper', location: 'Camp', societyId: 'soc-13', customerType: 'Household', date: '23 Sep', time: '7:00 AM', status: 'Assigned', emergency: false, amount: 1450, payment: 'Pending' }),
  job({ id: 'RW-2609-0951', service: 'Water Pump Failure', trade: 'Technician', location: 'Wakad', societyId: 'soc-16', customerType: 'Community', date: '22 Sep', time: '7:45 PM', status: 'Matched', emergency: true, amount: 1300, payment: 'Failed' }),
];

/* ── Cooperative payments and settlements ──────────────────────────────── */

export interface FedPaymentMetrics {
  totalRevenue: number;
  workerPayouts: number;
  coopShare: number;
  welfareShare: number;
  pendingSettlements: number;
  pendingCount: number;
}

export const FED_PAYMENT_POLICY = {
  workerPct: 92,
  coopPct: 6,
  welfarePct: 2,
  note: 'Illustrative configurable demo policy — not a legally mandated allocation.',
};

export const FED_PAYMENT_METRICS: FedPaymentMetrics = {
  totalRevenue: 4280000,
  workerPayouts: 3910000,
  coopShare: 220000,
  welfareShare: 150000,
  pendingSettlements: 340000,
  pendingCount: 7,
};

export type TxnStatus = 'Paid' | 'Pending' | 'Processing' | 'Failed' | 'Refunded';

export interface FedTxn {
  id: string;
  bookingId: string;
  customer: string;
  worker: string;
  cooperative: string;
  service: string;
  amount: number;
  workerShare: number;
  coopShare: number;
  welfareShare: number;
  status: TxnStatus;
  date: string;
  societyId: string;
}

const txn = (data: Omit<FedTxn, 'workerShare' | 'coopShare' | 'welfareShare'>): FedTxn => {
  const parts = splitAmount(data.amount);
  return { ...data, workerShare: parts.workerPayout, coopShare: parts.cooperativeAllocation, welfareShare: parts.welfareContribution };
};

export const FED_TRANSACTIONS: FedTxn[] = [
  txn({ id: 'txn-01', bookingId: 'RW-2609-1018', customer: 'Aarti Salvi', worker: 'Anil Sawant', cooperative: 'Maharashtra Woodcraft & Carpenters Cooperative', societyId: 'soc-03', service: 'Wardrobe Repair', amount: 2100, status: 'Paid', date: '24 Sep 2026' }),
  txn({ id: 'txn-02', bookingId: 'RW-2609-1007', customer: 'Sahyadri Education Trust', worker: 'Fatima Khan', cooperative: 'Kondhwa Women Workers Cooperative', societyId: 'soc-12', service: 'Kitchen Deep Clean', amount: 4800, status: 'Paid', date: '24 Sep 2026' }),
  txn({ id: 'txn-03', bookingId: 'RW-2609-0996', customer: 'Rohit Mehta', worker: 'Suresh Pawar', cooperative: 'Deccan Appliance Repair Cooperative', societyId: 'soc-07', service: 'AC Not Cooling', amount: 1600, status: 'Paid', date: '24 Sep 2026' }),
  txn({ id: 'txn-04', bookingId: 'RW-2609-0984', customer: 'Maple Works LLP', worker: 'Salim Ansari', cooperative: 'Yerawada Support Workers Cooperative', societyId: 'soc-14', service: 'Motor Repair', amount: 2400, status: 'Processing', date: '23 Sep 2026' }),
  txn({ id: 'txn-05', bookingId: 'RW-2609-1039', customer: 'Neha Kulkarni', worker: 'Rekha Shinde', cooperative: 'Shramik Mahila Sanitation Cooperative', societyId: 'soc-04', service: 'Deep Cleaning — 3 BHK', amount: 2200, status: 'Pending', date: '25 Sep 2026' }),
  txn({ id: 'txn-06', bookingId: 'RW-2609-1029', customer: 'Kothrud Housing Cooperative', worker: 'Meera Joshi', cooperative: 'Pimpri-Pune Plumbers Guild Cooperative', societyId: 'soc-02', service: 'Pipe Burst', amount: 1800, status: 'Pending', date: '25 Sep 2026' }),
  txn({ id: 'txn-07', bookingId: 'RW-2609-0951', customer: 'Wakada Nagar Welfare Group', worker: 'Ravi Kale', cooperative: 'Wakad Electricians Cooperative Society', societyId: 'soc-16', service: 'Water Pump Failure', amount: 1300, status: 'Failed', date: '22 Sep 2026' }),
  txn({ id: 'txn-08', bookingId: 'RW-2609-0962', customer: 'Kedar Patil', worker: 'Mangal Gaikwad', cooperative: 'Camp Household Workers Cooperative', societyId: 'soc-13', service: 'Domestic Helper — Morning', amount: 1450, status: 'Pending', date: '23 Sep 2026' }),
  txn({ id: 'txn-09', bookingId: 'RW-2609-0973', customer: 'Alka Pawar', worker: 'Unassigned', cooperative: 'Wanowrie Painter & Masonry Society', societyId: 'soc-33', service: 'Door Alignment', amount: 650, status: 'Refunded', date: '23 Sep 2026' }),
];

/* ── Welfare and insurance ─────────────────────────────────────────────── */

export interface FedWelfare {
  coveragePct: number;
  covered: number;
  totalWorkers: number;
  pendingEnrollment: number;
  insuranceCoverage: number;
  welfareFundFY: number;
  claimsPending: number;
  claimsThisMonth: number;
  claimsPaid: number;
  policiesExpiring30d: number;
  certRenewalDue: number;
  trainingDue: number;
}

export const FED_WELFARE: FedWelfare = {
  coveragePct: FED_WELFARE_COVERAGE_PCT,
  covered: FED_WELFARE_COVERED,
  totalWorkers: FED_TOTAL_WORKERS,
  pendingEnrollment: FED_TOTAL_WORKERS - FED_WELFARE_COVERED,
  insuranceCoverage: 2198,
  welfareFundFY: 18600000,
  claimsPending: 8,
  claimsThisMonth: 22,
  claimsPaid: 14,
  policiesExpiring30d: 14,
  certRenewalDue: 31,
  trainingDue: 46,
};

export interface WelfareProgram {
  id: string;
  name: string;
  detail: string;
  eligible: number;
  enrolled: number;
  pending: number;
  coverage: number;
  renewalDue: number;
}

export const FED_WELFARE_PROGRAMS: WelfareProgram[] = [
  { id: 'accident', name: 'Accident Insurance', detail: 'Federation-arranged accident cover for verified active members.', eligible: 2520, enrolled: 2293, pending: 227, coverage: 91, renewalDue: 14 },
  { id: 'tools', name: 'Tool Insurance', detail: 'Optional protection for tools used on assigned cooperative jobs.', eligible: 1824, enrolled: 1518, pending: 306, coverage: 83, renewalDue: 0 },
  { id: 'health', name: 'Health & Support Programs', detail: 'Federation-supported health navigation and emergency assistance access.', eligible: 2418, enrolled: 1982, pending: 436, coverage: 82, renewalDue: 0 },
  { id: 'emergency', name: 'Emergency Assistance', detail: '24×7 welfare desk, priority support and rapid emergency coordination.', eligible: 2418, enrolled: 2197, pending: 221, coverage: 91, renewalDue: 0 },
];

export interface WelfareAlert {
  id: string;
  title: string;
  body: string;
  count: number;
  severity: 'danger' | 'warn' | 'info';
  action: 'review' | 'reminder' | 'workers';
  tab: string;
}

export const FED_WELFARE_ALERTS: WelfareAlert[] = [
  { id: 'wa1', title: 'insurance renewal due', body: 'Across 5 member societies within the next 30 days.', count: 14, severity: 'warn', action: 'review', tab: 'welfare' },
  { id: 'wa2', title: 'certification expiring', body: 'Priority renewal seats are available in Training & Skills.', count: 31, severity: 'danger', action: 'workers', tab: 'training' },
  { id: 'wa3', title: 'refresher training recommended', body: 'AI-identified skill gaps and expiring certifications.', count: 46, severity: 'info', action: 'review', tab: 'training' },
  { id: 'wa4', title: 'welfare claims pending review', body: 'Society evidence and federation verification required.', count: 8, severity: 'danger', action: 'review', tab: 'welfare' },
];

/* ── Verification and trust ────────────────────────────────────────────── */

export interface VerifyTotals {
  verified: number;
  pending: number;
  needsReview: number;
  expired: number;
}

export const FED_VERIFY_TOTALS: VerifyTotals = { verified: FED_VERIFIED_WORKERS, pending: 62, needsReview: 46, expired: 25 };

export interface VerifyByTrade {
  trade: string;
  verified: number;
  pending: number;
  needsReview: number;
  expired: number;
}

export const FED_VERIFY_BY_TRADE: VerifyByTrade[] = [
  { trade: 'Electrician', verified: 392, pending: 8, needsReview: 6, expired: 4 },
  { trade: 'Plumber', verified: 322, pending: 6, needsReview: 8, expired: 4 },
  { trade: 'Carpenter', verified: 267, pending: 5, needsReview: 5, expired: 3 },
  { trade: 'Cleaner', verified: 501, pending: 6, needsReview: 8, expired: 5 },
  { trade: 'Caregiver', verified: 113, pending: 2, needsReview: 3, expired: 2 },
  { trade: 'AC Technician', verified: 90, pending: 2, needsReview: 2, expired: 2 },
  { trade: 'Domestic Helper', verified: 141, pending: 3, needsReview: 4, expired: 2 },
  { trade: 'Painter', verified: 85, pending: 2, needsReview: 2, expired: 1 },
  { trade: 'Gardener', verified: 66, pending: 1, needsReview: 2, expired: 1 },
  { trade: 'Technician / other', verified: 441, pending: 1, needsReview: 1, expired: 1 },
];

export const FED_VERIFY_CHECKS = [
  'Basic profile and cooperative membership',
  'Identity verification (demo records only)',
  'Practical skill assessment',
  'Work experience evidence',
  'Certification validation',
  'Cooperative verification and Skill Passport issue',
];

/* ── Emergency operations ──────────────────────────────────────────────── */

export type EmergencyTrade = 'Electrician' | 'Plumber' | 'Technician';
export type EmergencyStatus = 'Awaiting dispatch' | 'Matching' | 'Assigned';

export interface FedEmergency {
  id: string;
  issue: string;
  trade: EmergencyTrade;
  location: string;
  customerType: CustomerType;
  received: string;
  priority: 'Critical' | 'High' | 'Standard';
  status: EmergencyStatus;
  candidateIds: string[];
}

const ELECTRIC = ['w-sunita', 'w-ramesh', 'w-imtiyaz'];
const PLUMBER = ['w-meera', 'w-vijay', 'w-omkar'];
const TECHNICIAN = ['w-suresh', 'w-salim', 'w-ravi'];

export const FED_EMERGENCIES: FedEmergency[] = [
  { id: 'EMG-2609-121', issue: 'Electrical fault — switchboard burning smell', trade: 'Electrician', location: 'Kothrud', customerType: 'Household', received: '2 min ago', priority: 'Critical', status: 'Matching', candidateIds: ELECTRIC },
  { id: 'EMG-2609-120', issue: 'Water leak — ceiling flooding', trade: 'Plumber', location: 'Pimpri', customerType: 'Community', received: '4 min ago', priority: 'Critical', status: 'Matching', candidateIds: PLUMBER },
  { id: 'EMG-2609-119', issue: 'Main distribution fault — commercial unit', trade: 'Electrician', location: 'Viman Nagar', customerType: 'Commercial', received: '7 min ago', priority: 'High', status: 'Awaiting dispatch', candidateIds: ELECTRIC },
  { id: 'EMG-2609-118', issue: 'Electrical spark — MCB tripped', trade: 'Electrician', location: 'Kothrud', customerType: 'Household', received: '9 min ago', priority: 'High', status: 'Matching', candidateIds: ELECTRIC },
  { id: 'EMG-2609-117', issue: 'Pipe burst — main inlet', trade: 'Plumber', location: 'Hadapsar', customerType: 'Household', received: '12 min ago', priority: 'Critical', status: 'Awaiting dispatch', candidateIds: PLUMBER },
  { id: 'EMG-2609-116', issue: 'Appliance smoke — power isolated', trade: 'Technician', location: 'Baner', customerType: 'Household', received: '15 min ago', priority: 'Standard', status: 'Awaiting dispatch', candidateIds: TECHNICIAN },
  { id: 'EMG-2609-115', issue: 'Power outage — society distribution board', trade: 'Electrician', location: 'Shivajinagar', customerType: 'Community', received: '18 min ago', priority: 'Critical', status: 'Matching', candidateIds: ELECTRIC },
  { id: 'EMG-2609-114', issue: 'Drain overflow — residential block', trade: 'Plumber', location: 'Kothrud', customerType: 'Community', received: '22 min ago', priority: 'Standard', status: 'Awaiting dispatch', candidateIds: PLUMBER },
  { id: 'EMG-2609-113', issue: 'Water pump failure', trade: 'Technician', location: 'Aundh', customerType: 'Institution', received: '26 min ago', priority: 'High', status: 'Matching', candidateIds: TECHNICIAN },
  { id: 'EMG-2609-112', issue: 'Short circuit — kitchen outlet', trade: 'Electrician', location: 'Kharadi', customerType: 'Household', received: '29 min ago', priority: 'High', status: 'Awaiting dispatch', candidateIds: ELECTRIC },
  { id: 'EMG-2609-111', issue: 'Bathroom pipe leakage', trade: 'Plumber', location: 'Karve Nagar', customerType: 'Household', received: '33 min ago', priority: 'Standard', status: 'Awaiting dispatch', candidateIds: PLUMBER },
  { id: 'EMG-2609-110', issue: 'Motor starter fault', trade: 'Technician', location: 'Wakad', customerType: 'Commercial', received: '36 min ago', priority: 'Standard', status: 'Awaiting dispatch', candidateIds: TECHNICIAN },
];

export const FED_EMERGENCY_SUMMARY = {
  total: FED_EMERGENCIES.length,
  Electrician: FED_EMERGENCIES.filter((e) => e.trade === 'Electrician').length,
  Plumber: FED_EMERGENCIES.filter((e) => e.trade === 'Plumber').length,
  Technician: FED_EMERGENCIES.filter((e) => e.trade === 'Technician').length,
};

/* ── Training and skill development ────────────────────────────────────── */

export interface TrainingProgram {
  id: string;
  title: string;
  trade: string;
  location: string;
  reason: string;
  eligible: number;
  enrolled: number;
  totalSeats: number;
  duration: string;
  schedule: string;
  certification: string;
}

export const FED_TRAINING_PROGRAMS: TrainingProgram[] = [
  { id: 'trn-01', title: 'Advanced Plumbing & Leakage Repair', trade: 'Plumber', location: 'Pune North', reason: 'AI predicts a plumber shortage next week.', eligible: 42, enrolled: 18, totalSeats: 42, duration: '3 days', schedule: '29 Sep–01 Oct', certification: 'Federation Plumbing Certificate' },
  { id: 'trn-02', title: 'Electrical Safety & Smart Metering', trade: 'Electrician', location: 'Pune East', reason: 'Emergency demand is up 18% and certification renewals are due.', eligible: 36, enrolled: 22, totalSeats: 40, duration: '2 days', schedule: '03–04 Oct', certification: 'NCTT Safety Refresher' },
  { id: 'trn-03', title: 'Elder Care & Mobility Support', trade: 'Caregiver', location: 'Baner–Aundh', reason: 'Household care demand is growing across western Pune.', eligible: 54, enrolled: 30, totalSeats: 60, duration: '4 days', schedule: '06–09 Oct', certification: 'Geriatric Care Assistant' },
  { id: 'trn-04', title: 'Modular Furniture Repair', trade: 'Carpenter', location: 'Kharadi', reason: 'Weekend repair demand is outpacing available capacity.', eligible: 28, enrolled: 16, totalSeats: 32, duration: '2 days', schedule: '11–12 Oct', certification: 'NCTS Carpentry Update' },
];

/* ── Geospatial workforce clusters ─────────────────────────────────────── */

export interface AreaDensity {
  area: string;
  lat: number;
  lng: number;
  workerCount: number;
  available: number;
  emergencyReady: number;
  verified: number;
  demand: DemandLevel;
  trades: string[];
  societyIds: string[];
}

export const FED_DENSITY: AreaDensity[] = [
  { area: 'Kothrud', lat: 18.5074, lng: 73.8077, workerCount: 24, available: 18, emergencyReady: 6, verified: 24, demand: 'High', trades: ['Electrician', 'Plumber'], societyIds: ['soc-01', 'soc-09'] },
  { area: 'Shivajinagar', lat: 18.5314, lng: 73.8446, workerCount: 17, available: 12, emergencyReady: 4, verified: 17, demand: 'Very High', trades: ['Electrician', 'Multi-trade'], societyIds: ['soc-05'] },
  { area: 'Hadapsar', lat: 18.5077, lng: 73.9255, workerCount: 31, available: 7, emergencyReady: 5, verified: 29, demand: 'Very High', trades: ['Electrician', 'Cleaner'], societyIds: ['soc-04', 'soc-12', 'soc-24'] },
  { area: 'Pimpri', lat: 18.6298, lng: 73.7997, workerCount: 42, available: 29, emergencyReady: 9, verified: 42, demand: 'High', trades: ['Plumber', 'Carpenter'], societyIds: ['soc-02', 'soc-19'] },
  { area: 'Viman Nagar', lat: 18.5679, lng: 73.9143, workerCount: 26, available: 9, emergencyReady: 4, verified: 25, demand: 'High', trades: ['AC Technician', 'Driver'], societyIds: ['soc-07', 'soc-22'] },
  { area: 'Kharadi', lat: 18.5529, lng: 73.9402, workerCount: 28, available: 14, emergencyReady: 6, verified: 28, demand: 'Medium', trades: ['Carpenter', 'Cleaner'], societyIds: ['soc-03', 'soc-21'] },
  { area: 'Baner', lat: 18.5626, lng: 73.789, workerCount: 23, available: 16, emergencyReady: 5, verified: 22, demand: 'Medium', trades: ['Caregiver', 'Painter'], societyIds: ['soc-10', 'soc-17'] },
  { area: 'Aundh', lat: 18.5586, lng: 73.807, workerCount: 20, available: 15, emergencyReady: 5, verified: 20, demand: 'Medium', trades: ['Domestic Helper', 'Technician'], societyIds: ['soc-06', 'soc-13'] },
  { area: 'Bibwewadi', lat: 18.4737, lng: 73.9064, workerCount: 20, available: 13, emergencyReady: 3, verified: 19, demand: 'High', trades: ['Cleaner', 'Technician'], societyIds: ['soc-12', 'soc-14'] },
  { area: 'Wakad', lat: 18.5975, lng: 73.7658, workerCount: 19, available: 10, emergencyReady: 5, verified: 18, demand: 'High', trades: ['Electrician', 'Technician'], societyIds: ['soc-16', 'soc-20'] },
];

export const FED_MAP_LEGEND = [
  { color: '#34B27A', label: 'Healthy availability' },
  { color: '#F59E0B', label: 'Watch closely' },
  { color: '#EF4444', label: 'Shortage / high demand' },
];

export const demandColor = (d: DemandLevel): string =>
  d === 'Very High' ? '#B91C1C' : d === 'High' ? '#EF4444' : d === 'Medium' ? '#F59E0B' : '#34B27A';

/* ── Reports and performance ───────────────────────────────────────────── */

export interface ReportPoint {
  week: string;
  utilization: number;
  satisfaction: number;
  jobs: number;
  earningsLakh: number;
  demand: number;
  welfare: number;
}

export const FED_REPORT_SERIES: ReportPoint[] = [
  { week: 'W1', utilization: 58, satisfaction: 4.3, jobs: 920, earningsLakh: 11.2, demand: 176, welfare: 84 },
  { week: 'W2', utilization: 61, satisfaction: 4.4, jobs: 965, earningsLakh: 11.8, demand: 184, welfare: 85 },
  { week: 'W3', utilization: 64, satisfaction: 4.4, jobs: 1010, earningsLakh: 12.3, demand: 191, welfare: 86 },
  { week: 'W4', utilization: 63, satisfaction: 4.5, jobs: 990, earningsLakh: 12.0, demand: 188, welfare: 86 },
  { week: 'W5', utilization: 67, satisfaction: 4.5, jobs: 1060, earningsLakh: 12.9, demand: 198, welfare: 88 },
  { week: 'W6', utilization: 69, satisfaction: 4.6, jobs: 1120, earningsLakh: 13.7, demand: 205, welfare: 89 },
  { week: 'W7', utilization: 70, satisfaction: 4.6, jobs: 1175, earningsLakh: 14.3, demand: 214, welfare: 90 },
  { week: 'W8', utilization: 71, satisfaction: 4.7, jobs: 1220, earningsLakh: 14.9, demand: 224, welfare: 91 },
];

export const FED_REPORT_METRICS = [
  { label: 'Workforce utilization', value: '71%', sub: 'Up 13 pts over 8 weeks' },
  { label: 'Customer satisfaction', value: '4.7 / 5', sub: 'Across 6,120 ratings' },
  { label: 'Job completion', value: '93.4%', sub: 'On-time completion rate' },
  { label: 'Emergency response', value: '14 min', sub: 'Median dispatch time' },
  { label: 'Repeat customers', value: '41%', sub: 'Booked 2+ times' },
  { label: 'Fair-share opportunity', value: '4.2×', sub: 'Top vs least-used quartile' },
];

/* ── Notifications ─────────────────────────────────────────────────────── */

export interface FedNotice {
  id: string;
  title: string;
  body: string;
  time: string;
  tab: string;
  tone: 'danger' | 'warn' | 'info' | 'success';
}

export const FED_NOTICES: FedNotice[] = [
  { id: 'fn1', title: 'Electrician demand increased 18% in Pune East', body: 'A verified shortage is projected for the next 7 days.', time: 'Now', tab: 'forecast', tone: 'warn' },
  { id: 'fn2', title: '14 insurance renewals are due this month', body: 'Five affiliated societies need follow-up before policy expiry.', time: '8 min ago', tab: 'welfare', tone: 'danger' },
  { id: 'fn3', title: '3 societies have emergency-ready workforce', body: '42 verified members are available for priority deployment.', time: '18 min ago', tab: 'emergency', tone: 'info' },
  { id: 'fn4', title: 'Plumber demand may exceed availability next week', body: 'Open advanced plumbing training and rebalance nearby societies.', time: '42 min ago', tab: 'forecast', tone: 'warn' },
  { id: 'fn5', title: 'One society verification is pending', body: 'Pashan Waterproofing Workers Guild requires federation review.', time: '1 h ago', tab: 'societies', tone: 'warn' },
  { id: 'fn6', title: '12 emergency requests need attention', body: '5 electrician, 4 plumber and 3 technician requests are active.', time: '1 h ago', tab: 'emergency', tone: 'danger' },
  { id: 'fn7', title: 'Monthly federation report is ready', body: 'Workforce, demand, welfare and society performance are reconciled.', time: 'Yesterday', tab: 'reports', tone: 'success' },
  { id: 'fn8', title: '₹1.5 Lakh allocated to the welfare fund', body: 'This period’s configurable welfare contribution has been credited.', time: 'Yesterday', tab: 'payments', tone: 'success' },
];

/* ── Deterministic structured AI snapshot ──────────────────────────────── */

export const buildFedSnapshot = (): AIFedSnapshot => {
  const plumberSocieties = FED_SOCIETIES.filter((s) => s.trade === 'Plumber').sort((a, b) => b.availableToday - a.availableToday);
  return {
    societiesTotal: FED_TOTAL_SOCIETIES,
    activeSocieties: FED_ACTIVE_SOCIETIES,
    workersTotal: FED_TOTAL_WORKERS,
    workersVerified: FED_VERIFIED_WORKERS,
    activeJobs: FED_ACTIVE_REQUESTS,
    workersAvailable: FED_AVAILABLE_TODAY,
    workersWorking: FED_ACTIVE_REQUESTS,
    pendingVerification: FED_VERIFY_TOTALS.pending + FED_VERIFY_TOTALS.needsReview,
    workerEarningsFY: 42000000,
    jobsCompletedQuarter: FED_COMPLETED_QUARTER,
    jobsCompletedMonth: FED_REPORT_SERIES.slice(-2).reduce((sum, p) => sum + p.jobs, 0),
    welfareCoverage: FED_WELFARE_COVERAGE_PCT,
    welfareCovered: FED_WELFARE_COVERED,
    welfarePending: FED_WELFARE.pendingEnrollment,
    welfareFundFY: FED_WELFARE.welfareFundFY,
    certRenewalDue: FED_WELFARE.certRenewalDue,
    refresherTrainingDue: FED_WELFARE.trainingDue,
    claimsPending: FED_WELFARE.claimsPending,
    welfareNotEnrolled: FED_WELFARE.pendingEnrollment,
    policiesExpiring30d: FED_WELFARE.policiesExpiring30d,
    emergencyRequestsWeek: FED_EMERGENCY_SUMMARY.total,
    customerRequests: FED_ACTIVE_REQUESTS,
    pendingSettlements: FED_PAYMENT_METRICS.pendingSettlements,
    serviceValue: FED_PAYMENT_METRICS.totalRevenue,
    highestDemandLocation: 'Pune East',
    highestPlumberAvailabilitySociety: plumberSocieties[0]?.name ?? 'Pimpri-Pune Plumbers Guild Cooperative',
    availableByTrade: Object.fromEntries(FED_DEMAND_FORECAST.map((r) => [r.trade, r.available])),
    highDemandTrades: FED_SHORTAGE_TRADES.map((t) => t.trade),
    lowDemandTrades: FED_DEMAND_FORECAST.filter((t) => t.demand === 'Low' || t.gap > 20).map((t) => t.trade),
    forecastTop: FED_DEMAND_FORECAST.slice(0, 4).map((f) => `${f.trade} (${Math.abs(f.gap)} ${f.gap < 0 ? 'short' : 'surplus'})`),
  };
};

/* ── Store contract passed to every federation screen ──────────────────── */

export interface FedStore {
  lang: Lang;
  go: (tab: string) => void;
  showToast: (msg: string) => void;
  onOpenAI: () => void;
  societies: FedSociety[];
  focusSocietyId: string | null;
  openSociety: (id: string) => void;
  clearFocusSociety: () => void;
  readNotices: string[];
  markNoticeRead: (id: string) => void;
}

export const FED_LANGUAGES: { code: Lang; label: string; aiCode: AILanguage }[] = [
  { code: 'en', label: 'English', aiCode: 'en' },
  { code: 'hi', label: 'हिन्दी', aiCode: 'hi' },
  { code: 'mr', label: 'मराठी', aiCode: 'mr' },
];
