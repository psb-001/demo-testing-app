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
  Star,
} from 'lucide-react-native';
import { Booking, BookingStatus } from '../../types';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedSlot,
  getLocalizedTask,
} from '../../data/mobileTranslations';
import { Badge, Button, Card, EmptyState, Segmented, StatBox, StatusBadge } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface WorkerJobsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onNavigateTab: (tab: string) => void;
}

const accent = roleAccent.worker;
type JobsFilter = 'active' | 'completed' | 'all';

export const WorkerJobs: React.FC<WorkerJobsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onNavigateTab,
}) => {
  const t = mobileTranslations[currentLang];
  const [filter, setFilter] = useState<JobsFilter>('active');

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
      <Card style={styles.banner}>
        <View style={styles.bannerTopRow}>
          <View style={styles.bannerLeft}>
            <View style={styles.liveDot} />
            <Text style={styles.bannerShiftLabel}>{t.worker.jobs.dutyShiftActive}</Text>
          </View>
          <Badge color={accent} bg={colors.emeraldLight}>
            {t.worker.jobs.wardHub}
          </Badge>
        </View>

        <Text style={styles.workerName}>Ramesh Jadhav</Text>
        <Text style={styles.payoutRateText}>{t.worker.jobs.directPayoutRate}</Text>

        <View style={styles.statsRow}>
          <StatBox
            label={t.worker.jobs.activeJobs}
            value={String(activeCount)}
            color={accent}
            icon={<Briefcase size={16} color={accent} />}
          />
          <StatBox
            label={t.worker.jobs.todayNet}
            value="₹3,850"
            color={accent}
            icon={<IndianRupee size={16} color={accent} />}
          />
          <StatBox
            label={t.worker.jobs.qualityScore}
            value="4.94★"
            color={colors.amber}
            icon={<Star size={16} color={colors.amber} fill={colors.amber} />}
          />
        </View>
      </Card>

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
            <ChevronRight size={16} color={colors.warningFg} />
          </View>
        </Pressable>
      )}

      <Segmented<JobsFilter>
        options={[
          { value: 'active', label: `${t.worker.jobs.filterActive} (${activeCount})` },
          { value: 'completed', label: t.worker.jobs.filterCompleted },
          { value: 'all', label: `${t.worker.jobs.filterAll} (${workerBookings.length})` },
        ]}
        value={filter}
        onChange={setFilter}
        accent={accent}
      />

      {filteredBookings.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase size={40} color={colors.slate300} />}
            title={t.worker.jobs.emptyJobs}
          />
        </Card>
      ) : (
        <View style={styles.jobList}>
          {filteredBookings.map((job) => {
            const isAccepted = job.status === 'accepted';
            const isInProgress = job.status === 'in_progress';
            const isDone = job.status === 'completed';

            return (
              <Card key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeaderRow}>
                  <View style={styles.jobHeaderLeft}>
                    <View style={styles.jobMetaRow}>
                      <Text style={styles.jobId}>#{job.id.slice(-6).toUpperCase()}</Text>
                      <StatusBadge status={job.status} label={getLocalizedStatus(job.status, currentLang)} />
                    </View>
                    <Text style={styles.jobTitle}>
                      {getLocalizedTask(job.taskDescription, currentLang)}
                    </Text>
                  </View>

                  <View style={styles.jobHeaderRight}>
                    <View style={styles.payoutRow}>
                      <IndianRupee size={14} color={colors.emeraldDark} />
                      <Text style={styles.payoutValue}>{job.workerPayout}</Text>
                    </View>
                    <Text style={styles.takeHomeLabel}>{t.worker.jobs.yourTakeHome}</Text>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <View style={styles.infoRowBetween}>
                    <Text style={styles.customerName}>{job.customerName}</Text>
                    <Pressable
                      onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                      style={({ pressed }) => [styles.callPill, pressed && styles.pressedDim]}
                    >
                      <Phone size={12} color={colors.emeraldDark} />
                      <Text style={styles.callPillText}>{t.worker.jobs.customer}</Text>
                    </Pressable>
                  </View>
                  <View style={styles.infoRowStart}>
                    <MapPin size={14} color={colors.textMuted} />
                    <Text style={styles.infoText}>{job.address}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={14} color={colors.textMuted} />
                    <Text style={styles.infoText}>{getLocalizedSlot(job.scheduledSlot, currentLang)}</Text>
                  </View>
                </View>

                <View style={styles.actionWrap}>
                  {isAccepted && (
                    <Button
                      block
                      color={accent}
                      onPress={() => onUpdateBookingStatus(job.id, 'in_progress')}
                    >
                      <View style={styles.actionBtnInner}>
                        <PlayCircle size={16} color={colors.white} />
                        <Text style={styles.actionBtnText}>{t.worker.jobs.startJobBtn}</Text>
                      </View>
                    </Button>
                  )}

                  {isInProgress && (
                    <Button
                      block
                      color={colors.slate900}
                      onPress={() => onUpdateBookingStatus(job.id, 'completed')}
                    >
                      <View style={styles.actionBtnInner}>
                        <CheckCircle2 size={16} color={colors.white} />
                        <Text style={styles.actionBtnText}>{t.worker.jobs.completeJobBtn}</Text>
                      </View>
                    </Button>
                  )}

                  {isDone && (
                    <View style={styles.doneBox}>
                      <View style={styles.doneLeft}>
                        <CheckCircle2 size={16} color={colors.success} />
                        <Text style={styles.doneBoxText}>{t.worker.jobs.completedBadge}</Text>
                      </View>
                      <Text style={styles.doneBoxAmount}>₹{job.workerPayout}</Text>
                    </View>
                  )}
                </View>
              </Card>
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
    gap: spacing.lg,
  },
  banner: {
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  bannerShiftLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  workerName: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  payoutRateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  alertCard: {
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  alertBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadgeText: {
    fontWeight: '700',
    fontSize: fontSize.sm,
    color: colors.white,
  },
  alertTextWrap: {
    flexShrink: 1,
  },
  alertTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.warningFg,
  },
  alertSubtitle: {
    fontSize: fontSize.xs,
    color: colors.warningFg,
    marginTop: 2,
  },
  alertRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  alertRightText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.warningFg,
  },
  jobList: {
    gap: spacing.md,
  },
  jobCard: {
    gap: spacing.md,
  },
  jobHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  jobHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  jobId: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.slate800,
    marginTop: spacing.xs,
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
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.emeraldDark,
  },
  takeHomeLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  infoBox: {
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  infoRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.slate800,
    flexShrink: 1,
  },
  callPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.success,
    minHeight: 32,
  },
  callPillText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
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
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  actionWrap: {
    paddingTop: spacing.xs,
  },
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
  doneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.sm,
  },
  doneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneBoxText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.successFg,
  },
  doneBoxAmount: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  pressedDim: {
    opacity: 0.7,
  },
});
