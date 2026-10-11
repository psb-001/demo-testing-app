/**
 * Rozgar i18n core (React Native).
 *
 * A single centralized translation architecture for the whole product:
 *
 *   <I18nProvider initialLang={lang}>   wraps the app once, in App.tsx
 *   const { lang, t } = useI18n()
 *   t('customer.bookService') -> "Book a service" / "सेवा बुक करें" / "सेवा बुक करा"
 *
 * Behaviour required by the product spec:
 *  - English / हिन्दी / मराठी (en / hi / mr).
 *  - The choice persists across restarts (AsyncStorage) and survives login,
 *    portal switches and navigation; it defaults to the device locale.
 *  - Switching is instant and in-place: no reload, no logout, no lost state.
 *  - Missing keys fall back to English rather than leaking a raw key like
 *    "customer.bookService" into the UI, and are reported in development.
 *
 * Differences from the web implementation (workconnect/src/i18n/index.tsx):
 *  - `window.localStorage` -> AsyncStorage. Reads are async, so the persisted
 *    language is resolved by `loadStoredLang()` BEFORE the provider mounts
 *    (see App.tsx) rather than lazily inside `useState`. This keeps the first
 *    frame correctly localized instead of flashing English.
 *  - `import.meta.env?.DEV` -> React Native's `__DEV__`.
 *  - The `document.documentElement.lang` / `document.title` sync effect is
 *    dropped; React Native has no equivalent DOM contract. Screen titles come
 *    from React Navigation `options.title` instead.
 *  - The active language now also selects the UI font, because Plus Jakarta
 *    Sans contains no Devanagari glyphs (see src/theme/fonts.ts).
 */
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en, { EnTree } from './en';
import hi from './hi';
import mr from './mr';
import { applyDefaultFont } from '../theme/fonts';

export type Lang = 'en' | 'hi' | 'mr';
export type TranslationTree = typeof en;

export const LANGUAGES: { code: Lang; native: string; label: string; speech: string }[] = [
  { code: 'en', native: 'English', label: 'English', speech: 'en-IN' },
  { code: 'hi', native: 'हिन्दी', label: 'Hindi', speech: 'hi-IN' },
  { code: 'mr', native: 'मराठी', label: 'Marathi', speech: 'mr-IN' },
];

export const STORAGE_KEY = 'rozgar.lang.v1';
export const LEGACY_STORAGE_KEY = 'workconnect.lang';
export const DEFAULT_LANG: Lang = 'en';

const DICTIONARIES: Record<Lang, TranslationTree> = { en, hi: hi as TranslationTree, mr: mr as TranslationTree };

/** Narrow an arbitrary string to a supported Lang, or undefined if unsupported. */
function toLang(value: unknown): Lang | undefined {
  return value === 'en' || value === 'hi' || value === 'mr' ? value : undefined;
}

/**
 * The device language if Rozgar speaks it, otherwise English.
 * Used as the pre-persistence default so a Hindi phone shows Hindi on the very
 * first launch instead of waiting on storage.
 */
export function detectDeviceLang(): Lang {
  try {
    const [first] = Localization.getLocales();
    return toLang(first?.languageCode) ?? DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

/**
 * Resolve the language to start the app in.
 *
 * Order: stored preference -> legacy pre-rebrand preference -> device locale ->
 * English. Never throws; a storage failure just yields the device default.
 */
export async function loadStoredLang(): Promise<Lang> {
  try {
    const stored = toLang(await AsyncStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
    const legacy = toLang(await AsyncStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy) return legacy;
  } catch {
    /* storage unavailable — fall through to the device default */
  }
  return detectDeviceLang();
}

/** Persist a language choice. Best-effort; failures are non-fatal. */
export async function persistLang(lang: Lang): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* persistence is best-effort */
  }
}

/**
 * Resolve a dot-path such as "customer.bookService" inside a translation tree.
 * Returns undefined when any segment is missing so callers can fall back.
 */
function resolve(tree: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let node: unknown = tree;
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

/** Replace {placeholders} with runtime values. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match,
  );
}

export interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a dot-path key, with optional {placeholder} values. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  languages: typeof LANGUAGES;
  /** BCP-47 tag for speech synthesis in the active language. */
  speechLang: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: React.ReactNode;
  /**
   * Language resolved before mount (see `loadStoredLang`). Required so the very
   * first frame is already in the right language.
   */
  initialLang: Lang;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLang }) => {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Keep the persisted preference in sync with the in-memory choice.
  useEffect(() => {
    void persistLang(lang);
  }, [lang]);

  // Devanagari needs a font with Devanagari glyphs; English keeps Plus Jakarta.
  useEffect(() => {
    applyDefaultFont(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const primary = resolve(DICTIONARIES[lang], key);
      if (primary !== undefined) return interpolate(primary, vars);
      // English fallback: never show a raw key to the user.
      const fallback = resolve(DICTIONARIES.en, key);
      if (fallback !== undefined) {
        if (__DEV__) {
          console.warn(`[i18n] Missing ${lang} translation for "${key}" — using English.`);
        }
        return interpolate(fallback, vars);
      }
      if (__DEV__) console.error(`[i18n] Unknown translation key "${key}".`);
      return key;
    },
    [lang],
  );

  const speechLang = useMemo(
    () => LANGUAGES.find((l) => l.code === lang)?.speech ?? LANGUAGES[0].speech,
    [lang],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t, languages: LANGUAGES, speechLang }),
    [lang, setLang, t, speechLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Access the Rozgar i18n context.
 * Falls back to a self-contained English-only context so isolated component
 * tests never crash on a missing provider.
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  const fallback = useMemo<I18nContextValue>(
    () => ({
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (key, vars) => interpolate(resolve(en, key) ?? key, vars),
      languages: LANGUAGES,
      speechLang: LANGUAGES[0].speech,
    }),
    [],
  );
  return ctx ?? fallback;
}

/** Locale-aware number formatting that keeps Indian digit grouping. */
export const formatNumber = (value: number): string =>
  value.toLocaleString('en-IN');

/** Currency display — the ₹ symbol is locale-neutral, so only grouping is applied. */
export const formatCurrency = (value: number): string => `₹${value.toLocaleString('en-IN')}`;

/** Lakh / crore compact form, used by the federation and welfare screens. */
export const formatLakh = (value: number): string => `₹${(value / 1e5).toFixed(1)} Lakh`;
export const formatCrore = (value: number): string => `₹${(value / 1e7).toFixed(1)} Cr`;

export type { EnTree };
export { en, hi, mr };