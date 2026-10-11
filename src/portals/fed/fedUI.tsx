import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../../theme/theme';

/**
 * Federation shared UI primitives.
 *
 * These replace the Tailwind-based components in
 * workconnect/src/portals/coop/coopUI.tsx and workconnect/src/portals/fed/fedUI.tsx.
 * Tone mapping (`stTone`, `TONE`, `DOT`) is ported verbatim so status colours
 * stay consistent with the web build.
 *
 * The significant mobile adaptation is that the web portal's seven wide
 * `<table>`s (up to 12 columns, `min-w-[1250px]`, `overflow-x-auto`) became
 * `RecordCard` lists: each row renders as a tappable card with a title line and
 * a wrapping key/value grid. Horizontally scrolling a 12-column table on a phone
 * is unusable; a card list carries the same information and is readable.
 */

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/* ── Tone helpers ──────────────────────────────────────────────────────── */

export type BadgeTone = 'green' | 'amber' | 'red' | 'slate' | 'blue';

const TONE: Record<BadgeTone, { bg: string; fg: string }> = {
  green: { bg: colors.mint, fg: colors.forest },
  amber: { bg: '#FFF3E5', fg: '#B45309' },
  red: { bg: '#FFF0F0', fg: colors.danger },
  slate: { bg: '#EEF2F0', fg: colors.sage },
  blue: { bg: '#EAF3FB', fg: '#1D4E89' },
};

const DOT: Record<BadgeTone, string> = {
  green: '#168A5B',
  amber: '#D97706',
  red: '#DC2626',
  slate: '#64756D',
  blue: '#1D4E89',
};

/** Map a free-text status to a badge tone. Ported from coopUI.stTone. */
export const stTone = (s: string): BadgeTone => {
  const up = s.toLowerCase();
  if (['verified', 'settled', 'paid', 'completed', 'available', 'approved', 'balanced', 'active', 'resolved', 'matched'].some((k) => up.includes(k))) return 'green';
  if (['overloaded', 'emergency', 'rejected', 'disputed', 'cancelled', 'lapsed', 'open', 'refunded', 'urgent'].some((k) => up.includes(k))) return 'red';
  if (['pending', 'matching', 'expiring', 'under review', 'underutilized', 'busy'].some((k) => up.includes(k))) return 'amber';
  if (['new', 'assigned', 'in progress', 'authorized', 'en route', 'offline', 'on leave'].some((k) => up.includes(k))) return 'blue';
  return 'slate';
};

/* ── Badges, chips, pills ──────────────────────────────────────────────── */

export const StatusBadge: React.FC<{ value: string; tone?: BadgeTone }> = ({ value, tone }) => {
  const t = TONE[tone ?? stTone(value)];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.badgeText, { color: t.fg }]} numberOfLines={1}>{value}</Text>
    </View>
  );
};

export const Badge: React.FC<{ tone?: BadgeTone; children: React.ReactNode }> = ({ tone = 'slate', children }) => {
  const t = TONE[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {typeof children === 'string' ? (
        <Text style={[styles.badgeText, { color: t.fg }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

/** Filter / toggle chip. */
export const Chip: React.FC<{
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  count?: number;
  tone?: BadgeTone;
}> = ({ active = false, onPress, children, count, tone = 'green' }) => {
  const t = TONE[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: active ? t.bg : '#fff', borderColor: active ? DOT[tone] : colors.border },
        pressed && styles.pressed,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.chipText, { color: active ? t.fg : colors.sage }]}>{children}</Text>
      ) : (
        children
      )}
      {count !== undefined ? (
        <Text style={[styles.chipCount, { color: active ? t.fg : colors.sage }]}>{count}</Text>
      ) : null}
    </Pressable>
  );
};

/** Small "DEMO DATA" provenance marker used across the federation portal. */
export const CoopDemoTag: React.FC<{ label?: string }> = ({ label = 'DEMO' }) => (
  <View style={styles.demoTag}>
    <Text style={styles.demoTagText}>{label}</Text>
  </View>
);

/* ── Layout ────────────────────────────────────────────────────────────── */

/**
 * Standard scroll container for every federation screen.
 *
 * The mobile portal convention (see src/screens/Coop*Screen.tsx) is a
 * `#F4F6F3` background with 16px padding, so this wraps that in one place
 * rather than repeating the same StyleSheet in 15 files.
 */
export const FedScreen: React.FC<{
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  /**
   * Escape hatch for screens that need to scroll programmatically — the web
   * Training screen used `scrollIntoView`, which has no DOM equivalent here.
   */
  scrollRef?: React.RefObject<ScrollView | null>;
}> = ({ children, refreshing, onRefresh, scrollRef }) => (
  <ScrollView
    ref={scrollRef}
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
    showsVerticalScrollIndicator={false}
    refreshControl={
      onRefresh
        ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.forest} />
        : undefined
    }
  >
    {children}
  </ScrollView>
);

