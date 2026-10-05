import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../i18n';
import { locationT, type LocationText } from '../../data/locationText';
import {
  checkServiceCoverage,
  formatAddressLines,
  locationFromDetails,
  shortLocationLabel,
} from '../../services/locationService';
import { requestCurrentPosition } from '../../services/geolocationService';
import { geocodingService } from '../../services/geocodingService';
import { useLocation } from '../../context/LocationContext';
import { ManualAddressForm } from './ManualAddressForm';
import { MapPickerMap } from './MapPickerMap';
import { colors, radius } from '../../theme/theme';
import type { ServiceLocation } from '../../types';

/**
 * Location picker — ported from the web `LocationSelector` +
 * `CurrentLocationPanel` pair (workconnect/src/components/location/).
 *
 * The web version was a modal with a 3-state internal `mode`:
 *   choose  two option cards plus saved addresses
 *   gps     the GPS detection panel
 *   manual  the address form
 *
 * That structure is preserved. The DOM pieces are not: `document.body.style.overflow`
 * scroll locking becomes React Native `Modal` (which already captures touches), and
 * the Escape listener becomes the Android hardware back button via `onRequestClose`.
 *
 * A fourth mode is added, `map`, for the pin picker. On the web, `MapPinPicker`
 * was nested inside the manual form; as a full-screen step it is far easier to
 * use one-handed.
 */

export type LocationMode = 'choose' | 'gps' | 'manual' | 'map';

export interface LocationSelectorProps {
  visible: boolean;
  onClose: () => void;
  /** Prefill base for the manual form. Defaults to the current location. */
  initial?: ServiceLocation | null;
  onSelect?: (loc: ServiceLocation) => void;
  /** Offer to save the address (nickname row + save on confirm). */
  allowSave?: boolean;
  /** Open straight into the GPS step. */
  startInGps?: boolean;
  title?: string;
}

