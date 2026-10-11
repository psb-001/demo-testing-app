import type { SupportedLanguage } from '../types';

/**
 * Location-flow copy, kept in one dictionary so no location string is
 * hardcoded at a call site and the whole flow can be translated.
 *
 * Languages follow the existing portal architecture: English, Hindi and
 * Marathi are translated; the remaining supported languages fall back to
 * English until translations are added (same policy as portalUI).
 */
export type LocationLang = 'en' | 'hi' | 'mr';

const EN = {
  // Selector
  selectorTitle: 'Where do you need the service?',
  selectorSubtitle: 'Choose how you want to provide your service location.',
  optionGpsTitle: 'Use my current location',
  optionGpsDesc: 'Automatically detect your location using GPS.',
  optionManualTitle: 'Enter location manually',
  optionManualDesc: 'Enter address, PIN code and landmark.',
  privacyNote: 'Your location helps us find verified cooperative workers available near you.',
  close: 'Close',
  back: 'Back',

  // GPS states
  gpsDetecting: 'Detecting your location...',
  gpsDetected: 'Location detected',
  gpsConfirm: 'Confirm Location',
  gpsEdit: 'Edit Address',
  gpsDenied: 'Location permission was denied.',
  gpsDeniedHelp: 'You can still enter your address manually.',
  gpsUnavailable: 'Unable to detect your current location.',
  gpsUnsupported: 'Your browser does not support location detection.',
  gpsUnsupportedHelp: 'You can still enter your address manually.',
  gpsTryAgain: 'Try Again',
  gpsEnterManually: 'Enter Location Manually',
  gpsInaccurate: 'If the location looks inaccurate, edit the address or move the pin on the map.',

  // Manual form
  manualTitle: 'Enter location manually',
  searchPlaceholder: 'Search area, building, street or landmark',
  apartmentNumber: 'House / Flat / Apartment No.',
  apartmentPlaceholder: 'e.g. Flat 402, A Wing',
  buildingName: 'Building / Society Name',
  buildingPlaceholder: 'e.g. Green Heights',
  street: 'Street / Road',
  streetPlaceholder: 'e.g. FC Road',
  locality: 'Area / Locality',
  localityPlaceholder: 'e.g. Shivajinagar',
  landmark: 'Nearby Landmark (Optional)',
  landmarkPlaceholder: 'e.g. Near Pune University',
  city: 'City',
  state: 'State',
  pincode: 'PIN Code',
  pincodePlaceholder: '6-digit PIN code',
  floorNumber: 'Floor / Level (Optional)',
  floorPlaceholder: 'e.g. Ground Floor, 1st Floor',
  additionalDirections: 'Additional directions (Optional)',
  additionalPlaceholder: 'e.g. Enter through Gate 2, call before arriving',
  labelHome: 'Home',
  labelOffice: 'Office',
  labelOther: 'Other',
  labelName: 'Save as',
  useThisAddress: 'Use this address',
  selectOnMap: 'Select on map',
  mapHint: 'Tap the map or drag the pin to set the exact service location.',
  addressLine: 'Address line',

  // Validation
  errLocalityRequired: 'Please provide your area/locality.',
  errCityRequired: 'Please provide your city.',
  errInvalidPin: 'Please enter a valid 6-digit PIN code.',
  errApartmentRequired: 'Please provide the house/flat number.',
  errPinLocationRequired: 'Please select the exact location on the map.',

  // Coverage / no worker
  coverageTitle: 'Outside service coverage',
  errOutsideCoverage: 'Services are currently unavailable in this area.',
  noWorkerNearby: 'No verified worker is currently available within your selected service area.',
  expandRadius: 'Expand Search Radius',
  requestWorker: 'Request a Worker',
  notifyMe: 'Notify Me',

  // Summary
  serviceLocation: 'SERVICE LOCATION',
  locationSourceGps: 'GPS detected',
  locationSourceManual: 'Manually entered',
  changeLocation: 'Change Location',
  savedAddresses: 'Saved Addresses',
  addNewAddress: '+ Add New Address',
  useThisLocation: 'Use this location',
  setDefault: 'Set as default',
  default: 'Default',
  edit: 'Edit',
  delete: 'Delete',
  away: 'away',
  serviceRadius: 'Service radius',
  noSavedAddresses: 'No saved addresses yet. Add one to book faster next time.',
  demoLocation: 'Demo location',
  locationRequired: 'Select a service location to continue.',
  notInRadius: 'Outside this worker’s service radius',
  inRadius: 'Covers your location',
} as const;

