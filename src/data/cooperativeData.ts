import { CooperativeStat, ComparisonItem, WorkerMember } from '../types';

export const cooperativeStats: CooperativeStat[] = [
  {
    id: 'stat-workers',
    value: '14,850+',
    numericVal: 14850,
    label: 'Verified Worker Members',
    hindiLabel: 'सत्यापित श्रमिक सदस्य (मालिक)',
    marathiLabel: 'प्रमाणित कामगार सदस्य (सह-मालक)',
    description: 'Co-owners of the cooperative with full voting rights and profit share.',
    icon: 'ShieldCheck',
    trend: '+18% this quarter'
  },
  {
    id: 'stat-services',
    value: '52,400+',
    numericVal: 52400,
    label: 'Services Delivered',
    hindiLabel: 'सफलतापूर्वक पूर्ण सेवाएँ',
    marathiLabel: 'यशस्वीरित्या पूर्ण केलेल्या सेवा',
    description: 'Household & community tasks fulfilled with 98.4% timely completion.',
    icon: 'CheckCircle2',
    trend: '4.89 / 5.0 Avg Rating'
  },
  {
    id: 'stat-dividends',
    value: '₹2.45 Cr+',
    numericVal: 24500000,
    label: 'Cooperative Dividends Paid',
    hindiLabel: 'वितरित सहकारी लाभांश',
    marathiLabel: 'वाटप केलेला सहकारी लाभांश',
    description: 'Surplus revenue redistributed back into member workers savings & welfare.',
    icon: 'TrendingUp',
    trend: 'Zero venture capital extraction'
  },
  {
    id: 'stat-takehome',
    value: '88% Direct',
    numericVal: 88,
    label: 'Direct Payout to Workers',
    hindiLabel: 'श्रमिकों को प्रत्यक्ष भुगतान',
    marathiLabel: 'कामगारांना थेट मिळणारा वाटा',
    description: 'Workers retain 88% of booking fees, compared to 55–65% on corporate apps.',
    icon: 'HeartHandshake',
    trend: 'Industry benchmark'
  },
  {
    id: 'stat-communities',
    value: '42+ Hubs',
    numericVal: 42,
    label: 'Municipal Wards Served',
    hindiLabel: 'शहरी प्रभाग व वार्ड्स',
    marathiLabel: 'शहरी वॉर्ड्स आणि सहकारी केंद्रे',
    description: 'Decentralized ward-level dispatch centers for rapid 30-min response.',
    icon: 'MapPin',
    trend: 'Across 6 tier-1 & tier-2 cities'
  },
  {
    id: 'stat-welfare',
    value: '100% Covered',
    numericVal: 100,
    label: 'Worker Health & ESI Cover',
    hindiLabel: 'स्वास्थ्य व दुर्घटना बीमा',
    marathiLabel: 'आरोग्य व अपघात विमा संरक्षण',
    description: 'Accident insurance, maternity benefits, and emergency cooperative credit fund.',
    icon: 'Award',
    trend: 'Comprehensive social security'
  }
];

export const platformComparisons: ComparisonItem[] = [
  {
    feature: 'Worker Compensation & Commission',
    cooperative: '88% direct fee + annual patronage dividend from cooperative profits',
    traditional: 'Only 55%–65% take-home after platform commission & hidden charges',
    isHighlight: true
  },
  {
    feature: 'Governance & Ownership',
    cooperative: 'Democratic 1-Worker = 1-Vote; workers elect board members & set tariffs',
    traditional: 'Zero worker voice; corporate executives and venture shareholders dictate rules'
  },
  {
    feature: 'Social Security & Insurance',
    cooperative: 'Included ESI/health coverage, ₹5 Lakh accident insurance & welfare corpus',
    traditional: 'Classified as "independent contractors" with zero medical or retirement benefits',
    isHighlight: true
  },
  {
    feature: 'Customer Pricing Model',
    cooperative: 'Transparent standardized rate card, zero surge extortion, fair parts cost',
    traditional: 'Dynamic surge pricing, artificial scarcity algorithms, high markups'
  },
  {
    feature: 'Grievance & Deactivation',
    cooperative: 'Peer-reviewed transparent dispute council with right-to-be-heard',
    traditional: 'Arbitrary algorithmic penalties and automated sudden account blocking'
  },
  {
    feature: 'Skill Upskilling & Equipment',
    cooperative: 'Subsidized tool procurement, safety gear, and certified trade training',
    traditional: 'Workers forced to purchase overpriced kits directly from the platform'
  }
];

export const workerSpotlights: WorkerMember[] = [
  {
    id: 'w-1',
    name: 'Rameshwar Jadhav',
    trade: 'Senior Electrician & Ward Representative',
    coopRole: 'Elected Member, Pune Central Ward',
    rating: 4.94,
    reviewsCount: 428,
    completedJobs: 890,
    location: 'Kothrud, Pune',
    experienceYears: 12,
    dividendEarned: 34500,
    badge: 'Founding Member',
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    quote: 'In other apps, I was treated like a number and lost 35% of my earnings. In WorkerEMP, I am a co-owner with health insurance for my family and an annual bonus dividend.'
  },
  {
    id: 'w-2',
    name: 'Sunita Devi Rathore',
    trade: 'Master Cleaning Specialist & Trainer',
    coopRole: 'Women Empowerment Lead, Indore',
    rating: 4.96,
    reviewsCount: 382,
    completedJobs: 740,
    location: 'Vijay Nagar, Indore',
    experienceYears: 8,
    dividendEarned: 29800,
    badge: 'Top Rated Professional',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote: 'WorkerEMP gave women service professionals dignity, standard working hours, and respect. Customers trust us because they know we are cooperative members.'
  },
  {
    id: 'w-3',
    name: 'Rajesh Sharma',
    trade: 'Certified Master Plumber',
    coopRole: 'Quality & Safety Auditor, Jaipur',
    rating: 4.91,
    reviewsCount: 512,
    completedJobs: 1120,
    location: 'Mansarovar, Jaipur',
    experienceYears: 15,
    dividendEarned: 41200,
    badge: 'Co-op Safety Lead',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'We set our own rate cards transparently. No hidden cuts, no surge manipulation. Customers get genuine work and we get a fair living wage.'
  }
];

export const popularLocations = [
  'Kothrud, Pune',
  'Baner / Wakad, Pune',
  'Viman Nagar, Pune',
  'Andheri West, Mumbai',
  'Dadar / Bandra, Mumbai',
  'Thane West, Mumbai',
  'Koramangala, Bengaluru',
  'Indiranagar, Bengaluru',
  'HSR Layout, Bengaluru',
  'Mansarovar, Jaipur',
  'Malviya Nagar, Jaipur',
  'Vijay Nagar, Indore',
  'Palasia, Indore',
  'Noida Sector 62, NCR',
  'Gurugram Cyber City, NCR'
];
