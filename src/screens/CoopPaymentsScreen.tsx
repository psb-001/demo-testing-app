import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COP_TRANSACTIONS, PAYMENT_METRICS } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader, StatusPill } from '../components/portal';

export default function CoopPaymentsScreen() {
  const [settled, setSettled] = useState<Record<string, boolean>>({});
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>FINANCE OPERATIONS</Text><Text style={styles.heading}>Payments</Text></View><View style={styles.headingIcon}><Ionicons name="wallet" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Settle worker payouts and keep the welfare contribution transparent.</Text>
      <View style={styles.metricGrid}><MetricCard label="Gross volume" value={`₹${PAYMENT_METRICS.totalGross.toLocaleString('en-IN')}`} detail="demo period" icon="trending-up-outline" /><MetricCard label="Worker payouts" value={`₹${PAYMENT_METRICS.totalWorker.toLocaleString('en-IN')}`} detail="92% share" accent icon="people-outline" /><MetricCard label="Welfare fund" value={`₹${PAYMENT_METRICS.totalWelfare.toLocaleString('en-IN')}`} detail="8% contribution" icon="heart-outline" /><MetricCard label="Pending" value={String(PAYMENT_METRICS.pending)} detail="settlements" icon="time-outline" /></View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Settlement actions are local demo mutations.</Text></View>
      <SectionHeader title="Recent transactions" />
      {COP_TRANSACTIONS.slice(0, 16).map((transaction) => { const isSettled = settled[transaction.id] || transaction.status === 'Settled'; return <View key={transaction.id} style={styles.transaction}><View style={styles.transactionIcon}><Ionicons name={isSettled ? 'checkmark' : 'time-outline'} size={16} color={isSettled ? colors.leaf : colors.alert} /></View><View style={{ flex: 1 }}><Text style={styles.transactionTitle}>{transaction.workerName} · {transaction.service}</Text><Text style={styles.transactionMeta}>{transaction.date} · {transaction.id}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.transactionAmount}>₹{transaction.gross}</Text><StatusPill label={isSettled ? 'Settled' : 'Pending'} tone={isSettled ? 'green' : 'amber'} /></View>{!isSettled ? <Pressable style={styles.settleButton} onPress={() => setSettled((previous) => ({ ...previous, [transaction.id]: true }))}><Text style={styles.settleText}>Settle</Text></Pressable> : null}</View>; })}
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
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
  transaction: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  transactionIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  transactionTitle: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  transactionMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  transactionAmount: { color: colors.forest, fontSize: 13, fontWeight: '900', marginBottom: 3 },
  settleButton: { backgroundColor: colors.cta, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 6 },
  settleText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});
