import React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { Host, BottomSheet } from '@expo/ui';
import { Star, X } from 'lucide-react-native';
import {
  colors,
  radius,
  spacing,
  fontSize,
  cardShadow,
  statusTone,
  type StatusTone,
} from '../theme';
import type { BookingStatus } from '../types';

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}
export function Card({ children, style, padded = true }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>
  );
}

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------
interface RowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  between?: boolean;
  wrap?: boolean;
}
export function Row({ children, style, between, wrap }: RowProps) {
  return (
    <View
      style={[
        styles.row,
        between && styles.rowBetween,
        wrap && styles.rowWrap,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Col({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexShrink: 1 }, style]}>{children}</View>;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------
export function SectionTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Title({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function SmallText({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.smallText, style]}>{children}</Text>;
}

// ---------------------------------------------------------------------------
// Badge / Pill
// ---------------------------------------------------------------------------
interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: boolean;
  style?: StyleProp<TextStyle>;
}
export function Badge({ children, color = colors.textPrimary, bg = colors.slate100, border, style }: BadgeProps) {
  return (
    <Text
      style={[
        styles.badge,
        { color, backgroundColor: bg },
        border && styles.badgeBorder,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  block?: boolean;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
}
export function Button({
  onPress,
  children,
  color = colors.primary,
  disabled,
  style,
  textStyle,
  block,
  variant = 'solid',
}: ButtonProps) {
  const bg =
    variant === 'solid'
      ? color
      : variant === 'soft'
      ? color + '22'
      : 'transparent';
  const borderColor =
    variant === 'outline'
      ? color
      : variant === 'soft'
      ? color + '00'
      : 'transparent';
  const fontColor =
    variant === 'solid' ? colors.white : variant === 'outline' || variant === 'soft' ? color : colors.slate700;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        block && styles.buttonBlock,
        { backgroundColor: bg, borderColor },
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.buttonText, { color: fontColor }, textStyle]} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// IconButton
// ---------------------------------------------------------------------------
interface IconButtonProps {
  onPress?: () => void;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}
export function IconButton({ onPress, icon, color: _color = colors.textPrimary, bg, size = 36, style }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, backgroundColor: bg || 'transparent' },
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Chip (selectable pill)
// ---------------------------------------------------------------------------
interface ChipProps {
  label: string;
  selected?: boolean;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
export function Chip({
  label,
  selected,
  color = colors.primary,
  onPress,
  style,
  textStyle,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: selected ? color : colors.border, backgroundColor: selected ? color + '1a' : colors.surface },
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text
        style={[styles.chipText, { color: selected ? color : colors.slate600 }, textStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------
interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
  secureTextEntry,
  style,
  inputStyle,
}: TextFieldProps) {
  return (
    <View style={style}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
        maxLength={undefined}
        accessibilityLabel={label}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// StarRating (display + selectable)
// ---------------------------------------------------------------------------
interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
}
export function StarRating({ value, onChange, size = 16, color = colors.amber }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <Row>
      {stars.map((star) => (
        <Pressable key={star} disabled={!onChange} onPress={onChange ? () => onChange(star) : undefined}>
          <Star
            size={size}
            color={star <= value ? color : colors.slate300}
            fill={star <= value ? color : 'none'}
          />
        </Pressable>
      ))}
    </Row>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDesc}>{description}</Text> : null}
      {action}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------
interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  subtitle?: string;
}
export function AppModal({ visible, onClose, title, subtitle, children }: AppModalProps) {
  if (!visible) return null;
  return (
    <Host>
        <BottomSheet
          isPresented={visible}
          onDismiss={onClose}
          containerColor={colors.surface}
          contentPadding={{ top: 8, bottom: 20, left: 16, right: 16 }}
        >
        <View>
          <Row between style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
              {subtitle ? <Text style={styles.modalSubtitle}>{subtitle}</Text> : null}
            </View>
            <IconButton
              onPress={onClose}
              icon={<X size={18} color={colors.textSecondary} />}
              bg={colors.slate100}
            />
          </Row>
          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </BottomSheet>
    </Host>
  );
}

// ---------------------------------------------------------------------------
// StatBox
// ---------------------------------------------------------------------------
interface StatBoxProps {
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}
export function StatBox({ label, value, color = colors.primary, icon }: StatBoxProps) {
  return (
    <Card style={styles.statBox} padded={false}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '1a' }]}>{icon}</View>
      <Text style={[styles.statValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section — one label style for the whole app
// ---------------------------------------------------------------------------
interface SectionProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
export function Section({ title, action, children, style }: SectionProps) {
  return (
    <View style={[{ gap: spacing.sm }, style]}>
      {(title || action) && (
        <Row between>
          {title ? <SectionTitle>{title}</SectionTitle> : <View />}
          {action}
        </Row>
      )}
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Segmented — the one filter/tab control
// ---------------------------------------------------------------------------
interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}
interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accent?: string;
  style?: StyleProp<ViewStyle>;
}
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accent = colors.primary,
  style,
}: SegmentedProps<T>) {
  return (
    <View style={[styles.segmented, style]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.segment,
              active && { backgroundColor: colors.surface },
              active && styles.segmentActive,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.segmentText, active && { color: colors.textPrimary, fontWeight: '700' }]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — statusTone() only; no local hex maps
// ---------------------------------------------------------------------------
interface StatusBadgeProps {
  status: BookingStatus;
  label: string;
  style?: StyleProp<TextStyle>;
}
export function StatusBadge({ status, label, style }: StatusBadgeProps) {
  const tone = statusTone(status);
  return (
    <Text style={[styles.statusBadge, { color: tone.fg, backgroundColor: tone.bg }, style]}>
      {label}
    </Text>
  );
}

export function ToneBadge({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <Text style={[styles.statusBadge, { color: tone.fg, backgroundColor: tone.bg }]}>
      {label}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// ListRow — shared worker/booking/member row shell
// ---------------------------------------------------------------------------
interface ListRowProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  accent?: string;
  style?: StyleProp<ViewStyle>;
}
export function ListRow({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  onPress,
  accent,
  style,
}: ListRowProps) {
  const body = (
    <View
      style={[
        styles.listRow,
        accent ? { borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: spacing.md - 1 } : null,
        style,
      ]}
    >
      {leading}
      <View style={styles.listRowBody}>
        {title}
        {subtitle}
        {meta}
      </View>
      {trailing}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.88 }}>
      {body}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// PrimaryButton — one CTA pattern (role accent via color prop)
// ---------------------------------------------------------------------------
interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  color?: string;
  variant?: 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
}
export function PrimaryButton({
  label,
  onPress,
  color = colors.primary,
  variant = 'solid',
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryBtn,
        variant === 'solid'
          ? { backgroundColor: color }
          : { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color },
        pressed && { opacity: 0.88 },
        style,
      ]}
    >
      <Text
        style={[
          styles.primaryBtnText,
          variant === 'solid' ? { color: colors.white } : { color },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardPadded: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    justifyContent: 'space-between',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  smallText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },
  badgeBorder: {
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: radius.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
  },
  buttonBlock: {
    width: '100%',
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  modalHeader: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statBox: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.slate100,
    borderRadius: radius.md,
  },
  segment: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: radius.control,
  },
  segmentActive: {
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  segmentText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.slate600,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    fontSize: fontSize.xs,
    fontWeight: '700',
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.lg - 2,
    ...cardShadow,
  },
  listRowBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  primaryBtn: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
});