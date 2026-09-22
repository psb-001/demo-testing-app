import { 
  CustomerProfile, 
  UserProfile,
  DemoSession,
  Booking, 
  Invoice,
  Review, 
  Dispute, 
  AppNotification, 
  CooperativeSociety,
  DemandForecast,
  WorkforceAllocation
} from '../types';
import { mockWorkers } from './workersData';

export const demoProfiles: Record<'customer' | 'worker' | 'cooperative', UserProfile> = {
  customer: {
    id: 'c-101',
    role: 'customer',
    name: 'Pooja Sharma',
    title: 'Registered Household Customer',
    phone: '+91 98230 45671',
    email: 'pooja.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    locality: 'Kothrud, Pune',
    wardHub: 'Ward 14 (Kothrud Zone 4)',
    verificationBadge: 'Verified Resident (Pune Smart Card)',
    equityTier: 'Community Patron'
  },
  worker: {
    id: 'w-ramesh-jadhav',
    role: 'worker',
    name: 'Rameshwar Jadhav',
    title: 'Master Electrician & Founding Co-owner',
    phone: '+91 98220 41290',
    email: 'ramesh.jadhav@puneelectricians.coop',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&h=300&q=80',
    locality: 'Kothrud, Pune',
    wardHub: 'Kothrud Ward Hub #12',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    memberId: 'PEM-14-042',
    verificationBadge: 'NSDC Level 5 & Ward Council Lead',
    equityTier: 'Tier A (100 Voting Shares)'
  },
  cooperative: {
    id: 'coop-admin-vikas',
    role: 'cooperative',
    name: 'Vikas Deshmukh',
    title: 'Elected Secretary & Lead Dispatch Officer',
    phone: '+91 98220 11223',
    email: 'sec@puneelectricians.coop',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    locality: 'Kothrud Central Hub, Pune',
    wardHub: 'Pune Ward 14 Federation Hub',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    memberId: 'COOP-EXEC-01',
    verificationBadge: 'Govt Reg # MH-PUN-COOP-2022-8491',
    equityTier: 'Cooperative Board Executive'
  }
};

