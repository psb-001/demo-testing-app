import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import {
  Briefcase,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  PlayCircle,
  IndianRupee,
  ChevronRight,
} from 'lucide-react-native';
import { Booking, BookingStatus } from '../../types';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedSlot,
  getLocalizedTask,
} from '../../data/mobileTranslations';

interface WorkerJobsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkerJobs: React.FC<WorkerJobsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onNavigateTab,
}) => {
  const t = mobileTranslations[currentLang];
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');

  // Filter bookings for worker Ramesh Jadhav or general demo
  const workerBookings = bookings.filter(
    (b) =>
      b.workerId === 'w1' ||
      b.workerId === 'w-ramesh-jadhav' ||
      b.workerName.toLowerCase().includes('ramesh')
  );

  const filteredBookings = workerBookings.filter((b) => {
    if (filter === 'active') {
      return ['accepted', 'active', 'in_progress'].includes(b.status);
    }
    if (filter === 'completed') {
      return b.status === 'completed';
    }
    return true;
  });

  const activeCount = workerBookings.filter((b) =>
    ['accepted', 'active', 'in_progress'].includes(b.status)
  ).length;
  const pendingRequestsCount = bookings.filter(
    (b) =>
      (b.workerId === 'w1' ||
        b.workerId === 'w-ramesh-jadhav' ||
        b.workerName.toLowerCase().includes('ramesh')) &&
      b.status === 'requested'
  ).length;

  return (
    <View style={styles.container}>
      {/* Banner / Shift Header */}
      <View style={styles.banner}>
        <View style={styles.bannerTopRow}>
          <View style={styles.bannerLeft}>
            <View style={styles.liveDot} />
            <Text style={styles.bannerShiftLabel}>{t.worker.jobs.dutyShiftActive}</Text>
          </View>
          <Text style={styles.bannerHubBadge}>{t.worker.jobs.wardHub}</Text>
        </View>

        <Text style={styles.workerName}>Ramesh Jadhav</Text>
        <Text style={styles.payoutRateText}>{t.worker.jobs.directPayoutRate}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValueWhite}>{activeCount}</Text>
            <Text style={styles.statLabel}>{t.worker.jobs.activeJobs}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValueWhite}>₹3,850</Text>
            <Text style={styles.statLabel}>{t.worker.jobs.todayNet}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValueEmerald}>4.94★</Text>
            <Text style={styles.statLabel}>{t.worker.jobs.qualityScore}</Text>
          </View>
        </View>
      </View>

      {/* Pending Requests Alert if any */}
      {pendingRequestsCount > 0 && (
        <Pressable
          onPress={() => onNavigateTab('requests')}
          style={({ pressed }) => [styles.alertCard, pressed && styles.pressedDim]}
        >
          <View style={styles.alertLeft}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{pendingRequestsCount}</Text>
            </View>
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertTitle}>{t.worker.jobs.newRequestAlert}</Text>
              <Text style={styles.alertSubtitle}>{t.worker.jobs.decisionWindowActive}</Text>
            </View>
          </View>
          <View style={styles.alertRight}>
            <Text style={styles.alertRightText}>{t.worker.jobs.reviewBtn}</Text>
            <ChevronRight size={16} color="#78350f" />
          </View>
        </Pressable>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter('active')}
          style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
        >
          <Text style={[styles.filterTabText, filter === 'active' && styles.filterTabTextActive]}>
            {t.worker.jobs.filterActive} ({activeCount})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('completed')}
          style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
        >
          <Text style={[styles.filterTabText, filter === 'completed' && styles.filterTabTextActive]}>
            {t.worker.jobs.filterCompleted}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('all')}
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            {t.worker.jobs.filterAll} ({workerBookings.length})
          </Text>
        </Pressable>
      </View>

      {/* Job Cards List */}
      {filteredBookings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Briefcase size={40} color="#cbd5e1" />
          <Text style={styles.emptyText}>{t.worker.jobs.emptyJobs}</Text>
        </View>
      ) : (
        <View style={styles.jobList}>
          {filteredBookings.map((job) => {
            const isAccepted = job.status === 'accepted';
            const isInProgress = job.status === 'in_progress';
            const isDone = job.status === 'completed';

            const badgeBg = isInProgress
              ? '#e0e7ff'
              : isAccepted
              ? '#d1fae5'
              : isDone
              ? '#f1f5f9'
              : '#fef3c7';
            const badgeColor = isInProgress
              ? '#4338ca'
              : isAccepted
              ? '#047857'
              : isDone
              ? '#334155'
              : '#92400e';

            return (
              <View key={job.id} style={styles.jobCard}>
                {/* Header */}
                <View style={styles.jobHeaderRow}>
                  <View style={styles.jobHeaderLeft}>
                    <View style={styles.jobMetaRow}>
                      <Text style={styles.jobId}>#{job.id.slice(-6).toUpperCase()}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.statusBadgeText, { color: badgeColor }]}>
                          {getLocalizedStatus(job.status, currentLang)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.jobTitle}>
                      {getLocalizedTask(job.taskDescription, currentLang)}
                    </Text>
                  </View>

                  <View style={styles.jobHeaderRight}>
                    <View style={styles.payoutRow}>
                      <IndianRupee size={14} color="#047857" />
                      <Text style={styles.payoutValue}>{job.workerPayout}</Text>
                    </View>
                    <Text style={styles.takeHomeLabel}>{t.worker.jobs.yourTakeHome}</Text>
                  </View>
                </View>

                {/* Customer and Location info */}
                <View style={styles.infoBox}>
                  <View style={styles.infoRowBetween}>
                    <Text style={styles.customerName}>{job.customerName}</Text>
                    <Pressable
                      onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                      style={({ pressed }) => [styles.callPill, pressed && styles.pressedDim]}
                    >
                      <Phone size={12} color="#047857" />
                      <Text style={styles.callPillText}>{t.worker.jobs.customer}</Text>
                    </Pressable>
                  </View>
                  <View style={styles.infoRowStart}>
                    <MapPin size={14} color="#94a3b8" />
                    <Text style={styles.infoText}>{job.address}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#94a3b8" />
                    <Text style={styles.infoText}>{getLocalizedSlot(job.scheduledSlot, currentLang)}</Text>
                  </View>
                </View>

                {/* Action simulation buttons */}
                <View style={styles.actionWrap}>
                  {isAccepted && (
                    <Pressable
                      onPress={() => onUpdateBookingStatus(job.id, 'in_progress')}
                      style={({ pressed }) => [styles.startBtn, pressed && styles.btnPressed]}
                    >
                      <PlayCircle size={16} color="#ffffff" />
                      <Text style={styles.actionBtnText}>{t.worker.jobs.startJobBtn}</Text>
                    </Pressable>
                  )}

                  {isInProgress && (
                    <Pressable
                      onPress={() => onUpdateBookingStatus(job.id, 'completed')}
                      style={({ pressed }) => [styles.completeBtn, pressed && styles.btnPressed]}
                    >
                      <CheckCircle2 size={16} color="#ffffff" />
                      <Text style={styles.actionBtnText}>{t.worker.jobs.completeJobBtn}</Text>
                    </Pressable>
                  )}

                  {isDone && (
                    <View style={styles.doneBox}>
                      <View style={styles.doneLeft}>
                        <CheckCircle2 size={16} color="#059669" />
                        <Text style={styles.doneBoxText}>{t.worker.jobs.completedBadge}</Text>
                      </View>
                      <Text style={styles.doneBoxAmount}>₹{job.workerPayout}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  banner: {
    backgroundColor: '#065f46',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#34d399',
  },
  bannerShiftLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6ee7b7',
  },
  bannerHubBadge: {
    fontSize: 12,
    backgroundColor: 'rgba(4,120,87,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    color: '#d1fae5',
    fontWeight: '500',
  },
  workerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  payoutRateText: {
    fontSize: 12,
    color: '#a7f3d0',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(4,120,87,0.6)',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(2,44,34,0.4)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.3)',
    alignItems: 'center',
    minWidth: 0,
  },
  statValueWhite: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  statValueEmerald: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6ee7b7',
  },
  statLabel: {
    fontSize: 10,
    color: '#6ee7b7',
    marginTop: 2,
  },
  alertCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  alertBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadgeText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  alertTextWrap: {
    flexShrink: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350f',
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
  },
  alertRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertRightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 9,
  },
  filterTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#0f172a',
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginTop: 8,
  },
  jobList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  jobHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  jobHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  jobId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
    lineHeight: 18,
    flexShrink: 1,
  },
  jobHeaderRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  payoutValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  takeHomeLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
  },
  infoRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    flexShrink: 1,
  },
  callPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  callPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoRowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
    flexShrink: 1,
  },
  actionWrap: {
    paddingTop: 4,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#059669',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  doneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 10,
  },
  doneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneBoxText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#065f46',
  },
  doneBoxAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  btnPressed: {
    opacity: 0.85,
  },
  pressedDim: {
    opacity: 0.7,
  },
});