export function LocationSelector({
  visible,
  onClose,
  initial,
  onSelect,
  allowSave = false,
  startInGps = false,
  title,
}: LocationSelectorProps) {
  const insets = useSafeAreaInsets();
  const { lang } = useI18n();
  const t: LocationText = locationT(lang);
  const { location, savedAddresses, setLocation, saveAddress } = useLocation();

  const [mode, setMode] = useState<LocationMode>(startInGps ? 'gps' : 'choose');
  const [detected, setDetected] = useState<ServiceLocation | null>(null);
  const [geoState, setGeoState] = useState<'idle' | 'detecting' | 'failed'>('idle');
  const [geoReason, setGeoReason] = useState<string | null>(null);
  const [reverseError, setReverseError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [manualDraft, setManualDraft] = useState<ServiceLocation | null>(null);

  const base: ServiceLocation = initial ?? location;

  /** The single commit point for every path, as on the web. */
  const finish = (loc: ServiceLocation) => {
    setLocation(loc);
    if (allowSave && (loc.label || loc.id)) saveAddress(loc);
    onSelect?.(loc);
    onClose();
  };

  const detect = async () => {
    setGeoState('detecting');
    setGeoReason(null);
    const result = await requestCurrentPosition({ timeout: 12000 });
    if (result.state !== 'granted' || !result.fix) {
      setGeoState('failed');
      setGeoReason(result.reason ?? 'position-unavailable');
      setDetected(null);
      return;
    }
    setGeoState('idle');
    const { latitude, longitude } = result.fix;
    try {
      const details = await geocodingService.reverseDetails(latitude, longitude);
      setReverseError(false);
      setDetected(locationFromDetails(latitude, longitude, details, 'gps', base));
    } catch {
      // A fix without an address is still usable — the form can be filled by hand.
      setReverseError(true);
      setDetected(locationFromDetails(latitude, longitude, null, 'gps', base));
    }
  };

  const coverage = checkServiceCoverage(detected ?? base);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {mode !== 'choose' ? (
          <Pressable onPress={() => setMode('choose')} hitSlop={10} style={styles.back} accessibilityLabel={t.back}>
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
          </Pressable>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>{title ?? t.selectorTitle}</Text>
        <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityLabel={t.close}>
          <Ionicons name="close" size={20} color={colors.sage} />
        </Pressable>
      </View>

      {mode === 'choose' ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.lede}>{t.selectorSubtitle}</Text>

          <OptionCard
            icon="navigate"
            title={t.optionGpsTitle}
            body={t.optionGpsDesc}
            onPress={() => {
              setMode('gps');
              setDetected(null);
              setGeoState('idle');
            }}
          />
          <OptionCard
            icon="create-outline"
            title={t.optionManualTitle}
            body={t.optionManualDesc}
            onPress={() => {
              setManualDraft({ ...base });
              setMode('manual');
            }}
          />

          {savedAddresses.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.savedAddresses}</Text>
              {savedAddresses.map((addr) => (
                <Pressable
                  key={addr.id ?? addr.formattedAddress}
                  accessibilityRole="button"
                  accessibilityLabel={t.useThisLocation}
                  onPress={() => finish(addr)}
                  style={({ pressed }) => [styles.savedRow, pressed && styles.pressed]}
                >
                  <View style={styles.savedIcon}>
                    <Ionicons name="bookmark" size={14} color={colors.leaf} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.savedLabel} numberOfLines={1}>{addr.label ?? shortLocationLabel(addr)}</Text>
                    <Text style={styles.savedLine} numberOfLines={1}>{addr.formattedAddress ?? shortLocationLabel(addr)}</Text>
                  </View>
                  <Text style={styles.savedUse}>{t.useThisLocation} →</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>
      ) : null}

      {mode === 'gps' ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {geoState === 'idle' && !detected ? (
            <>
              <Text style={styles.lede}>{t.optionGpsDesc}</Text>
              <OptionCard icon="locate" title={t.gpsDetected} body={t.privacyNote} onPress={detect} primary />
            </>
          ) : null}

          {geoState === 'detecting' ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color={colors.cta} />
              <Text style={styles.stateTitle}>{t.gpsDetecting}</Text>
              <Text style={styles.stateBody}>{t.privacyNote}</Text>
            </View>
          ) : null}

          {geoState === 'failed' ? (
            <View style={[styles.stateCard, styles.stateCardWarn]}>
              <Ionicons name="alert-circle" size={20} color={colors.alert} />
              <Text style={styles.stateTitle}>
                {geoReason === 'permission-denied' ? t.gpsDenied : t.gpsUnavailable}
              </Text>
              {geoReason === 'permission-denied' ? (
                <Text style={styles.stateBody}>{t.gpsDeniedHelp}</Text>
              ) : null}
              <Pressable style={styles.stateAction} onPress={detect} accessibilityRole="button">
                <Text style={styles.stateActionText}>{t.gpsTryAgain}</Text>
              </Pressable>
              {/* A denial must never block booking — manual entry is always offered. */}
              <Pressable
                style={styles.stateActionGhost}
                accessibilityRole="button"
                onPress={() => {
                  setManualDraft({ ...base });
                  setMode('manual');
                }}
              >
                <Text style={styles.stateActionGhostText}>{t.gpsEnterManually}</Text>
              </Pressable>
            </View>
          ) : null}

          {detected ? (
            <>
              <View style={[styles.stateCard, styles.stateCardOk]}>
                <Ionicons name="checkmark-circle" size={20} color={colors.cta} />
                <Text style={styles.stateTitle}>{shortLocationLabel(detected)}</Text>
                {formatAddressLines(detected).map((line) => (
                  <Text key={line} style={styles.stateBody}>{line}</Text>
                ))}
                <Text style={styles.coords}>
                  {detected.latitude?.toFixed(5)}, {detected.longitude?.toFixed(5)}
                </Text>
                {reverseError ? <Text style={styles.warnText}>{t.gpsInaccurate}</Text> : null}
                {!coverage.covered ? (
                  <View style={styles.coverageWarn}>
                    <Text style={styles.warnText}>{`${t.coverageTitle} — ${t.errOutsideCoverage}`}</Text>
                  </View>
                ) : null}
              </View>

              {editing ? (
                <View style={styles.section}>
                  <AddressSearchBox
                    value={detected}
                    t={t}
                    onPick={(picked) => setDetected({ ...detected, ...picked, source: 'gps' })}
                    onManual={() => {
                      setManualDraft({ ...detected });
                      setMode('manual');
                    }}
                  />
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                style={styles.primaryBtn}
                onPress={() => finish(detected)}
              >
                <Text style={styles.primaryBtnText}>{t.gpsConfirm}</Text>
              </Pressable>
              <View style={styles.row}>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.ghostBtn, styles.flex]}
                  onPress={() => setEditing((v) => !v)}
                >
                  <Text style={styles.ghostBtnText}>{t.gpsEdit}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.ghostBtn, styles.flex]}
                  onPress={() => {
                    setManualDraft({ ...detected });
                    setMode('manual');
                  }}
                >
                  <Text style={styles.ghostBtnText}>{t.gpsEnterManually}</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </ScrollView>
      ) : null}

      {mode === 'manual' ? (
        <ManualAddressForm
          initial={manualDraft ?? base}
          allowSave={allowSave}
          t={t}
          onCancel={() => setMode('choose')}
          onSubmit={finish}
          onOpenMap={(current) => {
            setManualDraft(current);
            setMode('map');
          }}
        />
      ) : null}

      {mode === 'map' ? (
        <MapPickerMap
          value={manualDraft ?? base}
          t={t}
          onCancel={() => setMode('manual')}
          onConfirm={(point) => {
            // Return to the manual form with the resolved address prefilled.
            setManualDraft({
              ...(manualDraft ?? base),
              latitude: point.lat,
              longitude: point.lng,
            });
            setMode('manual');
          }}
        />
      ) : null}

      <View style={[styles.privacy, { paddingBottom: insets.bottom + 10 }]}>
        <Ionicons name="lock-closed" size={12} color={colors.sage} />
        <Text style={styles.privacyText}>{t.privacyNote}</Text>
      </View>
    </View>
  );
}