export const defaultCustomer: CustomerProfile = {
  id: 'c-101',
  name: 'Pooja Sharma',
  phone: '+91 98230 45671',
  email: 'pooja.sharma@example.com',
  locality: 'Kothrud, Pune',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

export const defaultCooperative: CooperativeSociety = {
  id: 'coop-pune-central',
  name: 'Pune Central Electricians Cooperative Society Ltd.',
  entityType: 'Primary Labor Cooperative Society',
  regNumber: 'MH-PUN-COOP-2022-8491',
  wardHub: 'Kothrud (Zone 4), Pune',
  city: 'Pune',
  totalMembers: 48,
  activeWorkers: 36,
  activeBookings: 14,
  completedBookings: 1840,
  rating: 4.93,
  openDisputes: 1,
  representativeName: 'Vikas Deshmukh (Secretary)',
  phone: '+91 98220 11223',
  email: 'sec@puneelectricians.coop',
  welfareReserveFund: 142800,
  healthInsurancePool: 500000
};

// -------------------------------------------------------------
// Relational Connected Initial Bookings
// -------------------------------------------------------------
export const initialBookings: Booking[] = [
  {
    id: 'BKG-8491',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98230 45671',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerPhoto: mockWorkers[0].photo,
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    taskDescription: 'Tripping MCB breaker and sparks from living room switchboard',
    category: 'electrician',
    locality: 'Kothrud, Pune',
    address: 'Flat 402, Shanti Heights, Paud Road, Kothrud',
    scheduledSlot: 'Immediate (within 30 mins)',
    baseFee: 349,
    totalAmount: 364,
    workerPayout: 320,
    coopFund: 44,
    status: 'requested',
    isEmergency: true,
    timeline: [
      {
        status: 'requested',
        label: 'EMERGENCY REQUEST DISPATCHED',
        timestamp: '4 mins ago',
        note: 'Customer sent direct request with emergency priority. 5-minute prompt window active.'
      }
    ],
    createdAt: Date.now() - 240000
  },
  {
    id: 'BKG-8420',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98230 45671',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerPhoto: mockWorkers[0].photo,
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    taskDescription: 'Inverter wiring and high-load kitchen socket installation',
    category: 'electrician',
    locality: 'Kothrud, Pune',
    address: 'Flat 402, Shanti Heights, Paud Road, Kothrud',
    scheduledSlot: 'Today, 2:00 PM - 3:30 PM',
    baseFee: 499,
    totalAmount: 520,
    workerPayout: 457,
    coopFund: 63,
    status: 'in_progress',
    timeline: [
      {
        status: 'requested',
        label: 'REQUEST SENT',
        timestamp: 'Today, 1:15 PM',
        note: 'Service requested by Pooja Sharma.'
      },
      {
        status: 'accepted',
        label: 'ACCEPTED BY WORKER',
        timestamp: 'Today, 1:18 PM',
        note: 'Rameshwar accepted within 3 mins.'
      },
      {
        status: 'active',
        label: 'EN ROUTE',
        timestamp: 'Today, 1:45 PM',
        note: 'Worker departed with safety toolkit.'
      },
      {
        status: 'in_progress',
        label: 'IN PROGRESS',
        timestamp: 'Today, 2:05 PM',
        note: 'Diagnosing wiring and installing modular socket.'
      }
    ],
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'BKG-7721',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98230 45671',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerPhoto: mockWorkers[0].photo,
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    taskDescription: 'Complete MCB sub-panel overhaul & earthing test',
    category: 'electrician',
    locality: 'Kothrud, Pune',
    address: 'Flat 402, Shanti Heights, Paud Road, Kothrud',
    scheduledSlot: 'Yesterday, 10:00 AM',
    baseFee: 399,
    totalAmount: 420,
    workerPayout: 370,
    coopFund: 50,
    status: 'completed',
    invoiceId: 'INV-2026-8801',
    rating: 5,
    reviewText: 'Outstanding diagnostic skill! Arrived on time and explained the co-op warranty.',
    timeline: [
      {
        status: 'requested',
        label: 'REQUEST SENT',
        timestamp: 'Yesterday, 9:20 AM',
        note: 'Booked directly via Ward 14.'
      },
      {
        status: 'accepted',
        label: 'ACCEPTED',
        timestamp: 'Yesterday, 9:22 AM',
        note: 'Accepted.'
      },
      {
        status: 'completed',
        label: 'COMPLETED & VERIFIED',
        timestamp: 'Yesterday, 11:30 AM',
        note: 'Work verified with safety certificate. ₹370 credited to Rameshwar wallet.'
      }
    ],
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 82000000
  },
  {
    id: 'BKG-6902',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98230 45671',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerPhoto: mockWorkers[0].photo,
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    taskDescription: 'Ceiling fan capacitor replacement and high-speed balancing',
    category: 'electrician',
    locality: 'Kothrud, Pune',
    address: 'Flat 402, Shanti Heights, Paud Road, Kothrud',
    scheduledSlot: '2 days ago',
    baseFee: 249,
    totalAmount: 260,
    workerPayout: 228,
    coopFund: 32,
    status: 'disputed',
    disputeId: 'DISP-1042',
    timeline: [
      {
        status: 'completed',
        label: 'COMPLETED',
        timestamp: '2 days ago',
        note: 'Capacitor replaced.'
      },
      {
        status: 'disputed',
        label: 'GRIEVANCE LOGGED',
        timestamp: 'Yesterday',
        note: 'Customer noticed slight ticking noise at speed 4. Ward mediation active.'
      }
    ],
    createdAt: Date.now() - 172800000
  }
];

// -------------------------------------------------------------
// Digital Invoices Linked to Completed Bookings
// -------------------------------------------------------------
export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-8801',
    bookingId: 'BKG-7721',
    invoiceNumber: 'ROZ/PUN/26/089-8801',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    taskDescription: 'Complete MCB sub-panel overhaul & earthing test',
    date: 'Yesterday, 11:35 AM',
    baseFee: 399,
    materialCost: 0,
    platformFee: 0,
    coopWelfareFund: 50,
    workerPayout: 370,
    totalAmount: 420,
    paymentMethod: 'Cooperative Escrow',
    paymentStatus: 'paid',
    transactionRef: 'UPI/ROJGAR/9842109841',
    gstRegistration: '27AABCP8821M1ZK'
  }
];

