import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DEMO_JOBS, PRIOR_PAYMENTS, DEMAND_INSIGHTS } from '../portals/workerData';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader } from '../components/portal';
import { WorkerJobCard } from '../components/WorkerJobCard';

export default function WorkerPortalScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { jobStatuses, updateJobStatus } = useAppState();
  const openJobs = useMemo(() => DEMO_JOBS.filter((job) => (jobStatuses[job.id] || 'available') === 'available'), [jobStatuses]);
  const scheduled = useMemo(() => DEMO_JOBS.filter((job) => ['accepted', 'arrived', 'inprogress'].includes(jobStatuses[job.id] || '')), [jobStatuses]);
  const emergencyJob = openJobs.find((job) => job.emergency);
  const paidTotal = PRIOR_PAYMENTS.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.share, 0);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>WORKER HOME</Text><Text style={styles.heading}>Good morning, {user?.name.split(' ')[0] || 'there'}</Text></View><View style={styles.headingIcon}><Ionicons name="briefcase" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Your work, earnings, passport and cooperative activity in one place.</Text>
      <View style={styles.metricGrid}><MetricCard label="Open jobs" value={String(openJobs.length)} detail="AI matched" icon="briefcase-outline" /><MetricCard label="Scheduled" value={String(scheduled.length)} detail="upcoming" icon="calendar-outline" /><MetricCard label="Paid this period" value={`₹${paidTotal.toLocaleString('en-IN')}`} detail="92% share" accent icon="wallet-outline" /><MetricCard label="Status" value="Available" detail="for new work" icon="pulse-outline" /></View>
      {emergencyJob ? <Pressable style={styles.emergencyBanner} onPress={() => navigation.navigate('Jobs')}><View style={styles.emergencyIcon}><Ionicons name="flash" size={19} color="#B45309" /></View><View style={{ flex: 1 }}><Text style={styles.emergencyKicker}>EMERGENCY REQUEST</Text><Text style={styles.emergencyText}>{emergencyJob.service} · {emergencyJob.distanceKm} km · ₹{emergencyJob.payout}</Text></View><Ionicons name="chevron-forward" size={17} color="#B45309" /></Pressable> : null}
      <SectionHeader title="AI work opportunities" action="View jobs" onAction={() => navigation.navigate('Jobs')} />
      <View style={styles.insightCard}><View style={styles.insightIcon}><Ionicons name="sparkles" size={18} color={colors.teal} /></View><View style={{ flex: 1 }}><Text style={styles.insightTitle}>Demand is rising in your area</Text><Text style={styles.insightText}>Evening availability is getting more electrical requests right now.</Text></View></View>
      <View style={styles.demandRow}>{DEMAND_INSIGHTS.slice(0, 3).map((item) => <View key={item.trade} style={styles.demandItem}><Text style={styles.demandTrade}>{item.trade}</Text><Text style={styles.demandRequests}>{item.requests} nearby</Text></View>)}</View>
      <SectionHeader title="Recommended jobs" action="See all" onAction={() => navigation.navigate('Jobs')} />
      {openJobs.slice(0, 2).map((job) => <WorkerJobCard key={job.id} job={job} status={jobStatuses[job.id] || 'available'} onAccept={() => updateJobStatus(job.id, 'accepted')} onAdvance={() => updateJobStatus(job.id, 'arrived')} />)}
      <SectionHeader title="Today's schedule" />
      {scheduled.length ? scheduled.map((job) => <View key={job.id} style={styles.scheduleRow}><View style={styles.scheduleTime}><Text style={styles.scheduleTimeText}>{job.time}</Text></View><View style={styles.scheduleLine}><View style={styles.scheduleDot} /><View style={styles.scheduleVertical} /></View><View style={styles.scheduleCopy}><Text style={styles.scheduleTitle}>{job.service}</Text><Text style={styles.scheduleMeta}>{job.area} · {jobStatuses[job.id] === 'inprogress' ? 'In progress' : jobStatuses[job.id] === 'arrived' ? 'Arrived' : 'Upcoming'}</Text></View></View>) : <View style={styles.emptySchedule}><Ionicons name="calendar-outline" size={18} color={colors.sage} /><Text style={styles.emptyScheduleText}>No jobs scheduled yet. Accept a recommendation to build your day.</Text></View>}
      <View style={styles.passportBanner} onStartShouldSetResponder={() => navigation.navigate('Passport')}><View style={styles.passportIcon}><Ionicons name="shield-checkmark" size={18} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.passportTitle}>Skill Passport · Cooperative verified</Text><Text style={styles.passportText}>Keep your certifications and welfare cover ready.</Text></View><Ionicons name="chevron-forward" size={16} color={colors.sage} /></View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Worker actions are local demo state and update immediately.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: colors.ink, fontSize: 22, fontWeight: '900', marginTop: 3 },
  headingIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  emergencyBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7E8', borderWidth: 1, borderColor: '#F5D08A', borderRadius: 14, padding: 12, marginTop: 14 },
  emergencyIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFF0C9', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  emergencyKicker: { color: '#B45309', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  emergencyText: { color: colors.ink, fontSize: 11, fontWeight: '800', marginTop: 3 },
  insightCard: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  insightIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#D5F0DF', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  insightText: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  demandRow: { flexDirection: 'row', gap: 7, marginTop: 8 },
  demandItem: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 9 },
  demandTrade: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  demandRequests: { color: colors.teal, fontSize: 9, marginTop: 4, fontWeight: '800' },
  scheduleRow: { flexDirection: 'row', minHeight: 45 },
  scheduleTime: { width: 54, paddingTop: 2 },
  scheduleTimeText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  scheduleLine: { width: 16, alignItems: 'center' },
  scheduleDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.cta, marginTop: 3 },
  scheduleVertical: { width: 2, flex: 1, backgroundColor: '#CBE6D4', marginTop: 3 },
  scheduleCopy: { flex: 1, paddingLeft: 8 },
  scheduleTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  scheduleMeta: { color: colors.sage, fontSize: 10, marginTop: 3 },
  emptySchedule: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyScheduleText: { color: colors.sage, fontSize: 10, lineHeight: 15, flex: 1 },
  passportBanner: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  passportIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  passportTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  passportText: { color: colors.sage, fontSize: 10, marginTop: 3 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
