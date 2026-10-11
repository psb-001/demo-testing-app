import type { Booking } from '../types';
import { WORKERS_LIST } from '../data/mockData';
import type { Notice } from './Notifications';

/**
 * Seeded DEMO data for the SIH26089 customer-portal walkthrough.
 *
 * Everything here is clearly labeled DEMO DATA — never presented as real
 * production statistics. Bookings/payments/reviews are illustrative and are
 * swapped for authenticated platform data once a backend exists.
 */

const w = (id: string) => {
  const found = WORKERS_LIST.find((x) => x.id === id);
  if (!found) throw new Error(`customerDemo: unknown worker ${id}`);
  return found;
};

const shares = (total: number) => ({
  workerEarnings: Math.round(total * 0.92),
  coopWelfareShare: total - Math.round(total * 0.92),
});

export const DEMO_CUSTOMER_NAME = 'Amit Deshmukh';

export const DEMO_CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: 'BK-DEMO-1001',
    workerId: w('worker-arun-sharma').id,
    workerName: w('worker-arun-sharma').name,
    workerAvatar: w('worker-arun-sharma').avatarUrl,
    tradeLabel: w('worker-arun-sharma').tradeLabel,
    cooperativeName: w('worker-arun-sharma').cooperativeName,
    serviceDate: 'Today, 23 Sep 2026',
    serviceTime: 'Worker on the way · ETA ~10 min',
    address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    serviceLat: 18.5074,
    serviceLng: 73.8077,
    customerName: DEMO_CUSTOMER_NAME,
    customerPhone: '+91 98220 91823',
    isEmergency: false,
    baseFare: 399,
    emergencyFee: 0,
    totalFare: 399,
    ...shares(399),
    paymentMethod: 'upi',
    status: 'in_progress',
    createdAt: '2026-09-23T08:10:00.000Z',
    bookingType: 'home',
    instructions: 'Split AC not cooling since last night, gas refill check needed.',
  },
  {
    id: 'BK-DEMO-1002',
    workerId: w('worker-balwant-singh').id,
    workerName: w('worker-balwant-singh').name,
    workerAvatar: w('worker-balwant-singh').avatarUrl,
    tradeLabel: w('worker-balwant-singh').tradeLabel,
    cooperativeName: w('worker-balwant-singh').cooperativeName,
    serviceDate: 'Tomorrow, 24 Sep 2026',
    serviceTime: '10:00 AM - 11:30 AM',
    address: 'Block C, Silver Oak Society, Aundh, Pune - 411007',
    serviceLat: 18.558,
    serviceLng: 73.807,
    customerName: DEMO_CUSTOMER_NAME,
    customerPhone: '+91 98220 91823',
    isEmergency: false,
    baseFare: 279,
    emergencyFee: 0,
    totalFare: 279,
    ...shares(279),
    paymentMethod: 'cash',
    status: 'confirmed',
    createdAt: '2026-09-22T17:40:00.000Z',
    bookingType: 'society',
    instructions: 'Bathroom leakage on 3rd floor near the common washing area.',
  },
  {
    id: 'BK-DEMO-1003',
    workerId: w('worker-sunita-patil').id,
    workerName: w('worker-sunita-patil').name,
    workerAvatar: w('worker-sunita-patil').avatarUrl,
    tradeLabel: w('worker-sunita-patil').tradeLabel,
    cooperativeName: w('worker-sunita-patil').cooperativeName,
    serviceDate: '15 Sep 2026',
    serviceTime: '04:00 PM - 05:30 PM',
    address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    serviceLat: 18.5074,
    serviceLng: 73.8077,
    customerName: DEMO_CUSTOMER_NAME,
    customerPhone: '+91 98220 91823',
    isEmergency: false,
    baseFare: 249,
    emergencyFee: 0,
    totalFare: 249,
    ...shares(249),
    paymentMethod: 'upi',
    status: 'completed',
    createdAt: '2026-09-12T11:20:00.000Z',
    bookingType: 'home',
    instructions: 'Switchboard sparking near the entrance, MCB keeps tripping.',
    rating: 5,
    feedback: 'Arrived on time, replaced the switchboard safely. Very professional.',
  },
  {
    id: 'BK-DEMO-1004',
    workerId: w('worker-ramesh-kadam').id,
    workerName: w('worker-ramesh-kadam').name,
    workerAvatar: w('worker-ramesh-kadam').avatarUrl,
    tradeLabel: w('worker-ramesh-kadam').tradeLabel,
    cooperativeName: w('worker-ramesh-kadam').cooperativeName,
    serviceDate: '08 Sep 2026',
    serviceTime: '10:00 AM - 11:30 AM',
    address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    serviceLat: 18.5074,
    serviceLng: 73.8077,
    customerName: DEMO_CUSTOMER_NAME,
    customerPhone: '+91 98220 91823',
    isEmergency: false,
    baseFare: 299,
    emergencyFee: 0,
    totalFare: 299,
    ...shares(299),
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: '2026-09-05T09:15:00.000Z',
    bookingType: 'home',
    instructions: 'Repair of kitchen cabinet door and new shelf fitting in study room.',
  },
  {
    id: 'BK-DEMO-1005',
    workerId: w('worker-priya-shinde').id,
    workerName: w('worker-priya-shinde').name,
    workerAvatar: w('worker-priya-shinde').avatarUrl,
    tradeLabel: w('worker-priya-shinde').tradeLabel,
    cooperativeName: w('worker-priya-shinde').cooperativeName,
    serviceDate: '20 Sep 2026',
    serviceTime: '02:00 PM - 03:30 PM',
    address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    serviceLat: 18.5074,
    serviceLng: 73.8077,
    customerName: DEMO_CUSTOMER_NAME,
    customerPhone: '+91 98220 91823',
    isEmergency: false,
    baseFare: 229,
    emergencyFee: 0,
    totalFare: 229,
    ...shares(229),
    paymentMethod: 'cash',
    status: 'confirmed',
    createdAt: '2026-09-18T12:00:00.000Z',
    bookingType: 'home',
    instructions: 'Deep home cleaning — kitchen + 2 bedrooms.',
  },
];

