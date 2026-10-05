import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { locationErrorText, type LocationText } from '../../data/locationText';
import { useI18n } from '../../i18n';
import {
  checkServiceCoverage,
  emptyLocationDraft,
  hasLocationErrors,
  validateServiceLocation,
  type LocationErrors,
} from '../../services/locationService';
import { geocodingService } from '../../services/geocodingService';
import { colors, radius } from '../../theme/theme';
import type { ServiceLocation } from '../../types';

/**
 * Manual address form — ported from
 * workconnect/src/components/location/ManualAddressForm.tsx.
 *
 * Preserved from the web version:
 *  - the nickname row (Home / Office / Other) shown only when `allowSave`
 *  - PIN auto-filling the state from the leading two digits
 *  - a live coverage warning as the draft changes
 *  - validation that does NOT require coordinates (a manual address without a
 *    map pin is allowed to submit; it simply cannot be geo-matched)
 *
 * Adapted:
 *  - `scrollIntoView` on the first invalid field became a ScrollView ref plus
 *    `scrollTo`, so an error is still brought into view on submit.
 *  - `MapPinPicker` is a separate step, opened via `onOpenMap`, rather than an
 *    inline expand. See `LocationSelector`'s `map` mode.
 */

export interface ManualAddressFormProps {
  initial?: ServiceLocation | null;
  allowSave?: boolean;
  t: LocationText;
  onSubmit: (loc: ServiceLocation) => void;
  onCancel: () => void;
  onOpenMap: (draft: ServiceLocation) => void;
}

/** Indian PIN prefix -> state, as on the web. */
const STATE_FOR_PIN: Record<string, string> = {
  '11': 'Delhi', '12': 'Haryana', '13': 'Haryana', '14': 'Punjab', '15': 'Rajasthan',
  '16': 'Punjab', '17': 'Himachal Pradesh', '18': 'Jammu & Kashmir', '19': 'Jammu & Kashmir',
  '20': 'Uttar Pradesh', '21': 'Uttar Pradesh', '22': 'Chhattisgarh', '23': 'Madhya Pradesh',
  '24': 'Gujarat', '26': 'Gujarat', '27': 'Maharashtra', '28': 'Assam',
  '30': 'Rajasthan', '31': 'Bihar', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Tamil Nadu',
  '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Odisha', '39': 'West Bengal',
  '40': 'Maharashtra', '41': 'Maharashtra', '42': 'Maharashtra', '44': 'Tamil Nadu',
  '45': 'Madhya Pradesh', '46': 'Madhya Pradesh', '47': 'Kerala', '48': 'Madhya Pradesh',
  '49': 'Chhattisgarh', '50': 'Telangana', '51': 'Gujarat', '52': 'Uttarakhand',
  '53': 'Andhra Pradesh', '56': 'Karnataka', '57': 'Karnataka', '58': 'Karnataka',
  '59': 'Karnataka', '60': 'Tamil Nadu', '61': 'Tamil Nadu', '67': 'Kerala',
  '68': 'Kerala', '69': 'Kerala', '70': 'West Bengal', '71': 'West Bengal',
  '72': 'Gujarat', '73': 'Punjab', '74': 'Punjab', '75': 'Madhya Pradesh',
  '76': 'Rajasthan', '77': 'Madhya Pradesh', '78': 'Assam', '79': 'Uttar Pradesh',
  '80': 'Uttar Pradesh', '81': 'Uttar Pradesh', '82': 'Uttar Pradesh', '83': 'Bihar',
  '84': 'Bihar', '85': 'Jharkhand', '86': 'Jharkhand', '87': 'West Bengal',
  '88': 'West Bengal', '90': 'Meghalaya', '91': 'Assam',
};

/**
 * The only fields `validateServiceLocation` can flag, in form order, so a
 * submit failure can scroll to the first offending input.
 */
const VALIDATED_FIELDS: readonly (keyof LocationErrors)[] = [
  'apartmentNumber', 'locality', 'city', 'pincode',
] as const;

