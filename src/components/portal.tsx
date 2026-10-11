import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WorkerProfile } from '../types';
import { colors, radius } from '../theme/theme';
import { jobMatchScore } from '../services/matchingService';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NotificationItem = { id: string; title: string; body: string; time: string; icon: IconName };

function notificationsForRole(roleLabel: string): NotificationItem[] {
  if (roleLabel.toLowerCase().includes('worker')) {
    return [
      { id: 'worker-job', title: 'New job near Baner', body: 'Electrical repair · 2.1 km · ₹249 payout', time: '8 min ago', icon: 'briefcase-outline' },
      { id: 'worker-passport', title: 'Passport verified', body: 'Your cooperative verification is active.', time: 'Today', icon: 'shield-checkmark-outline' },
      { id: 'worker-payout', title: 'Payout processed', body: 'Your transparent invoice is ready to view.', time: 'Yesterday', icon: 'wallet-outline' },
    ];
  }
  if (roleLabel.toLowerCase().includes('cooperative')) {
    return [
      { id: 'coop-requests', title: 'Requests need review', body: 'New service requests are waiting in the queue.', time: '5 min ago', icon: 'document-text-outline' },
      { id: 'coop-workers', title: 'Roster update', body: 'Availability and workload data refreshed.', time: 'Today', icon: 'people-outline' },
      { id: 'coop-payout', title: 'Payouts pending', body: 'Settlement actions are ready in Payments.', time: 'Yesterday', icon: 'wallet-outline' },
    ];
  }
  if (roleLabel.toLowerCase().includes('federation')) {
    return [
      { id: 'fed-demand', title: 'Demand report refreshed', body: 'Area demand and skill gaps are up to date.', time: 'Today', icon: 'trending-up-outline' },
      { id: 'fed-members', title: 'Society check-in', body: 'Member cooperative reports are available.', time: 'Yesterday', icon: 'business-outline' },
    ];
  }
  return [
    { id: 'customer-booking', title: 'Booking updates enabled', body: 'Track your service and worker in Bookings.', time: 'Now', icon: 'calendar-outline' },
    { id: 'customer-workers', title: 'Verified workers nearby', body: 'Open the map to see cooperative help around you.', time: 'Today', icon: 'map-outline' },
    { id: 'customer-welfare', title: 'Welfare support', body: 'Your service includes transparent worker welfare.', time: 'Always on', icon: 'heart-outline' },
  ];
}

