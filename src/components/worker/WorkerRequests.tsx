import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  UserCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react-native';
import { Booking, BookingStatus } from '../../types';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedSlot,
  getLocalizedTask,
} from '../../data/mobileTranslations';
import { Badge, Button, Card, EmptyState, PrimaryButton, ToneBadge } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface WorkerRequestsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onSimulateNewRequest: () => void;
}

const accent = roleAccent.worker;

export const WorkerRequests: React.FC<WorkerRequestsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onSimulateNewRequest,
}) => {
  const t = mobileTranslations[currentLang];

  const pendingRequests = bookings.filter(
    (b) =>
      (b.workerId === 'w1' ||
        b.workerId === 'w-ramesh-jadhav' ||
        b.workerName.toLowerCase().includes('ramesh')) &&
      b.status === 'requested'
  );

  const [secondsRemaining, setSecondsRemaining] = useState<number>(245);

  useEffect(() => {
    if (pendingRequests.length === 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingRequests.length]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const isUrgent = secondsRemaining < 60;

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>{t.worker.requests.title}</Text>
              <Badge color={colors.successFg} bg={colors.successLight}>
                {pendingRequests.length} {t.worker.requests.pendingCount}
              </Badge>
            </View>
            <Text style={styles.windowSubtitle}>{t.worker.requests.windowSubtitle}</Text>
          </View>

          <Button
            variant="outline"
            color={accent}
            onPress={onSimulateNewRequest}
          >
            + {t.worker.requests.simulateRequestBtn}
          </Button>
        </View>
      </Card>

      {pendingRequests.length === 0 ? (
        <Card>
          <EmptyState
            icon={
              <View style={styles.emptyIconWrap}>
                <UserCheck size={24} color={accent} />
              </View>
            }
            title={t.worker.requests.emptyRequests}
            action={
              <PrimaryButton
                label={t.worker.requests.simulateRequestBtn}
                color={accent}
                onPress={onSimulateNewRequest}
              />
            }
          />
        </Card>
      ) : (
        <View style={styles.requestList}>
          {pendingRequests.map((req) => {
            return (
              <Card key={req.id} style={[styles.requestCard, { borderColor: accent }]}>
                <View
                  style={[
                    styles.countdownStrip,
                    isUrgent ? styles.countdownUrgent : styles.countdownNormal,
                  ]}
                >
                  <View style={styles.countdownLeft}>
                    <Clock size={16} color={isUrgent ? colors.error : colors.warningFg} />
                    <Text
                      style={[
                        styles.countdownLabel,
                        isUrgent ? styles.countdownUrgentText : styles.countdownNormalText,
                      ]}
                    >
                      {t.worker.requests.expiresIn}:
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.countdownTime,
                      isUrgent ? styles.countdownUrgentText : styles.countdownNormalText,
                    ]}
                  >
                    {timeFormatted}
                  </Text>
                </View>

                {req.isEmergency && (
                  <View style={styles.emergencyTag}>
                    <AlertTriangle size={14} color={colors.error} />
                    <ToneBadge
                      tone={{ fg: colors.errorFg, bg: colors.errorLight }}
                      label={t.worker.requests.immediateRequest}
                    />
                  </View>
                )}

                <View>
                  <View style={styles.reqHeaderRow}>
                    <View style={styles.reqHeaderLeft}>
                      <Text style={styles.reqId}>Request #{req.id.slice(-6).toUpperCase()}</Text>
                      <Text style={styles.reqTitle}>
                        {getLocalizedTask(req.taskDescription, currentLang)}
                      </Text>
                    </View>
                    <View style={styles.reqHeaderRight}>
                      <View style={styles.payoutRow}>
                        <IndianRupee size={14} color={colors.emeraldDark} />
                        <Text style={styles.payoutValue}>{req.workerPayout}</Text>
                      </View>
                      <Text style={styles.directCreditLabel}>{t.worker.requests.directCredit}</Text>
                    </View>
                  </View>

                  <View style={styles.infoBox}>
                    <View style={styles.infoRowBetween}>
                      <Text style={styles.customerName}>{req.customerName}</Text>
                      <Badge color={colors.slate700} bg={colors.slate100}>
                        {req.locality}
                      </Badge>
                    </View>
                    <View style={styles.infoRowStart}>
                      <MapPin size={14} color={colors.textMuted} />
                      <Text style={styles.infoText}>{req.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Calendar size={14} color={colors.textMuted} />
                      <Text style={styles.infoText}>{getLocalizedSlot(req.scheduledSlot, currentLang)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.payoutBreakdown}>
                  <View style={styles.payoutBreakdownRow}>
                    <Text style={styles.payoutTotal}>
                      {t.worker.requests.totalCustomerPaid}: ₹{req.totalAmount}
                    </Text>
                    <Text style={styles.payoutDirect}>
                      {t.worker.requests.directCredit} (88%): ₹{req.workerPayout}
                    </Text>
                  </View>
                  <Text style={styles.payoutWelfare}>
                    ₹{req.coopFund} {t.worker.requests.welfareShare}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Button
                    variant="outline"
                    color={colors.slate700}
                    style={styles.actionFlex}
                    onPress={() => onUpdateBookingStatus(req.id, 'declined')}
                  >
                    <View style={styles.actionBtnInner}>
                      <XCircle size={16} color={colors.slate700} />
                      <Text style={styles.declineBtnText}>{t.worker.requests.declineJobBtn}</Text>
                    </View>
                  </Button>
                  <Button
                    color={accent}
                    style={styles.actionFlex}
                    onPress={() => onUpdateBookingStatus(req.id, 'accepted')}
                  >
                    <View style={styles.actionBtnInner}>
                      <CheckCircle size={16} color={colors.white} />
                      <Text style={styles.acceptBtnText}>{t.worker.requests.acceptJobBtn}</Text>
                    </View>
                  </Button>
                </View>

                <Pressable onPress={() => onUpdateBookingStatus(req.id, 'expired')}>
                  <Text style={styles.demoExpiryText}>
                    {currentLang === 'hi'
                      ? '[डेमो: स्वतः-समयसमाप्ति सिमुलेट करें]'
                      : currentLang === 'mr'
                      ? '[डेमो: आपोआप मुदत संपणे सिमुलेट करा]'
                      : '[Demo Control: Simulate Auto-Timeout / Expiry]'}
                  </Text>
                </Pressable>
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
  headerCard: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  headerTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  windowSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.card,
    backgroundColor: colors.emeraldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestList: {
    gap: spacing.md,
  },
  requestCard: {
    gap: spacing.md,
    borderWidth: 1.5,
  },
  countdownStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.control,
    borderWidth: 1,
  },
  countdownUrgent: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
  },
  countdownNormal: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  countdownLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    flexShrink: 1,
  },
  countdownUrgentText: {
    color: colors.errorFg,
  },
  countdownNormalText: {
    color: colors.warningFg,
  },
  countdownTime: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emergencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  reqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  reqHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  reqId: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reqTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
    marginTop: 2,
  },
  reqHeaderRight: {
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
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.emeraldDark,
  },
  directCreditLabel: {
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
    marginTop: spacing.sm,
  },
  infoRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  customerName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.slate800,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoRowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
    flexShrink: 1,
  },
  payoutBreakdown: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.sm,
  },
  payoutBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutTotal: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.successFg,
    flexShrink: 1,
  },
  payoutDirect: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
    flexShrink: 1,
  },
  payoutWelfare: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  actionFlex: {
    flex: 1,
  },
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  declineBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate700,
  },
  acceptBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
  demoExpiryText: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '500',
    paddingVertical: 2,
  },
});
