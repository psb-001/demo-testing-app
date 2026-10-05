import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader, StatusPill } from '../components/portal';

export default function WorkerPassportScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const firstName = user?.name || 'Worker';
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.passportHero}><View style={styles.passportMark}><Ionicons name="shield-checkmark" size={27} color="#B7F0CD" /></View><Text style={styles.heroKicker}>DIGITAL SKILL PASSPORT</Text><Text style={styles.heroName}>{firstName}</Text><Text style={styles.heroMeta}>{user?.tradeLabel || 'Electrician'} · {user?.area || 'Pune'} · Cooperative verified</Text><StatusPill label="VERIFIED MEMBER" tone="green" /></View>
      <View style={styles.metricGrid}><MetricCard label="Experience" value={`${user?.experienceYears || 8} yrs`} detail="trade experience" icon="briefcase-outline" /><MetricCard label="Rating" value="4.8 / 5" detail="54 reviews" accent icon="star-outline" /><MetricCard label="Service radius" value={`${user?.serviceRadiusKm || 8} km`} detail="around Pune" icon="navigate-outline" /><MetricCard label="Completed" value="54" detail="jobs" icon="checkmark-circle-outline" /></View>
      <SectionHeader title="Verified profile" action="Share" onAction={() => navigation.navigate('Account')} />
      <View style={styles.card}><InfoRow icon="ribbon-outline" label="Trade certification" value="NCCT-MH-EL-2015-8821" /><InfoRow icon="card-outline" label="Cooperative membership" value="PECS-10291" /><InfoRow icon="shield-checkmark-outline" label="Insurance policy" value="PM-JAY-COOP-449219" /><InfoRow icon="language-outline" label="Languages" value="Marathi · Hindi · English" /></View>
      <SectionHeader title="Skills" />
      <View style={styles.skills}>{(user?.skills || ['Ceiling fan installation', 'Switchboard wiring', 'MCB repair']).map((skill) => <View key={skill} style={styles.skill}><Ionicons name="checkmark-circle" size={14} color={colors.leaf} /><Text style={styles.skillText}>{skill}</Text></View>)}</View>
      <SectionHeader title="Welfare cover" />
      <View style={styles.welfareCard}><View style={styles.welfareIcon}><Ionicons name="heart" size={20} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Accident + tool insurance</Text><Text style={styles.cardText}>Your cooperative contribution keeps you covered while you work.</Text></View><Ionicons name="chevron-forward" size={16} color={colors.sage} /></View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Passport data is illustrative and ready to connect to a verification API.</Text></View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return <View style={styles.infoRow}><View style={styles.infoIcon}><Ionicons name={icon} size={16} color={colors.teal} /></View><View style={{ flex: 1 }}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View><Ionicons name="checkmark-circle" size={17} color={colors.verified} /></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  passportHero: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 18 },
  passportMark: { width: 52, height: 52, borderRadius: 18, backgroundColor: 'rgba(183,240,205,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroKicker: { color: '#B7F0CD', fontSize: 10, fontWeight: '900', letterSpacing: 0.8, marginTop: 15 },
  heroName: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 4 },
  heroMeta: { color: '#D5F0DF', fontSize: 11, marginTop: 4, marginBottom: 12 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  infoRowLast: { borderBottomWidth: 0 },
  infoIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: colors.sage, fontSize: 9 },
  infoValue: { color: colors.ink, fontSize: 11, fontWeight: '800', marginTop: 2 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  skill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.mint, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 7 },
  skillText: { color: colors.forest, fontSize: 10, fontWeight: '800' },
  welfareCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, flexDirection: 'row', alignItems: 'center' },
  welfareIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  cardText: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
