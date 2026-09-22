// Language type used by LanguageSelector
export type Language = 'en' | 'hi' | 'mr';

// Cooperative data types used in cooperativeData.ts and home-adjacent cooperative components
export interface CooperativeStat {
  id: string;
  value: string;
  numericVal: number;
  label: string;
  hindiLabel: string;
  marathiLabel: string;
  description: string;
  icon: string;
  trend: string;
}

export interface ComparisonItem {
  feature: string;
  cooperative: string;
  traditional: string;
  isHighlight?: boolean;
}

export interface WorkerMember {
  id: string;
  name: string;
  trade: string;
  coopRole: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  location: string;
  experienceYears: number;
  dividendEarned: number;
  badge: string;
  image: string;
  quote: string;
}

// AI Workforce types used in CooperativeOverview and mockAppData
export interface DemandForecast {
  hourSlot: string;
  trade: string;
  expectedDemandLevel: 'Normal' | 'Moderate' | 'Surge Peak';
  recommendedWorkers: number;
  activeWorkers: number;
  gapOrSurplus: number;
  predictedReason: string;
}

export interface WorkforceAllocation {
  ward: string;
  trade: string;
  assignedWorkersCount: number;
  utilizationRate: number;
  status: 'Optimal' | 'Rebalancing Recommended' | 'High Surge';
  suggestedAction: string;
}

export type WorkerAvailability = 'available' | 'busy' | 'offline';

export interface Worker {
  id: string;
  name: string;
  photo: string;
  primaryTrade: string;
  primaryTradeLabel: string;
  skills: string[];
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  distanceKm: number;
  etaMinutes: number;
  locality: string;
  availability: WorkerAvailability;
  baseVisitFee: number;
  workerPayoutPercent: number;
  cooperativeRole: string;
  cooperativeSociety?: string;
  wardHub?: string;
  memberSince: string;
  languages: string[];
  shortBio: string;
  badge?: string;
  phone?: string;
  verificationId?: string;
}



// -------------------------------------------------------------
// Mobile-First App Experience Types
// -------------------------------------------------------------

export type UserRole = 'customer' | 'worker' | 'cooperative';

export type BookingStatus = 
  | 'draft' 
  | 'requested' 
  | 'accepted' 
  | 'declined' 
  | 'expired' 
  | 'active' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export type DisputeStatus = 'open' | 'under_review' | 'resolved';

export type NotificationType = 
  | 'booking_request' 
  | 'booking_accepted' 
  | 'booking_declined' 
  | 'booking_expired' 
  | 'job_started' 
  | 'job_completed' 
  | 'review_received' 
  | 'dispute_opened' 
  | 'dispute_resolved'
  | 'payment_received'
  | 'invoice_issued';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  locality: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  locality: string;
  wardHub: string;
  coopId?: string;
  coopName?: string;
  memberId?: string;
  verificationBadge?: string;
  equityTier?: string;
}

export interface DemoSession {
  user: UserProfile;
  loginTime: number;
}

export interface BookingTimelineEvent {
  status: BookingStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  workerTrade: string;
  coopId: string;
  coopName: string;
  taskDescription: string;
  category: string;
  locality: string;
  address: string;
  scheduledSlot: string;
  baseFee: number;
  totalAmount: number;
  workerPayout: number;
  coopFund: number;
  status: BookingStatus;
  timeline: BookingTimelineEvent[];
  createdAt: number;
  completedAt?: number;
  rating?: number;
  reviewText?: string;
  disputeId?: string;
  invoiceId?: string;
  isEmergency?: boolean;
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  coopId: string;
  coopName: string;
  taskDescription: string;
  date: string;
  baseFee: number;
  materialCost: number;
  platformFee: number; // 0% platform extraction
  coopWelfareFund: number; // 12% social security & health pool
  workerPayout: number; // 88% direct worker take-home
  totalAmount: number;
  paymentMethod: 'UPI' | 'Cooperative Escrow' | 'Cash on Service';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  transactionRef: string;
  gstRegistration?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  text: string;
  date: string;
  trade: string;
  coopId: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  coopId: string;
  coopName: string;
  issue: string;
  status: DisputeStatus;
  createdAt: string;
  workerResponse?: string;
  workerResponseTime?: string;
  resolutionNotes?: string;
  resolutionDate?: string;
}

export interface AppNotification {
  id: string;
  role: UserRole;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  bookingId?: string;
  timestamp: string;
  isRead: boolean;
  targetTab?: string;
  entityId?: string;
}

export interface CooperativeSociety {
  id: string;
  name: string;
  entityType: string;
  regNumber: string;
  wardHub: string;
  city: string;
  totalMembers: number;
  activeWorkers: number;
  activeBookings: number;
  completedBookings: number;
  rating: number;
  openDisputes: number;
  representativeName: string;
  phone: string;
  email: string;
  welfareReserveFund: number;
  healthInsurancePool: number;
}

