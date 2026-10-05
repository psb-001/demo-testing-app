import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppState } from '../context/AppState';
import { colors, radius } from '../theme/theme';
import { DemoPill, MetricCard, SectionHeader, StatusPill } from '../components/portal';

export default function CustomerPaymentsScreen() {
  const navigation = useNavigation<any>();
  const { bookings } = useAppState();
  const completed = bookings.filter((booking) => booking.status === 'completed');
  const pending = bookings.filter((booking) => booking.status !== 'completed' && booking.status !== 'cancelled');
  const total = bookings.filter((booking) => booking.status !== 'cancelled').reduce((sum, booking) => sum + booking.totalFare, 0);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>PAYMENTS & INVOICES</Text><Text style={styles.heading}>Your payments</Text></View><View style={styles.headingIcon}><Ionicons name="receipt-outline" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Every service record shows the amount, payment method, and cooperative split.</Text>
      <View style={styles.metricGrid}><MetricCard label="Total booked" value={`₹${total.toLocaleString('en-IN')}`} detail="gross services" icon="wallet-outline" /><MetricCard label="Completed" value={String(completed.length)} detail="paid records" accent icon="checkmark-circle-outline" /><MetricCard label="Pending" value={String(pending.length)} detail="awaiting service" icon="time-outline" /><MetricCard label="Saved methods" value="UPI" detail="+ cash option" icon="card-outline" /></View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Demo invoices are generated from booking records.</Text></View>
      <SectionHeader title="Recent invoices" />
      {bookings.length ? bookings.map((booking) => <View key={booking.id} style={styles.invoice}><View style={styles.invoiceTop}><View style={styles.invoiceIcon}><Ionicons name="document-text-outline" size={17} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.invoiceTitle}>{booking.tradeLabel} · {booking.id}</Text><Text style={styles.invoiceMeta}>{booking.workerName} · {booking.serviceDate}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.invoiceAmount}>₹{booking.totalFare}</Text><StatusPill label={booking.status === 'completed' ? 'Paid' : booking.status === 'cancelled' ? 'Refunded' : 'Pending'} tone={booking.status === 'completed' ? 'green' : booking.status === 'cancelled' ? 'slate' : 'amber'} /></View></View><View style={styles.split}><Text style={styles.splitText}>Worker ₹{booking.workerEarnings} (92%)</Text><Text style={styles.splitText}>Welfare ₹{booking.coopWelfareShare} (8%)</Text><Text style={styles.splitText}>{booking.paymentMethod.toUpperCase()}</Text></View></View>) : <View style={styles.empty}><Text style={styles.emptyText}>Your invoices will appear after your first booking.</Text></View>}
      <Pressable style={styles.help} onPress={() => navigation.navigate('Account')}><Ionicons name="help-circle-outline" size={18} color={colors.leaf} /><Text style={styles.helpText}>Need an invoice correction? Open your account support.</Text><Ionicons name="chevron-forward" size={15} color={colors.sage} /></Pressable>
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
  invoice: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 12, marginBottom: 9 },
  invoiceTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  invoiceIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  invoiceTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  invoiceMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  invoiceAmount: { color: colors.forest, fontSize: 14, fontWeight: '900', marginBottom: 3 },
  split: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  splitText: { color: colors.sage, fontSize: 9, fontWeight: '700' },
  empty: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 20, alignItems: 'center' },
  emptyText: { color: colors.sage, fontSize: 11 },
  help: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.mint, borderRadius: 12, padding: 12, marginTop: 14 },
  helpText: { color: colors.ink, fontSize: 10, fontWeight: '800', flex: 1 },
});
