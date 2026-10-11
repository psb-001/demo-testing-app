import type { Lang } from '../../i18n';

/**
 * Federation Portal copy dictionary (English / हिन्दी / मराठी).
 * Navigation, major screen headings and actions are localized. Detailed
 * operational copy remains English in this SIH prototype while staying behind
 * a dictionary that can be expanded without restructuring components.
 */
const DICT: Record<string, Record<Lang, string>> = {
  grp_governance: { en: 'Federation Governance', hi: 'महासंघ शासन', mr: 'महासंघ प्रशासन' },
  grp_intelligence: { en: 'Workforce Intelligence', hi: 'कार्यबल बुद्धिमत्ता', mr: 'कामगार बुद्धिमत्ता' },
  grp_protection: { en: 'Finance, Care & Skills', hi: 'वित्त, कल्याण एवं कौशल', mr: 'वित्त, कल्याण व कौशल्ये' },
  grp_governance_support: { en: 'Trust & Administration', hi: 'विश्वास एवं प्रशासन', mr: 'विश्वास व प्रशासन' },

  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  societies: { en: 'Federation Network', hi: 'महासंघ नेटवर्क', mr: 'महासंघ नेटवर्क' },
  workforce: { en: 'Workers', hi: 'कार्यबल', mr: 'कामगार' },
  jobs: { en: 'Jobs & Operations', hi: 'काम एवं संचालन', mr: 'कामे व कार्यव्यवस्था' },
  allocation: { en: 'AI Workforce', hi: 'AI कार्यबल', mr: 'AI कामगार' },
  forecast: { en: 'Demand Forecast', hi: 'मांग पूर्वानुमान', mr: 'मागणी अंदाज' },
  fedMap: { en: 'Workforce Map', hi: 'कार्यबल मानचित्र', mr: 'कामगार नकाशा' },
  emergency: { en: 'Emergency Operations', hi: 'आपातकालीन संचालन', mr: 'आणीबाणी कार्यव्यवस्था' },
  payments: { en: 'Payments', hi: 'भुगतान', mr: 'पेमेंट' },
  welfare: { en: 'Welfare & Insurance', hi: 'कल्याण एवं बीमा', mr: 'कल्याण व विमा' },
  training: { en: 'Training & Skills', hi: 'प्रशिक्षण एवं कौशल', mr: 'प्रशिक्षण व कौशल्ये' },
  verification: { en: 'Verification', hi: 'सत्यापन', mr: 'पडताळणी' },
  reports: { en: 'Reports & Governance', hi: 'रिपोर्ट एवं शासन', mr: 'अहवाल व प्रशासन' },
  notifications: { en: 'Notifications', hi: 'सूचनाएं', mr: 'सूचना' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', mr: 'सेटिंग्ज' },

  title_dashboard: { en: 'Federation Workforce & Service Command Centre', hi: 'महासंघ कार्यबल एवं सेवा कमांड सेंटर', mr: 'महासंघ कामगार व सेवा कमांड सेंटर' },
  title_societies: { en: 'Federation Network', hi: 'महासंघ नेटवर्क', mr: 'महासंघ नेटवर्क' },
  title_workforce: { en: 'Federation Workforce Management', hi: 'महासंघ कार्यबल प्रबंधन', mr: 'महासंघ कामगार व्यवस्थापन' },
  title_jobs: { en: 'Jobs & Operations', hi: 'काम एवं संचालन', mr: 'कामे व कार्यव्यवस्था' },
  title_allocation: { en: 'AI Workforce Allocation', hi: 'AI कार्यबल आवंटन', mr: 'AI कामगार वाटप' },
  title_forecast: { en: 'Demand Forecast', hi: 'मांग पूर्वानुमान', mr: 'मागणी अंदाज' },
  title_map: { en: 'Workforce Map', hi: 'कार्यबल मानचित्र', mr: 'कामगार नकाशा' },
  title_emergency: { en: 'Emergency Service Demand', hi: 'आपातकालीन सेवा मांग', mr: 'आणीबाणी सेवा मागणी' },
  title_payments: { en: 'Cooperative Payments & Settlements', hi: 'सहकारी भुगतान एवं निपटान', mr: 'सहकारी पेमेंट व सेटलमेंट' },
  title_welfare: { en: 'Worker Welfare & Protection', hi: 'कार्यबल कल्याण एवं सुरक्षा', mr: 'कामगार कल्याण व संरक्षण' },
  title_training: { en: 'Training & Skills', hi: 'प्रशिक्षण एवं कौशल', mr: 'प्रशिक्षण व कौशल्ये' },
  title_reports: { en: 'Reports & Governance', hi: 'रिपोर्ट एवं शासन', mr: 'अहवाल व प्रशासन' },
  title_verification: { en: 'Worker Verification', hi: 'कार्यबल सत्यापन', mr: 'कामगार पडताळणी' },

  view: { en: 'View', hi: 'देखें', mr: 'पहा' },
  open: { en: 'Open', hi: 'खोलें', mr: 'उघडा' },
  back: { en: 'Back', hi: 'वापस', mr: 'मागे' },
  search: { en: 'Search', hi: 'खोजें', mr: 'शोधा' },
  all: { en: 'All', hi: 'सभी', mr: 'सर्व' },
  active: { en: 'Active', hi: 'सक्रिय', mr: 'सक्रिय' },
  available: { en: 'Available', hi: 'उपलब्ध', mr: 'उपलब्ध' },
  workers: { en: 'Workers', hi: 'कार्यबल', mr: 'कामगार' },
  society: { en: 'Society', hi: 'समिति', mr: 'संस्था' },
  location: { en: 'Location', hi: 'स्थान', mr: 'ठिकाण' },
  status: { en: 'Status', hi: 'स्थिति', mr: 'स्थिती' },
  demoTag: { en: 'Demo Data', hi: 'डेमो डेटा', mr: 'डेमो डेटा' },
  prototypeForecast: { en: 'Prototype Forecast', hi: 'प्रोटोटाइप पूर्वानुमान', mr: 'प्रोटोटाइप अंदाज' },
};

export const fedT = (key: string, lang: Lang): string => DICT[key]?.[lang] || DICT[key]?.en || key;
