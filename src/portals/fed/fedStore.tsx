import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useI18n, type Lang } from '../../i18n';
import { FED_SOCIETIES, type FedStore } from './fedData';
import { fedT as fedTForLang } from './fedText';

/**
 * Federation store context.
 *
 * The web portal passes a `store: FedStore` prop into all 15 screens
 * (workconnect/src/portals/FederationPortal.tsx builds it with `useMemo` and
 * threads it down). That works there because every screen is a sibling rendered
 * by one parent, but in React Native each screen is its own navigation route
 * with no shared parent render, so a prop cannot reach them.
 *
 * The contract is preserved exactly — same field names, same functions — and is
 * delivered through context instead. Screens read it with `useFedStore()`.
 *
 * Navigation is injected rather than imported so this module stays independent
 * of React Navigation and can be unit tested or reused.
 */

/** Tabs that the federation portal can navigate to. */
export const FED_TABS = [
  'dashboard',
  'societies',
  'workforce',
  'jobs',
  'allocation',
  'forecast',
  'fedMap',
  'emergency',
  'payments',
  'welfare',
  'training',
  'verification',
  'reports',
  'notifications',
  'settings',
] as const;

export type FedTab = (typeof FED_TABS)[number];

/**
 * Nav groups, matching the sidebar sections on the web portal. The "More" screen
 * renders these so all 15 modules stay reachable from a phone, where a
 * 15-item bottom bar would be unusable.
 */
export const FED_NAV_GROUPS: { id: string; labelKey: string; tabs: FedTab[] }[] = [
  {
    id: 'governance',
    labelKey: 'grp_governance',
    tabs: ['dashboard', 'societies', 'workforce', 'jobs'],
  },
  {
    id: 'intelligence',
    labelKey: 'grp_intelligence',
    tabs: ['allocation', 'forecast', 'fedMap', 'emergency'],
  },
  {
    id: 'protection',
    labelKey: 'grp_protection',
    tabs: ['payments', 'welfare', 'training'],
  },
  {
    id: 'support',
    labelKey: 'grp_governance_support',
    tabs: ['verification', 'reports', 'notifications', 'settings'],
  },
];

/** Short labels for the tab bar / more grid, resolved via fedT. */
export const FED_TAB_LABEL_KEY: Record<FedTab, string> = {
  dashboard: 'dashboard',
  societies: 'societies',
  workforce: 'workforce',
  jobs: 'jobs',
  allocation: 'allocation',
  forecast: 'forecast',
  fedMap: 'fedMap',
  emergency: 'emergency',
  payments: 'payments',
  welfare: 'welfare',
  training: 'training',
  verification: 'verification',
  reports: 'reports',
  notifications: 'notifications',
  settings: 'settings',
};

export const FED_TAB_ICON: Record<FedTab, React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name']> = {
  dashboard: 'grid-outline',
  societies: 'business-outline',
  workforce: 'people-outline',
  jobs: 'briefcase-outline',
  allocation: 'sparkles-outline',
  forecast: 'trending-up-outline',
  fedMap: 'map-outline',
  emergency: 'warning-outline',
  payments: 'wallet-outline',
  welfare: 'heart-outline',
  training: 'school-outline',
  verification: 'shield-checkmark-outline',
  reports: 'bar-chart-outline',
  notifications: 'notifications-outline',
  settings: 'settings-outline',
};

const FedStoreContext = createContext<FedChromeValue | null>(null);

/**
 * The store contract plus chrome that the navigator (not the screens) owns.
 * `toast` lives here so a message raised by a deep screen renders once, above
 * the navigator, instead of being clipped by that screen's ScrollView.
 */
export interface FedChromeValue extends FedStore {
  toast: string | null;
  hideToast: () => void;
}

export interface FedStoreProviderProps {
  children: React.ReactNode;
  /** Injected by the navigator: switch to a federation tab. */
  go: (tab: string) => void;
  /** Injected by the navigator: open the Rozgar AI assistant. */
  onOpenAI: () => void;
}

export const FedStoreProvider: React.FC<FedStoreProviderProps> = ({ children, go, onOpenAI }) => {
  const { lang } = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const [focusSocietyId, setFocusSocietyId] = useState<string | null>(null);
  const [readNotices, setReadNotices] = useState<string[]>([]);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const hideToast = useCallback(() => setToast(null), []);

  const openSociety = useCallback((id: string) => {
    setFocusSocietyId(id);
    go('societies');
  }, [go]);

  const clearFocusSociety = useCallback(() => setFocusSocietyId(null), []);

  const markNoticeRead = useCallback((id: string) => {
    setReadNotices((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const value = useMemo<FedChromeValue>(
    () => ({
      lang: lang as Lang,
      go,
      showToast,
      onOpenAI,
      societies: FED_SOCIETIES,
      focusSocietyId,
      openSociety,
      clearFocusSociety,
      readNotices,
      markNoticeRead,
      toast,
      hideToast,
    }),
    [lang, go, showToast, onOpenAI, focusSocietyId, openSociety, clearFocusSociety, readNotices, markNoticeRead, toast, hideToast],
  );

  return <FedStoreContext.Provider value={value}>{children}</FedStoreContext.Provider>;
};

/**
 * Access the federation store.
 *
 * Throws outside the provider (unlike `useI18n`, which soft-falls-back) because
 * every federation screen genuinely requires navigation and the shared dataset;
 * a silent fallback would produce a screen that renders but cannot navigate.
 */
export function useFedStore(): FedStore {
  const ctx = useContext(FedStoreContext);
  if (!ctx) throw new Error('useFedStore must be used inside <FedStoreProvider>');
  return ctx;
}

/** Chrome state the navigator renders (currently just the toast). */
export function useFedChrome(): { toast: string | null; onHide: () => void } {
  const ctx = useContext(FedStoreContext);
  if (!ctx) throw new Error('useFedChrome must be used inside <FedStoreProvider>');
  return { toast: ctx.toast, onHide: ctx.hideToast };
}

/** Localized federation copy bound to the active language. */
export function useFedT(): (key: string) => string {
  const { lang } = useI18n();
  return useMemo(() => (key: string) => fedTForLang(key, lang as Lang), [lang]);
}

/** All tab labels resolved in the active language. */
export function useFedLabels(): Record<FedTab, string> {
  const t = useFedT();
  return useMemo(() => {
    const out = {} as Record<FedTab, string>;
    for (const tab of FED_TABS) out[tab] = t(FED_TAB_LABEL_KEY[tab]);
    return out;
  }, [t]);
}