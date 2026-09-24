import React, { useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVICES_LIST, WORKERS_LIST, TRANSLATIONS } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import { SectionTitle, WorkerCard, PrimaryButton, GhostButton } from '../components/ui';
import { resolveCityCoords, CITY_COORDS } from '../services/mapService';

const CITIES = [...Object.keys(CITY_COORDS), 'Pune'];

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { language, setLanguage, searchQuery, setSearchQuery, selectedServiceSlug, setSelectedServiceSlug, userArea, setUserArea, setUserLocation } = useAppState();
  const { user } = useAuth();
  const t = TRANSLATIONS[language as 'en' | 'hi' | 'mr'] ?? TRANSLATIONS.en;

  const filtered = useMemo(() => {
    return WORKERS_LIST.filter((w) => {
      if (selectedServiceSlug && w.trade !== selectedServiceSlug) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!`${w.name} ${w.tradeLabel} ${w.specialty} ${w.skills.join(' ')}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [selectedServiceSlug, searchQuery]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>WorkConnect • Cooperative-owned</Text>
        <Text style={styles.h1}>{t.heroTitle1} <Text style={{ color: colors.leaf }}>{t.heroHighlight}</Text> {t.heroTitle2}</Text>
        <Text style={styles.sub}>{t.heroSubtitle}</Text>
        <TextInput
          style={styles.search}
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.sage}
        />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity style={styles.cta} onPress={() => nav.navigate('Workers')}>
            <Text style={styles.ctaText}>{t.findWorkersBtn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghost} onPress={() => nav.navigate('Map')}>
            <Text style={styles.ghostText}>Map</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {['en', 'hi', 'mr'].map((l) => (
            <TouchableOpacity key={l} style={[styles.lang, language === l && styles.langActive]} onPress={() => setLanguage(l as any)}>
              <Text style={[styles.langText, language === l && { color: '#fff' }]}>{l.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.bullet}>✓ {t.bulletVerified}</Text>
          <Text style={styles.bullet}>✓ {t.bulletWages}</Text>
          <Text style={styles.bullet}>✓ {t.bulletInsured}</Text>
        </View>
      </View>

      <SectionTitle title="Choose city" subtitle="Map + matching recenter instantly" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CITIES.slice(0, 7).map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, userArea === c && styles.chipActive]}
            onPress={() => {
              setUserArea(c);
              const coords = resolveCityCoords(c);
              setUserLocation({ ...coords, label: c });
            }}
          >
            <Text style={[styles.chipText, userArea === c && { color: '#fff' }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="SIH 2026 Readiness" subtitle={t.moreThanApp} />
      <View style={styles.grid}>
        {[
          { label: 'Emergency (15–20 min)', fn: () => nav.navigate('Emergency', {}) },
          { label: 'Welfare & Insurance', fn: () => nav.navigate('Welfare') },
          { label: 'Demand Forecast', fn: () => nav.navigate('Admin', { tab: 'forecast' }) },
          { label: 'Fair-Share Allocation', fn: () => nav.navigate('Admin', { tab: 'fairshare' }) },
          { label: 'Join as Worker', fn: () => nav.navigate('Auth', { mode: 'signup' }) },
          { label: 'Ask Rozgar AI', fn: () => nav.navigate('AI') },
        ].map((a) => (
          <TouchableOpacity key={a.label} style={styles.tile} onPress={a.fn}>
            <Text style={styles.tileText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="17+ Household Services" subtitle="Tap to filter workers below" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SERVICES_LIST.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.chip, selectedServiceSlug === s.slug && styles.chipActive]}
            onPress={() => setSelectedServiceSlug(selectedServiceSlug === s.slug ? null : s.slug)}
          >
            <Text style={[styles.chipText, selectedServiceSlug === s.slug && { color: '#fff' }]}>
              {s.name}{s.floorPrice ? ` • ₹${s.floorPrice}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title={`Top-rated workers${selectedServiceSlug ? ` • ${selectedServiceSlug}` : ''}`} subtitle={`${filtered.length} verified`} />
      {filtered.map((w) => (
        <WorkerCard
          key={w.id}
          worker={w}
          onBook={() => nav.navigate('Booking', { workerId: w.id })}
          onView={() => nav.navigate('WorkerDetail', { workerId: w.id })}
        />
      ))}

      {user ? (
        <View style={{ marginTop: 12, gap: 8 }}>
          <PrimaryButton label={`Open my portal (${user.role})`} onPress={() => {
            if (user.role === 'customer') nav.navigate('CustomerPortal');
            else if (user.role === 'worker') nav.navigate('WorkerPortal');
            else if (user.role === 'cooperative') nav.navigate('CooperativePortal');
            else nav.navigate('FederationPortal');
          }} />
        </View>
      ) : (
        <View style={{ marginTop: 12, gap: 8 }}>
          <PrimaryButton label="Login / Signup" onPress={() => nav.navigate('Auth', { mode: 'login' })} />
          <GhostButton label="Continue as guest" onPress={() => nav.navigate('Workers')} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm },
  hero: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  kicker: { fontSize: 11, fontWeight: '800', color: colors.leaf, letterSpacing: 1 },
  h1: { fontSize: 22, fontWeight: '900', color: colors.ink, marginTop: 6 },
  sub: { fontSize: 13, color: colors.sage, marginTop: 6, lineHeight: 18 },
  search: {
    backgroundColor: colors.warm, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12, fontSize: 14, color: colors.ink,
  },
  cta: { flex: 1, backgroundColor: colors.cta, borderRadius: radius.md, padding: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' },
  ghost: { padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', minWidth: 90, alignItems: 'center' },
  ghostText: { color: colors.ink, fontWeight: '700' },
  lang: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  langActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  langText: { fontWeight: '800', fontSize: 12, color: colors.ink },
  bullet: { fontSize: 12, color: colors.ink, marginTop: 2 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexBasis: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12 },
  tileText: { fontSize: 13, fontWeight: '700', color: colors.ink },
});
