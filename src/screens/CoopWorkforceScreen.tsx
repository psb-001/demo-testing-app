import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COP_WORKERS } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import { DemoPill, SectionHeader, StatusPill } from '../components/portal';

const FILTERS = ['All', 'Available', 'Pending', 'Overloaded'] as const;
type Filter = (typeof FILTERS)[number];

export default function CoopWorkforceScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const workers = useMemo(() => COP_WORKERS.filter((worker) => {
    if (filter === 'Available') return worker.availableToday;
    if (filter === 'Pending') return worker.verification.status === 'Pending' || worker.verification.status === 'Under Review';
    if (filter === 'Overloaded') return worker.workload === 'Overloaded';
    return true;
  }).slice(0, 18), [filter]);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>WORKFORCE OPERATIONS</Text><Text style={styles.heading}>Workforce</Text></View><View style={styles.headingIcon}><Ionicons name="people" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Keep availability, verification, workload, and fair allocation in sync.</Text>
      <View style={styles.filters}>{FILTERS.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>40-worker deterministic cooperative roster.</Text></View>
      <SectionHeader title={`${workers.length} members`} />
      {workers.map((worker) => { const isApproved = approved[worker.id] ?? worker.verification.status === 'Verified'; return <View key={worker.id} style={styles.workerCard}><View style={styles.workerTop}><View style={styles.avatar}><Text style={styles.avatarText}>{worker.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View style={{ flex: 1 }}><Text style={styles.workerName}>{worker.name}</Text><Text style={styles.workerMeta}>{worker.tradeLabel} · {worker.area} · {worker.experienceYears} yrs</Text></View><StatusPill label={isApproved ? 'Verified' : worker.verification.status} tone={isApproved ? 'green' : 'amber'} /></View><View style={styles.workerStats}><View><Text style={styles.statLabel}>STATUS</Text><Text style={styles.statValue}>{worker.availability}</Text></View><View><Text style={styles.statLabel}>WORKLOAD</Text><Text style={styles.statValue}>{worker.workload}</Text></View><View><Text style={styles.statLabel}>RATING</Text><Text style={styles.statValue}>★ {worker.rating}</Text></View></View><View style={styles.workerActions}>{!isApproved ? <><Pressable style={styles.approve} onPress={() => setApproved((previous) => ({ ...previous, [worker.id]: true }))}><Ionicons name="checkmark" size={14} color="#fff" /><Text style={styles.approveText}>Approve</Text></Pressable><Pressable style={styles.reject}><Text style={styles.rejectText}>Review</Text></Pressable></> : <Pressable style={styles.passportButton}><Ionicons name="shield-checkmark-outline" size={14} color={colors.teal} /><Text style={styles.passportText}>View passport</Text></Pressable>}</View></View>; })}
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
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 15 },
  filter: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 8 },
  filterActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  filterText: { color: colors.sage, fontSize: 10, fontWeight: '800' },
  filterTextActive: { color: '#fff' },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
  workerCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, marginBottom: 9 },
  workerTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.forest, fontSize: 12, fontWeight: '900' },
  workerName: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  workerMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  workerStats: { flexDirection: 'row', gap: 22, marginTop: 11, paddingTop: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  statLabel: { color: colors.sage, fontSize: 8, fontWeight: '900' },
  statValue: { color: colors.ink, fontSize: 10, fontWeight: '800', marginTop: 3 },
  workerActions: { flexDirection: 'row', gap: 7, marginTop: 11 },
  approve: { flex: 1, minHeight: 32, backgroundColor: colors.cta, borderRadius: 8, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  reject: { minHeight: 32, paddingHorizontal: 13, borderWidth: 1, borderColor: colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  passportButton: { minHeight: 32, borderRadius: 8, backgroundColor: colors.mint, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', flex: 1 },
  passportText: { color: colors.forest, fontSize: 10, fontWeight: '900' },
});
