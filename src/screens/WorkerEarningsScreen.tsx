import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIOR_PAYMENTS } from '../portals/workerData';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader, StatusPill } from '../components/portal';

export default function WorkerEarningsScreen() {
  const pending = PRIOR_PAYMENTS.filter((payment) => payment.status === 'pending');
  const paid = PRIOR_PAYMENTS.filter((payment) => payment.status === 'paid');
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>TRANSPARENT PAYOUTS</Text><Text style={styles.heading}>Earnings</Text></View><View style={styles.headingIcon}><Ionicons name="wallet" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Every completed job shows the gross fare, your 92% share, and the cooperative welfare contribution.</Text>
      <View style={styles.metricGrid}><MetricCard label="This month" value="₹18,450" detail="gross service value" icon="trending-up-outline" /><MetricCard label="Your share" value="₹16,974" detail="92% direct payout" accent icon="person-outline" /><MetricCard label="Welfare share" value="₹1,476" detail="8% contribution" icon="heart-outline" /><MetricCard label="Jobs done" value="54" detail="this month" icon="checkmark-circle-outline" /></View>
      <SectionHeader title="Payment history" action="Export" onAction={() => {}} />
      <View style={styles.card}>{[...pending, ...paid].map((payment) => <View key={payment.id} style={styles.paymentRow}><View style={styles.paymentIcon}><Ionicons name={payment.status === 'paid' ? 'checkmark' : 'time-outline'} size={16} color={payment.status === 'paid' ? colors.leaf : colors.alert} /></View><View style={{ flex: 1 }}><Text style={styles.paymentJob}>{payment.job}</Text><Text style={styles.paymentMeta}>{payment.date} · {payment.invoice}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.paymentAmount}>₹{payment.share}</Text><StatusPill label={payment.status === 'paid' ? 'Paid' : 'Pending'} tone={payment.status === 'paid' ? 'green' : 'amber'} /></View></View>)}</View>
      <View style={styles.splitCard}><View style={styles.splitHeader}><Ionicons name="receipt-outline" size={18} color={colors.leaf} /><Text style={styles.splitTitle}>How your fare is split</Text></View><View style={styles.splitBar}><View style={styles.workerShare} /><View style={styles.welfareShare} /></View><View style={styles.splitLegend}><View><View style={[styles.legendDot, { backgroundColor: colors.cta }]} /><Text style={styles.legendText}>You receive 92%</Text></View><View><View style={[styles.legendDot, { backgroundColor: colors.alert }]} /><Text style={styles.legendText}>Welfare fund 8%</Text></View></View></View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Demo payment history. No real money moves in this prototype.</Text></View>
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
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  paymentIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  paymentJob: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  paymentMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  paymentAmount: { color: colors.forest, fontSize: 14, fontWeight: '900', marginBottom: 3 },
  splitCard: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2', borderRadius: radius.lg, padding: 13, marginTop: 15 },
  splitHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  splitTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  splitBar: { height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', marginTop: 12 },
  workerShare: { width: '92%', backgroundColor: colors.cta },
  welfareShare: { width: '8%', backgroundColor: colors.alert },
  splitLegend: { flexDirection: 'row', gap: 15, marginTop: 9 },
  legendDot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  legendText: { color: colors.ink, fontSize: 9, fontWeight: '700' },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
