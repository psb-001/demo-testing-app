import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Scale,
} from 'lucide-react-native';
import { Dispute } from '../../types';
import { TextField } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTrade,
  getLocalizedStatement,
} from '../../data/mobileTranslations';

interface WorkerDisputesProps {
  disputes: Dispute[];
  currentLang?: AppLanguage;
  onWorkerRespond: (disputeId: string, response: string) => void;
}

export const WorkerDisputes: React.FC<WorkerDisputesProps> = ({
  disputes,
  currentLang = 'en',
  onWorkerRespond,
}) => {
  const t = mobileTranslations[currentLang];

  // Filter disputes relevant to worker Ramesh Jadhav
  const workerDisputes = disputes.filter(
    (d) =>
      d.workerId === 'w1' ||
      d.workerId === 'w-ramesh-jadhav' ||
      d.workerName.toLowerCase().includes('ramesh')
  );
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  const handleTextChange = (disputeId: string, text: string) => {
    setResponseTexts((prev) => ({ ...prev, [disputeId]: text }));
  };

  const handleSendResponse = (disputeId: string) => {
    const text = responseTexts[disputeId];
    if (!text || !text.trim()) return;
    onWorkerRespond(disputeId, text.trim());
    setResponseTexts((prev) => ({ ...prev, [disputeId]: '' }));
  };

  return (
    <View style={styles.container}>
      {/* Cooperative Protection Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerRow}>
          <Scale size={20} color="#818cf8" />
          <Text style={styles.bannerTitle}>{t.worker.disputes.peerPanel}</Text>
        </View>
        <Text style={styles.bannerSubtitle}>{t.worker.disputes.disputesSubtitle}</Text>
      </View>

      <View style={styles.list}>
        <Text style={styles.listHeader}>
          {t.worker.disputes.disputeCases} ({workerDisputes.length})
        </Text>

        {workerDisputes.length === 0 ? (
          <View style={styles.emptyCard}>
            <CheckCircle2 size={40} color="#059669" />
            <Text style={styles.emptyTitle}>{t.worker.disputes.noActiveDisputes}</Text>
            <Text style={styles.emptyDesc}>{t.worker.disputes.allClearDesc}</Text>
          </View>
        ) : (
          workerDisputes.map((dispute) => {
            const isResolved = dispute.status === 'resolved';

            return (
              <View key={dispute.id} style={styles.disputeCard}>
                {/* Header */}
                <View style={styles.disputeHeaderRow}>
                  <View style={styles.disputeHeaderLeft}>
                    <View style={styles.disputeMetaRow}>
                      <Text style={styles.disputeId}>
                        Dispute #{dispute.id.slice(-6).toUpperCase()}
                      </Text>
                      <View style={styles.bookingIdBadge}>
                        <Text style={styles.bookingIdBadgeText}>
                          Booking #{dispute.bookingId.slice(-6).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.disputeTitle}>
                      {getLocalizedTrade(dispute.workerTrade, currentLang)} Service
                    </Text>
                    <Text style={styles.disputeMeta}>
                      Filed by: {dispute.customerName} • {dispute.createdAt}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isResolved ? styles.statusBadgeResolved : styles.statusBadgeOpen,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isResolved ? styles.statusBadgeTextResolved : styles.statusBadgeTextOpen,
                      ]}
                    >
                      {getLocalizedStatus(dispute.status, currentLang)}
                    </Text>
                  </View>
                </View>

                {/* Complaint Text - Blockquote without quotes to avoid overflow */}
                <View style={styles.complaintBox}>
                  <View style={styles.boxLabelRow}>
                    <AlertCircle size={14} color="#e11d48" />
                    <Text style={styles.complaintLabel}>{t.worker.disputes.claimDetails}</Text>
                  </View>
                  <Text style={styles.blockQuoteRose}>
                    {getLocalizedStatement(dispute.issue, currentLang)}
                  </Text>
                </View>

                {/* Existing Worker Response */}
                {dispute.workerResponse && (
                  <View style={styles.responseBox}>
                    <View style={styles.boxLabelRow}>
                      <User size={14} color="#3730a3" />
                      <Text style={styles.responseLabel}>{t.worker.disputes.yourStatement}</Text>
                    </View>
                    <Text style={styles.blockQuoteIndigo}>
                      {getLocalizedStatement(dispute.workerResponse, currentLang)}
                    </Text>
                  </View>
                )}

                {/* Co-op Council Resolution Notes if available */}
                {dispute.resolutionNotes && (
                  <View style={styles.resolutionBox}>
                    <View style={styles.boxLabelRow}>
                      <CheckCircle2 size={14} color="#065f46" />
                      <Text style={styles.resolutionLabel}>{t.worker.disputes.peerCouncilRuling}</Text>
                    </View>
                    <Text style={styles.blockQuoteEmerald}>
                      {getLocalizedStatement(dispute.resolutionNotes, currentLang)}
                    </Text>
                  </View>
                )}

                {/* Reply Form if not yet resolved */}
                {!isResolved && (
                  <View style={styles.replyForm}>
                    <Text style={styles.replyLabel}>{t.worker.disputes.provideExplanation}</Text>
                    <TextField
                      value={responseTexts[dispute.id] || ''}
                      onChangeText={(text) => handleTextChange(dispute.id, text)}
                      placeholder={t.worker.disputes.explanationPlaceholder}
                      multiline
                    />
                    <Pressable
                      onPress={() => handleSendResponse(dispute.id)}
                      disabled={!responseTexts[dispute.id]?.trim()}
                      style={({ pressed }) => [
                        styles.sendBtn,
                        !responseTexts[dispute.id]?.trim() && styles.sendBtnDisabled,
                        pressed && !responseTexts[dispute.id]?.trim() && styles.sendBtnDisabled,
                        pressed && styles.pressedDim,
                      ]}
                    >
                      <Send size={14} color="#ffffff" />
                      <Text style={styles.sendBtnText}>{t.worker.disputes.submitResponseBtn}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingBottom: 80,
  },
  banner: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  disputeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  disputeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  disputeHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  disputeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  disputeId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingIdBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 4,
  },
  bookingIdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338ca',
  },
  disputeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
    flexShrink: 1,
  },
  disputeMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  statusBadgeResolved: {
    backgroundColor: '#d1fae5',
  },
  statusBadgeOpen: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusBadgeTextResolved: {
    color: '#065f46',
  },
  statusBadgeTextOpen: {
    color: '#92400e',
  },
  complaintBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#ffe4e6',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  responseBox: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  resolutionBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  boxLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complaintLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9f1239',
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730a3',
  },
  resolutionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  blockQuoteRose: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#fda4af',
    paddingLeft: 10,
  },
  blockQuoteIndigo: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#a5b4fc',
    paddingLeft: 10,
  },
  blockQuoteEmerald: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#34d399',
    paddingLeft: 10,
  },
  replyForm: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  replyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  sendBtnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  sendBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressedDim: {
    opacity: 0.85,
  },
});