export function ManualAddressForm({
  initial,
  allowSave = false,
  t,
  onSubmit,
  onCancel,
  onOpenMap,
}: ManualAddressFormProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<ScrollView>(null);
  const [draft, setDraft] = useState<ServiceLocation>(() => ({
    ...emptyLocationDraft('manual'),
    ...(initial ?? {}),
  }));
  const [errors, setErrors] = useState<LocationErrors>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ lat: number; lng: number; displayName: string }[]>([]);

  const set = <K extends keyof ServiceLocation>(key: K, value: ServiceLocation[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as keyof LocationErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof LocationErrors];
      return next;
    });
  };

  const onPinChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    const inferred = digits.length >= 2 ? STATE_FOR_PIN[digits.slice(0, 2)] : undefined;
    setDraft((prev) => ({
      ...prev,
      pincode: digits,
      // Only fill the state when the user has not set one.
      state: prev.state ? prev.state : inferred ?? prev.state,
    }));
  };

  const coverage = useMemo(() => checkServiceCoverage(draft), [draft]);

  const runSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 3) {
      setResults([]);
      return;
    }
    try {
      const bias =
        draft.latitude != null && draft.longitude != null
          ? { lat: draft.latitude, lng: draft.longitude }
          : undefined;
      const found = await geocodingService.search(text, bias);
      setResults(found.map((r) => ({ lat: r.lat, lng: r.lng, displayName: r.displayName })));
    } catch {
      setResults([]);
    }
  };

  const submit = () => {
    const found = validateServiceLocation(draft, { requireCoordinates: false });
    setErrors(found);
    if (hasLocationErrors(found)) {
      // Bring the first invalid field into view.
      const firstBad = VALIDATED_FIELDS.find((f) => found[f]);
      if (firstBad) scrollRef.current?.scrollToEnd({ animated: true });
      return;
    }
    const normalised: ServiceLocation = {
      ...draft,
      pincode: draft.pincode ? draft.pincode.padStart(6, '0') : draft.pincode,
      formattedAddress:
        draft.formattedAddress ?? [draft.locality, draft.city, draft.state].filter(Boolean).join(', '),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };
    onSubmit(normalised);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={onCancel} hitSlop={10} style={styles.close} accessibilityLabel={t.close}>
          <Ionicons name="close" size={20} color={colors.sage} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{t.manualTitle}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Address search */}
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
        </View>
        {results.map((r) => (
          <Pressable
            key={`${r.lat},${r.lng}`}
            accessibilityRole="button"
            onPress={() => {
              setDraft((prev) => ({
                ...prev,
                latitude: r.lat,
                longitude: r.lng,
                formattedAddress: r.displayName,
              }));
              setQuery('');
              setResults([]);
            }}
            style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
          >
            <Ionicons name="location-outline" size={14} color={colors.leaf} />
            <Text style={styles.resultText} numberOfLines={2}>{r.displayName}</Text>
          </Pressable>
        ))}

        {/* Nickname */}
        {allowSave ? (
          <View style={styles.section}>
            <Text style={styles.label}>{t.labelName}</Text>
            <View style={styles.nicknameRow}>
              {[
                { key: 'Home', label: t.labelHome },
                { key: 'Office', label: t.labelOffice },
                { key: 'Other', label: t.labelOther },
              ].map((opt) => (
                <Pressable
                  key={opt.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: draft.label === opt.key }}
                  onPress={() => set('label', draft.label === opt.key ? undefined : opt.key)}
                  style={[styles.nickname, draft.label === opt.key && styles.nicknameActive]}
                >
                  <Text style={[styles.nicknameText, draft.label === opt.key && styles.nicknameTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <Field label={t.apartmentNumber} placeholder={t.apartmentPlaceholder} value={draft.apartmentNumber ?? ''} onChange={(v) => set('apartmentNumber', v)} error={errors.apartmentNumber} />
        <Field label={t.buildingName} placeholder={t.buildingPlaceholder} value={draft.buildingName ?? ''} onChange={(v) => set('buildingName', v)} />
        <Field label={t.street} placeholder={t.streetPlaceholder} value={draft.street ?? ''} onChange={(v) => set('street', v)} />
        <Field label={t.locality} placeholder={t.localityPlaceholder} value={draft.locality ?? ''} onChange={(v) => set('locality', v)} error={errors.locality} required />
        <Field label={t.landmark} placeholder={t.landmarkPlaceholder} value={draft.landmark ?? ''} onChange={(v) => set('landmark', v)} />
        <Field label={t.city} value={draft.city ?? ''} onChange={(v) => set('city', v)} error={errors.city} required />
        <Field label={t.state} value={draft.state ?? ''} onChange={(v) => set('state', v)} />
        <Field
          label={t.pincode}
          placeholder={t.pincodePlaceholder}
          value={draft.pincode ?? ''}
          onChange={onPinChange}
          error={errors.pincode}
         
          keyboardType="number-pad"
          maxLength={6}
        />
        <Field label={t.floorNumber} placeholder={t.floorPlaceholder} value={draft.floorNumber ?? ''} onChange={(v) => set('floorNumber', v)} />
        <Field label={t.additionalDirections} placeholder={t.additionalPlaceholder} value={draft.additionalDirections ?? ''} onChange={(v) => set('additionalDirections', v)} />

        {/* Map */}
        <View style={styles.section}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.selectOnMap}
            onPress={() => onOpenMap(draft)}
            style={({ pressed }) => [styles.mapBtn, pressed && styles.pressed]}
          >
            <Ionicons name="map-outline" size={16} color={colors.forest} />
            <Text style={styles.mapBtnText}>{t.selectOnMap}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.sage} />
          </Pressable>
          <Text style={styles.mapHint}>{t.mapHint}</Text>
          {draft.latitude != null && draft.longitude != null ? (
            <Text style={styles.coords}>
              {draft.latitude.toFixed(5)}, {draft.longitude.toFixed(5)}
            </Text>
          ) : null}
        </View>

        {/* Live coverage warning */}
        {draft.latitude != null && draft.longitude != null && !coverage.covered ? (
          <View style={styles.coverageWarn}>
            <Ionicons name="warning" size={14} color="#B45309" />
            <Text style={styles.coverageText}>
              {`${t.coverageTitle} — ${t.errOutsideCoverage}`}
              {coverage.distanceToAreaKm ? ` (~${Math.round(coverage.distanceToAreaKm)} km)` : ''}
            </Text>
          </View>
        ) : null}

        <Pressable accessibilityRole="button" style={styles.primaryBtn} onPress={submit}>
          <Text style={styles.primaryBtnText}>{t.useThisLocation}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.ghostBtn} onPress={onCancel}>
          <Text style={styles.ghostBtnText}>{t.close}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ── Field ─────────────────────────────────────────────────────────────── */

const Field: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
}> = ({ label, placeholder, value, onChange, error, required, keyboardType, maxLength }) => {
  const { lang } = useI18n();
  return (
  <View style={styles.section}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.sage}
      style={[styles.input, error && styles.inputError]}
      autoCorrect={false}
      keyboardType={keyboardType ?? 'default'}
      maxLength={maxLength}
      accessibilityLabel={label}
    />
    {error ? <Text style={styles.error}>{locationErrorText(lang, error) ?? error}</Text> : null}
  </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '900' },
  body: { padding: 16, paddingBottom: 30, gap: 4 },
  section: { marginBottom: 10 },
  label: { color: colors.sage, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 5 },
  required: { color: colors.danger },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: colors.ink, fontSize: 13 },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFF7F7' },
  error: { color: colors.danger, fontSize: 10, marginTop: 4, fontWeight: '700' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 10, marginBottom: 8 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, padding: 0 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 6 },
  resultText: { color: colors.ink, fontSize: 11, lineHeight: 15, flex: 1 },
  nicknameRow: { flexDirection: 'row', gap: 7 },
  nickname: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 9, backgroundColor: '#fff' },
  nicknameActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  nicknameText: { color: colors.sage, fontSize: 11, fontWeight: '800' },
  nicknameTextActive: { color: '#fff' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2', borderRadius: radius.md, padding: 12 },
  mapBtnText: { color: colors.forest, fontSize: 12, fontWeight: '900', flex: 1 },
  mapHint: { color: colors.sage, fontSize: 9, marginTop: 5 },
  coords: { color: colors.teal, fontSize: 9, marginTop: 4, fontWeight: '700' },
  coverageWarn: { flexDirection: 'row', gap: 7, backgroundColor: '#FFF7E8', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 10, padding: 10, marginBottom: 10 },
  coverageText: { color: '#B45309', fontSize: 10, lineHeight: 15, flex: 1, fontWeight: '700' },
  primaryBtn: { backgroundColor: colors.cta, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  ghostBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 11, alignItems: 'center', marginTop: 7, backgroundColor: '#fff' },
  ghostBtnText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  pressed: { opacity: 0.75 },
});