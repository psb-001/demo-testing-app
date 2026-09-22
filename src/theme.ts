import { StyleSheet } from 'react-native';

export const colors = {
  // surfaces
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  // text scale
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  // role brands (customer=emerald, worker=blue, cooperative=purple)
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#d1fae5',
  blue: '#2563eb',
  blueDark: '#1d4ed8',
  blueLight: '#dbeafe',
  purple: '#7c3aed',
  purpleDark: '#6d28d9',
  purpleLight: '#ede9fe',
  // brand support
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
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 22,
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
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
} as const;

export const containerShadow = {
  shadowColor: '#0f172a',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 24,
  elevation: 8,
} as const;


/**
 * MD3 role tokens — brand-seeded additive layer (zero deps, Hermes-safe).
 * Every role maps to existing color/spacing/radius/font constants so screens
 * can repoint from hardcoded hexes WITHOUT introducing new tokens or deps.
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
    displayLarge: fontSize['2xl'],
    displayMedium: fontSize.xl,
    headlineMedium: fontSize.lg,
    titleLarge: fontSize.lg,
    titleMedium: fontSize.base,
    bodyLarge: fontSize.base,
    bodyMedium: fontSize.sm,
    labelLarge: fontSize.sm,
    labelMedium: fontSize.xs,
  },
} as const;

export const shared = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...cardShadow,
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    fontSize: 10,
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
});