/** Horizontal gap-wrapped row used by every KPI grid. */
export const Grid: React.FC<{ children: React.ReactNode; minWidth?: string; style?: object }> = ({
  children,
  minWidth = '46%',
  style,
}) => <View style={[styles.grid, style]}>{React.Children.map(children, (child) =>
  child ? <View style={{ minWidth: minWidth as never, flexGrow: 1, flexBasis: 0 }}>{child}</View> : null,
)}</View>;

export const Row: React.FC<{ children: React.ReactNode; style?: object; wrap?: boolean }> = ({ children, style, wrap = true }) => (
  <View style={[wrap ? styles.rowWrap : styles.row, style]}>{children}</View>
);

export const Stack: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[styles.stack, style]}>{children}</View>
);

export const Card2: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const ScreenHeader: React.FC<{
  title: string;
  subtitle?: string;
  tag?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, tag, action }) => (
  <View style={styles.screenHeader}>
    <View style={styles.screenHeaderText}>
      <View style={styles.screenHeaderTitleRow}>
        <Text style={styles.screenTitle}>{title}</Text>
        {tag}
      </View>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
    {action ? <View style={styles.screenHeaderAction}>{action}</View> : null}
  </View>
);

export const SectionTitle: React.FC<{
  children: React.ReactNode;
  action?: React.ReactNode;
  hint?: string;
}> = ({ children, action, hint }) => (
  <View style={styles.sectionTitleRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
    </View>
    {action}
  </View>
);

/** Key/value line. */
export const KV: React.FC<{ k: string; v: React.ReactNode; mono?: boolean }> = ({ k, v, mono }) => (
  <View style={styles.kvRow}>
    <Text style={styles.kvKey}>{k}</Text>
    {typeof v === 'string' || typeof v === 'number' ? (
      <Text style={[styles.kvValue, mono && styles.kvMono]} numberOfLines={2}>{v}</Text>
    ) : (
      <View style={styles.kvValueNode}>{v}</View>
    )}
  </View>
);

/** Small labelled metric, used inside detail sheets. */
export const DetailStat: React.FC<{ label: string; value: string; tone?: BadgeTone }> = ({ label, value, tone = 'slate' }) => (
  <View style={styles.detailStat}>
    <Text style={styles.detailStatLabel} numberOfLines={1}>{label}</Text>
    <Text style={[styles.detailStatValue, { color: tone === 'slate' ? colors.ink : DOT[tone] }]} numberOfLines={1}>{value}</Text>
  </View>
);

/** KPI card used across the federation dashboard and screen headers. */
export const FederationKpiCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub: string;
  tone?: BadgeTone;
  icon?: IconName;
  style?: object;
}> = ({ label, value, sub, tone = 'green', icon, style }) => (
  <View style={[styles.kpi, style]}>
    <View style={styles.kpiTop}>
      <Text style={styles.kpiLabel} numberOfLines={1}>{label}</Text>
      {icon ? <Ionicons name={icon} size={14} color={DOT[tone]} /> : null}
    </View>
    <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{typeof value === 'string' || typeof value === 'number' ? value : value}</Text>
    <Text style={styles.kpiSub} numberOfLines={2}>{sub}</Text>
    <View style={[styles.kpiDot, { backgroundColor: DOT[tone] }]} />
  </View>
);

/**
 * Alert tone vocabulary used by federation notices and welfare alerts
 * (`FedNotice.tone`, `WelfareAlert.severity`). Mapped onto badge tones for
 * colours, but kept as its own union because the semantic names read better at
 * call sites than the palette names.
 */
export type AlertTone = 'danger' | 'warn' | 'info' | 'success';

const ALERT_TO_BADGE: Record<AlertTone, BadgeTone> = {
  danger: 'red',
  warn: 'amber',
  info: 'blue',
  success: 'green',
};

