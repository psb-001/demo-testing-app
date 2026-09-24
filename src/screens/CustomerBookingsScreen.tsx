import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WORKERS_LIST } from '../data/mockData';
import { useAppState } from '../context/AppState';
import { colors, radius } from '../theme/theme';
import { BookingTimeline, DemoPill, EmptyPanel, SectionHeader, StatusPill } from '../components/portal';
import type { Booking } from '../types';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

type BookingTab = (typeof TABS)[number]['id'];

function BookingCard({ booking, onCancel, onRate, onRebook, onTrack }: { booking: Booking; onCancel: () => void; onRate: (rating: number, feedback: string) => void; onRebook: () => void; onTrack: () => void }) {
  const [rating, setRating] = useState(booking.rating || 0);
  const [feedback, setFeedback] = useState(booking.feedback || '');
  const [showRating, setShowRating] = useState(false);
  const statusTone = booking.status === 'in_progress' ? 'green' : booking.status === 'cancelled' ? 'red' : booking.status === 'completed' ? 'slate' : 'amber';
  const statusLabel = booking.status === 'in_progress' ? 'On the way' : booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'completed' ? 'Completed' : 'Cancelled';

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingTitleWrap}>
          <Text style={styles.bookingService}>{booking.tradeLabel}</Text>
          <Text style={styles.bookingId}>{booking.id}</Text>
        </View>
        <StatusPill label={statusLabel} tone={statusTone} />
      </View>
      <View style={styles.workerLine}>
        <View style={styles.workerAvatar}><Text style={styles.workerAvatarText}>{booking.workerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.workerName}>{booking.workerName}</Text><Text style={styles.workerMeta}>{booking.cooperativeName}</Text></View>
        <Text style={styles.amount}>₹{booking.totalFare}</Text>
      </View>
      <View style={styles.detailLine}><Ionicons name="calendar-outline" size={14} color={colors.sage} /><Text style={styles.detailText}>{booking.serviceDate} · {booking.serviceTime}</Text></View>
      <View style={styles.detailLine}><Ionicons name="location-outline" size={14} color={colors.sage} /><Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text></View>
      {booking.status === 'in_progress' ? <BookingTimeline status={booking.status} /> : null}
      {booking.status === 'completed' && booking.rating ? <View style={styles.ratingLine}><Ionicons name="star" size={14} color="#D97706" /><Text style={styles.ratingLineText}>You rated this service {booking.rating}/5</Text></View> : null}
      <View style={styles.bookingActions}>
        {booking.status === 'in_progress' ? <Pressable style={styles.primaryAction} onPress={onTrack}><Ionicons name="navigate" size={14} color="#fff" /><Text style={styles.primaryActionText}>Track service</Text></Pressable> : null}
        {booking.status === 'confirmed' ? <><Pressable style={styles.primaryAction} onPress={onTrack}><Text style={styles.primaryActionText}>View details</Text></Pressable><Pressable style={styles.dangerAction} onPress={onCancel}><Text style={styles.dangerActionText}>Cancel</Text></Pressable></> : null}
        {booking.status === 'completed' ? <><Pressable style={styles.primaryAction} onPress={() => setShowRating((value) => !value)}><Ionicons name="star-outline" size={14} color="#fff" /><Text style={styles.primaryActionText}>{booking.rating ? 'Edit rating' : 'Rate service'}</Text></Pressable><Pressable style={styles.secondaryAction} onPress={onRebook}><Text style={styles.secondaryActionText}>Rebook</Text></Pressable></> : null}
      </View>
      {showRating && booking.status === 'completed' ? (
        <View style={styles.ratingBox}>
          <Text style={styles.ratingLabel}>How was the service?</Text>
          <View style={styles.starRow}>{[1, 2, 3, 4, 5].map((star) => <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}><Ionicons name={star <= rating ? 'star' : 'star-outline'} size={25} color="#D97706" /></Pressable>)}</View>
          <TextInput value={feedback} onChangeText={setFeedback} placeholder="Add a quick note (optional)" placeholderTextColor={colors.sage} style={styles.feedbackInput} />
          <Pressable style={styles.saveRating} onPress={() => { onRate(rating, feedback); setShowRating(false); }}><Text style={styles.saveRatingText}>Save feedback</Text></Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default function CustomerBookingsScreen() {
  const navigation = useNavigation<any>();
  const { bookings, cancelBooking, rateBooking } = useAppState();
  const [tab, setTab] = useState<BookingTab>('active');
  const groups: Record<BookingTab, Booking[]> = {
    upcoming: bookings.filter((booking) => booking.status === 'confirmed'),
    active: bookings.filter((booking) => booking.status === 'in_progress'),
    completed: bookings.filter((booking) => booking.status === 'completed'),
    cancelled: bookings.filter((booking) => booking.status === 'cancelled'),
  };

  const confirmCancel = (booking: Booking) => {
    Alert.alert('Cancel this booking?', 'The cooperative will be notified. Demo mode does not process a refund.', [
      { text: 'Keep booking', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => cancelBooking(booking.id) },
    ]);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>YOUR SERVICES</Text><Text style={styles.heading}>My bookings</Text></View><View style={styles.headingIcon}><Ionicons name="calendar" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Track active work, manage upcoming visits, and keep your service history.</Text>
      <View style={styles.tabs}>{TABS.map((item) => <Pressable key={item.id} onPress={() => setTab(item.id)} style={[styles.tab, tab === item.id && styles.tabActive]}><Text style={[styles.tabText, tab === item.id && styles.tabTextActive]}>{item.label} ({groups[item.id].length})</Text></Pressable>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Bookings and actions stay on this device.</Text></View>
      {groups[tab].length === 0 ? <EmptyPanel title={tab === 'upcoming' ? 'No upcoming bookings' : tab === 'active' ? 'No active service' : tab === 'completed' ? 'No completed services yet' : 'No cancelled bookings'} body={tab === 'upcoming' ? 'Find a verified cooperative worker for your next task.' : 'Your booking activity will appear here.'} action={tab === 'upcoming' ? 'Explore services' : undefined} onAction={() => navigation.navigate('Services')} /> : <View style={{ gap: 10 }}>{groups[tab].map((booking) => <BookingCard key={booking.id} booking={booking} onCancel={() => confirmCancel(booking)} onRate={(rating, feedback) => rateBooking(booking.id, rating, feedback)} onRebook={() => { const worker = WORKERS_LIST.find((item) => item.id === booking.workerId); if (worker) navigation.navigate('Booking', { workerId: worker.id }); }} onTrack={() => navigation.navigate('Map')} />)}</View>}
      <SectionHeader title="Payment transparency" />
      <View style={styles.transparencyCard}><View style={styles.transparencyIcon}><Ionicons name="receipt-outline" size={20} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.transparencyTitle}>Every fare is itemised</Text><Text style={styles.transparencyText}>92% goes directly to the worker. 8% supports cooperative welfare and insurance.</Text></View></View>
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
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5, maxWidth: 310 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 },
  tab: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 },
  tabActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  tabText: { color: colors.sage, fontSize: 10, fontWeight: '800' },
  tabTextActive: { color: '#fff' },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
  bookingCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bookingTitleWrap: { flex: 1 },
  bookingService: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  bookingId: { color: colors.sage, fontSize: 9, marginTop: 2 },
  workerLine: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  workerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  workerAvatarText: { color: colors.forest, fontSize: 12, fontWeight: '900' },
  workerName: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  workerMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  amount: { color: colors.forest, fontSize: 15, fontWeight: '900' },
  detailLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  detailText: { color: colors.sage, fontSize: 10, flex: 1 },
  bookingActions: { flexDirection: 'row', gap: 7, marginTop: 12 },
  primaryAction: { flex: 1, minHeight: 34, borderRadius: 9, backgroundColor: colors.cta, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
  primaryActionText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  secondaryAction: { flex: 1, minHeight: 34, borderRadius: 9, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  dangerAction: { minHeight: 34, borderRadius: 9, borderWidth: 1, borderColor: '#F1B8B8', paddingHorizontal: 11, alignItems: 'center', justifyContent: 'center' },
  dangerActionText: { color: colors.danger, fontSize: 10, fontWeight: '900' },
  ratingLine: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  ratingLineText: { color: '#B45309', fontSize: 10, fontWeight: '800' },
  ratingBox: { backgroundColor: colors.mint, borderRadius: 12, padding: 12, marginTop: 11 },
  ratingLabel: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  starRow: { flexDirection: 'row', gap: 7, marginTop: 9 },
  feedbackInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 9, padding: 9, marginTop: 10, fontSize: 11, color: colors.ink },
  saveRating: { alignSelf: 'flex-start', backgroundColor: colors.cta, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8, marginTop: 9 },
  saveRatingText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  transparencyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, flexDirection: 'row', alignItems: 'center' },
  transparencyIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  transparencyTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  transparencyText: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
});
