import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AREA_DEMAND, COP_REQUESTS, COP_TRANSACTIONS, COP_WORKERS } from '../portals/coop/coopData';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, QuickAction, SectionHeader, StatusPill } from '../components/portal';

export default function CooperativePortalScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const openRequests = COP_REQUESTS.filter((request) => request.status === 'New' || request.status === 'Matching');
  const pendingVerification = COP_WORKERS.filter((worker) => worker.verification.status === 'Pending' || worker.verification.status === 'Under Review');
  const overloaded = COP_WORKERS.filter((worker) => worker.workload === 'Overloaded');
  const highDemand = useMemo(() => AREA_DEMAND.filter((area) => area.level === 'High').slice(0, 3), []);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.command}><View style={styles.commandCircle} /><Text style={styles.commandKicker}>COOPERATIVE COMMAND CENTER</Text><Text style={styles.commandTitle}>Good morning, {user?.name.split(' ')[0] || 'admin'}</Text><Text style={styles.commandSub}>Keep requests moving, protect fair work, and keep the roster healthy.</Text><View style={styles.commandStatus}><View style={styles.liveDot} /><Text style={styles.commandStatusText}>Operations are live · {openRequests.length} requests need attention</Text></View></View>
      <View style={styles.metricGrid}><MetricCard label="Open requests" value={String(openRequests.length)} detail="new or matching" icon="document-text-outline" /><MetricCard label="Available workers" value={String(COP_WORKERS.filter((worker) => worker.availableToday).length)} detail="ready today" accent icon="people-outline" /><MetricCard label="Verification queue" value={String(pendingVerification.length)} detail="needs review" icon="shield-checkmark-outline" /><MetricCard label="Pending payouts" value={String(COP_TRANSACTIONS.filter((transaction) => transaction.status === 'Pending').length)} detail="settlement" icon="wallet-outline" /></View>
      <View style={styles.quickGrid}><QuickAction icon="document-text-outline" label="Review requests" onPress={() => navigation.navigate('Requests')} /><QuickAction icon="people-outline" label="Manage workforce" onPress={() => navigation.navigate('Workforce')} /><QuickAction icon="map-outline" label="Coverage map" onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })} /><QuickAction icon="sparkles-outline" label="Ask Rozgar AI" onPress={() => navigation.navigate('MainTabs', { screen: 'AI' })} tone="dark" /></View>
      <SectionHeader title="Request pipeline" action="Open queue" onAction={() => navigation.navigate('Requests')} />
      <View style={styles.pipelineCard}><PipelineRow label="New" value={COP_REQUESTS.filter((request) => request.status === 'New').length} color={colors.alert} /><PipelineRow label="Matching" value={COP_REQUESTS.filter((request) => request.status === 'Matching').length} color={colors.teal} /><PipelineRow label="Assigned" value={COP_REQUESTS.filter((request) => request.status === 'Assigned' || request.status === 'In Progress').length} color={colors.leaf} /><PipelineRow label="Settled" value={COP_REQUESTS.filter((request) => request.status === 'Settled').length} color={colors.forest} /></View>
      <SectionHeader title="Workforce health" action="View roster" onAction={() => navigation.navigate('Workforce')} />
      <View style={styles.healthCard}><View style={styles.healthRow}><View style={[styles.healthIcon, { backgroundColor: '#FFF0F0' }]}><Ionicons name="trending-up" size={17} color={colors.danger} /></View><View style={{ flex: 1 }}><Text style={styles.healthTitle}>{overloaded.length} overloaded members</Text><Text style={styles.healthText}>Use fair allocation to rebalance the next queue.</Text></View><StatusPill label="Review" tone="red" /></View><View style={styles.healthRow}><View style={styles.healthIcon}><Ionicons name="people" size={17} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.healthTitle}>{COP_WORKERS.filter((worker) => worker.workload === 'Underutilized').length} underutilized members</Text><Text style={styles.healthText}>There is fair work waiting to be matched.</Text></View><StatusPill label="Balance" tone="green" /></View></View>
      <SectionHeader title="Demand hotspots" action="Forecast" onAction={() => navigation.navigate('MainTabs', { screen: 'Map' })} />
      <View style={styles.hotspotCard}>{highDemand.map((item) => <View key={`${item.area}-${item.trade}`} style={styles.hotspotRow}><View style={styles.hotspotDot} /><View style={{ flex: 1 }}><Text style={styles.hotspotArea}>{item.area}</Text><Text style={styles.hotspotTrade}>{item.trade}</Text></View><StatusPill label={item.level} tone="amber" /></View>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Shared operations data is deterministic demo data, ready for API replacement.</Text></View>
    </ScrollView>
  );
}

function PipelineRow({ label, value, color }: { label: string; value: number; color: string }) {
  return <View style={styles.pipelineRow}><View style={[styles.pipelineDot, { backgroundColor: color }]} /><Text style={styles.pipelineLabel}>{label}</Text><View style={styles.pipelineTrack}><View style={[styles.pipelineFill, { backgroundColor: color, width: `${Math.max(12, Math.min(100, value * 10))}%` }]} /></View><Text style={styles.pipelineValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  command: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 18, overflow: 'hidden' },
  commandCircle: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(46,139,87,0.25)', right: -65, top: -80 },
  commandKicker: { color: '#B7F0CD', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  commandTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 7 },
  commandSub: { color: '#D5F0DF', fontSize: 11, lineHeight: 16, marginTop: 4, maxWidth: 300 },
  commandStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#B7F0CD' },
  commandStatusText: { color: '#D5F0DF', fontSize: 10, fontWeight: '800' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  pipelineCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  pipelineRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 5 },
  pipelineDot: { width: 8, height: 8, borderRadius: 4 },
  pipelineLabel: { width: 60, color: colors.ink, fontSize: 10, fontWeight: '800' },
  pipelineTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: '#EDF2EF', overflow: 'hidden' },
  pipelineFill: { height: '100%', borderRadius: 4 },
  pipelineValue: { width: 24, color: colors.ink, fontSize: 11, fontWeight: '900', textAlign: 'right' },
  healthCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  healthRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  healthIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  healthTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  healthText: { color: colors.sage, fontSize: 10, marginTop: 3 },
  hotspotCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  hotspotRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  hotspotDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.alert },
  hotspotArea: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  hotspotTrade: { color: colors.sage, fontSize: 9, marginTop: 2 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