/** Bookings cancelled by the customer (demo cancellation record). */
export const DEMO_CANCELLED_IDS = ['BK-DEMO-1005'];

export interface DemoAddress {
  id: string;
  label: string;
  address: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export const DEMO_SAVED_ADDRESSES: DemoAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    area: 'Kothrud',
    city: 'Pune',
    lat: 18.5074,
    lng: 73.8077,
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    address: 'Blue Ridge Tower, Baner Road, Pune - 411045',
    area: 'Baner',
    city: 'Pune',
    lat: 18.559,
    lng: 73.7868,
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Society',
    address: 'Silver Oak Co-op Society, Aundh, Pune - 411007',
    area: 'Aundh',
    city: 'Pune',
    lat: 18.558,
    lng: 73.807,
    isDefault: false,
  },
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: 'n-1',
    title: 'Worker on the way',
    body: 'Arun Sharma is on the way for your AC service (BK-DEMO-1001). ETA ~10 minutes.',
    time: '10 min ago',
  },
  {
    id: 'n-2',
    title: 'Booking confirmed',
    body: 'Balwant Singh (Plumber) confirmed — Tomorrow, 24 Sep, 10:00 AM, Silver Oak Society.',
    time: '2 hrs ago',
  },
  {
    id: 'n-3',
    title: 'Payment received',
    body: '₹249 received for booking BK-DEMO-1003. Digital invoice generated.',
    time: '8 days ago',
  },
  {
    id: 'n-4',
    title: 'Feedback reminder',
    body: 'Rate your Carpenter service for booking BK-DEMO-1004 — your review counts toward the worker aggregate.',
    time: '15 days ago',
  },
];

export const SUPPORT_CATEGORIES = [
  "Worker didn't arrive",
  'Service quality issue',
  'Payment issue',
  'Wrong amount',
  'Booking issue',
  'Other',
];

export const CUSTOMER_TYPES: { id: string; label: string }[] = [
  { id: 'household', label: 'Household' },
  { id: 'society', label: 'Housing Society' },
  { id: 'office', label: 'Office' },
  { id: 'institution', label: 'Institution' },
  { id: 'community', label: 'Community Organization' },
];

/** Service-detail copy per trade (display only — pricing stays dynamic floor rates). */
export interface ServiceDetailInfo {
  description: string[];
  duration: string;
  inclusions: string[];
}

export function serviceDetailInfo(slug: string): ServiceDetailInfo {
  switch (slug) {
    case 'plumber':
      return {
        description: [
          'Leak repair and drip fix',
          'Tap, mixer and sillcock replacement',
          'Pipe work and joint repairs',
          'Bathroom and kitchen plumbing',
          'Washing-machine / RO installation help',
        ],
        duration: '1 – 3 hours',
        inclusions: ['Visit & diagnosis', 'Basic tools', 'Warranty on workmanship (co-op backed)'],
      };
    case 'electrician':
      return {
        description: [
          'Wiring and switchboard repair',
          'MCB / fuse / trip troubleshooting',
          'Light, fan and appliance fitting',
          'Circuit testing and safety checks',
        ],
        duration: '1 – 3 hours',
        inclusions: ['Visit & diagnosis', 'Safety test after work', 'Warranty on workmanship (co-op backed)'],
      };
    case 'carpenter':
      return {
        description: [
          'Furniture assembly and repair',
          'Cabinet / shelf fitting and fixing',
          'Door, window and lock repairs',
          'Custom woodwork for home or office',
        ],
        duration: '2 – 4 hours',
        inclusions: ['Materials estimate shared before start', 'Basic hand & power tools'],
      };
    case 'cleaner':
      return {
        description: [
          'Deep home cleaning — kitchen, bathroom, bedrooms',
          'Society common-area cleaning',
          'Office & institution sanitization',
          'Post-construction cleanup',
        ],
        duration: '2 – 5 hours',
        inclusions: ['Eco cleaning products', 'Two-person team for large jobs'],
      };
    case 'ac-technician':
      return {
        description: [
          'AC not cooling — diagnosis & service',
          'Gas refill and leak checks',
          'Filter cleaning and outdoor unit service',
          'Installation / uninstallation support',
        ],
        duration: '1 – 2 hours',
        inclusions: ['Gas level check', 'Filter & coil cleaning', 'Leak inspection'],
      };
    case 'emergency':
      return {
        description: [
          'Immediate hazard response (within 15–20 min in Pune)',
          'Electrical sparking / MCB tripping',
          'Burst pipe / flooding',
          'Gas appliance / geyser leak',
          'Lock jammed / security locked',
        ],
        duration: 'Priority lane – 15–20 min ETA',
        inclusions: ['Priority dispatch', 'On-call cooperative standby worker', 'Fixed emergency floor rate'],
      };
    default:
      return {
        description: [
          'Verified cooperative workers in this trade across Pune',
          'AI-matched to your location, availability and workload',
          'Transparent starting rate — final quote after diagnosis',
        ],
        duration: '1 – 4 hours',
        inclusions: ['Visit & diagnosis', 'Cooperative verified worker'],
      };
  }
}

export const AVAILABLE_AREAS = 'Pune city · Pimpri-Chinchwad · Baner · Kothrud · Aundh · Hinjewadi · Hadapsar';