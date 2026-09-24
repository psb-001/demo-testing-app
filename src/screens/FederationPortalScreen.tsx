import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COOP_SOCIETIES, WORKERS_LIST } from '../data/mockData';
import { AREA_DEMAND, SKILL_GAPS } from '../portals/coop/coopData';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader, StatusPill } from '../components/portal';

export default function FederationPortalScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const totalMembers = COOP_SOCIETIES.reduce((sum, society) => sum + society.members, 0);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><View style={styles.heroCircle} /><Text style={styles.kicker}>FEDERATION OVERSIGHT</Text><Text style={styles.heading}>Welcome, {user?.name.split(' ')[0] || 'admin'}</Text><Text style={styles.subheading}>A clear view across member societies, workers, demand, and welfare.</Text><View style={styles.heroStatus}><Ionicons name="shield-checkmark" size={15} color="#B7F0CD" /><Text style={styles.heroStatusText}>All member systems reporting · demo network</Text></View></View>
      <View style={styles.metricGrid}><MetricCard label="Member societies" value={String(COOP_SOCIETIES.length)} detail="verified cooperatives" icon="business-outline" /><MetricCard label="Total members" value={totalMembers.toLocaleString('en-IN')} detail="across societies" accent icon="people-outline" /><MetricCard label="Verified workers" value={String(WORKERS_LIST.filter((worker) => worker.verified).length)} detail="on platform" icon="shield-checkmark-outline" /><MetricCard label="Open skill gaps" value={String(SKILL_GAPS.filter((gap) => gap.gap > 0).length)} detail="need planning" icon="analytics-outline" /></View>
      <View style={styles.actionRow}><Pressable style={styles.actionCard} onPress={() => navigation.navigate('Societies')}><View style={styles.actionIcon}><Ionicons name="business" size={19} color={colors.leaf} /></View><Text style={styles.actionTitle}>View societies</Text><Text style={styles.actionBody}>Coverage and membership</Text></Pressable><Pressable style={styles.actionCard} onPress={() => navigation.navigate('Demand')}><View style={styles.actionIcon}><Ionicons name="trending-up" size={19} color={colors.alert} /></View><Text style={styles.actionTitle}>Plan demand</Text><Text style={styles.actionBody}>Forecast supply gaps</Text></Pressable></View>
      <SectionHeader title="Demand across the network" action="Coverage" onAction={() => navigation.navigate('Coverage')} />
      <View style={styles.demandCard}>{AREA_DEMAND.slice(0, 7).map((item) => <View key={`${item.area}-${item.trade}`} style={styles.demandRow}><View style={styles.demandDot} /><View style={{ flex: 1 }}><Text style={styles.demandArea}>{item.area}</Text><Text style={styles.demandTrade}>{item.trade}</Text></View><StatusPill label={item.level} tone={item.level === 'High' ? 'red' : item.level === 'Medium' ? 'amber' : 'slate'} /></View>)}</View>
      <SectionHeader title="Member society pulse" action="See all" onAction={() => navigation.navigate('Societies')} />
      <View style={styles.societyCard}>{COOP_SOCIETIES.slice(0, 4).map((society) => <View key={society.id} style={styles.societyRow}><View style={styles.societyMark}><Text style={styles.societyMarkText}>{society.name.slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={styles.societyName}>{society.name}</Text><Text style={styles.societyMeta}>{society.members} members · {society.area}</Text></View><StatusPill label="Verified" tone="green" /></View>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Federation metrics aggregate the same demo store as the web app.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  hero: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 18, overflow: 'hidden' },
  heroCircle: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(46,139,87,0.25)', right: -65, top: -80 },
  kicker: { color: '#B7F0CD', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 7 },
  subheading: { color: '#D5F0DF', fontSize: 11, lineHeight: 16, marginTop: 5, maxWidth: 300 },
  heroStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  heroStatusText: { color: '#D5F0DF', fontSize: 10, fontWeight: '800' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 11 },
  actionIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: colors.ink, fontSize: 11, fontWeight: '900', marginTop: 8 },
  actionBody: { color: colors.sage, fontSize: 9, marginTop: 3 },
  demandCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  demandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  demandDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.alert },
  demandArea: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  demandTrade: { color: colors.sage, fontSize: 9, marginTop: 2 },
  societyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  societyRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  societyMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  societyMarkText: { color: colors.forest, fontSize: 14, fontWeight: '900' },
  societyName: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  societyMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
