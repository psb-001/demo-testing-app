import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COP_REQUESTS, type RequestStatus } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import { DemoPill, EmptyPanel, SectionHeader, StatusPill } from '../components/portal';

const FILTERS = ['All', 'New', 'Matching', 'Assigned', 'In Progress'] as const;
type Filter = (typeof FILTERS)[number];

export default function CoopRequestsScreen() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<Filter>('All');
  const [overrides, setOverrides] = useState<Record<string, RequestStatus>>({});
  const rows = useMemo(() => COP_REQUESTS.filter((request) => filter === 'All' || (overrides[request.id] || request.status) === filter).slice(0, 18), [filter, overrides]);
  const setStatus = (id: string, status: RequestStatus) => setOverrides((previous) => ({ ...previous, [id]: status }));
  const advance = (request: (typeof COP_REQUESTS)[number]) => {
    const current = overrides[request.id] || request.status;
    const next: Partial<Record<RequestStatus, RequestStatus>> = { New: 'Matching', Matching: 'Assigned', Assigned: 'In Progress', 'In Progress': 'Completed', Completed: 'Payment Pending', 'Payment Pending': 'Settled' };
    const nextStatus = next[current];
    if (nextStatus) setStatus(request.id, nextStatus);
  };
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>OPERATIONS QUEUE</Text><Text style={styles.heading}>Service requests</Text></View><View style={styles.headingIcon}><Ionicons name="document-text" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Review demand, match a verified member, and move each request toward settlement.</Text>
      <View style={styles.filters}>{FILTERS.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Status changes are local demo mutations.</Text></View>
      <SectionHeader title={`${rows.length} requests`} action="AI matching" onAction={() => navigation.navigate('MainTabs', { screen: 'AI' })} />
      {rows.length ? rows.map((request) => { const status = overrides[request.id] || request.status; return <View key={request.id} style={styles.requestCard}><View style={styles.requestTop}><View style={{ flex: 1 }}><Text style={styles.requestService}>{request.service}</Text><Text style={styles.requestMeta}>{request.customer} · {request.location} · {request.preferredDate}</Text></View><StatusPill label={status} tone={status === 'New' ? 'amber' : status === 'Settled' ? 'green' : 'slate'} /></View><View style={styles.requestInfo}><View><Text style={styles.infoLabel}>TRADE</Text><Text style={styles.infoValue}>{request.trade}</Text></View><View><Text style={styles.infoLabel}>URGENCY</Text><Text style={styles.infoValue}>{request.urgency}</Text></View><View><Text style={styles.infoLabel}>RANGE</Text><Text style={styles.infoValue}>{request.priceRange}</Text></View></View><View style={styles.requestBottom}><Text style={styles.matchText}>{request.matchType}</Text>{status === 'New' || status === 'Matching' ? <Pressable style={styles.matchButton} onPress={() => { setStatus(request.id, 'Assigned'); Alert.alert('Worker assigned', 'The request is now in the assigned queue.'); }}><Ionicons name="sparkles" size={14} color="#fff" /><Text style={styles.matchButtonText}>Assign worker</Text></Pressable> : <Pressable style={styles.nextButton} onPress={() => advance(request)}><Text style={styles.nextButtonText}>Move to {status === 'Settled' ? 'done' : 'next stage'}</Text></Pressable>}</View></View>; }) : <EmptyPanel title="No requests in this queue" body="Try another status filter." />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 3 },
  headingIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5, maxWidth: 320 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 15 },
  filter: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 8 },
  filterActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  filterText: { color: colors.sage, fontSize: 10, fontWeight: '800' },
  filterTextActive: { color: '#fff' },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
  requestCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, marginBottom: 9 },
  requestTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  requestService: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  requestMeta: { color: colors.sage, fontSize: 10, marginTop: 3 },
  requestInfo: { flexDirection: 'row', gap: 18, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  infoLabel: { color: colors.sage, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  infoValue: { color: colors.ink, fontSize: 10, fontWeight: '800', marginTop: 3 },
  requestBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  matchText: { flex: 1, color: colors.teal, fontSize: 10, fontWeight: '800' },
  matchButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.cta, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 },
  matchButtonText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  nextButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 },
  nextButtonText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
});