const ALERT_ICON: Record<AlertTone, IconName> = {
  danger: 'alert-circle',
  warn: 'warning',
  info: 'information-circle',
  success: 'checkmark-circle',
};

/** Federation alert / callout. Tappable when `onPress` is supplied. */
export const FederationAlert: React.FC<{
  title: string;
  body?: string;
  tone?: AlertTone;
  actionLabel?: string;
  onPress?: () => void;
}> = ({ title, body, tone = 'info', actionLabel, onPress }) => {
  const badge = ALERT_TO_BADGE[tone];
  const content = (
    <>
      <View style={styles.alertIcon}>
        <Ionicons name={ALERT_ICON[tone]} size={16} color={DOT[badge]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.alertTitle}>{title}</Text>
        {body ? <Text style={styles.alertBody}>{body}</Text> : null}
        {actionLabel ? <Text style={[styles.alertAction, { color: DOT[badge] }]}>{actionLabel} →</Text> : null}
      </View>
    </>
  );
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.alert, { backgroundColor: TONE[badge].bg }, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return <View style={[styles.alert, { backgroundColor: TONE[badge].bg }]}>{content}</View>;
};

/** Round initials avatar. The web version used <img> with an onError fallback. */
export const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>
      {name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
    </Text>
  </View>
);

/* ── Buttons ───────────────────────────────────────────────────────────── */

export const ActBtn: React.FC<{
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'ghost' | 'danger' | 'dark';
  icon?: IconName;
  disabled?: boolean;
  style?: object;
}> = ({ label, onPress, tone = 'primary', icon, disabled, style }) => {
  const bg = tone === 'primary' ? colors.cta : tone === 'dark' ? colors.forest : tone === 'danger' ? colors.danger : '#fff';
  const fg = tone === 'ghost' ? colors.teal : '#fff';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actBtn,
        { backgroundColor: bg, borderColor: tone === 'ghost' ? colors.border : bg },
        disabled && styles.actBtnDisabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={13} color={fg} /> : null}
      <Text style={[styles.actBtnText, { color: fg }]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
};

/* ── Inputs: search, select sheet, stepper ─────────────────────────────── */

export const SearchInput: React.FC<{
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChangeText, placeholder = 'Search' }) => (
  <View style={styles.searchWrap}>
    <Ionicons name="search" size={15} color={colors.sage} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.sage}
      style={styles.searchInput}
      autoCorrect={false}
      accessibilityLabel={placeholder}
    />
    {value ? (
      <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
        <Ionicons name="close-circle" size={15} color={colors.sage} />
      </Pressable>
    ) : null}
  </View>
);

export type SelectOption = { label: string; value: string };

/**
 * Replacement for the web portal's native `<select>` filters, which do not exist
 * in React Native. Renders as a tappable pill that opens a bottom sheet.
 */
