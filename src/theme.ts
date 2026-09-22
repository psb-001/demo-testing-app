import { StyleSheet } from 'react-native';
import type { BookingStatus, UserRole } from './types';

export const colors = {
  // surfaces
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  // text scale
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  // brand
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#d1fae5',
  blue: '#2563eb',
  blueDark: '#1d4ed8',
  blueLight: '#dbeafe',
  purple: '#7c3aed',
  purpleDark: '#6d28d9',
  purpleLight: '#ede9fe',
  emerald: '#059669',
  emeraldDark: '#047857',
  emeraldLight: '#d1fae5',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  // semantic
  success: '#059669',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#dc2626',
  errorLight: '#fee2e2',
  info: '#2563eb',
  infoLight: '#dbeafe',
  // status text partners (AA on light tints)
  successFg: '#065f46',
  warningFg: '#92400e',
  errorFg: '#991b1b',
  infoFg: '#1e40af',
  neutralFg: '#334155',
  // slate scale
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  // mono
  white: '#ffffff',
  black: '#000000',
  // overlay (non-hex rgba lives here so screens stay literal-free)
  overlay: 'rgba(15,23,42,0.7)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  control: 10,
  md: 12,
  card: 14,
  lg: 16,
  sheet: 20,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 18,
  xl: 24,
} as const;

export const fontWeight = {
  medium: '500',
  bold: '700',
  heavy: '800',
} as const;

export const font = {
  regular: 'Inter',
  medium: 'Inter Medium',
  semibold: 'Inter SemiBold',
  bold: 'Inter Bold',
  black: 'Inter Black',
} as const;

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
} as const;

export const containerShadow = {
  shadowColor: '#0f172a',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
} as const;

/** Role accents — Direction A: accent only, never full-surface theming. */
export const roleAccent: Record<UserRole, string> = {
  customer: colors.blue,
  worker: colors.emerald,
  cooperative: colors.purple,
};

export const roleAccentLight: Record<UserRole, string> = {
  customer: colors.blueLight,
  worker: colors.emeraldLight,
  cooperative: colors.purpleLight,
};

export type StatusTone = { fg: string; bg: string; border?: string };

/** Single source for booking/lifecycle status color. */
export function statusTone(status: BookingStatus): StatusTone {
  switch (status) {
    case 'requested':
      return { fg: colors.warningFg, bg: colors.warningLight, border: '#fde68a' };
    case 'accepted':
    case 'active':
    case 'in_progress':
      return { fg: colors.infoFg, bg: colors.infoLight, border: '#bfdbfe' };
    case 'completed':
      return { fg: colors.successFg, bg: colors.successLight, border: '#a7f3d0' };
    case 'disputed':
      return { fg: colors.errorFg, bg: colors.errorLight, border: '#fecdd3' };
    case 'declined':
    case 'expired':
    case 'cancelled':
    case 'draft':
    default:
      return { fg: colors.neutralFg, bg: colors.slate100, border: colors.border };
  }
}

/**
 * MD3 role tokens — brand-seeded additive layer (zero deps, Hermes-safe).
 * Screens should prefer roleAccent/statusTone; md3 remains for shell pieces.
 */
export const md3 = {
  colors: {
    primary: colors.emerald,
    onPrimary: colors.white,
    primaryContainer: colors.emeraldLight,
    onPrimaryContainer: colors.slate900,
    secondary: colors.blue,
    onSecondary: colors.white,
    secondaryContainer: colors.blueLight,
    onSecondaryContainer: colors.slate900,
    tertiary: colors.purple,
    onTertiary: colors.white,
    tertiaryContainer: colors.purpleLight,
    onTertiaryContainer: colors.slate900,
    surface: colors.surface,
    onSurface: colors.textPrimary,
    surfaceVariant: colors.slate50,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.slate300,
    outlineVariant: colors.slate200,
    background: colors.background,
    onBackground: colors.textPrimary,
    error: colors.error,
    onError: colors.white,
    errorContainer: colors.errorLight,
    onErrorContainer: colors.slate900,
    inverseSurface: colors.slate900,
    onInverseSurface: colors.slate100,
    inversePrimary: colors.emerald,
  },
  shapes: {
    none: 0,
    extraSmall: 4,
    small: radius.sm,
    medium: radius.md,
    large: radius.lg,
    extraLarge: radius.xl,
    full: radius.full,
  },
  type: {
    displayLarge: fontSize.xl,
    displayMedium: fontSize.lg,
    headlineMedium: fontSize.base,
    titleLarge: fontSize.base,
    titleMedium: fontSize.sm,
    bodyLarge: fontSize.sm,
    bodyMedium: fontSize.xs,
    labelLarge: fontSize.xs,
    labelMedium: fontSize.xs,
  },
} as const;

export const shared = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...cardShadow,
  },
  cardFlat: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    fontSize: fontSize.xs,
    fontWeight: '700',
    overflow: 'hidden',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    fontSize: fontSize.sm,
    fontWeight: '600',
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
    gap: spacing.xl,
    paddingBottom: 96,
  },
  bodyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