// -------------------------------------------------------------
// Reviews
// -------------------------------------------------------------
export const initialReviews: Review[] = [
  {
    id: 'rev-301',
    bookingId: 'BKG-7721',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Outstanding diagnostic skill! Rameshwar arrived in 18 minutes, resolved the tripping MCB without extra charges, and explained the cooperative warranty backing.',
    date: 'Yesterday',
    trade: 'Master Electrician',
    coopId: 'coop-pune-central'
  },
  {
    id: 'rev-302',
    bookingId: 'BKG-6500',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    customerId: 'c-104',
    customerName: 'Anil Kulkarni',
    rating: 5,
    text: 'Very professional and clean wiring. Transparent pricing with 0% platform surcharge—truly worker-owned dignity of labour.',
    date: '3 days ago',
    trade: 'Master Electrician',
    coopId: 'coop-pune-central'
  },
  {
    id: 'rev-303',
    bookingId: 'BKG-6410',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    customerId: 'c-105',
    customerName: 'Sunil Joshi',
    rating: 4,
    text: 'Courteous technician and genuine replacement parts. Highly recommended in Kothrud.',
    date: '5 days ago',
    trade: 'Master Electrician',
    coopId: 'coop-pune-central'
  }
];

// -------------------------------------------------------------
// Disputes / Ward Council Inquiries
// -------------------------------------------------------------
export const initialDisputes: Dispute[] = [
  {
    id: 'DISP-1042',
    bookingId: 'BKG-6902',
    customerId: 'c-101',
    customerName: 'Pooja Sharma',
    workerId: 'w-ramesh-jadhav',
    workerName: 'Rameshwar Jadhav',
    workerTrade: 'Master Electrician',
    coopId: 'coop-pune-central',
    coopName: 'Pune Central Electricians Cooperative Society Ltd.',
    issue: 'The bedroom fan has a slight clicking noise at speed 4 after capacitor replacement. Requesting a quick check under co-op warranty.',
    status: 'under_review',
    createdAt: 'Yesterday',
    workerResponse: 'I used a certified Anchor capacitor. Will happily revisit tomorrow at 11 AM to balance the fan blades at zero extra cost under our 30-day cooperative warranty.',
    workerResponseTime: 'Yesterday, 4:30 PM',
    resolutionNotes: 'Ward 14 Council approved warranty visit. Zero customer penalty or arbitrary worker strike.'
  }
];

// -------------------------------------------------------------
// App Notifications with Deep Linking
// -------------------------------------------------------------
export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    role: 'customer',
    recipientId: 'c-101',
    title: '⚡ Emergency Request Received by Worker',
    message: 'Rameshwar Jadhav received your emergency MCB repair request. 5-minute decision window active.',
    type: 'booking_request',
    bookingId: 'BKG-8491',
    timestamp: '4 mins ago',
    isRead: false,
    targetTab: 'bookings',
    entityId: 'BKG-8491'
  },
  {
    id: 'notif-2',
    role: 'worker',
    recipientId: 'w-ramesh-jadhav',
    title: '⚡ URGENT: New Emergency Booking Request!',
    message: 'Pooja Sharma requested emergency MCB repair at Paud Road, Kothrud. Prompt window: 5 mins.',
    type: 'booking_request',
    bookingId: 'BKG-8491',
    timestamp: '4 mins ago',
    isRead: false,
    targetTab: 'requests',
    entityId: 'BKG-8491'
  },
  {
    id: 'notif-3',
    role: 'cooperative',
    recipientId: 'coop-pune-central',
    title: 'Dispatch Logged: Ward 14 Emergency',
    message: 'Direct emergency request dispatched to member Rameshwar Jadhav (Booking #BKG-8491).',
    type: 'booking_request',
    bookingId: 'BKG-8491',
    timestamp: '4 mins ago',
    isRead: false,
    targetTab: 'bookings',
    entityId: 'BKG-8491'
  },
  {
    id: 'notif-4',
    role: 'worker',
    recipientId: 'w-ramesh-jadhav',
    title: '⭐ 5-Star Review Received',
    message: 'Pooja Sharma reviewed your MCB overhaul: "Outstanding diagnostic skill!"',
    type: 'review_received',
    timestamp: 'Yesterday',
    isRead: true,
    targetTab: 'reviews'
  },
  {
    id: 'notif-5',
    role: 'customer',
    recipientId: 'c-101',
    title: '🧾 Cooperative Invoice Issued',
    message: 'Invoice #ROZ/PUN/26/089-8801 for ₹420 has been settled via Cooperative Escrow.',
    type: 'invoice_issued',
    bookingId: 'BKG-7721',
    timestamp: 'Yesterday',
    isRead: true,
    targetTab: 'invoices',
    entityId: 'INV-2026-8801'
  }
];