export const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Label shown for the "no filter" option. */
  allLabel?: string;
}> = ({ label, value, options, onChange, allLabel = 'All' }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isFiltered = value !== '' && value !== '__all';
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? allLabel}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.select, isFiltered && styles.selectActive, pressed && styles.pressed]}
      >
        <Text style={styles.selectLabel} numberOfLines={1}>{label}</Text>
        <View style={styles.selectValueRow}>
          <Text style={[styles.selectValue, isFiltered && styles.selectValueActive]} numberOfLines={1}>
            {selected?.label ?? allLabel}
          </Text>
          <Ionicons name="chevron-down" size={12} color={isFiltered ? colors.cta : colors.sage} />
        </View>
      </Pressable>
      <OptionSheet
        visible={open}
        title={label}
        options={[{ label: allLabel, value: '__all' }, ...options]}
        value={value === '' ? '__all' : value}
        onSelect={(v) => {
          onChange(v === '__all' ? '' : v);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

/** Generic option picker sheet, also used for the forecast horizon control. */
export const OptionSheet: React.FC<{
  visible: boolean;
  title: string;
  options: SelectOption[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}> = ({ visible, title, options, value, onSelect, onClose }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close">
              <Ionicons name="close" size={20} color={colors.sage} />
            </Pressable>
          </View>
          <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
            {options.map((o) => {
              const active = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => onSelect(o.value)}
                  style={({ pressed }) => [styles.optionRow, active && styles.optionRowActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]} numberOfLines={1}>{o.label}</Text>
                  {active ? <Ionicons name="checkmark" size={17} color={colors.cta} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Replacement for `<input type="range">` in Settings.
 *
 * `@react-native-community/slider` would be a new native module for one screen;
 * a stepper with a live bar gives the same control with better touch targets
 * and no dependency.
 */
export const Stepper: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}> = ({ label, value, min, max, step, onChange, suffix = '' }) => {
  const pct = ((value - min) / (max - min || 1)) * 100;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <View style={styles.stepper}>
      <View style={styles.stepperHeader}>
        <Text style={styles.stepperLabel}>{label}</Text>
        <Text style={styles.stepperValue}>{value}{suffix}</Text>
      </View>
      <View style={styles.stepperRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          disabled={value <= min}
          onPress={() => onChange(clamp(value - step))}
          style={({ pressed }) => [styles.stepperBtn, value <= min && styles.actBtnDisabled, pressed && styles.pressed]}
        >
          <Ionicons name="remove" size={16} color={colors.forest} />
        </Pressable>
        <View style={styles.stepperTrack}>
          <View style={[styles.stepperFill, { width: `${pct}%` }]} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          disabled={value >= max}
          onPress={() => onChange(clamp(value + step))}
          style={({ pressed }) => [styles.stepperBtn, value >= max && styles.actBtnDisabled, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={16} color={colors.forest} />
        </Pressable>
      </View>
    </View>
  );
};

/** Switch row, replacing `<input type="checkbox">` in Settings / map filters. */
export const ToggleRow: React.FC<{ label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }> = ({
  label,
  hint,
  value,
  onChange,
}) => (
  <Pressable
    accessibilityRole="switch"
    accessibilityState={{ checked: value }}
    accessibilityLabel={label}
    onPress={() => onChange(!value)}
    style={({ pressed }) => [styles.toggleRow, pressed && styles.pressed]}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {hint ? <Text style={styles.toggleHint}>{hint}</Text> : null}
    </View>
    <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </View>
  </Pressable>
);

/* ── Record list: the mobile replacement for wide `<table>`s ────────────── */

/**
 * One row of a web table, rendered as a card.
 *
 * `fields` are the secondary columns (the ones that would sit to the right of
 * the title). They wrap onto a 2-up grid so a 10-column ledger stays readable.
 */
export const RecordCard: React.FC<{
  title: string;
  subtitle?: string;
  badge?: { label: string; tone?: BadgeTone };
  fields?: { label: string; value: string }[];
  onPress?: () => void;
  trailing?: React.ReactNode;
  /** Icon rendered before the title block. */
  leading?: React.ReactNode;
  /** Drops the inner divider/field padding; for dense rows inside hero bands. */
  compact?: boolean;
  showChevron?: boolean;
  /**
   * `dark` is for cards sitting on a dark hero band (e.g. the dashboard's
   * closed-loop ecosystem strip). A `style` override cannot fix that case,
   * because the title/subtitle colours live on the inner <Text> — without this
   * variant they stay dark-on-dark and become unreadable.
   */
  variant?: 'light' | 'dark';
  style?: object;
}> = ({ title, subtitle, badge, fields, onPress, trailing, leading, compact, showChevron = true, variant = 'light', style }) => {
  const dark = variant === 'dark';
  const body = (
    <>
      <View style={styles.recordHeader}>
        {leading}
        <View style={{ flex: 1 }}>
          <Text style={[styles.recordTitle, dark && styles.recordTitleDark]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[styles.recordSubtitle, dark && styles.recordSubtitleDark]} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {badge ? <StatusBadge value={badge.label} tone={badge.tone} /> : null}
        {trailing}
        {onPress && showChevron ? (
          <Ionicons name="chevron-forward" size={15} color={dark ? 'rgba(255,255,255,0.5)' : colors.sage} />
        ) : null}
      </View>
      {fields && fields.length ? (
        <View style={[styles.recordFields, compact && styles.recordFieldsCompact, dark && styles.recordFieldsDark]}>
          {fields.map((f) => (
            <View key={f.label} style={styles.recordField}>
              <Text style={[styles.recordFieldLabel, dark && styles.recordFieldLabelDark]} numberOfLines={1}>{f.label}</Text>
              <Text style={[styles.recordFieldValue, dark && styles.recordFieldValueDark]} numberOfLines={1}>{f.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
  const base = [styles.record, dark && styles.recordDark, style];
  if (!onPress) return <View style={base}>{body}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [...base, pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
};

/** Vertical scroll-into-view target for the record list. */
export const RecordList: React.FC<{ children: React.ReactNode; emptyLabel?: string; isEmpty?: boolean }> = ({
  children,
  emptyLabel = 'No matching records',
  isEmpty,
}) => {
  if (isEmpty) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="file-tray-outline" size={22} color={colors.leaf} />
        <Text style={styles.emptyStateText}>{emptyLabel}</Text>
      </View>
    );
  }
  return <View style={{ gap: 8 }}>{children}</View>;
};

/* ── Drawer / modal detail sheet ───────────────────────────────────────── */

/**
 * Full-screen detail sheet, replacing the web `Drawer`.
 *
 * The web version mutated `document.body.style.overflow` with a module-level
 * refcount to lock background scroll. React Native's `Modal` already captures
 * touches outside the sheet, so no scroll locking is needed.
 */
export const Drawer: React.FC<{
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, open, onClose, children, footer }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
      <View style={styles.drawerRoot}>
        <View style={[styles.drawerHeader, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={onClose} hitSlop={10} style={styles.drawerBack} accessibilityLabel="Close">
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.drawerTitle} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.drawerSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
        </View>
        <ScrollView style={styles.drawerBody} contentContainerStyle={styles.drawerBodyContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer ? <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
      </View>
    </Modal>
  );
};

/** Simple confirmation dialog, replacing the `fixed inset-0 z-[60]` modals. */
export const ConfirmDialog: React.FC<{
  visible: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: BadgeTone;
}> = ({ visible, title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, tone = 'green' }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.dialogOverlay}>
      <View style={styles.dialogCard}>
        <Text style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogBody}>{body}</Text>
        <View style={styles.dialogActions}>
          <ActBtn label={cancelLabel} tone="ghost" onPress={onCancel} style={{ flex: 1 }} />
          <ActBtn label={confirmLabel} tone={tone === 'red' ? 'danger' : 'primary'} onPress={onConfirm} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  </Modal>
);

/* ── Toast ─────────────────────────────────────────────────────────────── */

/** Lightweight transient message. Auto-dismisses after `duration` ms. */
export const Toast: React.FC<{ message: string | null; onHide: () => void; duration?: number }> = ({
  message,
  onHide,
  duration = 2600,
}) => {
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [message, onHide, duration]);

  if (!message) return null;
  return (
    <View pointerEvents="none" style={[styles.toastWrap, { bottom: insets.bottom + 78 }]}>
      <View style={styles.toast}>
        <Ionicons name="checkmark-circle" size={15} color="#B7F0CD" />
        <Text style={styles.toastText} numberOfLines={3}>{message}</Text>
      </View>
    </View>
  );
};

/** Payment settlement flow diagram (worker / coop / welfare / platform). */
export const PaymentFlow: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const steps = [
    { icon: 'card-outline' as IconName, label: 'Customer pays' },
    { icon: 'shield-checkmark-outline' as IconName, label: 'Platform settles' },
    { icon: 'people-outline' as IconName, label: 'Worker payout' },
    { icon: 'heart-outline' as IconName, label: 'Welfare fund' },
  ];
  return (
    <View style={styles.flow}>
      {steps.map((s, i) => (
        <View key={s.label} style={styles.flowRow}>
          <View style={[styles.flowNode, compact && styles.flowNodeCompact]}>
            <Ionicons name={s.icon} size={compact ? 13 : 15} color={colors.cta} />
            <Text style={[styles.flowLabel, compact && styles.flowLabelCompact]} numberOfLines={1}>{s.label}</Text>
          </View>
          {i < steps.length - 1 ? (
            <View style={styles.flowArrow}>
              <View style={styles.flowArrowLine} />
              <Ionicons name="chevron-forward" size={12} color={colors.leaf} />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
};

/** Horizontal segmented control, replacing the web `Tabs` row. */
export const SegmentedTabs: React.FC<{
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}> = ({ tabs, active, onChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segWrap}>
    {tabs.map((t) => {
      const isActive = t.id === active;
      return (
        <Pressable
          key={t.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          onPress={() => onChange(t.id)}
          style={({ pressed }) => [styles.seg, isActive && styles.segActive, pressed && styles.pressed]}
        >
          <Text style={[styles.segText, isActive && styles.segTextActive]}>{t.label}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

/** Label + value progress row used by welfare/training/verification. */
export const ProgressRow: React.FC<{ label: string; pct: number; right?: string; color?: string }> = ({
  label,
  pct,
  right,
  color = colors.cta,
}) => (
  <View style={styles.progressRow}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel} numberOfLines={1}>{label}</Text>
      <Text style={styles.progressValue}>{right ?? `${Math.round(pct)}%`}</Text>
    </View>
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: color }]} />
    </View>
  </View>
);

/** 4-step timeline used by jobs and emergency flows. */
export const StepFlow: React.FC<{ steps: string[]; currentIndex: number }> = ({ steps, currentIndex }) => (
  <View style={styles.stepFlow}>
    {steps.map((s, i) => {
      const done = i <= currentIndex;
      return (
        <View key={s} style={styles.stepFlowRow}>
          <View style={[styles.stepDot, done && styles.stepDotDone]}>
            <Text style={[styles.stepDotText, done && styles.stepDotTextDone]}>{i + 1}</Text>
          </View>
          {i < steps.length - 1 ? <View style={[styles.stepLine, done && styles.stepLineDone]} /> : null}
          <Text style={[styles.stepLabel, done && styles.stepLabelDone]} numberOfLines={1}>{s}</Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3, maxWidth: 160 },
  badgeText: { fontSize: 9, fontWeight: '900' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 7 },
  chipText: { fontSize: 11, fontWeight: '800' },
  chipCount: { fontSize: 9, fontWeight: '900' },
  demoTag: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, borderColor: '#B7E4C7', backgroundColor: colors.mint, paddingHorizontal: 7, paddingVertical: 3 },
  demoTagText: { color: colors.teal, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  screen: { flex: 1, backgroundColor: '#F4F6F3' },
  screenContent: { padding: 16, paddingBottom: 34, gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  stack: { gap: 10 },
  screenHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  screenHeaderText: { flex: 1, minWidth: 0 },
  screenHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  screenTitle: { color: colors.ink, fontSize: 19, fontWeight: '900', flexShrink: 1 },
  screenSubtitle: { color: colors.sage, fontSize: 11, lineHeight: 16, marginTop: 3 },
  screenHeaderAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 8 },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  sectionHint: { color: colors.sage, fontSize: 10, marginTop: 2 },
  kvRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  kvKey: { width: 116, color: colors.sage, fontSize: 11, fontWeight: '700' },
  kvValue: { flex: 1, color: colors.ink, fontSize: 11, fontWeight: '800' },
  kvMono: { fontVariant: ['tabular-nums'] },
  kvValueNode: { flex: 1, alignItems: 'flex-start' },
  detailStat: { flex: 1, minWidth: '30%', backgroundColor: colors.warm, borderRadius: radius.sm, padding: 9 },
  detailStatLabel: { color: colors.sage, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  detailStatValue: { fontSize: 15, fontWeight: '900', marginTop: 3 },
  kpi: { flex: 1, minWidth: '46%', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, overflow: 'hidden' },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  kpiLabel: { color: colors.sage, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.3, flex: 1 },
  kpiValue: { color: colors.ink, fontSize: 21, fontWeight: '900', marginTop: 5 },
  kpiSub: { color: colors.sage, fontSize: 9, marginTop: 3, lineHeight: 13 },
  kpiDot: { position: 'absolute', right: 10, bottom: 10, width: 6, height: 6, borderRadius: 3, opacity: 0.5 },
  alert: { flexDirection: 'row', gap: 9, borderRadius: radius.md, padding: 12 },
  alertIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  alertTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  alertBody: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  alertAction: { fontSize: 10, fontWeight: '900', marginTop: 6 },
  avatar: { backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.forest, fontWeight: '900' },
  actBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9 },
  actBtnText: { fontSize: 11, fontWeight: '900' },
  actBtnDisabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, padding: 0 },
  select: { minWidth: '47%', flexGrow: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  selectActive: { borderColor: colors.cta, backgroundColor: '#F2FBF6' },
  selectLabel: { color: colors.sage, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  selectValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, marginTop: 3 },
  selectValue: { color: colors.ink, fontSize: 11, fontWeight: '800', flex: 1 },
  selectValueActive: { color: colors.cta },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(24,50,42,0.38)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '78%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10 },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D5DEDA', alignSelf: 'center', marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sheetTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  optionRowActive: { backgroundColor: '#F7FBF9' },
  optionLabel: { color: colors.ink, fontSize: 13, flex: 1 },
  optionLabelActive: { color: colors.cta, fontWeight: '800' },
  stepper: { marginBottom: 12 },
  stepperHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  stepperLabel: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  stepperValue: { color: colors.cta, fontSize: 12, fontWeight: '900' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  stepperBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  stepperTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  stepperFill: { height: '100%', borderRadius: 4, backgroundColor: colors.cta },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  toggleLabel: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  toggleHint: { color: colors.sage, fontSize: 10, marginTop: 2 },
  toggleTrack: { width: 44, height: 26, borderRadius: 13, backgroundColor: '#DCE5E0', padding: 3, justifyContent: 'center' },
  toggleTrackOn: { backgroundColor: colors.cta },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  record: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  recordTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  recordSubtitle: { color: colors.sage, fontSize: 10, marginTop: 2 },
  recordTitleDark: { color: '#fff' },
  recordSubtitleDark: { color: 'rgba(255,255,255,0.65)' },
  recordDark: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' },
  recordFieldsDark: { borderTopColor: 'rgba(255,255,255,0.15)' },
  recordFieldLabelDark: { color: 'rgba(255,255,255,0.55)' },
  recordFieldValueDark: { color: '#fff' },
  recordFields: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingTop: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1', rowGap: 8 },
  recordFieldsCompact: { marginTop: 6, paddingTop: 6, borderTopWidth: 0 },
  recordField: { width: '50%', paddingRight: 8 },
  recordFieldLabel: { color: colors.sage, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.2 },
  recordFieldValue: { color: colors.ink, fontSize: 11, fontWeight: '800', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyStateText: { color: colors.sage, fontSize: 11, fontWeight: '700' },
  drawerRoot: { flex: 1, backgroundColor: '#F4F6F3' },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  drawerBack: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  drawerTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  drawerSubtitle: { color: colors.sage, fontSize: 10, marginTop: 2 },
  drawerBody: { flex: 1 },
  drawerBodyContent: { padding: 14, paddingBottom: 28, gap: 10 },
  drawerFooter: { flexDirection: 'row', gap: 8, backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 11, borderTopWidth: 1, borderTopColor: colors.border },
  dialogOverlay: { flex: 1, backgroundColor: 'rgba(24,50,42,0.45)', alignItems: 'center', justifyContent: 'center', padding: 26 },
  dialogCard: { width: '100%', backgroundColor: '#fff', borderRadius: radius.xl, padding: 18 },
  dialogTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  dialogBody: { color: colors.sage, fontSize: 12, lineHeight: 18, marginTop: 7 },
  dialogActions: { flexDirection: 'row', gap: 9, marginTop: 17 },
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 420, backgroundColor: colors.forest, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  toastText: { color: '#fff', fontSize: 11, fontWeight: '700', flexShrink: 1 },
  flow: { gap: 2 },
  flowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flowNode: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.mint, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 9 },
  flowNodeCompact: { paddingVertical: 7 },
  flowLabel: { color: colors.forest, fontSize: 10, fontWeight: '800', flex: 1 },
  flowLabelCompact: { fontSize: 9 },
  flowArrow: { width: 18, alignItems: 'center' },
  flowArrowLine: { position: 'absolute', left: 0, right: 4, height: 1, backgroundColor: colors.leaf },
  segWrap: { gap: 7, paddingVertical: 2 },
  seg: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 8 },
  segActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  segText: { color: colors.sage, fontSize: 11, fontWeight: '800' },
  segTextActive: { color: '#fff' },
  progressRow: { marginBottom: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  progressLabel: { color: colors.sage, fontSize: 11, fontWeight: '700', flex: 1, marginRight: 8 },
  progressValue: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  stepFlow: { gap: 0 },
  stepFlowRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  stepDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#DCE5E0', alignItems: 'center', justifyContent: 'center' },
  stepDotDone: { backgroundColor: colors.cta },
  stepDotText: { color: colors.sage, fontSize: 10, fontWeight: '900' },
  stepDotTextDone: { color: '#fff' },
  stepLine: { width: 2, height: 14, backgroundColor: '#DCE5E0' },
  stepLineDone: { backgroundColor: colors.leaf },
  stepLabel: { color: colors.sage, fontSize: 11, flex: 1 },
  stepLabelDone: { color: colors.forest, fontWeight: '800' },
});

export { colors, radius };
export type { IconName };