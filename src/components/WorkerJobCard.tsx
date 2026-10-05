import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { JobStatus, WorkerJob } from '../portals/workerData';
import { colors, radius } from '../theme/theme';
import { StatusPill } from './portal';

const STATUS_LABELS: Record<JobStatus, string> = {
  available: 'Recommended',
  pending: 'Offer received',
  accepted: 'Upcoming',
  arrived: 'Arrived',
  inprogress: 'In progress',
  completed: 'Completed',
};

function scoreJob(job: WorkerJob): number {
  return Math.min(97, 55 + Math.max(0, 25 - job.distanceKm * 2) + 12);
}

export function WorkerJobCard({ job, status, onAccept, onAdvance }: { job: WorkerJob; status: JobStatus; onAccept: () => void; onAdvance: () => void }) {
  const actionLabel = status === 'available' ? 'Accept job' : status === 'pending' ? 'Accept offer' : status === 'accepted' ? 'Start route' : status === 'arrived' ? 'Start work' : status === 'inprogress' ? 'Complete job' : 'Payout ready';
  const actionDisabled = status === 'completed';
  return (
    <View style={[styles.card, job.emergency && styles.emergencyCard]}>
      <View style={styles.topRow}><View style={{ flex: 1 }}><View style={styles.serviceRow}><Text style={styles.service}>{job.service}</Text>{job.emergency ? <StatusPill label="Emergency" tone="red" /> : null}</View><Text style={styles.customer}>{job.customer} · {job.area} · {job.distanceKm} km</Text></View><StatusPill label={STATUS_LABELS[status]} tone={status === 'completed' ? 'slate' : job.emergency ? 'red' : 'green'} /></View>
      <View style={styles.infoGrid}><View><Text style={styles.metaLabel}>WHEN</Text><Text style={styles.metaValue}>{job.date} · {job.time}</Text></View><View><Text style={styles.metaLabel}>YOUR PAYOUT</Text><Text style={styles.metaValue}>₹{job.payout} <Text style={styles.gross}>of ₹{job.gross}</Text></Text></View><View><Text style={styles.metaLabel}>MATCH</Text><Text style={styles.metaValue}>{scoreJob(job)}%</Text></View></View>
      <View style={styles.skills}>{job.skills.slice(0, 3).map((skill) => <View key={skill} style={styles.skill}><Ionicons name="checkmark-circle" size={12} color={colors.leaf} /><Text style={styles.skillText}>{skill}</Text></View>)}</View>
      <Pressable disabled={actionDisabled} onPress={status === 'available' || status === 'pending' ? onAccept : onAdvance} style={[styles.action, actionDisabled && styles.actionDisabled]}><Text style={styles.actionText}>{actionLabel}</Text><Ionicons name={actionDisabled ? 'checkmark-done' : 'arrow-forward'} size={15} color="#fff" /></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, marginBottom: 9 },
  emergencyCard: { borderColor: '#F2B8B8', backgroundColor: '#FFF9F9' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  service: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  customer: { color: colors.sage, fontSize: 10, marginTop: 4 },
  infoGrid: { flexDirection: 'row', gap: 10, marginTop: 13, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  metaLabel: { color: colors.sage, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  metaValue: { color: colors.ink, fontSize: 10, fontWeight: '800', marginTop: 3 },
  gross: { color: colors.sage, fontWeight: '500' },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 11 },
  skill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.mint, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 },
  skillText: { color: colors.forest, fontSize: 9, fontWeight: '700' },
  action: { minHeight: 36, marginTop: 12, borderRadius: 9, backgroundColor: colors.cta, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionDisabled: { backgroundColor: colors.sage },
  actionText: { color: '#fff', fontSize: 11, fontWeight: '900' },
});