type Dict = Record<keyof typeof EN, string>;

const HI: Dict = {
  selectorTitle: 'आपको सेवा कहाँ चाहिए?',
  selectorSubtitle: 'अपना सेवा स्थान देने का तरीका चुनें।',
  optionGpsTitle: 'मेरे वर्तमान स्थान का उपयोग करें',
  optionGpsDesc: 'GPS से अपना स्थान अपने आप पहचानें।',
  optionManualTitle: 'स्थान स्वयं दर्ज करें',
  optionManualDesc: 'पता, पिन कोड और लैंडमार्क दर्ज करें।',
  privacyNote: 'आपका स्थान हमें आपके पास उपलब्ध सत्यापित सहकारी कामगार खोजने में मदद करता है।',
  close: 'बंद करें',
  back: 'वापस',

  gpsDetecting: 'आपका स्थान पता लगाया जा रहा है...',
  gpsDetected: 'स्थान मिल गया',
  gpsConfirm: 'स्थान की पुष्टि करें',
  gpsEdit: 'पता संपादित करें',
  gpsDenied: 'स्थान की अनुमति अस्वीकृत कर दी गई।',
  gpsDeniedHelp: 'आप अपना पता स्वयं दर्ज कर सकते हैं।',
  gpsUnavailable: 'आपका वर्तमान स्थान पता नहीं लगा।',
  gpsUnsupported: 'आपका ब्राउज़र स्थान पता लगाने का समर्थन नहीं करता।',
  gpsUnsupportedHelp: 'आप अपना पता स्वयं दर्ज कर सकते हैं।',
  gpsTryAgain: 'फिर कोशिश करें',
  gpsEnterManually: 'स्थान स्वयं दर्ज करें',
  gpsInaccurate: 'स्थान सही न लगे तो पता संपादित करें या नक्शे पर पिन खिसकाएँ।',

  manualTitle: 'स्थान स्वयं दर्ज करें',
  searchPlaceholder: 'क्षेत्र, इमारत, सड़क या लैंडमार्क खोजें',
  apartmentNumber: 'मकान / फ्लैट / अपार्टमेंट नं.',
  apartmentPlaceholder: 'जैसे फ्लैट 402, A विंग',
  buildingName: 'इमारत / सोसाइटी का नाम',
  buildingPlaceholder: 'जैसे ग्रीन हाइट्स',
  street: 'सड़क / मार्ग',
  streetPlaceholder: 'जैसे एफसी रोड',
  locality: 'क्षेत्र / मोहल्ला',
  localityPlaceholder: 'जैसे शिवाजीनगर',
  landmark: 'पास का लैंडमार्क (वैकल्पिक)',
  landmarkPlaceholder: 'जैसे पुणे विश्वविद्यालय के पास',
  city: 'शहर',
  state: 'राज्य',
  pincode: 'पिन कोड',
  pincodePlaceholder: '6 अंकों का पिन कोड',
  floorNumber: 'मंज़िल (वैकल्पिक)',
  floorPlaceholder: 'जैसे ग्राउंड फ़्लोर, पहली मंज़िल',
  additionalDirections: 'अतिरिक्त निर्देश (वैकल्पिक)',
  additionalPlaceholder: 'जैसे गेट 2 से प्रवेश करें, पहुँचने से पहले कॉल करें',
  labelHome: 'घर',
  labelOffice: 'ऑफ़िस',
  labelOther: 'अन्य',
  labelName: 'सहेजें',
  useThisAddress: 'इस पते का उपयोग करें',
  selectOnMap: 'नक्शे पर चुनें',
  mapHint: 'सटीक सेवा स्थान सेट करने के लिए नक्शा टैप करें या पिन खिसकाएँ।',
  addressLine: 'पता',

  errLocalityRequired: 'कृपया अपना क्षेत्र/मोहल्ला दर्ज करें।',
  errCityRequired: 'कृपया अपना शहर दर्ज करें।',
  errInvalidPin: 'कृपया मान्य 6-अंकीय पिन कोड दर्ज करें।',
  errApartmentRequired: 'कृपया मकान/फ्लैट नंबर दर्ज करें।',
  errPinLocationRequired: 'कृपया नक्शे पर सटीक स्थान चुनें।',

  coverageTitle: 'सेवा क्षेत्र से बाहर',
  errOutsideCoverage: 'इस क्षेत्र में वर्तमान में सेवाएँ उपलब्ध नहीं हैं।',
  noWorkerNearby: 'आपके चुने हुए सेवा क्षेत्र में अभी कोई सत्यापित कामगार उपलब्ध नहीं है।',
  expandRadius: 'खोज का दायरा बढ़ाएँ',
  requestWorker: 'कामगार माँगें',
  notifyMe: 'मुझे सूचित करें',

  serviceLocation: 'सेवा स्थान',
  locationSourceGps: 'GPS से पता लगाया गया',
  locationSourceManual: 'स्वयं दर्ज किया गया',
  changeLocation: 'स्थान बदलें',
  savedAddresses: 'सहेजे गए पते',
  addNewAddress: '+ नया पता जोड़ें',
  useThisLocation: 'यह स्थान उपयोग करें',
  setDefault: 'डिफ़ॉल्ट बनाएँ',
  default: 'डिफ़ॉल्ट',
  edit: 'संपादित करें',
  delete: 'हटाएँ',
  away: 'दूर',
  serviceRadius: 'सेवा दायरा',
  noSavedAddresses: 'अभी कोई पता सहेजा नहीं गया। अगली बार तेज़ बुकिंग के लिए जोड़ें।',
  demoLocation: 'डेमो स्थान',
  locationRequired: 'जारी रखने के लिए सेवा स्थान चुनें।',
  notInRadius: 'इस कामगार के सेवा दायरे से बाहर',
  inRadius: 'आपके स्थान को कवर करता है',
};

