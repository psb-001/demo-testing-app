import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../i18n';
import { locationT, type LocationText } from '../../data/locationText';
import { formatAddressLines, shortLocationLabel } from '../../services/locationService';
import { useLocation } from '../../context/LocationContext';
import { LocationSelector } from './LocationSelector';
import { colors, radius } from '../../theme/theme';

/**
 * Saved addresses — ported from
 * workconnect/src/components/location/SavedAddresses.tsx.
 *
 * A self-contained card for the customer portal: list the stored addresses with
 * use / set-default / delete, plus "add new". Owns its own `LocationSelector`
 * modal so a caller only has to drop this card in.
 */

export function SavedAddresses({ compact = false }: { compact?: boolean }) {
  const { lang } = useI18n();
  const t: LocationText = locationT(lang);
  const { savedAddresses, setLocation, setDefaultAddress, removeAddress } = useLocation();
  const [adding, setAdding] = React.useState(false);

  if (savedAddresses.length === 0 && !adding) {
    return (
      <>
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={20} color={colors.leaf} />
          <Text style={styles.emptyText}>{t.noSavedAddresses}</Text>
        </View>
        <AddButton label={t.addNewAddress} onPress={() => setAdding(true)} />
        <LocationModal visible={adding} onClose={() => setAdding(false)} allowSave />
      </>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {savedAddresses.map((addr) => (
        <View key={addr.id ?? addr.formattedAddress} style={styles.card}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.useThisLocation}
            onPress={() => setLocation(addr)}
            style={({ pressed }) => [styles.main, pressed && styles.pressed]}
          >
            <View style={styles.iconWrap}>
              <Ionicons name="bookmark" size={14} color={colors.leaf} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Row>
                <Text style={styles.label} numberOfLines={1}>
                  {addr.label ?? shortLocationLabel(addr)}
                </Text>
                {addr.isDefault ? <Tag text={t.default} /> : null}
                {addr.source === 'gps' ? <Tag text={t.locationSourceGps} /> : null}
                {addr.source === 'manual' ? <Tag text={t.locationSourceManual} /> : null}
              </Row>
              {!compact
                ? formatAddressLines(addr).map((line) => (
                    <Text key={line} style={styles.line} numberOfLines={1}>{line}</Text>
                  ))
                : (
                  <Text style={styles.line} numberOfLines={1}>{addr.formattedAddress ?? shortLocationLabel(addr)}</Text>
                )}
            </View>
          </Pressable>

          <Row style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.useThisLocation}
              onPress={() => setLocation(addr)}
              style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}
            >
              <Text style={styles.actionPrimaryText}>{t.useThisLocation}</Text>
            </Pressable>
            {!addr.isDefault ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.setDefault}
                onPress={() => setDefaultAddress(addr.id!)}
                style={({ pressed }) => [styles.actionGhost, pressed && styles.pressed]}
              >
                <Text style={styles.actionGhostText}>{t.setDefault}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.delete}
              onPress={() => removeAddress(addr.id!)}
              style={({ pressed }) => [styles.actionGhost, styles.actionDanger, pressed && styles.pressed]}
            >
              <Ionicons name="trash-outline" size={13} color={colors.danger} />
            </Pressable>
          </Row>
        </View>
      ))}
      <AddButton label={t.addNewAddress} onPress={() => setAdding(true)} />
      <LocationModal visible={adding} onClose={() => setAdding(false)} allowSave />
    </View>
  );
}

/** The location trigger chip — ported from `LocationTrigger`. */
export function LocationTrigger({
  onOpen,
  variant = 'card',
}: {
  onOpen: () => void;
  variant?: 'hero' | 'card';
}) {
  const { lang } = useI18n();
  const t: LocationText = locationT(lang);
  const { location, isDemoLocation } = useLocation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.changeLocation}
      onPress={onOpen}
      style={({ pressed }) => [
        variant === 'hero' ? styles.triggerHero : styles.triggerCard,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="location" size={14} color={colors.forest} />
      <Text style={styles.triggerText} numberOfLines={1}>
        {isDemoLocation ? `${t.demoLocation}: ${shortLocationLabel(location)}` : shortLocationLabel(location)}
      </Text>
      {isDemoLocation ? <Tag text="Demo" /> : null}
      <Ionicons name="chevron-down" size={13} color={colors.sage} />
    </Pressable>
  );
}

/** Read-only summary row with an optional provenance badge. */
export function LocationSummary({ onChange }: { onChange?: () => void }) {
  const { lang } = useI18n();
  const t: LocationText = locationT(lang);
  const { location, isDemoLocation } = useLocation();

  return (
    <View style={styles.summary}>
      <Row style={{ marginBottom: 6 }}>
        <Text style={styles.summaryLabel}>{t.serviceLocation}</Text>
        {isDemoLocation ? <Tag text="Demo" /> : null}
        <Tag text={location.source === 'gps' ? t.locationSourceGps : t.locationSourceManual} />
        {location.isDefault ? <Tag text={t.default} /> : null}
      </Row>
      {formatAddressLines(location).map((line) => (
        <Text key={line} style={styles.summaryLine}>{line}</Text>
      ))}
      {onChange ? (
        <Pressable accessibilityRole="button" onPress={onChange} style={styles.changeBtn}>
          <Text style={styles.changeText}>{t.changeLocation}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ── Pieces ────────────────────────────────────────────────────────────── */

function LocationModal({
  visible,
  onClose,
  allowSave = false,
}: {
  visible: boolean;
  onClose: () => void;
  allowSave?: boolean;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <LocationSelector visible={visible} onClose={onClose} allowSave={allowSave} />
    </Modal>
  );
}

const AddButton: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
  >
    <Ionicons name="add" size={16} color={colors.forest} />
    <Text style={styles.addText}>{label}</Text>
  </Pressable>
);

const Tag: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

const Row: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[styles.row, style]}>{children}</View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, gap: 9 },
  main: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  iconWrap: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.ink, fontSize: 12, fontWeight: '900', flexShrink: 1 },
  line: { color: colors.sage, fontSize: 10, marginTop: 2 },
  actions: { gap: 7 },
  actionPrimary: { backgroundColor: colors.cta, borderRadius: 9, paddingVertical: 9, alignItems: 'center' },
  actionPrimaryText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  actionGhost: { borderWidth: 1, borderColor: colors.border, borderRadius: 9, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  actionGhostText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  actionDanger: { borderColor: '#F2B8B8', flexDirection: 'row' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.md, paddingVertical: 12, backgroundColor: '#fff' },
  addText: { color: colors.forest, fontSize: 11, fontWeight: '900' },
  tag: { backgroundColor: colors.mint, borderRadius: 9, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: colors.teal, fontSize: 8, fontWeight: '900' },
  empty: { alignItems: 'center', gap: 7, paddingVertical: 18, backgroundColor: colors.mint, borderRadius: radius.md, borderWidth: 1, borderColor: '#C5E8D2' },
  emptyText: { color: colors.sage, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  triggerCard: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.mint, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 7 },
  triggerHero: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11, alignSelf: 'flex-start' },
  triggerText: { color: colors.forest, fontSize: 12, fontWeight: '900', flexShrink: 1 },
  summary: { backgroundColor: colors.warm, borderRadius: radius.md, padding: 12 },
  summaryLabel: { color: colors.sage, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.3 },
  summaryLine: { color: colors.ink, fontSize: 11, lineHeight: 16 },
  changeBtn: { marginTop: 8, alignSelf: 'flex-start' },
  changeText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  pressed: { opacity: 0.75 },
});