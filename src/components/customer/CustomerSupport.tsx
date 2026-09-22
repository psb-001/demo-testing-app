import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import {
  Scale,
  Plus,
  MessageSquare,
  Building2,
  Phone,
  CheckCircle2
} from 'lucide-react-native';
import { Dispute, Booking } from '../../types';
import { AppModal, Button, Chip, TextField } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedStatement
} from '../../data/mobileTranslations';

interface CustomerSupportProps {
  disputes: Dispute[];
  bookings: Booking[];
  currentLang?: AppLanguage;
  onRaiseDispute: (bookingId: string, issue: string) => void;
}

export const CustomerSupport: React.FC<CustomerSupportProps> = ({
  disputes,
  bookings,
  currentLang = 'en',
  onRaiseDispute
}) => {
  const t = mobileTranslations[currentLang];
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || '');
  const [issueText, setIssueText] = useState('');

  const isWeb = Platform.OS === 'web';

  React.useEffect(() => {
    if (!showRaiseModal) return;
    if (!isWeb) return;
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === 'Escape') setShowRaiseModal(false);
    };
    const g = globalThis as any;
    g.window.addEventListener('keydown', handleKeyDown);
    return () => g.window.removeEventListener('keydown', handleKeyDown);
     
  }, [showRaiseModal, isWeb]);

  const handleCreateDispute = () => {
    if (!selectedBookingId || !issueText) return;
    onRaiseDispute(selectedBookingId, issueText);
    setShowRaiseModal(false);
    setIssueText('');
  };

  const getStatusStyle = (status: Dispute['status']) => {
    if (status === 'resolved') return { bg: '#d1fae5', color: '#065f46' };
    if (status === 'under_review') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };

  return (
    <View style={styles.root}>

      {/* Header */}
      <View>
        <Text style={styles.headerTitle}>{t.customer.support.title}</Text>
        <Text style={styles.headerSubtitle}>{t.customer.support.subtitle}</Text>
      </View>

      {/* Raise Dispute CTA Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.bannerLeft}>
          <View style={styles.councilBadge}>
            <Scale size={12} color="#fcd34d" />
            <Text style={styles.councilBadgeText}>{t.customer.support.councilBadge}</Text>
          </View>
          <Text style={styles.bannerTitle}>{t.customer.support.bannerTitle}</Text>
          <Text style={styles.bannerDesc}>{t.customer.support.bannerDesc}</Text>
        </View>
        <Pressable
          onPress={() => setShowRaiseModal(true)}
          style={({ pressed }) => [styles.raiseBtn, pressed && styles.pressed]}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={styles.raiseBtnText}>{t.customer.support.raiseIssueBtn}</Text>
        </Pressable>
      </View>

      {/* Disputes List */}
      <View>
        <Text style={styles.sectionLabel}>
          {t.customer.support.activeGrievances.replace('{count}', String(disputes.length))}
        </Text>

        {disputes.length === 0 ? (
          <View style={styles.emptyCard}>
            <CheckCircle2 size={32} color="#059669" />
            <Text style={styles.emptyTitle}>{t.customer.support.noDisputesTitle}</Text>
            <Text style={styles.emptyDesc}>{t.customer.support.noDisputesDesc}</Text>
          </View>
        ) : (
          <View style={styles.disputesList}>
            {disputes.map((dsp) => {
              const statusCol = getStatusStyle(dsp.status);
              return (
                <View key={dsp.id} style={styles.disputeCard}>
                  {/* Status bar */}
                  <View style={styles.disputeTop}>
                    <Text style={styles.disputeRef}>Ref #{dsp.bookingId}</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusCol.bg }]}>
                      <Text style={[styles.statusPillText, { color: statusCol.color }]}>
                        {dsp.status === 'under_review'
                          ? (currentLang === 'hi'
                              ? 'परिषद समीक्षा में'
                              : currentLang === 'mr'
                              ? 'समिती तपासत आहे'
                              : 'Council Reviewing')
                          : dsp.status}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.targetText}>
                      {t.customer.support.targetProfessional
                        .replace('{name}', dsp.workerName)
                        .replace('{trade}', getLocalizedTrade(dsp.workerTrade, currentLang))}
                    </Text>
                    <View style={styles.statementBox}>
                      <Text style={styles.statementLabel}>{t.customer.support.yourStatement}:</Text>
                      <Text style={styles.blockquote}>
                        {getLocalizedStatement(dsp.issue, currentLang)}
                      </Text>
                    </View>
                  </View>

                  {/* Worker Response (if provided) */}
                  {dsp.workerResponse && (
                    <View style={styles.workerResponseBox}>
                      <View style={styles.responseHeader}>
                        <MessageSquare size={14} color="#4338ca" />
                        <Text style={styles.responseHeaderText}>
                          {t.customer.support.workerResponse.replace('{name}', dsp.workerName)}:
                        </Text>
                      </View>
                      <Text style={styles.blockquoteIndigo}>
                        {getLocalizedStatement(dsp.workerResponse, currentLang)}
                      </Text>
                      {dsp.workerResponseTime && (
                        <Text style={styles.responseTime}>{dsp.workerResponseTime}</Text>
                      )}
                    </View>
                  )}

                  {/* Council Resolution Notes */}
                  {dsp.resolutionNotes && (
                    <View style={styles.resolutionBox}>
                      <View style={styles.resolutionHeader}>
                        <CheckCircle2 size={14} color="#047857" />
                        <Text style={styles.resolutionHeaderText}>
                          {t.customer.support.councilResolution}:
                        </Text>
                      </View>
                      <Text style={styles.blockquoteEmerald}>
                        {getLocalizedStatement(dsp.resolutionNotes, currentLang)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Cooperative Help Center Cards */}
      <View>
        <Text style={styles.sectionLabel}>{t.customer.support.emergencyTitle}</Text>

        <View style={styles.helpList}>
          <View style={styles.helpCard}>
            <View style={styles.helpLeft}>
              <View style={styles.helpIconBlue}>
                <Phone size={20} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.helpTitle}>{t.customer.support.helplineTitle}</Text>
                <Text style={styles.helpSubtitle}>{t.customer.support.helplineTiming}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => Linking.openURL('tel:18002608900')}
              style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}
            >
              <Text style={styles.callBtnText}>{t.customer.support.callBtn}</Text>
            </Pressable>
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpLeft}>
              <View style={styles.helpIconBlue}>
                <Building2 size={20} color="#1d4ed8" />
              </View>
              <View style={styles.helpInfoWrap}>
                <Text style={styles.helpTitle}>{t.customer.support.wardHubCell}</Text>
                <Text style={styles.helpSubtitle}>{t.customer.support.wardHubAddress}</Text>
              </View>
            </View>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>Zone 4</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Raise Dispute Modal */}
      <AppModal
        visible={showRaiseModal}
        onClose={() => setShowRaiseModal(false)}
        title={t.customer.support.modalTitle}
        subtitle={t.customer.support.modalSubtitle}
      >
        <View style={styles.formField}>
          <Text style={styles.formLabel}>{t.customer.support.selectBooking}</Text>
          <View style={styles.bookingChips}>
            {bookings.map((b) => (
              <Chip
                key={b.id}
                label={`#${b.id} - ${b.workerName} (${getLocalizedTrade(b.workerTrade, currentLang)}) - ₹${b.totalAmount}`}
                selected={selectedBookingId === b.id}
                color="#2563eb"
                onPress={() => setSelectedBookingId(b.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>{t.customer.support.describeIssue}</Text>
          <TextField
            value={issueText}
            onChangeText={setIssueText}
            placeholder={t.customer.support.describeIssuePlaceholder}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.protectionBox}>
          <Text style={styles.protectionText}>{t.customer.support.coopProtection}</Text>
        </View>

        <Button block color="#2563eb" onPress={handleCreateDispute}>
          {t.customer.support.submitGrievanceBtn}
        </Button>
      </AppModal>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    gap: 20,
    paddingBottom: 96,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  bannerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerLeft: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  councilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(69,26,3,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
  },
  councilBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fcd34d',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerDesc: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  raiseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  raiseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#94a3b8',
    marginBottom: 10,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  emptyDesc: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  disputesList: {
    gap: 12,
  },
  disputeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  disputeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disputeRef: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  targetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  statementBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: 6,
    gap: 4,
  },
  statementLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  blockquote: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#cbd5e1',
    paddingLeft: 8,
  },
  workerResponseBox: {
    backgroundColor: 'rgba(238,242,255,0.7)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(199,210,254,0.7)',
    gap: 6,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#312e81',
  },
  blockquoteIndigo: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#a5b4fc',
    paddingLeft: 8,
  },
  responseTime: {
    fontSize: 10,
    color: '#4338ca',
    fontWeight: '500',
    marginTop: 2,
  },
  resolutionBox: {
    backgroundColor: 'rgba(236,253,245,0.8)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 6,
  },
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resolutionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064e3b',
  },
  blockquoteEmerald: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#34d399',
    paddingLeft: 8,
  },
  helpList: {
    gap: 10,
  },
  helpCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  helpIconBlue: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  helpSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  helpInfoWrap: {
    flex: 1,
    minWidth: 0,
  },
  callBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  zonePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  zonePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  formField: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  bookingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  protectionBox: {
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 14,
  },
  protectionText: {
    fontSize: 11,
    color: '#1e3a8a',
    lineHeight: 16,
  },
});