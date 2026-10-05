import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DEMO_JOBS, type JobStatus } from '../portals/workerData';
import { useAppState } from '../context/AppState';
import { colors } from '../theme/theme';
import { DemoPill, EmptyPanel, SectionHeader } from '../components/portal';
import { WorkerJobCard } from '../components/WorkerJobCard';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'available', label: 'Recommended' },
  { id: 'accepted', label: 'Upcoming' },
  { id: 'inprogress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
] as const;

type JobFilter = (typeof FILTERS)[number]['id'];

export default function WorkerJobsScreen() {
  const navigation = useNavigation<any>();
  const { jobStatuses, updateJobStatus } = useAppState();
  const [filter, setFilter] = useState<JobFilter>('all');
  const jobs = useMemo(() => DEMO_JOBS.filter((job) => {
    const status = jobStatuses[job.id] || 'available';
    if (filter === 'all') return status !== 'completed' || job.id === 'job-105';
    if (filter === 'accepted') return status === 'accepted' || status === 'arrived';
    if (filter === 'inprogress') return status === 'inprogress';
    return status === filter;
  }), [filter, jobStatuses]);
  const advance = (id: string, status: JobStatus) => {
    const next: Record<string, JobStatus> = { accepted: 'arrived', arrived: 'inprogress', inprogress: 'completed', pending: 'accepted' };
    updateJobStatus(id, next[status] || 'completed');
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>WORK OPPORTUNITIES</Text><Text style={styles.heading}>My jobs</Text></View><View style={styles.headingIcon}><Ionicons name="briefcase" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Accept work matched to your trade, distance, availability, and fair-work schedule.</Text>
      <View style={styles.filters}>{FILTERS.map((item) => <Pressable key={item.id} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Actions update your job lifecycle on this device.</Text></View>
      <SectionHeader title={`${jobs.length} opportunities`} />
      {jobs.length ? jobs.map((job) => { const status = jobStatuses[job.id] || 'available'; return <WorkerJobCard key={job.id} job={job} status={status} onAccept={() => updateJobStatus(job.id, 'accepted')} onAdvance={() => advance(job.id, status)} />; }) : <EmptyPanel title="No jobs in this view" body="Try another filter or check back when new cooperative work arrives." action="View all jobs" onAction={() => setFilter('all')} />}
      <View style={styles.tip}><Ionicons name="bulb-outline" size={18} color={colors.teal} /><Text style={styles.tipText}>Keep your availability and working hours updated so AI matching can route better opportunities to you.</Text></View>
      <Pressable style={styles.mapLink} onPress={() => navigation.navigate('Map')}><Ionicons name="map-outline" size={16} color={colors.teal} /><Text style={styles.mapLinkText}>Open service-area map</Text><Ionicons name="chevron-forward" size={15} color={colors.sage} /></Pressable>
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
  tip: { flexDirection: 'row', gap: 8, backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2', borderRadius: 12, padding: 12, marginTop: 15 },
  tipText: { flex: 1, color: colors.ink, fontSize: 10, lineHeight: 15 },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 13, marginTop: 10 },
  mapLinkText: { flex: 1, color: colors.teal, fontSize: 11, fontWeight: '900' },
});
