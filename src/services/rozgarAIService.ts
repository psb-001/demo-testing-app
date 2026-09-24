/**
 * Rozgar AI assistant service.
 *
 * Provider abstraction: the UI only talks to `AIAssistantProvider`.
 * `DemoRozgarAIBackend` is a demo-ready guided assistant (keyword +
 * intent routing over the existing service catalog and live worker
 * counts) — it does NOT claim production AI processing. Swap
 * `rozgarAI` for a live backend implementation later without touching UI.
 */

import type { AuthRole } from '../types';

export type AILanguage = 'en' | 'hi' | 'mr';

export const AI_LANGUAGES: { code: AILanguage; label: string; native: string; speechTag: string }[] = [
  { code: 'en', label: 'English', native: 'English', speechTag: 'en-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', speechTag: 'hi-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', speechTag: 'mr-IN' },
];

/** Languages planned next — shown disabled under "+ More" so we never claim unsupported languages. */
export const AI_COMING_SOON_LANGUAGES = ['தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'বাংলা (Bengali)'];

export type AIPlatformActionType =
  | 'select-service'
  | 'open-map'
  | 'book-worker'
  | 'open-register'
  | 'open-emergency'
  | 'open-admin'
  | 'coop-nav'
  | 'scroll';

export interface AIPlatformAction {
  type: AIPlatformActionType;
  label: string;
  slug?: string;
  targetId?: string;
  /** Cooperative portal tab to navigate to (type === 'coop-nav'). */
  tab?: string;
}

export interface AIAssistantReply {
  text: string;
  actions?: AIPlatformAction[];
}

/** Cooperative-portal snapshot the app hands the assistant (consistent with the demo store). */
export interface AICoopSnapshot {
  workersTotal: number;
  workersVerified: number;
  availableToday: number;
  onJobs: number;
  overloaded: number;
  underutilized: number;
  emergencyReady: number;
  pendingVerifications: number;
  certExpiring: number;
  openRequests: number;
  activeEmergencies: number;
  payoutPending: number;
  grossMonth: number;
  workerPayoutsMonth: number;
  welfareMonth: number;
  availableByTrade: Record<string, number>;
  workersByTrade: Record<string, number>;
  areaDemand: { area: string; trade: string; level: string }[];
  demandGaps: { trade: string; gap: number }[];
  overloadedNames: string[];
  underutilizedNames: string[];
}

export interface AIAssistantContext {
  language: AILanguage;
  /** Authenticated role, when known — adapts guidance to the right portal. */
  role?: AuthRole | null;
  userArea: string;
  bookingsCount: number;
  serviceCatalog: { slug: string; name: string; floorPrice?: number }[];
  totalWorkers: number;
  workersByTrade: Record<string, number>;
  /** Cooperative store snapshot — powers coop-intent answers (anti-bullshit, numbers from the shared store). */
  coop?: AICoopSnapshot | null;
  /** Where the assistant was opened (page-aware). Lets answers match the screen. */
  pageContext?: AIPageContext | null;
}

export interface AIAssistantProvider {
  readonly mode: 'demo' | 'live';
  respond(input: string, ctx: AIAssistantContext): Promise<AIAssistantReply>;
}

/* ---------------- UI chrome strings (extensible per language) ---------------- */

interface AIStrings {
  subtitle: string;
  chatTab: string;
  voiceTab: string;
  placeholder: string;
  tapToSpeak: string;
  listening: string;
  processing: string;
  youSaid: string;
  voiceNotSupported: string;
  voiceError: string;
  micPermission: string;
  voiceResponses: string;
  suggestedTitle: string;
  suggestService: string;
  suggestWorker: string;
  suggestBooking: string;
  suggestWorkerHelp: string;
  demoNote: string;
  moreLanguages: string;
  comingSoon: string;
}

export const AI_UI_STRINGS: Record<AILanguage, AIStrings> = {
  en: {
    subtitle: 'Your multilingual assistant for workers and customers.',
    chatTab: 'Chat',
    voiceTab: 'Voice',
    placeholder: 'Type your message...',
    tapToSpeak: 'Tap the microphone to speak.',
    listening: 'Listening...',
    processing: 'Thinking...',
    youSaid: 'You said:',
    voiceNotSupported: 'Voice input is not supported in this browser. Please type instead.',
    voiceError: 'Could not hear you clearly. Please try again or type.',
    micPermission: 'Microphone access is required for voice input. Please allow microphone permission and try again.',
    voiceResponses: 'Voice replies',
    suggestedTitle: 'Suggested actions',
    suggestService: 'Find a Service',
    suggestWorker: 'Find a Worker',
    suggestBooking: 'My Booking',
    suggestWorkerHelp: 'Worker Help',
    demoNote: 'Demo assistant — guided help. Connect an AI backend for live answers.',
    moreLanguages: 'More',
    comingSoon: 'Coming soon',
  },
  hi: {
    subtitle: 'कामगारों और ग्राहकों के लिए आपका बहुभाषी सहायक।',
    chatTab: 'चैट',
    voiceTab: 'वॉइस',
    placeholder: 'अपना संदेश लिखें...',
    tapToSpeak: 'बोलने के लिए माइक दबाएं।',
    listening: 'सुन रहे हैं...',
    processing: 'सोच रहे हैं...',
    youSaid: 'आपने कहा:',
    voiceNotSupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया लिखें।',
    voiceError: 'आपकी बात स्पष्ट सुनाई नहीं दी। पुनः प्रयास करें या लिखें।',
    micPermission: 'वॉइस इनपुट के लिए माइक्रोफ़ोन की अनुमति आवश्यक है। कृपया अनुमति दें और पुनः प्रयास करें।',
    voiceResponses: 'वॉइस उत्तर',
    suggestedTitle: 'सुझाए गए विकल्प',
    suggestService: 'सेवा खोजें',
    suggestWorker: 'कामगार खोजें',
    suggestBooking: 'मेरी बुकिंग',
    suggestWorkerHelp: 'कामगार सहायता',
    demoNote: 'डेमो सहायक — निर्देशित सहायता। लाइव उत्तरों के लिए AI बैकएंड जोड़ें।',
    moreLanguages: 'और',
    comingSoon: 'जल्द आ रहा है',
  },
  mr: {
    subtitle: 'कामगार आणि ग्राहकांसाठी तुमचा बहुभाषिक सहाय्यक।',
    chatTab: 'चॅट',
    voiceTab: 'व्हॉइस',
    placeholder: 'तुमचा संदेश लिहा...',
    tapToSpeak: 'बोलण्यासाठी माइक दाबा.',
    listening: 'ऐकत आहे...',
    processing: 'विचार करत आहे...',
    youSaid: 'तुम्ही म्हणालात:',
    voiceNotSupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया लिहा.',
    voiceError: 'तुमचे बोलणे स्पष्ट ऐकू आले नाही. पुन्हा प्रयत्न करा किंवा लिहा.',
    micPermission: 'व्हॉइस इनपुटसाठी मायक्रोफोन परवानगी आवश्यक आहे. कृपया परवानगी द्या आणि पुन्हा प्रयत्न करा.',
    voiceResponses: 'व्हॉइस उत्तरे',
    suggestedTitle: 'सुचवलेले पर्याय',
    suggestService: 'सेवा शोधा',
    suggestWorker: 'कामगार शोधा',
    suggestBooking: 'माझे बुकिंग',
    suggestWorkerHelp: 'कामगार मदत',
    demoNote: 'डेमो सहाय्यक — मार्गदर्शित मदत. लाइव्ह उत्तरांसाठी AI बॅकएंड जोडा.',
    moreLanguages: 'आणखी',
    comingSoon: 'लवकरच येत आहे',
  },
};

/* ---------------- Demo backend: intent + keyword routing ---------------- */

interface ServiceKeys {
  slug: string;
  keys: string[];
}

const SERVICE_KEYS: ServiceKeys[] = [
  { slug: 'electrician', keys: ['electric', 'bijli', 'बिजली', 'इलेक्ट्रिशियन', 'बत्ती', 'पंखा', 'लाइट', 'लाईट', 'स्विच', 'वीज', 'mcb', 'wiring', 'fan', 'light'] },
  { slug: 'plumber', keys: ['plumb', 'pipe', 'पाइप', 'पाईप', 'नल', 'नळ', 'पानी', 'पाणी', 'leak', 'रिसाव', 'गळती', 'tap', 'flush', 'tank', 'टंकी', 'टाकी', 'प्लंबर'] },
  { slug: 'cleaner', keys: ['clean', 'सफाई', 'साफ', 'स्वच्छ', 'क्लीनर', 'झाड़ू', 'mop', 'kitchen cleaning', 'bathroom'] },
  { slug: 'carpenter', keys: ['carpent', 'बढ़ई', 'सुतार', 'लकड़ी', 'लाकूड', 'फर्नीचर', 'फर्निचर', 'wood', 'furniture', 'door', 'दरवाजा', 'दार'] },
  { slug: 'wall-painter', keys: ['paint', 'पेंट', 'रंग', 'दीवार', 'भिंत', 'whitewash', 'putty'] },
  { slug: 'ac-technician', keys: ['ac', 'एसी', 'air condition', 'cooling', 'कूलिंग', 'कुलिंग', 'gas refill', 'refrigerat'] },
  { slug: 'gas-appliance-technician', keys: ['gas', 'गैस', 'geyser', 'गीजर', 'stove', 'चूल्हा', 'burner'] },
  { slug: 'pest-control', keys: ['pest', 'cockroach', 'termite', 'bedbug', 'कॉकरोच', 'दीमक', 'उंदीर', 'mosquito', 'मच्छर'] },
  { slug: 'gardener', keys: ['garden', 'बगीचा', 'बाग', 'plant', 'पौधा', 'झाड', 'lawn', 'माळी'] },
  { slug: 'mover-packer', keys: ['mov', 'pack', 'shift', 'शिफ्ट', 'सामान', 'घर बदल', 'transport'] },
  { slug: 'handyman', keys: ['handyman', 'drill', 'hang', 'छोटा', 'लहान', 'small fix', 'repair'] },
];

const norm = (s: string) => s.toLowerCase();

function findService(text: string): string | null {
  const t = norm(text);
  for (const s of SERVICE_KEYS) {
    if (s.keys.some((k) => t.includes(norm(k)))) return s.slug;
  }
  return null;
}

function hasAny(text: string, keys: string[]): boolean {
  const t = norm(text);
  return keys.some((k) => t.includes(norm(k)));
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class DemoRozgarAIBackend implements AIAssistantProvider {
  readonly mode = 'demo' as const;

  async respond(input: string, ctx: AIAssistantContext): Promise<AIAssistantReply> {
    await delay(500 + Math.random() * 400);
    const lang = ctx.language;
    const serviceSlug = findService(input);
    const service = serviceSlug
      ? ctx.serviceCatalog.find((s) => s.slug === serviceSlug)
      : undefined;
    const count = serviceSlug ? ctx.workersByTrade[serviceSlug] ?? 0 : 0;

    // Emergency
    if (hasAny(input, ['emergency', 'urgent', 'spark', 'चिंगारी', 'ठिणगी', 'burst', 'flood', 'फट', 'gas leak', 'गैस रिसाव', 'तुरंत', 'तातडी'])) {
      return this.t(lang, {
        en: `For urgent issues, our Emergency lane dispatches a verified worker in 15–20 minutes. Tell me the problem and I will start priority dispatch.`,
        hi: `जरूरी समस्या के लिए हमारी Emergency लेन 15–20 मिनट में सत्यापित कामगार भेजती है। समस्या बताएं, मैं प्राथमिकता डिस्पैच शुरू करता हूं।`,
        mr: `तातडीच्या समस्यांसाठी आमची Emergency लेन 15–20 मिनिटांत प्रमाणित कामगार पाठवते. समस्या सांगा, मी प्राधान्य डिस्पॅच सुरू करतो.`,
      }, [{ type: 'open-emergency', label: this.actLabel(lang, 'emergency') }]);
    }

    // Cooperative-portal intents (role + live store snapshot; data never invented)
    const coopReply = ctx.role === 'cooperative' && ctx.coop ? this.coopGuidance(input, ctx) : null;
    if (coopReply) return coopReply;

    // Role-aware portal guidance (uses the authenticated role where known)
    const roleReply = this.roleGuidance(input, ctx);
    if (roleReply) return roleReply;

    // Pricing
    if (hasAny(input, ['price', 'cost', 'charge', 'rate', 'fee', 'कितना', 'कीमत', 'दाम', 'शुल्क', 'किती', 'किंमत', 'दर', 'फी', 'paisa', 'पैसे'])) {
      if (service) {
        const rateEn = service.floorPrice
          ? `starts at ₹${service.floorPrice} (cooperative floor rate, fixed before booking)`
          : `has cooperative rates fixed before booking (ask for the current floor rate)`;
        const rateHi = service.floorPrice
          ? `की शुरुआत ₹${service.floorPrice} से होती है (सहकारी फ्लोर रेट, बुकिंग से पहले तय)`
          : `की सहकारी दरें बुकिंग से पहले तय होती हैं (वर्तमान फ्लोर रेट पूछें)`;
        const rateMr = service.floorPrice
          ? `ची सुरुवात ₹${service.floorPrice} पासून होते (सहकारी फ्लोअर रेट, बुकिंगपूर्वी निश्चित)`
          : `चे सहकारी दर बुकिंगपूर्वी निश्चित होतात (सध्याचा फ्लोअर रेट विचारा)`;
        return this.t(lang, {
          en: `${service.name} ${rateEn}. No hidden charges — 92% goes directly to the worker. Want to see available ${service.name.toLowerCase()}s near ${ctx.userArea}?`,
          hi: `${service.name} ${rateHi}। कोई छिपा शुल्क नहीं — 92% सीधे कामगार को जाता है। क्या ${ctx.userArea} के पास उपलब्ध कामगार देखना चाहेंगे?`,
          mr: `${service.name} ${rateMr}। कोणतेही छुपे शुल्क नाही — 92% थेट कामगाराला जाते. ${ctx.userArea} जवळ उपलब्ध कामगार पाहायचे का?`,
        }, this.serviceActions(lang, serviceSlug!, service.name));
      }
      const list = ctx.serviceCatalog.slice(0, 5).map((s) => (s.floorPrice ? `${s.name} (₹${s.floorPrice})` : s.name)).join(', ');
      return this.t(lang, {
        en: `Our cooperative floor rates are fixed and transparent — e.g. ${list}. Which service do you need a price for?`,
        hi: `हमारे सहकारी फ्लोर रेट तय और पारदर्शी हैं — जैसे ${list}। आपको किस सेवा की कीमत जाननी है?`,
        mr: `आमचे सहकारी फ्लोअर रेट निश्चित आणि पारदर्शक आहेत — उदा. ${list}। तुम्हाला कोणत्या सेवेची किंमत हवी आहे?`,
      });
    }

    // Booking status
    if (hasAny(input, ['booking', 'बुकिंग', 'appointment', 'status', 'स्थिति', 'स्टेटस', 'my book', 'मेरी बुक', 'माझे बुक', 'order', 'ऑर्डर'])) {
      if (ctx.bookingsCount === 0) {
        return this.t(lang, {
          en: `You have no confirmed bookings yet in this session. Tell me which service you need and I will help you book a verified cooperative worker.`,
          hi: `इस सत्र में आपकी कोई पुष्ट बुकिंग नहीं है। आपको कौन सी सेवा चाहिए, बताएं — मैं सत्यापित सहकारी कामगार बुक करने में मदद करूंगा।`,
          mr: `या सत्रात तुमचे कोणतेही निश्चित बुकिंग नाही. तुम्हाला कोणती सेवा हवी आहे ते सांगा — मी प्रमाणित सहकारी कामगार बुक करायला मदत करतो.`,
        }, [{ type: 'open-map', label: this.actLabel(lang, 'map') }]);
      }
      return this.t(lang, {
        en: `You have ${ctx.bookingsCount} confirmed booking${ctx.bookingsCount > 1 ? 's' : ''} in this session. The worker arrives in your chosen time window and you pay the transparent floor fare. Need anything changed?`,
        hi: `इस सत्र में आपकी ${ctx.bookingsCount} पुष्ट बुकिंग है। कामगार आपके चुने समय पर पहुंचेगा और पारदर्शी फ्लोर किराया देना होगा। कुछ बदलना है?`,
        mr: `या सत्रात तुमचे ${ctx.bookingsCount} निश्चित बुकिंग आहे. कामगार तुमच्या निवडलेल्या वेळेत येईल आणि पारदर्शक फ्लोअर भाडे द्यावे लागेल. काही बदल हवे आहे का?`,
      });
    }

    // Become a worker / job
    if (hasAny(input, ['become a worker', 'join as worker', 'register as worker', 'job', 'work', 'कामगार बन', 'नौकरी', 'रोजगार', 'काम हवे', 'काम पाहिजे', 'join worker', 'register worker'])) {
      return this.t(lang, {
        en: `Wonderful! Joining as a cooperative worker is free. Register once, get your Digital Skill Passport, and receive fair rotating work with 92% earnings. Shall I open worker registration?`,
        hi: `बहुत बढ़िया! सहकारी कामगार के रूप में जुड़ना मुफ्त है। एक बार पंजीकरण करें, डिजिटल स्किल पासपोर्ट पाएं और 92% कमाई के साथ निष्पक्ष काम पाएं। क्या मैं पंजीकरण खोलूं?`,
        mr: `छान! सहकारी कामगार म्हणून सामील होणे मोफत आहे. एकदा नोंदणी करा, डिजिटल स्किल पासपोर्ट मिळवा आणि 92% कमाईसह रास्त फिरते काम मिळवा. मी नोंदणी उघडू का?`,
      }, [{ type: 'open-register', label: this.actLabel(lang, 'register') }]);
    }

    // Skill passport
    if (hasAny(input, ['passport', 'skill', 'certificate', 'certification', 'स्किल', 'प्रमाण', 'प्रमाणपत्र', 'कौशल', 'kaushal'])) {
      return this.t(lang, {
        en: `The Digital Skill Passport is a verified worker profile — skills, experience, certifications, availability and welfare cover. Every booking shows the worker's passport before you confirm.`,
        hi: `डिजिटल स्किल पासपोर्ट एक सत्यापित कामगार प्रोफाइल है — कौशल, अनुभव, प्रमाणपत्र, उपलब्धता और कल्याण कवर। हर बुकिंग से पहले कामगार का पासपोर्ट दिखाया जाता है।`,
        mr: `डिजिटल स्किल पासपोर्ट हे प्रमाणित कामगार प्रोफाइल आहे — कौशल्ये, अनुभव, प्रमाणपत्रे, उपलब्धता आणि कल्याण संरक्षण. प्रत्येक बुकिंगपूर्वी कामगाराचा पासपोर्ट दाखवला जातो.`,
      }, [{ type: 'scroll', targetId: 'top-rated-section', label: this.actLabel(lang, 'workers') }]);
    }

    // Welfare / earnings
    if (hasAny(input, ['welfare', 'insurance', 'बीमा', 'विमा', 'कल्याण', 'earning', 'कमाई', 'पगार', 'payment', 'pf', 'pension'])) {
      return this.t(lang, {
        en: `Cooperative members keep 92% of every fare, plus accident & tool insurance and a welfare fund from the 8% cooperative share. Ask your society about claims anytime.`,
        hi: `सहकारी सदस्य हर किराए का 92% रखते हैं, साथ में दुर्घटना व टूल बीमा और 8% सहकारी हिस्से से कल्याण कोष। दावों के लिए अपनी समिति से कभी भी पूछें।`,
        mr: `सहकारी सदस्य प्रत्येक भाड्याच्या 92% रक्कम ठेवतात, तसेच अपघात व टूल विमा आणि 8% सहकारी वाट्यातून कल्याण निधी. दाव्यांसाठी तुमच्या संस्थेला कधीही विचारा.`,
      });
    }

    // Service request (with matched trade)
    if (service) {
      const avail = count > 0 ? count : ctx.totalWorkers;
      const fromRateEn = service.floorPrice ? `, starting at ₹${service.floorPrice}` : '';
      const fromRateHi = service.floorPrice ? `, शुरुआत ₹${service.floorPrice} से` : '';
      const fromRateMr = service.floorPrice ? `, सुरुवात ₹${service.floorPrice} पासून` : '';
      return this.t(lang, {
        en: `Good news — ${avail} cooperative ${service.name.toLowerCase()}${avail > 1 ? 's are' : ' is'} available near ${ctx.userArea}${fromRateEn}. Shall I show them?`,
        hi: `${ctx.userArea} के पास ${avail} सहकारी ${service.name} उपलब्ध हैं${fromRateHi}। क्या मैं उन्हें दिखाऊं?`,
        mr: `${ctx.userArea} जवळ ${avail} सहकारी ${service.name} उपलब्ध आहेत${fromRateMr}. मी ते दाखवू का?`,
      }, this.serviceActions(lang, serviceSlug!, service.name));
    }

    // Generic service discovery
    if (hasAny(input, ['service', 'सेवा', 'worker', 'कामगार', 'मजदूर', 'mistri', 'मिस्त्री', 'need', 'चाहिए', 'पाहिजे', 'help', 'मदद', 'मदत'])) {
      const names = ctx.serviceCatalog.slice(0, 6).map((s) => s.name).join(', ');
      const moreCount = Math.max(ctx.serviceCatalog.length - 6, 0);
      return this.t(lang, {
        en: `I can help with ${names} and ${moreCount} more services from verified cooperatives near ${ctx.userArea}. Which one do you need?`,
        hi: `मैं ${ctx.userArea} के पास सत्यापित समितियों की ${names} सहित ${moreCount}+ सेवाओं में मदद कर सकता हूं। आपको कौन सी चाहिए?`,
        mr: `मी ${ctx.userArea} जवळील प्रमाणित संस्थांच्या ${names} सह आणखी ${moreCount}+ सेवांमध्ये मदत करू शकतो. तुम्हाला कोणती हवी आहे?`,
      }, [{ type: 'open-map', label: this.actLabel(lang, 'map') }]);
    }

    // Greeting
    if (hasAny(input, ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'नमस्कार', 'राम राम', 'yo'])) {
      return this.t(lang, {
        en: `Namaste! I am Rozgar AI. Ask me for a service, a nearby worker, prices, your booking, or worker help — in English, हिन्दी or मराठी.`,
        hi: `नमस्ते! मैं Rozgar AI हूं। सेवा, नजदीकी कामगार, कीमत, बुकिंग या कामगार सहायता पूछें — English, हिन्दी या मराठी में।`,
        mr: `नमस्कार! मी Rozgar AI आहे. सेवा, जवळचा कामगार, किंमत, बुकिंग किंवा कामगार मदत विचारा — English, हिन्दी किंवा मराठीत.`,
      });
    }

    // Fallback
    return this.t(lang, {
      en: `I can help you find services, nearby cooperative workers, prices, bookings, or worker support near ${ctx.userArea}. Could you tell me a little more — e.g. "I need an electrician"?`,
      hi: `मैं ${ctx.userArea} के पास सेवाएं, सहकारी कामगार, कीमत, बुकिंग या कामगार सहायता में मदद कर सकता हूं। थोड़ा और बताएं — जैसे "मुझे प्लंबर चाहिए"?`,
      mr: `मी ${ctx.userArea} जवळ सेवा, सहकारी कामगार, किंमत, बुकिंग किंवा कामगार मदत करू शकतो. थोडे अधिक सांगा — उदा. "मला इलेक्ट्रिशियन पाहिजे"?`,
    });
  }

  private t(
    lang: AILanguage,
    texts: Record<AILanguage, string>,
    actions?: AIPlatformAction[],
  ): AIAssistantReply {
    return { text: texts[lang], actions };
  }

  /**
   * Cooperative admin intents — always answers from the shared store snapshot
   * (counts, names and areas), never from thin air. Navigates via 'coop-nav'.
   */
  private coopGuidance(input: string, ctx: AIAssistantContext): AIAssistantReply | null {
    const lang = ctx.language;
    const c = ctx.coop!;
    const slug = findService(input);
    const tradeName = slug ? ctx.serviceCatalog.find((s) => s.slug === slug)?.name : undefined;

    // Available workers: "How many electricians are available today?" / हिंदी / मराठी
    if ((hasAny(input, ['available', 'उपलब्ध', 'मौजूद', 'कितने', 'किती', 'ready', 'free', 'today', 'आज']) && slug) || hasAny(input, ['आज कितने', 'कितनी सूची', 'सूची दिखाओ', 'यादी दाखव'])) {
      const avail = slug ? c.availableByTrade[slug] ?? 0 : c.availableToday;
      const total = slug ? c.workersByTrade[slug] ?? 0 : c.workersTotal;
      const availList = tradeName
        ? `${avail} of ${total} ${tradeName} members ready today`
        : `${avail} members ready today`;
      return this.t(lang, {
        en: `From the live roster: ${availList}. Pick one from the Workers tab (availability is filterable) or rate them with AI matching.`,
        hi: `लाइव रोस्टर से: ${tradeName ? `${avail} में से ${total} ${tradeName} सदस्य` : `${avail} सदस्य`} आज उपलब्ध हैं। Workers टैब में चुनें या AI मैचिंग से रेट करें।`,
        mr: `लाइव्ह यादीतून: ${tradeName ? `${avail} पैकी ${total} ${tradeName} सदस्य` : `${avail} सदस्य`} आज उपलब्ध आहेत. Workers टॅबमधून निवडा किंवा AI मॅचिंगने रेट करा.`,
      }, [
        { type: 'coop-nav', tab: 'workers', label: this.actLabel(lang, 'view') + ' ' + (tradeName ?? 'workers') },
        { type: 'coop-nav', tab: 'matching', label: lang === 'en' ? 'Open AI matching' : lang === 'hi' ? 'AI मैचिंग खोलें' : 'AI मॅचिंग उघडा' },
      ]);
    }

    // Overloaded / rebalance / fairness
    if (hasAny(input, ['overload', 'ओवरलोड', 'भार', 'rebalance', 'संतुलन', 'fair', 'निष्पक्ष', 'न्याय्य', 'आवंटन', 'allocation', 'वाटप'])) {
      return this.t(lang, {
        en: `${c.overloaded} members are overloaded (${c.overloadedNames.slice(0, 3).join(', ')}${c.overloadedNames.length > 3 ? '…' : ''}) while ${c.underutilized} are underutilized. Fair Allocation re-routes the next queue toward light verified members — open it to rebalance now.`,
        hi: `${c.overloaded} सदस्य ओवरलोड हैं (${c.overloadedNames.slice(0, 3).join(', ')}…) और ${c.underutilized} कम उपयोग में हैं। Fair Allocation अगली कतार हल्के सत्यापित सदस्यों की ओर भेजता है — अभी खोलें।`,
        mr: `${c.overloaded} सदस्य ओव्हरलोड आहेत (${c.overloadedNames.slice(0, 3).join(', ')}…) तर ${c.underutilized} कमी वापरात आहेत. Fair Allocation पुढील रांग हलक्या प्रमाणित सदस्यांकडे पाठवते — आता उघडा.`,
      }, [{ type: 'coop-nav', tab: 'matching', label: this.actLabel(lang, 'view') + ' Fair Allocation' }]);
    }

    // Area demand / hotspots
    if (hasAny(input, ['area', 'क्षेत्र', 'area demand', 'लोकेशन', 'hotspot', 'स्थान', 'location', 'zone'])) {
      const high = c.areaDemand.filter((a) => a.level === 'High').slice(0, 3);
      const list = high.map((a) => `${a.area} (${a.trade})`).join(', ') || c.areaDemand.map((a) => `${a.area} (${a.level})`).join(', ');
      return this.t(lang, {
        en: `High-demand hotspots right now: ${list}. Open the coverage map to see circles and dispatch balance, or the forecast for capacity planning.`,
        hi: `अभी उच्च-मांग क्षेत्र: ${list}। कवरेज मानचित्र या पूर्वानुमान टैब से क्षमता योजना करें।`,
        mr: `सध्या उच्च-मागणी भाग: ${list}. कव्हरेज नकाशा किंवा अंदाज टॅबमधून क्षमता नियोजन करा.`,
      }, [
        { type: 'coop-nav', tab: 'coverageMap', label: this.actLabel(lang, 'map') },
        { type: 'coop-nav', tab: 'demandForecast', label: lang === 'en' ? 'Open demand forecast' : lang === 'hi' ? 'पूर्वानुमान खोलें' : 'अंदाज उघडा' },
      ]);
    }

    // Certification renewal / passports / verification
    if (hasAny(input, ['certification', 'प्रमाणन', 'प्रमाणपत्र', 'renew', 'नवीनीकरण', 'पासपोर्ट', 'passport', 'verification', 'सत्यापन', 'पडताळणी'])) {
      return this.t(lang, {
        en: `${c.certExpiring} certifications expire within 30 days and ${c.pendingVerifications} member verifications are pending. Clear the queue in Verification Center; renew through Training & Skills.`,
        hi: `${c.certExpiring} प्रमाणपत्र 30 दिनों में समाप्त हो रहे हैं और ${c.pendingVerifications} सत्यापन लंबित हैं। Verification Center से सूची पूरी करें।`,
        mr: `${c.certExpiring} प्रमाणपत्रे ३० दिवसांत संपत आहेत आणि ${c.pendingVerifications} पडताळणी प्रलंबित आहेत. Verification Center मधून यादी पूर्ण करा.`,
      }, [
        { type: 'coop-nav', tab: 'verification', label: this.actLabel(lang, 'view') + ' Verification' },
        { type: 'coop-nav', tab: 'training', label: this.actLabel(lang, 'view') + ' Training' },
      ]);
    }

    // "Why was this worker recommended" / matching explainability
    if (hasAny(input, ['why', 'क्यों', 'का', 'recommend', 'सुझाव', 'शिफारस', 'match', 'मैच', 'मॅच', 'rank'])) {
      return this.t(lang, {
        en: `AI ranking weights: 30% verified skills + 20% distance + 15% verification + 15% fairness (workload) + 10% availability + 10% rating. Every recommendation on the Matching screen shows these factors, so you can audit and adjust — no black box.`,
        hi: `AI रैंकिंग भार: 30% सत्यापित कौशल + 20% दूरी + 15% सत्यापन + 15% निष्पक्षता (कार्यभार) + 10% उपलब्धता + 10% रेटिंग। Matching स्क्रीन पर हर सुझाव ये कारण दिखाता है।`,
        mr: `AI रँकिंग वजन: 30% प्रमाणित कौशल्ये + 20% अंतर + 15% पडताळणी + 15% न्याय्यता (कार्यभार) + 10% उपलब्धता + 10% रेटिंग. प्रत्येक शिफारस ही कारणे दाखवते.`,
      }, [{ type: 'coop-nav', tab: 'matching', label: this.actLabel(lang, 'view') + ' AI Matching' }]);
    }

    // Payments / payouts / month
    if (hasAny(input, ['payment', 'भुगतान', 'payout', 'पेआउट', 'पैसे', 'salary', 'वेतन', 'settle', 'सेटलमेंट', 'ग्रॉस', 'gross'])) {
      return this.t(lang, {
        en: `This demo period: gross ${this.inr(c.grossMonth)} split as worker payouts ${this.inr(c.workerPayoutsMonth)} (92%), welfare fund ${this.inr(c.welfareMonth)}. ${c.payoutPending} payouts are awaiting settlement in Payments & Payouts.`,
        hi: `इस डेमो अवधि में: सकल ${this.inr(c.grossMonth)} — कामगार भुगतान ${this.inr(c.workerPayoutsMonth)} (92%), कल्याण कोष ${this.inr(c.welfareMonth)}। ${c.payoutPending} भुगतान लंबित हैं।`,
        mr: `या डेमो कालावधीत: एकूण ${this.inr(c.grossMonth)} — कामगार पेमेंट ${this.inr(c.workerPayoutsMonth)} (92%), कल्याण निधी ${this.inr(c.welfareMonth)}. ${c.payoutPending} पेमेंट प्रलंबित आहेत.`,
      }, [{ type: 'coop-nav', tab: 'paymentsPayouts', label: this.actLabel(lang, 'view') + ' Payments' }]);
    }

    // Supply/skill gaps
    if (hasAny(input, ['skill gap', 'कौशल अंतर', 'कौशल्य तफावत', 'supply', 'आपूर्ति', 'पुरवठा', 'shortage', 'कमी', 'gap', 'अंतर'])) {
      const gaps = c.demandGaps.filter((g) => g.gap > 0).slice(0, 3);
      const list = gaps.map((g) => `${g.trade} (+${g.gap})`).join(', ');
      return this.t(lang, {
        en: `Live skill gaps: ${list || 'none right now'}. Close them via Training & Skills or recruit through the federation.`,
        hi: `लाइव कौशल अंतर: ${list || 'अभी कोई नहीं'}। Training & Skills या फेडरेशन से पूरा करें।`,
        mr: `लाइव्ह कौशल्य तफावत: ${list || 'सध्या काही नाही'}. Training & Skills किंवा महासंघातून भरा.`,
      }, [
        { type: 'coop-nav', tab: 'training', label: this.actLabel(lang, 'view') + ' Training' },
        { type: 'coop-nav', tab: 'demandForecast', label: this.actLabel(lang, 'view') + ' Demand' },
      ]);
    }

    // Emergency / dispatch
    if (hasAny(input, ['emergency', 'आपात', 'आणीबाणी', 'dispatch', 'डिस्पैच', 'डिस्पॅच', 'सायरन', 'siren', 'alert'])) {
      return this.t(lang, {
        en: `${c.activeEmergencies} emergency request(s) active; ${c.emergencyReady} members are emergency-ready. The command center routes the nearest verified member — open Emergency Dashboard to dispatch or escalate to the federation.`,
        hi: `${c.activeEmergencies} आपातकालीन अनुरोध सक्रिय; ${c.emergencyReady} सदस्य तैयार हैं। Emergency Dashboard से डिस्पैच करें।`,
        mr: `${c.activeEmergencies} आपत्कालीन विनंत्या सक्रिय; ${c.emergencyReady} सदस्य सज्ज आहेत. Emergency Dashboard मधून डिस्पॅच करा.`,
      }, [{ type: 'coop-nav', tab: 'emergency', label: this.actLabel(lang, 'emergency') }]);
    }

    // Training / upsKill
    if (hasAny(input, ['training', 'प्रशिक्षण', 'course', 'कोर्स', 'कौशल', 'skill', 'सीट', 'seat', 'learn'])) {
      return this.t(lang, {
        en: `Training & Skills lists open NCCT programs, skill-gap-driven plans and ${c.certExpiring} certifications expiring soon. Enrol members directly to close gaps before peaks.`,
        hi: `Training & Skills में खुले NCCT प्रोग्राम और कौशल-अंतर योजनाएं हैं। पीक से पहले सदस्यों को प्रशिक्षित करें।`,
        mr: `Training & Skills मध्ये खुले NCCT कार्यक्रम आणि कौशल्य-तफावत योजना आहेत. पीकपूर्वी सदस्यांना प्रशिक्षित करा.`,
      }, [{ type: 'coop-nav', tab: 'training', label: this.actLabel(lang, 'view') + ' Training' }]);
    }

    // Requests / open jobs
    if (hasAny(input, ['request', 'अनुरोध', 'विनंती', 'job', 'काम', 'नौकरी', 'नवीन', 'new', 'open'])) {
      return this.t(lang, {
        en: `${c.openRequests} service requests are open right now. Review and assign them from Service Requests — AI recommends the top verified member per request.`,
        hi: `अभी ${c.openRequests} सेवा अनुरोध खुले हैं। Service Requests से समीक्षा करें।`,
        mr: `सध्या ${c.openRequests} सेवा विनंत्या उघड्या आहेत. Service Requests मधून पडताळणी करा.`,
      }, [{ type: 'coop-nav', tab: 'requests', label: 'Service Requests' }]);
    }

    return null;
  }

  private inr(n: number): string {
    return `₹${n.toLocaleString('en-IN')}`;
  }

  /**
   * Role-aware guidance toward the matching portal tab. Text-only directions
   * (no invented data); actions reuse existing platform flows where they fit.
   */
  private roleGuidance(input: string, ctx: AIAssistantContext): AIAssistantReply | null {
    const lang = ctx.language;
    const role = ctx.role;
    if (!role || role === 'customer') return null;

    if (role === 'worker') {
      if (hasAny(input, ['availability', 'उपलब्धता', 'shift', 'schedule', 'रजा', 'leave'])) {
        return this.t(lang, {
          en: 'You can change availability in your Worker Portal under the Availability tab — working days, hours and service radius. It feeds AI matching right away.',
          hi: 'आप वर्कर पोर्टल में Availability टैब से उपलब्धता बदल सकते हैं — कार्य दिवस, घंटे और सेवा दायरा। यह तुरंत AI मैचिंग में जाता है।',
          mr: 'तुम्ही वर्कर पोर्टलमधील Availability टॅबमधून उपलब्धता बदलू शकता — कामाचे दिवस, वेळा आणि सेवा परिघ. ते लगेच AI मॅचिंगमध्ये जाते.',
        });
      }
      if (hasAny(input, ['earning', 'salary', 'पगार', 'कमाई', 'payment', 'पैसे', 'wage', 'मजुरी'])) {
        return this.t(lang, {
          en: 'Your Earnings tab shows today, weekly and monthly payouts with the 92% worker share. Members keep 92% of every fare plus welfare cover.',
          hi: 'आपके Earnings टैब में आज, साप्ताहिक और मासिक भुगतान 92% हिस्से के साथ दिखते हैं। सदस्य हर किराए का 92% रखते हैं।',
          mr: 'तुमच्या Earnings टॅबमध्ये आजचे, साप्ताहिक आणि मासिक पेमेंट 92% वाट्यासह दिसते. सदस्य प्रत्येक भाड्याच्या 92% रक्कम ठेवतात.',
        });
      }
      if (
        hasAny(input, ['job', 'work', 'काम', 'रोजगार', 'नौकरी', 'next job', 'nearby jobs']) &&
        !hasAny(input, ['become', 'register', 'join', 'बन'])
      ) {
        return this.t(lang, {
          en: 'Open the My Jobs tab and check Recommended — jobs are ranked for your trade, distance and availability. Accept one to add it to Upcoming.',
          hi: 'My Jobs टैब खोलें और Recommended देखें — काम आपके ट्रेड, दूरी और उपलब्धता के अनुसार क्रमबद्ध हैं। स्वीकार करके Upcoming में जोड़ें।',
          mr: 'My Jobs टॅब उघडा आणि Recommended पहा — कामे तुमच्या ट्रेड, अंतर आणि उपलब्धतेनुसार क्रमवारीत आहेत. स्वीकारून Upcoming मध्ये जोडा.',
        });
      }
      if (hasAny(input, ['demand', 'मांग', 'मागणी', 'busy time', 'peak hours', 'highest'])) {
        return this.t(lang, {
          en: 'Electrical demand in your area currently peaks between 4 PM and 8 PM (demo insight). Set evening hours in the Availability tab to catch more jobs.',
          hi: 'आपके क्षेत्र में बिजली की मांग शाम 4–8 बजे सबसे अधिक है (डेमो जानकारी)। अधिक काम के लिए Availability में शाम के घंटे चुनें।',
          mr: 'तुमच्या भागात वीज मागणी सध्या संध्याकाळी 4–8 या वेळेत जास्त आहे (डेमो माहिती). जास्त कामांसाठी Availability मध्ये संध्याकाळच्या वेळा निवडा.',
        });
      }
      if (hasAny(input, ['accept', 'स्वीकार', 'swikar', 'pick the best', 'which job'])) {
        return this.t(lang, {
          en: 'Accept the job with the highest AI match — it is ranked for your verified skills, distance from your service area and your availability. Every card shows why it matched you before you decide.',
          hi: 'सबसे अधिक AI मैच वाला काम स्वीकारें — यह आपके सत्यापित कौशल, सेवा दायरे की दूरी और उपलब्धता के अनुसार रैंक किया गया है। हर कार्ड पर मैच का कारण दिखता है।',
          mr: 'सर्वाधिक AI मॅच असलेले काम स्वीकारा — ते तुमच्या प्रमाणित कौशल्यांनुसार, सेवा परीघातील अंतर आणि उपलब्धतेनुसार क्रमांकित आहे. प्रत्येक कार्डवर मॅचचे कारण दिसते.',
        });
      }
      if (hasAny(input, ['invoice', 'इनवॉइस', 'इनव्हॉइस', 'bill', 'receipt'])) {
        return this.t(lang, {
          en: 'Every completed job creates a cooperative invoice under Earnings → Payment history. View or download it anytime — gross, 92% worker share and 8% welfare share are itemised.',
          hi: 'हर पूर्ण काम के लिए Earnings → Payment history में सहकारी इनवॉइस बनता है। कुल राशि, 92% कामगार हिस्सा और 8% कल्याण हिस्सा अलग-अलग दिखता है।',
          mr: 'प्रत्येक पूर्ण झालेल्या कामासाठी Earnings → Payment history मध्ये सहकारी इनव्हॉइस तयार होते. एकूण रक्कम, 92% कामगार वाटा आणि 8% कल्याण वाटा स्वतंत्र दिसतो.',
        });
      }
      if (hasAny(input, ['claim', 'दावा', 'दाव', 'insured', 'insuranc', 'विमा', 'बीमा'])) {
        return this.t(lang, {
          en: 'Your Welfare & Insurance tab lists accident and tool insurance, and you can file a claim there. Your cooperative welfare desk reviews every claim.',
          hi: 'आपके Welfare & Insurance टैब में दुर्घटना और टूल बीमा है, और वहां से दावा दायर कर सकते हैं। हर दावे की समीक्षा आपकी समिति करती है।',
          mr: 'तुमच्या Welfare & Insurance टॅबमध्ये अपघात आणि टूल विमा आहे, आणि तेथून दावा दाखल करू शकता. प्रत्येक दाव्याची तुमची संस्था पडताळणी करते.',
        });
      }
      return null;
    }

    if (role === 'cooperative') {
      if (hasAny(input, ['upload', 'bulk', 'अपलोड', 'csv', 'excel', 'import'])) {
        return this.t(lang, {
          en: 'Go to the Bulk Upload tab: download the CSV template, upload your file, review the validation summary, then import — Skill Passports are auto-created for valid rows.',
          hi: 'Bulk Upload टैब पर जाएं: CSV टेम्पलेट डाउनलोड करें, फ़ाइल अपलोड करें, जांच सारांश देखें, फिर इंपोर्ट करें — सही पंक्तियों के स्किल पासपोर्ट स्वतः बनते हैं।',
          mr: 'Bulk Upload टॅबवर जा: CSV टेम्पलेट डाउनलोड करा, फाइल अपलोड करा, तपासणी सारांश पहा, मग इंपोर्ट करा — बरोबर ओळींचे स्किल पासपोर्ट आपोआप तयार होतात.',
        });
      }
      if (hasAny(input, ['available', 'उपलब्ध', 'workforce', 'workers available', 'today'])) {
        return this.t(lang, {
          en: 'The Workers tab lists every member with live availability, workload and verification filters. I can also show them on the coverage map.',
          hi: 'Workers टैब में उपलब्धता, कार्यभार और सत्यापन फ़िल्टर के साथ सभी सदस्य हैं। मैं उन्हें कवरेज मानचित्र पर भी दिखा सकता हूं।',
          mr: 'Workers टॅबमध्ये उपलब्धता, कामाचा भार आणि पडताळणी फिल्टरसह सर्व सदस्य आहेत. मी त्यांना कव्हरेज नकाशावरही दाखवू शकतो.',
        }, [{ type: 'open-map', label: this.actLabel(lang, 'map') }]);
      }
      if (hasAny(input, ['demand', 'forecast', 'मांग', 'मागणी', 'insight', 'predict'])) {
        return this.t(lang, {
          en: 'The Demand tab shows trade demand to plan hiring, and full forecasting lives in the federation analytics view.',
          hi: 'Demand टैब भर्ती योजना के लिए ट्रेड मांग दिखाता है, और पूर्ण पूर्वानुमान फेडरेशन एनालिटिक्स में है।',
          mr: 'Demand टॅब भरती नियोजनासाठी ट्रेड मागणी दाखवतो आणि संपूर्ण अंदाज फेडरेशन अॅनालिटिक्समध्ये आहे.',
        }, [{ type: 'open-admin', label: this.actLabel(lang, 'view') }]);
      }
      return null;
    }

    if (role === 'federation') {
      if (hasAny(input, ['coverage', 'कवरेज', 'व्याप्ती', 'region', 'area', 'क्षेत्र'])) {
        return this.t(lang, {
          en: 'The Coverage tab lists every cluster with its trade strengths. I can also open the live map for a geographic view.',
          hi: 'Coverage टैब में हर क्लस्टर और उसकी ट्रेड ताकत है। भौगोलिक दृश्य के लिए मैं लाइव मानचित्र खोल सकता हूं।',
          mr: 'Coverage टॅबमध्ये प्रत्येक क्लस्टर आणि त्याची ट्रेड ताकद आहे. भौगोलिक दृश्यासाठी मी लाइव्ह नकाशा उघडू शकतो.',
        }, [{ type: 'open-map', label: this.actLabel(lang, 'map') }]);
      }
      if (hasAny(input, ['statistic', 'report', 'आंकड़े', 'आकडेवारी', 'number', 'total'])) {
        return this.t(lang, {
          en: 'The Overview tab aggregates members, verified workers and trade coverage, and Reports exports cooperatives and workers as CSV.',
          hi: 'Overview टैब में सदस्य, सत्यापित कामगार और ट्रेड कवरेज है, और Reports से CSV निर्यात होता है।',
          mr: 'Overview टॅबमध्ये सदस्य, प्रमाणित कामगार आणि ट्रेड व्याप्ती आहे आणि Reports मधून CSV निर्यात होते.',
        });
      }
      if (hasAny(input, ['demand', 'forecast', 'मांग', 'मागणी', 'trend'])) {
        return this.t(lang, {
          en: 'The Demand tab shows location and trade demand trends plus skill gaps, so federations can plan training and hiring.',
          hi: 'Demand टैब में स्थान व ट्रेड मांग के रुझान और कौशल अंतर हैं, ताकि प्रशिक्षण व भर्ती की योजना बने।',
          mr: 'Demand टॅबमध्ये स्थान व ट्रेड मागणीचे कल आणि कौशल्य तफावत आहे, जेणेकरून प्रशिक्षण व भरतीचे नियोजन होईल.',
        }, [{ type: 'open-admin', label: this.actLabel(lang, 'view') }]);
      }
      return null;
    }

    return null;
  }

  private actLabel(lang: AILanguage, key: 'map' | 'register' | 'workers' | 'emergency' | 'view'): string {
    const labels: Record<string, Record<AILanguage, string>> = {
      map: { en: 'Open live map', hi: 'लाइव मानचित्र खोलें', mr: 'लाइव्ह नकाशा उघडा' },
      register: { en: 'Register as worker', hi: 'कामगार पंजीकरण', mr: 'कामगार नोंदणी' },
      workers: { en: 'View workers', hi: 'कामगार देखें', mr: 'कामगार पहा' },
      emergency: { en: 'Start emergency dispatch', hi: 'आपातकालीन डिस्पैच', mr: 'आपत्कालीन डिस्पॅच' },
      view: { en: 'View', hi: 'देखें', mr: 'पहा' },
    };
    return labels[key][lang];
  }

  private serviceActions(lang: AILanguage, slug: string, name: string): AIPlatformAction[] {
    const view = this.actLabel(lang, 'view');
    return [
      { type: 'select-service', slug, label: `${view} ${name}` },
      { type: 'book-worker', slug, label: lang === 'en' ? `Book ${name} now` : lang === 'hi' ? `${name} अभी बुक करें` : `${name} आत्ताच बुक करा` },
      { type: 'open-map', label: this.actLabel(lang, 'map') },
    ];
  }
}

/** Swap this singleton for a live backend later — no UI changes needed. */
export const rozgarAI: AIAssistantProvider = new DemoRozgarAIBackend();

/* ---------------- Page-aware context (subtle, same panel everywhere) ---------------- */

export type AIPageContext =
  | 'booking'
  | 'map'
  | 'emergency'
  | 'service'
  | 'register'
  | 'worker-dashboard'
  | 'worker-jobs'
  | 'worker-passport'
  | 'worker-ratings'
  | 'worker-availability'
  | 'worker-earnings'
  | 'worker-welfare'
  | 'worker-coop'
  | 'worker-profile'
  | 'coop-dashboard'
  | 'coop-requests'
  | 'coop-workers'
  | 'coop-verification'
  | 'coop-passports'
  | 'coop-availability'
  | 'coop-matching'
  | 'coop-jobs'
  | 'coop-coverage'
  | 'coop-demand'
  | 'coop-payments'
  | 'coop-welfare'
  | 'coop-ratings'
  | 'coop-emergency'
  | 'coop-reports'
  | 'coop-federation'
  | 'coop-training'
  | 'coop-notifications'
  | 'coop-settings';

/** Subtle contextual prompt shown in the panel based on where it was opened. */
export const AI_CONTEXT_HINTS: Record<AIPageContext, Record<AILanguage, string>> = {
  booking: {
    en: 'Need help with your booking?',
    hi: 'अपनी बुकिंग में मदद चाहिए?',
    mr: 'तुमच्या बुकिंगसाठी मदत हवी आहे का?',
  },
  map: {
    en: 'Looking for workers near a location?',
    hi: 'किसी स्थान के पास कामगार खोज रहे हैं?',
    mr: 'एखाद्या ठिकाणाजवळ कामगार शोधत आहात का?',
  },
  emergency: {
    en: 'Need urgent help? I can start priority dispatch.',
    hi: 'तत्काल मदद चाहिए? मैं प्राथमिकता डिस्पैच शुरू कर सकता हूं।',
    mr: 'तातडीची मदत हवी आहे का? मी प्राधान्य डिस्पॅच सुरू करू शकतो.',
  },
  service: {
    en: 'Need help choosing a service?',
    hi: 'सेवा चुनने में मदद चाहिए?',
    mr: 'सेवा निवडायला मदत हवी आहे का?',
  },
  register: {
    en: 'Want to know more about becoming a worker?',
    hi: 'कामगार बनने के बारे में और जानना चाहते हैं?',
    mr: 'कामगार होण्याबद्दल अधिक जाणून घ्यायचे आहे का?',
  },
  'worker-dashboard': {
    en: 'How is your work, earnings and cooperative activity today?',
    hi: 'आज आपका काम, कमाई और सहकारी गतिविधि कैसी है?',
    mr: 'आज तुमचे काम, कमाई आणि सहकारी कार्य कसे आहे?',
  },
  'worker-jobs': {
    en: 'Which job should you accept today?',
    hi: 'आज आपको कौन सा काम स्वीकारना चाहिए?',
    mr: 'आज तुम्ही कोणते काम स्वीकारावे?',
  },
  'worker-passport': {
    en: 'Ask about your certifications, skills or verification.',
    hi: 'अपने प्रमाणपत्र, कौशल या सत्यापन के बारे में पूछें।',
    mr: 'तुमची प्रमाणपत्रे, कौशल्ये किंवा पडताळणी विचारा.',
  },
  'worker-ratings': {
    en: 'Ask what customers are saying about your work.',
    hi: 'पूछें कि ग्राहक आपके काम के बारे में क्या कह रहे हैं।',
    mr: 'ग्राहक तुमच्या कामाबद्दल काय म्हणत आहेत ते विचारा.',
  },
  'worker-availability': {
    en: 'Update availability anytime — it feeds AI matching right away.',
    hi: 'उपलब्धता कभी भी बदलें — यह तुरंत AI मैचिंग में जाती है।',
    mr: 'उपलब्धता कधीही बदला — ती लगेच AI मॅचिंगमध्ये जाते.',
  },
  'worker-earnings': {
    en: 'Ask when your payment arrives or check any invoice.',
    hi: 'पूछें कि भुगतान कब आएगा या कोई इनवॉइस देखें।',
    mr: 'पेमेंट कधी येईल किंवा कोणतेही इनव्हॉइस पहा.',
  },
  'worker-welfare': {
    en: 'Ask about your insurance cover or how to file a claim.',
    hi: 'अपने बीमा कवर या दावा दायर करने के तरीके के बारे में पूछें।',
    mr: 'तुमच्या विमा संरक्षणाबद्दल किंवा दावा कसा दाखल करायचा ते विचारा.',
  },
  'worker-coop': {
    en: 'Reach your cooperative desk, training or announcements.',
    hi: 'अपनी समिति, प्रशिक्षण या सूचनाओं तक पहुंचें।',
    mr: 'तुमची संस्था, प्रशिक्षण किंवा सूचना मिळवा.',
  },
  'worker-profile': {
    en: 'Update your details, skills and preferences.',
    hi: 'अपने विवरण, कौशल और प्राथमिकताएं अपडेट करें।',
    mr: 'तुमची माहिती, कौशल्ये आणि प्राधान्ये अपडेट करा.',
  },
  'coop-dashboard': {
    en: 'Ask about today’s operations, demand or workforce?',
    hi: 'आज के संचालन, मांग या कार्यबल के बारे में पूछें?',
    mr: 'आजच्या कार्यवाही, मागणी किंवा कामगारविषयी विचारा?',
  },
  'coop-requests': {
    en: 'Which open request should you assign first?',
    hi: 'कौन सा अनुरोध पहले आवंटित करें?',
    mr: 'कोणती विनंती आधी नियुक्त कराल?',
  },
  'coop-workers': {
    en: 'Who is available and verified right now?',
    hi: 'अभी कौन उपलब्ध और सत्यापित है?',
    mr: 'सध्या कोण उपलब्ध आणि प्रमाणित आहे?',
  },
  'coop-verification': {
    en: 'How many verifications are pending?',
    hi: 'कितने सत्यापन लंबित हैं?',
    mr: 'किती पडताळणी प्रलंबित आहेत?',
  },
  'coop-passports': {
    en: 'Check certification renewals or passport status.',
    hi: 'प्रमाणपत्र नवीनीकरण या पासपोर्ट स्थिति देखें।',
    mr: 'प्रमाणपत्र नूतनीकरण किंवा पासपोर्ट स्थिती पहा.',
  },
  'coop-availability': {
    en: 'Which shift or trade needs coverage?',
    hi: 'किस शिफ्ट या ट्रेड में कवरेज चाहिए?',
    mr: 'कोणत्या शिफ्ट किंवा ट्रेडला व्याप्ती हवी आहे?',
  },
  'coop-matching': {
    en: 'Ask why a worker was recommended.',
    hi: 'पूछें कि किसी कामगार की सिफारिश क्यों हुई।',
    mr: 'कामगाराची शिफारस का झाली ते विचारा.',
  },
  'coop-jobs': {
    en: 'Which jobs or bookings need action?',
    hi: 'कौन से काम या बुकिंग पर कार्रवाई चाहिए?',
    mr: 'कोणती कामे किंवा बुकिंग कारवाई मागते?',
  },
  'coop-coverage': {
    en: 'Check coverage or live emergency pins.',
    hi: 'कवरेज या लाइव आपात पिन देखें।',
    mr: 'व्याप्ती किंवा लाइव्ह आपत्कालीन पिन पहा.',
  },
  'coop-demand': {
    en: 'Ask for demand forecasts or skill gaps.',
    hi: 'मांग पूर्वानुमान या कौशल अंतर पूछें।',
    mr: 'मागणी अंदाज किंवा कौशल्य तफावत विचारा.',
  },
  'coop-payments': {
    en: 'Ask about payouts, splits or pending settlement.',
    hi: 'भुगतान, हिस्सेदारी या लंबित सेटलमेंट पूछें।',
    mr: 'पेमेंट, वाटप किंवा प्रलंबित सेटलमेंट विचारा.',
  },
  'coop-welfare': {
    en: 'Ask about welfare fund, claims or insurance.',
    hi: 'कल्याण कोष, दावे या बीमा के बारे में पूछें।',
    mr: 'कल्याण निधी, दावे किंवा विम्याबद्दल विचारा.',
  },
  'coop-ratings': {
    en: 'Ask about complaints or customer feedback.',
    hi: 'शिकायतों या ग्राहक फीडबैक के बारे में पूछें।',
    mr: 'तक्रारी किंवा ग्राहक अभिप्रायाबद्दल विचारा.',
  },
  'coop-emergency': {
    en: 'Start dispatch or escalate an emergency.',
    hi: 'डिस्पैच शुरू करें या आपात बढ़ाएं।',
    mr: 'डिस्पॅच सुरू करा किंवा आणीबाणी वाढवा.',
  },
  'coop-reports': {
    en: 'Ask about utilization, revenue or reconciliation.',
    hi: 'उपयोग, राजस्व या समाधान के बारे में पूछें।',
    mr: 'वापर, महसूल किंवा पुनर्संयोजनाबद्दल विचारा.',
  },
  'coop-federation': {
    en: 'Ask about sister societies or pooled welfare.',
    hi: 'सहयोगी समितियों या कल्याण कोष के बारे में पूछें।',
    mr: 'सहकारी संस्था किंवा पूल केलेल्या कल्याणाबद्दल विचारा.',
  },
  'coop-training': {
    en: 'Ask about programs, seats or renewals.',
    hi: 'प्रोग्राम, सीटें या नवीनीकरण पूछें।',
    mr: 'कार्यक्रम, जागा किंवा नूतनीकरण विचारा.',
  },
  'coop-notifications': {
    en: 'Ask what needs your attention first.',
    hi: 'पूछें कि पहले किस पर ध्यान देना है।',
    mr: 'आधी कशाकडे लक्ष द्यावे ते विचारा.',
  },
  'coop-settings': {
    en: 'Ask about matching weights or portal language.',
    hi: 'मैचिंग भार या पोर्टल भाषा के बारे में पूछें।',
    mr: 'मॅचिंग वजन किंवा पोर्टल भाषेबद्दल विचारा.',
  },
};

/* ------------------ Worker-portal context-aware suggestions ---------------- */

interface ContextSuggestions {
  labels: Record<AILanguage, string[]>;
  queries: Record<AILanguage, string[]>;
}

/** Tab-tuned assistant chips shown when a worker opens AI from a specific screen. */
export const WORKER_CONTEXT_SUGGESTIONS: Record<string, ContextSuggestions> = {
  'worker-jobs': {
    labels: {
      en: ['Which job should I accept?', 'Recommended jobs', 'Why was this job matched?', 'When will I be paid?'],
      hi: ['कौन सा काम स्वीकारूं?', 'अनुशंसित काम', 'यह काम क्यों मैच हुआ?', 'मुझे कब भुगतान मिलेगा?'],
      mr: ['कोणते काम स्वीकारू?', 'शिफारस कामे', 'हे काम का मॅच झाले?', 'मला कधी पेमेंट मिळेल?'],
    },
    queries: {
      en: ['Which job should I accept?', 'Show me available jobs', 'Why was this job recommended?', 'When will my payment arrive?'],
      hi: ['कौन सा काम स्वीकारूं?', 'मुझे उपलब्ध काम दिखाएं', 'यह काम मेरे लिए क्यों सुझाया गया?', 'मेरा भुगतान कब आएगा?'],
      mr: ['कोणते काम स्वीकारू?', 'मला उपलब्ध कामे दाखवा', 'हे काम माझ्यासाठी का सुचवले?', 'माझे पेमेंट कधी येईल?'],
    },
  },
  'worker-passport': {
    labels: {
      en: ['My certifications', 'Explain Skill Passport', 'Verification status', 'How do I update skills?'],
      hi: ['मेरे प्रमाणपत्र', 'स्किल पासपोर्ट समझाएं', 'सत्यापन स्थिति', 'कौशल कैसे अपडेट करूं?'],
      mr: ['माझी प्रमाणपत्रे', 'स्किल पासपोर्ट समजावा', 'पडताळणी स्थिती', 'कौशल्ये कशी अपडेट करू?'],
    },
    queries: {
      en: ['What certifications do I have?', 'Explain my Digital Skill Passport', 'What is my verification status?', 'Update my skills'],
      hi: ['मेरे पास कौन से प्रमाणपत्र हैं?', 'मेरा डिजिटल स्किल पासपोर्ट समझाएं', 'मेरी सत्यापन स्थिति क्या है?', 'मेरे कौशल अपडेट करें'],
      mr: ['माझ्याकडे कोणती प्रमाणपत्रे आहेत?', 'माझा डिजिटल स्किल पासपोर्ट समजावा', 'माझी पडताळणी स्थिती काय आहे?', 'माझी कौशल्ये अपडेट करा'],
    },
  },
  'worker-availability': {
    labels: {
      en: ['When is demand highest?', 'Update availability', 'Best working hours', 'Show me open jobs'],
      hi: ['मांग सबसे अधिक कब है?', 'उपलब्धता बदलें', 'सर्वोत्तम समय', 'खुले काम दिखाएं'],
      mr: ['मागणी सर्वाधिक कधी असते?', 'उपलब्धता बदला', 'उत्तम वेळा', 'उपलब्ध कामे दाखवा'],
    },
    queries: {
      en: ['When is demand highest near me?', 'How do I update my availability?', 'What are the best working hours?', 'Show me available jobs'],
      hi: ['मेरे पास मांग सबसे अधिक कब है?', 'मैं उपलब्धता कैसे बदलूं?', 'सबसे अच्छे काम के घंटे कौन से हैं?', 'मुझे उपलब्ध काम दिखाएं'],
      mr: ['माझ्या जवळ मागणी सर्वाधिक कधी असते?', 'मी उपलब्धता कशी बदलू?', 'सर्वोत्तम कामाच्या वेळा कोणत्या?', 'मला उपलब्ध कामे दाखवा'],
    },
  },
  'worker-earnings': {
    labels: {
      en: ['When does my payment arrive?', 'My earnings this month', 'View my invoice', 'What is my 92% share?'],
      hi: ['मेरा भुगतान कब आएगा?', 'इस महीने की कमाई', 'मेरा इनवॉइस देखें', 'मेरा 92% हिस्सा क्या है?'],
      mr: ['माझे पेमेंट कधी येईल?', 'या महिन्याची कमाई', 'माझे इनव्हॉइस पहा', 'माझा 92% वाटा काय आहे?'],
    },
    queries: {
      en: ['When will my payment arrive?', 'How much did I earn this month?', 'Show my invoice', 'Explain the 92% worker share'],
      hi: ['मेरा भुगतान कब आएगा?', 'इस महीने मेरी कमाई कितनी है?', 'मेरा इनवॉइस दिखाएं', '92% हिस्सा समझाएं'],
      mr: ['माझे पेमेंट कधी येईल?', 'या महिन्यात माझी कमाई किती?', 'माझे इनव्हॉइस दाखवा', '92% वाटा समजावा'],
    },
  },
  'worker-welfare': {
    labels: {
      en: ['My insurance benefits', 'How do I file a claim?', 'Welfare fund', 'Emergency support'],
      hi: ['मेरे बीमा लाभ', 'दावा कैसे दायर करूं?', 'कल्याण कोष', 'आपातकालीन सहायता'],
      mr: ['माझे विमा लाभ', 'दावा कसा दाखल करू?', 'कल्याण निधी', 'आपत्कालीन मदत'],
    },
    queries: {
      en: ['What insurance benefits do I have?', 'How do I file a welfare claim?', 'What is my welfare fund?', 'How do I get emergency support?'],
      hi: ['मुझे कौन से बीमा लाभ हैं?', 'कल्याण दावा कैसे दायर करूं?', 'मेरा कल्याण कोष क्या है?', 'आपातकालीन सहायता कैसे मिलेगी?'],
      mr: ['मला कोणते विमा लाभ आहेत?', 'कल्याण दावा कसा दाखल करू?', 'माझा कल्याण निधी काय आहे?', 'आपत्कालीन मदत कशी मिळेल?'],
    },
  },
  'worker-coop': {
    labels: {
      en: ['My cooperative contact', 'Available training', 'Announcements', 'Welfare desk'],
      hi: ['मेरी समिति संपर्क', 'उपलब्ध प्रशिक्षण', 'सूचनाएं', 'कल्याण डेस्क'],
      mr: ['माझी संस्था संपर्क', 'उपलब्ध प्रशिक्षण', 'सूचना', 'कल्याण डेस्क'],
    },
    queries: {
      en: ['How do I contact my cooperative?', 'What training is available?', 'Show cooperative announcements', 'Where is the welfare desk?'],
      hi: ['मैं अपनी समिति से कैसे संपर्क करूं?', 'कौन सा प्रशिक्षण उपलब्ध है?', 'समिति की सूचनाएं दिखाएं', 'कल्याण डेस्क कहां है?'],
      mr: ['मी माझ्या संस्थेशी कसे संपर्क करू?', 'कोणते प्रशिक्षण उपलब्ध आहे?', 'संस्थेच्या सूचना दाखवा', 'कल्याण डेस्क कुठे आहे?'],
    },
  },
};

/* ------------------ Cooperative-portal context-aware suggestions ---------------- */

/** Tab-tuned assistant chips shown when a cooperative admin opens AI inside a screen. */
export const COOP_CONTEXT_SUGGESTIONS: Record<string, ContextSuggestions> = {
  'coop-requests': {
    labels: {
      en: ['Open requests to assign', 'How does AI recommend?', 'Urgent requests', 'Available members today'],
      hi: ['आवंटन हेतु खुले अनुरोध', 'AI कैसे अनुशंसा करता है?', 'जरूरी अनुरोध', 'आज उपलब्ध सदस्य'],
      mr: ['नियुक्तीसाठी उघड्या विनंत्या', 'AI शिफारस कशी करते?', 'तातडीच्या विनंत्या', 'आज उपलब्ध सदस्य'],
    },
    queries: {
      en: ['Which requests are open?', 'How does the AI rank workers?', 'Show urgent requests', 'How many members are available today?'],
      hi: ['कौन से अनुरोध खुले हैं?', 'AI कामगारों को कैसे रैंक करता है?', 'जरूरी अनुरोध दिखाएं', 'आज कितने सदस्य उपलब्ध हैं?'],
      mr: ['कोणत्या विनंत्या उघड्या आहेत?', 'AI कामगारांना कसे क्रमांक देते?', 'तातडीच्या विनंत्या दाखवा', 'आज किती सदस्य उपलब्ध आहेत?'],
    },
  },
  'coop-matching': {
    labels: {
      en: ['Why was this worker recommended?', 'Overloaded members', 'Fair allocation', 'Open jobs to match'],
      hi: ['यह कामगार क्यों सुझाया गया?', 'ओवरलोड सदस्य', 'निष्पक्ष आवंटन', 'मिलान हेतु खुले काम'],
      mr: ['हा कामगार का सुचवला?', 'ओव्हरलोड सदस्य', 'न्याय्य वाटप', 'जुळणीसाठी उघडी कामे'],
    },
    queries: {
      en: ['Why was this worker recommended?', 'Who is overloaded right now?', 'How does fair allocation work?', 'Which jobs need a match?'],
      hi: ['इस कामगार की सिफारिश क्यों हुई?', 'अभी कौन ओवरलोड है?', 'निष्पक्ष आवंटन कैसे काम करता है?', 'किन कामों के लिए मिलान चाहिए?'],
      mr: ['या कामगाराची शिफारस का झाली?', 'सध्या कोण ओव्हरलोड आहे?', 'न्याय्य वाटप कसे काम करते?', 'कोणत्या कामांना जुळणी हवी आहे?'],
    },
  },
  'coop-demand': {
    labels: {
      en: ['Demand gaps', 'Area hotspots', 'Demand vs capacity', 'Skill gaps'],
      hi: ['मांग अंतर', 'क्षेत्र हॉटस्पॉट', 'मांग बनाम क्षमता', 'कौशल अंतर'],
      mr: ['मागणी तफावत', 'क्षेत्र हॉटस्पॉट', 'मागणी विरुद्ध क्षमता', 'कौशल्य तफावत'],
    },
    queries: {
      en: ['Which trades have demand gaps?', 'Which areas are hotspots?', 'Show demand vs capacity', 'What are the skill gaps?'],
      hi: ['किस ट्रेड में मांग अंतर है?', 'कौन से क्षेत्र हॉटस्पॉट हैं?', 'मांग बनाम क्षमता दिखाएं', 'कौशल अंतर क्या हैं?'],
      mr: ['कोणत्या ट्रेडला मागणी तफावत आहे?', 'कोणते भाग हॉटस्पॉट आहेत?', 'मागणी विरुद्ध क्षमता दाखवा', 'कौशल्य तफावत काय आहे?'],
    },
  },
  'coop-payments': {
    labels: {
      en: ['Pending payouts', '92% worker share', 'Monthly gross', 'Welfare fund'],
      hi: ['लंबित भुगतान', '92% कामगार हिस्सा', 'मासिक सकल', 'कल्याण कोष'],
      mr: ['प्रलंबित पेमेंट', '92% कामगार वाटा', 'मासिक एकूण', 'कल्याण निधी'],
    },
    queries: {
      en: ['How many payouts are pending?', 'Explain the 92% worker share', 'What is the monthly gross?', 'How much is in the welfare fund?'],
      hi: ['कितने भुगतान लंबित हैं?', '92% हिस्सा समझाएं', 'मासिक सकल क्या है?', 'कल्याण कोष में कितना है?'],
      mr: ['किती पेमेंट प्रलंबित आहेत?', '92% वाटा समजावा', 'मासिक एकूण किती?', 'कल्याण निधीत किती आहे?'],
    },
  },
  'coop-welfare': {
    labels: {
      en: ['Active policies', 'Claims under review', 'Insurance expiring', 'Welfare fund'],
      hi: ['सक्रिय पॉलिसियां', 'समीक्षा में दावे', 'समाप्त होते बीमा', 'कल्याण कोष'],
      mr: ['सक्रिय पॉलिसी', 'पडताळणीतील दावे', 'संपणारा विमा', 'कल्याण निधी'],
    },
    queries: {
      en: ['How many policies are active?', 'Show claims under review', 'How many policies expire soon?', 'What is in the welfare fund?'],
      hi: ['कितनी पॉलिसियां सक्रिय हैं?', 'समीक्षा में दावे दिखाएं', 'कितनी पॉलिसियां जल्द समाप्त होंगी?', 'कल्याण कोष में क्या है?'],
      mr: ['किती पॉलिसी सक्रिय आहेत?', 'पडताळणीतील दावे दाखवा', 'किती पॉलिसी लवकर संपणार आहेत?', 'कल्याण निधीत काय आहे?'],
    },
  },
  'coop-emergency': {
    labels: {
      en: ['Active emergencies', 'Nearest members', 'Escalate', 'Emergency-ready members'],
      hi: ['सक्रिय आपात', 'निकटतम सदस्य', 'बढ़ाएं (एस्कलेट)', 'आपात-तैयार सदस्य'],
      mr: ['सक्रिय आणीबाणी', 'जवळचे सदस्य', 'वाढवा', 'आपत्कालीन-सज्ज सदस्य'],
    },
    queries: {
      en: ['How many emergencies are active?', 'Who is nearest to each emergency?', 'How do I escalate to the federation?', 'How many members are emergency-ready?'],
      hi: ['कितनी आपात सक्रिय हैं?', 'हर आपात के सबसे निकट कौन है?', 'फेडरेशन तक कैसे बढ़ाऊं?', 'कितने सदस्य आपात-तैयार हैं?'],
      mr: ['किती आणीबाणी सक्रिय आहेत?', 'प्रत्येक आणीबाणीला सर्वात जवळ कोण?', 'महासंघापर्यंत कसे वाढवू?', 'किती सदस्य आपत्कालीन-सज्ज आहेत?'],
    },
  },
  'coop-reports': {
    labels: {
      en: ['Utilization trend', 'Revenue this period', 'Reconciliation', 'Job completion'],
      hi: ['उपयोग प्रवृत्ति', 'इस अवधि का राजस्व', 'समाधान', 'काम पूर्णता'],
      mr: ['वापर कल', 'या कालावधीचा महसूल', 'पुनर्संयोजन', 'काम पूर्णता'],
    },
    queries: {
      en: ['What is fleet utilization?', 'Show revenue this period', 'How do reports reconcile?', 'What is the completion rate?'],
      hi: ['फ्लीट उपयोग क्या है?', 'इस अवधि का राजस्व दिखाएं', 'रिपोर्ट कैसे मेल खाती हैं?', 'पूर्णता दर क्या है?'],
      mr: ['फ्लीट वापर काय आहे?', 'या कालावधीचा महसूल दाखवा', 'अहवाल कसे पुनर्संयोजित होतात?', 'पूर्णता दर किती?'],
    },
  },
  'coop-training': {
    labels: {
      en: ['Open programs', 'Skill-gap plan', 'Certs expiring', 'Enrol members'],
      hi: ['खुले प्रोग्राम', 'कौशल-अंतर योजना', 'समाप्त होते प्रमाणपत्र', 'सदस्य दाखल करें'],
      mr: ['उघडे कार्यक्रम', 'कौशल्य-तफावत योजना', 'संपणारी प्रमाणपत्रे', 'सदस्य नोंदवा'],
    },
    queries: {
      en: ['Which programs are open?', 'Show the skill-gap plan', 'How many certs expire soon?', 'How do I enrol members?'],
      hi: ['कौन से प्रोग्राम खुले हैं?', 'कौशल-अंतर योजना दिखाएं', 'कितने प्रमाणपत्र जल्द समाप्त होंगे?', 'सदस्य कैसे दाखल करूं?'],
      mr: ['कोणते कार्यक्रम उघडे आहेत?', 'कौशल्य-तफावत योजना दाखवा', 'किती प्रमाणपत्रे लवकर संपतील?', 'सदस्य कसे नोंदवू?'],
    },
  },
  'coop-notifications': {
    labels: {
      en: ['Unread alerts', 'Emergencies', 'AI insights', 'Payout batch'],
      hi: ['अनपढ़ सूचनाएं', 'आपात', 'AI अंतर्दृष्टि', 'भुगतान बैच'],
      mr: ['न वाचलेल्या सूचना', 'आणीबाणी', 'AI अंतर्दृष्टी', 'पेमेंट बॅच'],
    },
    queries: {
      en: ['Show unread alerts', 'Show emergency notifications', 'Show AI insights', 'Payout batch status'],
      hi: ['अनपढ़ सूचनाएं दिखाएं', 'आपात सूचनाएं दिखाएं', 'AI अंतर्दृष्टि दिखाएं', 'भुगतान बैच स्थिति'],
      mr: ['न वाचलेल्या सूचना दाखवा', 'आणीबाणी सूचना दाखवा', 'AI अंतर्दृष्टी दाखवा', 'पेमेंट बॅच स्थिती'],
    },
  },
};

/** Floating-button hover tooltip. */
export const AI_FAB_TOOLTIP: Record<AILanguage, string> = {
  en: 'Speak or chat with Rozgar AI',
  hi: 'Rozgar AI से बोलें या चैट करें',
  mr: 'Rozgar AI शी बोला किंवा चॅट करा',
};