const MR: Dict = {
  selectorTitle: 'तुम्हाला सेवा कुठे हवी आहे?',
  selectorSubtitle: 'तुमचे सेवा ठिकाण कसा द्यायचे ते निवडा.',
  optionGpsTitle: 'माझे सध्याचे स्थान वापरा',
  optionGpsDesc: 'GPS वापरून माझे स्थान आपोआप ओळखा.',
  optionManualTitle: 'स्थान स्वतः भरा',
  optionManualDesc: 'पत्ता, पिन कोड आणि लँडमार्क भरा.',
  privacyNote: 'तुमच्या स्थानामुळे आम्हाला जवळचे खात्रीशीर सहकारी कामगार शोधता येतात.',
  close: 'बंद करा',
  back: 'मागे',

  gpsDetecting: 'तुमचे स्थान शोधत आहे...',
  gpsDetected: 'स्थान सापडले',
  gpsConfirm: 'स्थान निश्चित करा',
  gpsEdit: 'पत्ता बदला',
  gpsDenied: 'स्थानाची परवानगी नाकारली गेली.',
  gpsDeniedHelp: 'तुम्ही तरीही पत्ता स्वतः भरू शकता.',
  gpsUnavailable: 'तुमचे सध्याचे स्थान शोधता आले नाही.',
  gpsUnsupported: 'तुमचा ब्राउझर स्थान शोधण्यास समर्थन नाही.',
  gpsUnsupportedHelp: 'तुम्ही तरीही पत्ता स्वतः भरू शकता.',
  gpsTryAgain: 'पुन्हा प्रयत्न करा',
  gpsEnterManually: 'स्थान स्वतः भरा',
  gpsInaccurate: 'स्थान अचूक नसल्यास पत्ता बदला किंवा नकाशावर पिन हलवा.',

  manualTitle: 'स्थान स्वतः भरा',
  searchPlaceholder: 'भाग, इमारत, रस्ता किंवा लँडमार्क शोधा',
  apartmentNumber: 'घर / फ्लॅट / अपार्टमेंट क्र.',
  apartmentPlaceholder: 'उदा. फ्लॅट 402, A विंग',
  buildingName: 'इमारत / सोसायटीचे नाव',
  buildingPlaceholder: 'उदा. ग्रीन हाइट्स',
  street: 'रस्ता / मार्ग',
  streetPlaceholder: 'उदा. एफसी रोड',
  locality: 'भाग / परिसर',
  localityPlaceholder: 'उदा. शिवाजीनगर',
  landmark: 'जवळचा लँडमार्क (ऐच्छिक)',
  landmarkPlaceholder: 'उदा. पुणे विद्यापीठाजवळ',
  city: 'शहर',
  state: 'राज्य',
  pincode: 'पिन कोड',
  pincodePlaceholder: '6 अंकी पिन कोड',
  floorNumber: 'मजला (ऐच्छिक)',
  floorPlaceholder: 'उदा. तळटीपा, पहिला मजला',
  additionalDirections: 'अतिरिक्त सूचना (ऐच्छिक)',
  additionalPlaceholder: 'उदा. गेट 2 मधून प्रवेश करा, येण्यापूर्वी फोन करा',
  labelHome: 'घर',
  labelOffice: 'ऑफिस',
  labelOther: 'इतर',
  labelName: 'जतन करा',
  useThisAddress: 'हा पत्ता वापरा',
  selectOnMap: 'नकाशावर निवडा',
  mapHint: 'नेमके सेवा ठिकाण ठेवण्यासाठी नकाशावर टॅप करा किंवा पिन हलवा.',
  addressLine: 'पत्ता',

  errLocalityRequired: 'कृपया तुमचा भाग/परिसर भरा.',
  errCityRequired: 'कृपया तुमचे शहर भरा.',
  errInvalidPin: 'कृपया वैध 6-अंकी पिन कोड भरा.',
  errApartmentRequired: 'कृपया घर/फ्लॅट क्रमांक भरा.',
  errPinLocationRequired: 'कृपया नकाशावर नेमके ठिकाण निवडा.',

  coverageTitle: 'सेवा क्षेत्राबाहेर',
  errOutsideCoverage: 'या भागात सध्या सेवा उपलब्ध नाहीत.',
  noWorkerNearby: 'तुम्ही निवडलेल्या सेवा क्षेत्रात सध्या कोणताही खात्रीशीर कामगार उपलब्ध नाही.',
  expandRadius: 'शोध क्षेत्र वाढवा',
  requestWorker: 'कामगार मागा',
  notifyMe: 'मला कळवा',

  serviceLocation: 'सेवा ठिकाण',
  locationSourceGps: 'GPS ने शोधलेले',
  locationSourceManual: 'स्वतः भरलेले',
  changeLocation: 'ठिकाण बदला',
  savedAddresses: 'जतन केलेले पत्ते',
  addNewAddress: '+ नवीन पत्ता जोडा',
  useThisLocation: 'हे ठिकाण वापरा',
  setDefault: 'डीफॉल्ट करा',
  default: 'डीफॉल्ट',
  edit: 'बदला',
  delete: 'काढा',
  away: 'अंतरावर',
  serviceRadius: 'सेवा त्रिज्या',
  noSavedAddresses: 'अद्याप कोणताही पत्ता जतन केलेला नाही. पुढच्या बुकिंगसाठी जोडा.',
  demoLocation: 'डेमो ठिकाण',
  locationRequired: 'पुढे जाण्यासाठी सेवा ठिकाण निवडा.',
  notInRadius: 'या कामगाराच्या सेवा त्रिज्येबाहेर',
  inRadius: 'तुमचे ठिकाण समाविष्ट करते',
};

const DICT: Record<LocationLang, Dict> = { en: EN, hi: HI, mr: MR };

export const toLocationLang = (l: string | undefined): LocationLang =>
  l === 'hi' || l === 'mr' ? l : 'en';

export type LocationText = Dict;

/**
 * Resolve location copy. Unknown languages fall back to English so the flow
 * is never blank or half-translated. Use as `const t = locationT(lang)`.
 */
export function locationT(lang: string | undefined): LocationText {
  return DICT[toLocationLang(lang)];
}

/** Translate a LocationErrors key (already a message key from locationService). */
export function locationErrorText(
  lang: string | undefined,
  key: string | undefined,
): string | undefined {
  if (!key) return undefined;
  const dict = DICT[toLocationLang(lang)];
  return (dict as Record<string, string>)[key];
}

export const SUPPORTED_LOCATION_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'mr'];
