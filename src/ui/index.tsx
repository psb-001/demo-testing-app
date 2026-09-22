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
import { colors, radius, spacing, fontSize, cardShadow } from '../theme';

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
export function Badge({ children, color = '#0f172a', bg = '#f1f5f9', border, style }: BadgeProps) {
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
  color = '#059669',
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
    variant === 'solid' ? '#ffffff' : variant === 'outline' || variant === 'soft' ? color : '#334155';

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
export function IconButton({ onPress, icon, color: _color = '#0f172a', bg, size = 36, style }: IconButtonProps) {
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
  color = '#059669',
  onPress,
  style,
  textStyle,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: selected ? color : '#e2e8f0', backgroundColor: selected ? color + '1a' : '#ffffff' },
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text
        style={[styles.chipText, { color: selected ? color : '#475569' }, textStyle]}
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
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
        maxLength={undefined}
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
export function StarRating({ value, onChange, size = 16, color = '#f59e0b' }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <Row>
      {stars.map((star) => (
        <Pressable key={star} disabled={!onChange} onPress={onChange ? () => onChange(star) : undefined}>
          <Star
            size={size}
            color={star <= value ? color : '#cbd5e1'}
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
        containerColor="#ffffff"
        contentPadding={{ top: 8, bottom: 20, left: 16, right: 16 }}
      >
        <View>
          <Row between style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
              {subtitle ? <Text style={styles.modalSubtitle}>{subtitle}</Text> : null}
            </View>
            <IconButton onPress={onClose} icon={<X size={18} color="#64748b" />} bg="#f1f5f9" />
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
export function StatBox({ label, value, color = '#059669', icon }: StatBoxProps) {
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
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
  },
  badgeBorder: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  buttonBlock: {
    width: '100%',
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
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
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: fontSize.sm,
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
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
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
});