import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Dispute } from '../../types';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  User 
} from 'lucide-react-native';
import { TextField } from '../../ui';
import { 
  AppLanguage, 
  mobileTranslations, 
  getLocalizedStatus, 
  getLocalizedTrade, 
  getLocalizedStatement 
} from '../../data/mobileTranslations';

interface CooperativeDisputesProps {
  disputes: Dispute[];
  onResolveDispute: (disputeId: string, resolutionNotes: string) => void;
  currentLang?: AppLanguage;
}

export const CooperativeDisputes: React.FC<CooperativeDisputesProps> = ({
  disputes,
  onResolveDispute,
  currentLang = 'en'
}) => {
  const [resolutionTexts, setResolutionTexts] = useState<Record<string, string>>({});
  const t = mobileTranslations[currentLang];

  const handleResolve = (disputeId: string, customNote?: string) => {
    const defaultAmicable = currentLang === 'hi'
      ? 'वार्ड 14 साथी परिषद द्वारा सौहार्दपूर्ण समाधान।'
      : currentLang === 'mr'
      ? 'वॉर्ड 14 सहकारी परिषदेकडून सलोख्याने निकाली काढले.'
      : 'Resolved amicably by Ward 14 Peer Council.';
    const note = customNote || resolutionTexts[disputeId] || defaultAmicable;
    onResolveDispute(disputeId, note);
    setResolutionTexts(prev => ({ ...prev, [disputeId]: '' }));
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTextWrap}>
          <View style={styles.headerTitleRow}>
            <Scale size={16} color="#7c3aed" />
            <Text style={styles.headerTitle}>{t.cooperative.disputes.title}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t.cooperative.disputes.subtitle}</Text>
        </View>
        <Text style={styles.pendingBadge}>
          {t.cooperative.disputes.pendingCount.replace('{count}', String(disputes.filter(d => d.status !== 'resolved').length))}
        </Text>
      </View>

      {disputes.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle2 size={32} color="#10b981" />
          <Text style={styles.emptyStateText}>{t.cooperative.disputes.noGrievances}</Text>
        </View>
      ) : (
        <View style={styles.disputeList}>
          {disputes.map((dispute) => {
            const isResolved = dispute.status === 'resolved';

            return (
              <View key={dispute.id} style={styles.disputeCard}>
                {/* Header */}
                <View style={styles.disputeHeader}>
                  <View style={styles.disputeMain}>
                    <View style={styles.disputeIdRow}>
                      <Text style={styles.disputeId}>
                        #{dispute.id.slice(-6).toUpperCase()}
                      </Text>
                      <Text style={[
                        styles.statusBadge,
                        isResolved ? styles.statusResolved : styles.statusOpen
                      ]}>
                        {getLocalizedStatus(dispute.status, currentLang)}
                      </Text>
                    </View>
                    <Text style={styles.disputeTitle}>
                      {getLocalizedTrade(dispute.workerTrade, currentLang)} {currentLang === 'hi' ? 'सेवा' : currentLang === 'mr' ? 'सेवा' : 'Service'}
                    </Text>
                  </View>

                  <Text style={styles.createdAtChip}>
                    {dispute.createdAt}
                  </Text>
                </View>

                {/* Dispute Parties */}
                <View style={styles.partiesBox}>
                  <View style={styles.partyCell}>
                    <Text style={styles.partyLabel}>{t.worker.jobs.customer}</Text>
                    <Text style={styles.partyValue}>{dispute.customerName}</Text>
                  </View>
                  <View style={styles.partyCell}>
                    <Text style={styles.partyLabel}>{t.worker.profile.coopOwner}</Text>
                    <Text style={styles.partyValue}>{dispute.workerName}</Text>
                  </View>
                </View>

                {/* Customer Complaint */}
                <View style={styles.complaintBox}>
                  <View style={styles.boxTitleRow}>
                    <AlertCircle size={14} color="#9f1239" />
                    <Text style={styles.complaintTitle}>{t.cooperative.disputes.customerComplaint}</Text>
                  </View>
                  <Text style={styles.blockquoteRose}>
                    {getLocalizedStatement(dispute.issue, currentLang)}
                  </Text>
                </View>

                {/* Worker Explanation */}
                <View style={styles.statementBox}>
                  <View style={styles.boxTitleRow}>
                    <User size={14} color="#3730a3" />
                    <Text style={styles.statementTitle}>{t.cooperative.disputes.workerStatement}</Text>
                  </View>
                  <Text style={styles.blockquoteIndigo}>
                    {dispute.workerResponse 
                      ? getLocalizedStatement(dispute.workerResponse, currentLang) 
                      : (currentLang === 'hi' ? 'कारीगर-स्वामी के औपचारिक वक्तव्य की प्रतीक्षा...' : currentLang === 'mr' ? 'कामगार-मालकाच्या अधिकृत उत्तराची प्रतीक्षा...' : 'Awaiting formal statement from worker-owner...')}
                  </Text>
                </View>

                {/* Council Resolution if already resolved */}
                {isResolved && dispute.resolutionNotes && (
                  <View style={styles.rulingBox}>
                    <View style={styles.boxTitleRow}>
                      <CheckCircle2 size={14} color="#065f46" />
                      <Text style={styles.rulingTitle}>{t.cooperative.disputes.councilRuling}</Text>
                    </View>
                    <Text style={styles.blockquoteEmerald}>
                      {getLocalizedStatement(dispute.resolutionNotes, currentLang)}
                    </Text>
                  </View>
                )}

                {/* Council Resolution Controls if not resolved */}
                {!isResolved && (
                  <View style={styles.remediationWrap}>
                    <Text style={styles.remediationLabel}>
                      {t.cooperative.disputes.remediationLabel}
                    </Text>
                    <TextField
                      value={resolutionTexts[dispute.id] || ''}
                      onChangeText={(text) => setResolutionTexts(prev => ({ ...prev, [dispute.id]: text }))}
                      placeholder={t.cooperative.disputes.remediationPlaceholder}
                      multiline
                      numberOfLines={2}
                    />

                    <View style={styles.rulingActions}>
                      <Pressable
                        onPress={() => {
                          const note = currentLang === 'hi'
                            ? 'परिषद निर्णय: सहकारी वारंटी स्वीकृत। ग्राहक को ₹0 लागत पर पुनः निरीक्षण प्रदान किया गया।'
                            : currentLang === 'mr'
                            ? 'परिषद निर्णय: सहकारी वॉरंटी मंजूर. ग्राहकाला ₹0 खर्चात पुनर्निरीक्षण दिले.'
                            : 'Council ruling: Co-op warranty approved. Customer re-inspection completed at ₹0 cost.';
                          handleResolve(dispute.id, note);
                        }}
                        style={styles.approveBtn}
                      >
                        <Text style={styles.approveBtnText}>{t.cooperative.disputes.approveRemedyBtn}</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          const defaultSignoff = currentLang === 'hi'
                            ? 'ग्राहक और कारीगर दोनों की सहमति से निर्णय दर्ज।'
                            : currentLang === 'mr'
                            ? 'ग्राहक आणि कामगार दोघांच्या संमतीने निर्णय नोंदवला.'
                            : 'Settled with mutual customer & worker sign-off.';
                          handleResolve(dispute.id, resolutionTexts[dispute.id] || defaultSignoff);
                        }}
                        style={styles.rulingBtn}
                      >
                        <Text style={styles.rulingBtnText}>{t.cooperative.disputes.recordRulingBtn}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
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
  headerBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTextWrap: {
    flexShrink: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pendingBadge: {
    fontSize: 12,
    backgroundColor: '#f5f3ff',
    color: '#6b21a8',
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    overflow: 'hidden',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  disputeList: {
    gap: 16,
  },
  disputeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  disputeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  disputeMain: {
    flexShrink: 1,
  },
  disputeIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disputeId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusOpen: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  disputeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  createdAtChip: {
    fontSize: 10,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
    overflow: 'hidden',
  },
  partiesBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  partyCell: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  partyValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
    marginTop: 2,
  },
  complaintBox: {
    backgroundColor: 'rgba(255,241,242,0.7)',
    borderWidth: 1,
    borderColor: '#ffe4e6',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    overflow: 'hidden',
  },
  statementBox: {
    backgroundColor: 'rgba(238,242,255,0.7)',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    overflow: 'hidden',
  },
  rulingBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    overflow: 'hidden',
  },
  boxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complaintTitle: {
    fontSize: 12,
    color: '#9f1239',
    fontWeight: '700',
  },
  statementTitle: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '700',
  },
  rulingTitle: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '700',
  },
  blockquote: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  blockquoteRose: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#fda4af',
    paddingLeft: 10,
  },
  blockquoteIndigo: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#a5b4fc',
    paddingLeft: 10,
  },
  blockquoteEmerald: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#34d399',
    paddingLeft: 10,
  },
  remediationWrap: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  remediationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  rulingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#059669',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  rulingBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  rulingBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});