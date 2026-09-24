export type TradeCategory =
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'wall-painter'
  | 'cleaner'
  | 'ac-technician'
  | 'gas-appliance-technician'
  | 'glass-aluminium-worker'
  | 'mason'
  | 'handyman'
  | 'furniture-repair'
  | 'pest-control'
  | 'gardener'
  | 'appliance-technician'
  | 'internet-dth-technician'
  | 'mover-packer'
  | 'car-bike-service'
  | 'roofer'
  | 'tiler-flooring'
  | 'welder-fabricator'
  | 'tailor-alteration'
  | 'cook-home-chef'
  | 'laundry-ironing'
  | 'beauty-salon'
  | 'security-watchman'
  | 'solar-technician'
  | 'cctv-security'
  | 'water-tank-cleaning';

export interface ServiceItem {
  id: string;
  slug: TradeCategory;
  name: string;
  shortDesc: string;
  /** Cooperative-set floor rate. Omitted until the cooperative configures a rate — UI hides the price. */
  floorPrice?: number;
  iconBg: string;
  iconColor: string;
  /** Cooperative floor-rate explainer. Omitted until a floor rate is configured. */
  coopFloorRateDesc?: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  trade: TradeCategory;
  tradeLabel: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  area: string;
  lat: number;
  lng: number;
  floorPrice: number;
  cooperativeName: string;
  societyRegNo: string;
  ncctCertId: string;
  verified: boolean;
  availableToday: boolean;
  isEmergencyReady: boolean;
  insurancePolicyId: string;
  phone: string;
  skills: string[];
}

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  tradeLabel: string;
  cooperativeName: string;
  serviceDate: string;
  serviceTime: string;
  address: string;
  serviceLat?: number;
  serviceLng?: number;
  customerName: string;
  customerPhone: string;
  isEmergency: boolean;
  baseFare: number;
  emergencyFee: number;
  totalFare: number;
  workerEarnings: number;
  coopWelfareShare: number;
  paymentMethod: 'upi' | 'cash';
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  /** Customer booking type — household AND institutional customers (SIH26089). */
  bookingType?: 'home' | 'society' | 'office' | 'institution';
  /** Customer-supplied work description / instructions. */
  instructions?: string;
  rating?: number;
  feedback?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export type AuthRole = 'customer' | 'worker' | 'cooperative' | 'federation';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** Demo-only local credential. Never presented as production security. */
  password?: string;
  role: AuthRole;
  language?: SupportedLanguage;
  city?: string;
  area?: string;
  address?: string;
  avatarUrl?: string;
  // Worker profile fields
  trade?: string;
  tradeLabel?: string;
  cooperativeName?: string;
  experienceYears?: number;
  skills?: string[];
  availableToday?: boolean;
  serviceRadiusKm?: number;
  verificationStatus?: 'Pending' | 'Cooperative Verified' | 'Verified';
  // Cooperative / federation fields
  orgName?: string;
  orgType?: 'cooperative' | 'federation';
  regNo?: string;
  createdAt: string;
}

export interface TranslationStrings {
  heroTitle1: string;
  heroHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  locationDefault: string;
  findWorkersBtn: string;
  bulletVerified: string;
  bulletWages: string;
  bulletInsured: string;
  sihReadiness: string;
  moreThanApp: string;
  whatCanWeHelp: string;
  forWorkers: string;
}
