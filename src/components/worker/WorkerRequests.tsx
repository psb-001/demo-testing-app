import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  Sparkles,
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

interface WorkerRequestsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onSimulateNewRequest: () => void;
}

export const WorkerRequests: React.FC<WorkerRequestsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onSimulateNewRequest,
}) => {
  const t = mobileTranslations[currentLang];

  // Pending requests for Ramesh Jadhav or unassigned
  const pendingRequests = bookings.filter(
    (b) =>
      (b.workerId === 'w1' ||
        b.workerId === 'w-ramesh-jadhav' ||
        b.workerName.toLowerCase().includes('ramesh')) &&
      b.status === 'requested'
  );

  // Simulated countdown clock for the top request (default 245s / ~4 min)
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
      {/* Header Banner - Responsive and collision-free */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>{t.worker.requests.title}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingRequests.length} {t.worker.requests.pendingCount}
                </Text>
              </View>
            </View>
            <Text style={styles.windowSubtitle}>{t.worker.requests.windowSubtitle}</Text>
          </View>

          <Pressable
            onPress={onSimulateNewRequest}
            style={({ pressed }) => [styles.simulateBtn, pressed && styles.pressedDim]}
          >
            <Sparkles size={14} color="#059669" />
            <Text style={styles.simulateBtnText}>+ {t.worker.requests.simulateRequestBtn}</Text>
          </Pressable>
        </View>
      </View>

      {pendingRequests.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <UserCheck size={24} color="#059669" />
          </View>
          <Text style={styles.emptyTitle}>{t.worker.requests.emptyRequests}</Text>
          <Pressable
            onPress={onSimulateNewRequest}
            style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.pressedDim]}
          >
            <Sparkles size={16} color="#ffffff" />
            <Text style={styles.emptyActionBtnText}>{t.worker.requests.simulateRequestBtn}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.requestList}>
          {pendingRequests.map((req) => {
            return (
              <View key={req.id} style={styles.requestCard}>
                {/* Urgent Countdown Strip */}
                <View
                  style={[
                    styles.countdownStrip,
                    isUrgent ? styles.countdownUrgent : styles.countdownNormal,
                  ]}
                >
                  <View style={styles.countdownLeft}>
                    <Clock size={16} color={isUrgent ? '#e11d48' : '#d97706'} />
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

                {/* Emergency Tag if applicable */}
                {req.isEmergency && (
                  <View style={styles.emergencyTag}>
                    <AlertTriangle size={14} color="#e11d48" />
                    <Text style={styles.emergencyTagText}>{t.worker.requests.immediateRequest}</Text>
                  </View>
                )}

                {/* Request Details */}
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
                        <IndianRupee size={14} color="#047857" />
                        <Text style={styles.payoutValue}>{req.workerPayout}</Text>
                      </View>
                      <Text style={styles.directCreditLabel}>{t.worker.requests.directCredit}</Text>
                    </View>
                  </View>

                  <View style={styles.infoBox}>
                    <View style={styles.infoRowBetween}>
                      <Text style={styles.customerName}>{req.customerName}</Text>
                      <View style={styles.localityPill}>
                        <Text style={styles.localityPillText}>{req.locality}</Text>
                      </View>
                    </View>
                    <View style={styles.infoRowStart}>
                      <MapPin size={14} color="#94a3b8" />
                      <Text style={styles.infoText}>{req.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Calendar size={14} color="#94a3b8" />
                      <Text style={styles.infoText}>{getLocalizedSlot(req.scheduledSlot, currentLang)}</Text>
                    </View>
                  </View>
                </View>

                {/* Payout Breakdown */}
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

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => onUpdateBookingStatus(req.id, 'declined')}
                    style={({ pressed }) => [styles.declineBtn, pressed && styles.pressedDim]}
                  >
                    <XCircle size={16} color="#334155" />
                    <Text style={styles.declineBtnText}>{t.worker.requests.declineJobBtn}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onUpdateBookingStatus(req.id, 'accepted')}
                    style={({ pressed }) => [styles.acceptBtn, pressed && styles.pressedDim]}
                  >
                    <CheckCircle size={16} color="#ffffff" />
                    <Text style={styles.acceptBtnText}>{t.worker.requests.acceptJobBtn}</Text>
                  </Pressable>
                </View>

                {/* Demo expiry button */}
                <Pressable onPress={() => onUpdateBookingStatus(req.id, 'expired')}>
                  <Text style={styles.demoExpiryText}>
                    {currentLang === 'hi'
                      ? '[डेमो: स्वतः-समयसमाप्ति सिमुलेट करें]'
                      : currentLang === 'mr'
                      ? '[डेमो: आपोआप मुदत संपणे सिमुलेट करा]'
                      : '[Demo Control: Simulate Auto-Timeout / Expiry]'}
                  </Text>
                </Pressable>
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
    paddingBottom: 20,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  pendingBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  pendingBadgeText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '700',
  },
  windowSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 0,
  },
  simulateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  requestList: {
    gap: 14,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(16,185,129,0.8)',
    padding: 14,
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  countdownStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  countdownUrgent: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  countdownNormal: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  countdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  countdownUrgentText: {
    color: '#9f1239',
  },
  countdownNormalText: {
    color: '#92400e',
  },
  countdownTime: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emergencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffe4e6',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
  emergencyTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9f1239',
  },
  reqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  reqHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  reqId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
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
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  directCreditLabel: {
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
    marginTop: 10,
  },
  infoRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  localityPill: {
    backgroundColor: 'rgba(226,232,240,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 999,
  },
  localityPillText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoRowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    flexShrink: 1,
  },
  payoutBreakdown: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: 'rgba(167,243,208,0.6)',
    borderRadius: 12,
    padding: 8,
  },
  payoutBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutTotal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#064e3b',
    flexShrink: 1,
  },
  payoutDirect: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    flexShrink: 1,
  },
  payoutWelfare: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  acceptBtn: {
    flex: 1,
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
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  demoExpiryText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    paddingVertical: 2,
  },
  pressedDim: {
    opacity: 0.7,
  },
});