// -------------------------------------------------------------
// SIH26089: AI Demand Forecasting & Dynamic Workforce Allocation
// -------------------------------------------------------------
export const mockDemandForecasts: DemandForecast[] = [
  {
    hourSlot: '08:00 AM - 11:30 AM',
    trade: 'Electrician',
    expectedDemandLevel: 'Surge Peak',
    recommendedWorkers: 18,
    activeWorkers: 12,
    gapOrSurplus: -6,
    predictedReason: 'Morning peak power tripping & geyser switchboard load in high-rise clusters.'
  },
  {
    hourSlot: '11:30 AM - 03:00 PM',
    trade: 'Cleaning',
    expectedDemandLevel: 'Moderate',
    recommendedWorkers: 10,
    activeWorkers: 11,
    gapOrSurplus: +1,
    predictedReason: 'Midday post-cooking kitchen deep-clean requests.'
  },
  {
    hourSlot: '03:00 PM - 07:00 PM',
    trade: 'Plumber',
    expectedDemandLevel: 'Surge Peak',
    recommendedWorkers: 14,
    activeWorkers: 9,
    gapOrSurplus: -5,
    predictedReason: 'Evening municipal water supply surge & overhead tank valve inspections.'
  },
  {
    hourSlot: '07:00 PM - 10:00 PM',
    trade: 'Electrician (Emergency)',
    expectedDemandLevel: 'Moderate',
    recommendedWorkers: 8,
    activeWorkers: 8,
    gapOrSurplus: 0,
    predictedReason: 'Evening lighting & emergency tripping standby squad.'
  }
];

export const mockWorkforceAllocations: WorkforceAllocation[] = [
  {
    ward: 'Ward 14 (Kothrud South)',
    trade: 'Electrician',
    assignedWorkersCount: 16,
    utilizationRate: 94,
    status: 'High Surge',
    suggestedAction: 'Deploy 4 reserve worker-owners from Ward 12 to maintain <15m ETA.'
  },
  {
    ward: 'Ward 15 (Paud Road North)',
    trade: 'Plumbing',
    assignedWorkersCount: 12,
    utilizationRate: 78,
    status: 'Optimal',
    suggestedAction: 'Workload balanced evenly across cooperative members.'
  },
  {
    ward: 'Ward 16 (Bavdhan Link)',
    trade: 'Carpentry',
    assignedWorkersCount: 8,
    utilizationRate: 62,
    status: 'Rebalancing Recommended',
    suggestedAction: 'Offer cross-ward appliance maintenance appointments to boost earnings.'
  }
];

// -------------------------------------------------------------
// Persistence Layer (works on web & native)
// -------------------------------------------------------------
import { getItemSync, setItemSync, removeItemSync } from '../utilities/storage';

const STORAGE_KEY = 'rojgar_mobile_app_state_v2';
const SESSION_KEY = 'rojgar_active_demo_session_v2';

export interface AppStoredState {
  currentRole: 'customer' | 'worker' | 'cooperative';
  customer: CustomerProfile;
  cooperative: CooperativeSociety;
  bookings: Booking[];
  invoices: Invoice[];
  reviews: Review[];
  disputes: Dispute[];
  notifications: AppNotification[];
}

export function loadActiveSession(): DemoSession | null {
  try {
    const raw = getItemSync(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.user.role) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load session:', err);
  }
  return null;
}

export function saveActiveSession(session: DemoSession): void {
  try {
    setItemSync(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function clearActiveSession(): void {
  try {
    removeItemSync(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

export function loadStoredAppState(): AppStoredState {
  try {
    const raw = getItemSync(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.bookings && parsed.currentRole) {
        return {
          ...parsed,
          invoices: parsed.invoices || initialInvoices
        };
      }
    }
  } catch (err) {
    console.error('Failed to load stored state from storage:', err);
  }

  const freshState: AppStoredState = {
    currentRole: 'customer',
    customer: defaultCustomer,
    cooperative: defaultCooperative,
    bookings: initialBookings,
    invoices: initialInvoices,
    reviews: initialReviews,
    disputes: initialDisputes,
    notifications: initialNotifications
  };
  saveStoredAppState(freshState);
  return freshState;
}

export function saveStoredAppState(state: AppStoredState): void {
  try {
    setItemSync(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to storage:', err);
  }
}

export function resetStoredAppState(): AppStoredState {
  try {
    removeItemSync(STORAGE_KEY);
    clearActiveSession();
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  return loadStoredAppState();
}