/* ── Pieces ────────────────────────────────────────────────────────────── */

const OptionCard: React.FC<{
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  onPress: () => void;
  primary?: boolean;
}> = ({ icon, title, body, onPress, primary }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={title}
    onPress={onPress}
    style={({ pressed }) => [styles.option, primary && styles.optionPrimary, pressed && styles.pressed]}
  >
    <View style={[styles.optionIcon, primary && styles.optionIconPrimary]}>
      <Ionicons name={icon} size={17} color={primary ? '#fff' : colors.forest} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionBody}>{body}</Text>
    </View>
    <Ionicons name="chevron-forward" size={15} color={colors.sage} />
  </Pressable>
);

/**
 * Address autocomplete. The web version debounced 450ms and showed an absolutely
 * positioned dropdown; results render inline here, which avoids z-order problems
 * inside a scrolling parent and removes the need for a `z-[900]` overlay.
 */
function AddressSearchBox({
  value,
  t,
  onPick,
  onManual,
}: {
  value: ServiceLocation;
  t: LocationText;
  onPick: (picked: ServiceLocation) => void;
  onManual: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ lat: number; lng: number; displayName: string }[]>([]);
  const [busy, setBusy] = useState(false);

  const runSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 3) {
      setResults([]);
      return;
    }
    setBusy(true);
    try {
      const bias =
        value.latitude != null && value.longitude != null
          ? { lat: value.latitude, lng: value.longitude }
          : undefined;
      const found = await geocodingService.search(text, bias);
      setResults(found.map((r) => ({ lat: r.lat, lng: r.lng, displayName: r.displayName })));
    } catch {
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={15} color={colors.sage} />
        <TextInput
          value={query}
          onChangeText={runSearch}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.sage}
          style={styles.searchInput}
          autoCorrect={false}
          accessibilityLabel={t.searchPlaceholder}
        />
        {busy ? <ActivityIndicator size="small" color={colors.cta} /> : null}
      </View>
      {results.map((r) => (
        <Pressable
          key={`${r.lat},${r.lng}`}
          accessibilityRole="button"
          onPress={() => {
            onPick(locationFromDetails(r.lat, r.lng, null, value.source, value));
            setQuery('');
            setResults([]);
          }}
          style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
        >
          <Ionicons name="location-outline" size={14} color={colors.leaf} />
          <Text style={styles.resultText} numberOfLines={2}>{r.displayName}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={onManual} style={styles.linkBtn}>
        <Text style={styles.linkBtnText}>{t.gpsEnterManually}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '900' },
  body: { padding: 16, paddingBottom: 24, gap: 10 },
  lede: { color: colors.sage, fontSize: 12, lineHeight: 17 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  optionPrimary: { borderColor: colors.cta },
  optionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  optionIconPrimary: { backgroundColor: colors.cta },
  optionTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  optionBody: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  section: { gap: 8, marginTop: 6 },
  sectionTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 11 },
  savedIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  savedLabel: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  savedLine: { color: colors.sage, fontSize: 10, marginTop: 2 },
  savedUse: { color: colors.teal, fontSize: 10, fontWeight: '900' },
  stateCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, gap: 5, alignItems: 'center' },
  stateCardWarn: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', alignItems: 'flex-start' },
  stateCardOk: { backgroundColor: '#F2FAF6', borderColor: 'rgba(22,138,91,0.2)', alignItems: 'flex-start' },
  stateTitle: { color: colors.ink, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  stateBody: { color: colors.sage, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  coords: { color: colors.sage, fontSize: 9, marginTop: 3 },
  warnText: { color: '#B45309', fontSize: 10, lineHeight: 15, fontWeight: '700' },
  coverageWarn: { backgroundColor: '#FFF7E8', borderRadius: 9, padding: 9, marginTop: 5, alignSelf: 'stretch' },
  stateAction: { backgroundColor: colors.cta, borderRadius: 9, paddingHorizontal: 13, paddingVertical: 9, marginTop: 8, alignSelf: 'stretch', alignItems: 'center' },
  stateActionText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  stateActionGhost: { borderWidth: 1, borderColor: colors.border, borderRadius: 9, paddingHorizontal: 13, paddingVertical: 9, marginTop: 7, alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#fff' },
  stateActionGhostText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
  flex: { flex: 1 },
  primaryBtn: { backgroundColor: colors.cta, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  ghostBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: '#fff' },
  ghostBtnText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: '#fff' },
  privacyText: { color: colors.sage, fontSize: 9, flex: 1, lineHeight: 13 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, padding: 0 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10 },
  resultText: { color: colors.ink, fontSize: 11, lineHeight: 15, flex: 1 },
  linkBtn: { paddingVertical: 6 },
  linkBtnText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  pressed: { opacity: 0.75 },
});