export function PortalTopBar({
  roleLabel,
  userName,
  userMeta,
  onLogout,
  onOpenAI,
  onOpenNotifications,
  notificationCount = 3,
}: {
  roleLabel: string;
  userName: string;
  userMeta: string;
  onLogout: () => void | Promise<void>;
  onOpenAI: () => void;
  onOpenNotifications?: () => void;
  notificationCount?: number;
}) {
  const insets = useSafeAreaInsets();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const notifications = notificationsForRole(roleLabel);
  const unreadCount = readNotifications.length ? 0 : Math.max(notificationCount, notifications.length);
  const openNotifications = () => {
    setReadNotifications(notifications.map((item) => item.id));
    setNotificationsOpen(true);
    onOpenNotifications?.();
  };
  return (
    <>
      <View style={[styles.topBar, { paddingTop: insets.top + 10, minHeight: 64 + insets.top }]}>
      <View style={styles.brandRow} accessible accessibilityLabel={`${userName}, ${userMeta}`}>
        <View style={styles.brandMark}><Text style={styles.brandLetter}>R</Text></View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>Rozgar</Text>
          <Text style={styles.roleLabel} numberOfLines={1}>{roleLabel}</Text>
        </View>
      </View>
      <View style={styles.topActions}>
        <Pressable accessibilityRole="button" accessibilityLabel="Ask Rozgar AI" onPress={onOpenAI} style={styles.aiButton}>
          <Ionicons name="sparkles" size={15} color={colors.forest} />
          <Text style={styles.aiText}>Ask AI</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Open notifications" style={styles.iconButton} onPress={openNotifications}>
          <Ionicons name="notifications-outline" size={19} color={colors.ink} />
          {unreadCount > 0 && <View style={styles.notificationDot}><Text style={styles.notificationText}>{unreadCount}</Text></View>}
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Log out" style={styles.avatarButton} onPress={() => { void onLogout(); }}>
          <Text style={styles.avatarText}>{userName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text>
        </Pressable>
      </View>
    </View>
      <Modal visible={notificationsOpen} transparent animationType="slide" onRequestClose={() => setNotificationsOpen(false)}>
        <View style={styles.notificationOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setNotificationsOpen(false)} />
          <View style={[styles.notificationSheet, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Notifications</Text><Text style={styles.sheetSubtitle}>{notifications.length} updates for this portal</Text></View><Pressable onPress={() => setNotificationsOpen(false)} style={styles.sheetClose}><Ionicons name="close" size={18} color={colors.sage} /></Pressable></View>
            <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
              {notifications.map((item) => <View key={item.id} style={styles.notificationRow}><View style={styles.notificationIcon}><Ionicons name={item.icon} size={17} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.notificationTitle}>{item.title}</Text><Text style={styles.notificationBody}>{item.body}</Text><Text style={styles.notificationTime}>{item.time}</Text></View></View>)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function PortalAIButton({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Ask Rozgar AI" onPress={onPress} style={[styles.floatingAI, { bottom: 78 + insets.bottom }]}>
      <Ionicons name="sparkles" size={17} color={colors.forest} />
      <Text style={styles.floatingAIText}>Ask AI</Text>
    </Pressable>
  );
}

export function DemoPill() {
  return <View style={styles.demoPill}><Text style={styles.demoPillText}>DEMO</Text></View>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function MetricCard({ label, value, detail, accent = false, icon }: { label: string; value: string; detail?: string; accent?: boolean; icon?: IconName }) {
  return (
    <View style={[styles.metric, accent && styles.metricAccent]}>
      <View style={styles.metricTop}>
        <Text style={[styles.metricLabel, accent && styles.metricTextLight]}>{label}</Text>
        {icon ? <Ionicons name={icon} size={16} color={accent ? '#B7F0CD' : colors.leaf} /> : null}
      </View>
      <Text style={[styles.metricValue, accent && styles.metricTextLight]}>{value}</Text>
      {detail ? <Text style={[styles.metricDetail, accent && styles.metricDetailLight]}>{detail}</Text> : null}
    </View>
  );
}

export function StatusPill({ label, tone = 'green' }: { label: string; tone?: 'green' | 'amber' | 'red' | 'slate' }) {
  const toneStyle = {
    green: { backgroundColor: colors.mint, color: colors.forest },
    amber: { backgroundColor: '#FFF3E5', color: '#B45309' },
    red: { backgroundColor: '#FFF0F0', color: colors.danger },
    slate: { backgroundColor: '#EEF2F0', color: colors.sage },
  }[tone];
  return <View style={[styles.statusPill, { backgroundColor: toneStyle.backgroundColor }]}><Text style={[styles.statusText, { color: toneStyle.color }]}>{label}</Text></View>;
}

export function QuickAction({ icon, label, onPress, tone = 'light' }: { icon: IconName; label: string; onPress: () => void; tone?: 'light' | 'dark' | 'alert' }) {
  const backgroundColor = tone === 'dark' ? colors.forest : tone === 'alert' ? '#FFF0F0' : '#fff';
  const iconColor = tone === 'dark' ? '#B7F0CD' : tone === 'alert' ? colors.danger : colors.forest;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor }, pressed && styles.pressed]}>
      <View style={[styles.quickIcon, { backgroundColor: tone === 'dark' ? 'rgba(183,240,205,0.15)' : colors.mint }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.quickLabel, tone === 'dark' && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function MiniWorkerCard({ worker, onPress, onBook, saved = false, onToggleSaved }: { worker: WorkerProfile; onPress: () => void; onBook: () => void; saved?: boolean; onToggleSaved?: () => void }) {
  const match = jobMatchScore(worker);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.workerCard, pressed && styles.pressed]}>
      <View style={styles.workerTop}>
        <Image source={{ uri: worker.avatarUrl }} style={styles.workerAvatar} />
        <View style={styles.workerInfo}>
          <View style={styles.workerNameRow}>
            <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
            {worker.verified ? <Ionicons name="checkmark-circle" size={14} color={colors.verified} /> : null}
          </View>
          <Text style={styles.workerTrade} numberOfLines={1}>{worker.tradeLabel} · {worker.specialty}</Text>
          <Text style={styles.workerMeta}>{worker.area} · {worker.distanceKm} km</Text>
        </View>
        {onToggleSaved ? <Pressable onPress={onToggleSaved} hitSlop={10}><Ionicons name={saved ? 'heart' : 'heart-outline'} size={19} color={saved ? colors.danger : colors.sage} /></Pressable> : null}
      </View>
      <View style={styles.workerBottom}>
        <View style={styles.ratingRow}><Ionicons name="star" size={13} color="#D97706" /><Text style={styles.ratingText}>{worker.rating} ({worker.reviewCount})</Text></View>
        <StatusPill label={`${match}% match`} tone="green" />
        <Pressable onPress={onBook} style={styles.bookMini}><Text style={styles.bookMiniText}>Book ₹{worker.floorPrice}</Text></Pressable>
      </View>
    </Pressable>
  );
}

export function BookingTimeline({ status }: { status: string }) {
  const steps = [
    { label: 'Confirmed', done: true },
    { label: 'Worker assigned', done: true },
    { label: status === 'completed' ? 'Completed' : 'On the way', done: status === 'completed' || status === 'in_progress' },
    { label: 'Payment', done: status === 'completed' },
  ];
  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => (
        <View key={step.label} style={styles.timelineStep}>
          <View style={[styles.timelineDot, step.done && styles.timelineDotDone]}>{step.done ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}</View>
          {index < steps.length - 1 ? <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} /> : null}
          <Text style={[styles.timelineLabel, step.done && styles.timelineLabelDone]}>{step.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function EmptyPanel({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.emptyPanel}>
      <View style={styles.emptyIcon}><Ionicons name="sparkles-outline" size={22} color={colors.leaf} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action && onAction ? <Pressable onPress={onAction} style={styles.emptyAction}><Text style={styles.emptyActionText}>{action}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { minHeight: 64, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  brandMark: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  brandLetter: { color: '#fff', fontSize: 15, fontWeight: '900' },
  brandCopy: { marginLeft: 9 },
  brandName: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  roleLabel: { color: colors.teal, fontSize: 9, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase', marginTop: 1 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.mint, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 },
  aiText: { color: colors.forest, fontSize: 11, fontWeight: '900' },
  iconButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', right: -3, top: -4, minWidth: 16, height: 16, paddingHorizontal: 3, borderRadius: 8, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  notificationText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  avatarButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  notificationOverlay: { flex: 1, backgroundColor: 'rgba(24,50,42,0.38)', justifyContent: 'flex-end' },
  notificationSheet: { maxHeight: '78%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18 },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D5DEDA', alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sheetTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  sheetSubtitle: { color: colors.sage, fontSize: 10, marginTop: 3 },
  sheetClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  notificationList: { flexGrow: 0 },
  notificationRow: { flexDirection: 'row', gap: 9, paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  notificationIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  notificationTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  notificationBody: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  notificationTime: { color: colors.teal, fontSize: 9, fontWeight: '800', marginTop: 4 },
  floatingAI: { position: 'absolute', right: 16, zIndex: 20, elevation: 8, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#B7E4C7', borderRadius: 22, paddingHorizontal: 13, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 8 },
  floatingAIText: { color: colors.forest, fontSize: 11, fontWeight: '900' },
  demoPill: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, borderColor: '#B7E4C7', backgroundColor: colors.mint, paddingHorizontal: 7, paddingVertical: 3 },
  demoPillText: { color: colors.teal, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 9 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  sectionAction: { color: colors.teal, fontSize: 12, fontWeight: '800' },
  metric: { flex: 1, minWidth: '46%', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12 },
  metricAccent: { backgroundColor: colors.forest, borderColor: colors.forest },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: colors.sage, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  metricValue: { color: colors.ink, fontSize: 20, fontWeight: '900', marginTop: 5 },
  metricDetail: { color: colors.leaf, fontSize: 10, marginTop: 2 },
  metricTextLight: { color: '#fff' },
  metricDetailLight: { color: '#B7F0CD' },
  statusPill: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 },
  statusText: { fontSize: 9, fontWeight: '900' },
  quickAction: { width: '48%', minHeight: 76, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10 },
  quickIcon: { width: 31, height: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickLabel: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  workerCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 12, marginBottom: 9 },
  workerTop: { flexDirection: 'row', alignItems: 'center' },
  workerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.mint },
  workerInfo: { flex: 1, marginLeft: 10, minWidth: 0 },
  workerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workerName: { color: colors.ink, fontSize: 13, fontWeight: '900', flexShrink: 1 },
  workerTrade: { color: colors.ink, fontSize: 11, marginTop: 2 },
  workerMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  workerBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  ratingText: { color: colors.ink, fontSize: 10, fontWeight: '800' },
  bookMini: { backgroundColor: colors.cta, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7 },
  bookMiniText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  timelineStep: { flex: 1, alignItems: 'center', position: 'relative' },
  timelineDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#DCE5E0', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  timelineDotDone: { backgroundColor: colors.cta },
  timelineLine: { position: 'absolute', top: 9, left: '50%', right: '-50%', height: 2, backgroundColor: '#DCE5E0' },
  timelineLineDone: { backgroundColor: colors.leaf },
  timelineLabel: { color: colors.sage, fontSize: 8, textAlign: 'center', marginTop: 5, paddingHorizontal: 2 },
  timelineLabelDone: { color: colors.forest, fontWeight: '800' },
  emptyPanel: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2', borderRadius: radius.lg, padding: 20, alignItems: 'center' },
  emptyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D5F0DF', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.ink, fontSize: 14, fontWeight: '900', marginTop: 9 },
  emptyBody: { color: colors.sage, fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 4, maxWidth: 260 },
  emptyAction: { backgroundColor: colors.cta, borderRadius: 9, paddingHorizontal: 13, paddingVertical: 8, marginTop: 12 },
  emptyActionText: { color: '#fff', fontSize: 11, fontWeight: '900' },
});
