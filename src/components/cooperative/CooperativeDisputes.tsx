import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dispute } from '../../types';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react-native';
import { Badge, Button, Card, EmptyState, TextField, ToneBadge } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTrade,
  getLocalizedStatement
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CooperativeDisputesProps {
  disputes: Dispute[];
  onResolveDispute: (disputeId: string, resolutionNotes: string) => void;
  currentLang?: AppLanguage;
}

const accent = roleAccent.cooperative;

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
      <Card style={styles.headerBanner}>
        <View style={styles.headerTextWrap}>
          <View style={styles.headerTitleRow}>
            <Scale size={16} color={accent} />
            <Text style={styles.headerTitle}>{t.cooperative.disputes.title}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t.cooperative.disputes.subtitle}</Text>
        </View>
        <Badge color={colors.purpleDark} bg={colors.purpleLight}>
          {t.cooperative.disputes.pendingCount.replace('{count}', String(disputes.filter(d => d.status !== 'resolved').length))}
        </Badge>
      </Card>

      {disputes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CheckCircle2 size={32} color={colors.success} />}
            title={t.cooperative.disputes.noGrievances}
          />
        </Card>
      ) : (
        <View style={styles.disputeList}>
          {disputes.map((dispute) => {
            const isResolved = dispute.status === 'resolved';

            return (
              <Card key={dispute.id} style={styles.disputeCard}>
                <View style={styles.disputeHeader}>
                  <View style={styles.disputeMain}>
                    <View style={styles.disputeIdRow}>
                      <Text style={styles.disputeId}>
                        #{dispute.id.slice(-6).toUpperCase()}
                      </Text>
                      <ToneBadge
                        tone={
                          isResolved
                            ? { fg: colors.successFg, bg: colors.successLight }
                            : { fg: colors.warningFg, bg: colors.warningLight }
                        }
                        label={getLocalizedStatus(dispute.status, currentLang)}
                      />
                    </View>
                    <Text style={styles.disputeTitle}>
                      {getLocalizedTrade(dispute.workerTrade, currentLang)} {currentLang === 'hi' ? 'सेवा' : currentLang === 'mr' ? 'सेवा' : 'Service'}
                    </Text>
                  </View>

                  <Badge color={colors.textSecondary} bg={colors.slate100}>
                    {dispute.createdAt}
                  </Badge>
                </View>

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

                <View style={styles.complaintBox}>
                  <View style={styles.boxTitleRow}>
                    <AlertCircle size={14} color={colors.errorFg} />
                    <Text style={styles.complaintTitle}>{t.cooperative.disputes.customerComplaint}</Text>
                  </View>
                  <Text style={styles.blockquoteRose}>
                    {getLocalizedStatement(dispute.issue, currentLang)}
                  </Text>
                </View>

                <View style={styles.statementBox}>
                  <View style={styles.boxTitleRow}>
                    <User size={14} color={colors.blueDark} />
                    <Text style={styles.statementTitle}>{t.cooperative.disputes.workerStatement}</Text>
                  </View>
                  <Text style={styles.blockquoteBlue}>
                    {dispute.workerResponse
                      ? getLocalizedStatement(dispute.workerResponse, currentLang)
                      : (currentLang === 'hi' ? 'कारीगर-स्वामी के औपचारिक वक्तव्य की प्रतीक्षा...' : currentLang === 'mr' ? 'कामगार-मालकाच्या अधिकृत उत्तराची प्रतीक्षा...' : 'Awaiting formal statement from worker-owner...')}
                  </Text>
                </View>

                {isResolved && dispute.resolutionNotes && (
                  <View style={styles.rulingBox}>
                    <View style={styles.boxTitleRow}>
                      <CheckCircle2 size={14} color={colors.successFg} />
                      <Text style={styles.rulingTitle}>{t.cooperative.disputes.councilRuling}</Text>
                    </View>
                    <Text style={styles.blockquoteGreen}>
                      {getLocalizedStatement(dispute.resolutionNotes, currentLang)}
                    </Text>
                  </View>
                )}

                {!isResolved && (
                  <View style={styles.remediationWrap}>
                    <TextField
                      label={t.cooperative.disputes.remediationLabel}
                      value={resolutionTexts[dispute.id] || ''}
                      onChangeText={(text) => setResolutionTexts(prev => ({ ...prev, [dispute.id]: text }))}
                      placeholder={t.cooperative.disputes.remediationPlaceholder}
                      multiline
                      numberOfLines={2}
                    />

                    <View style={styles.rulingActions}>
                      <Button
                        color={colors.success}
                        style={styles.rulingActionFlex}
                        onPress={() => {
                          const note = currentLang === 'hi'
                            ? 'परिषद निर्णय: सहकारी वारंटी स्वीकृत। ग्राहक को ₹0 लागत पर पुनः निरीक्षण प्रदान किया गया।'
                            : currentLang === 'mr'
                            ? 'परिषद निर्णय: सहकारी वॉरंटी मंजूर. ग्राहकाला ₹0 खर्चात पुनर्निरीक्षण दिले.'
                            : 'Council ruling: Co-op warranty approved. Customer re-inspection completed at ₹0 cost.';
                          handleResolve(dispute.id, note);
                        }}
                      >
                        {t.cooperative.disputes.approveRemedyBtn}
                      </Button>

                      <Button
                        color={accent}
                        style={styles.rulingActionFlex}
                        onPress={() => {
                          const defaultSignoff = currentLang === 'hi'
                            ? 'ग्राहक और कारीगर दोनों की सहमति से निर्णय दर्ज।'
                            : currentLang === 'mr'
                            ? 'ग्राहक आणि कामगार दोघांच्या संमतीने निर्णय नोंदवला.'
                            : 'Settled with mutual customer & worker sign-off.';
                          handleResolve(dispute.id, resolutionTexts[dispute.id] || defaultSignoff);
                        }}
                      >
                        {t.cooperative.disputes.recordRulingBtn}
                      </Button>
                    </View>
                  </View>
                )}
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
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: accent,
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
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disputeList: {
    gap: spacing.lg,
  },
  disputeCard: {
    gap: spacing.md,
  },
  disputeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  disputeMain: {
    flexShrink: 1,
  },
  disputeIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  disputeId: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  disputeTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  partiesBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.slate50,
    padding: spacing.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partyCell: {
    flex: 1,
  },
  partyLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  partyValue: {
    fontSize: fontSize.xs,
    color: colors.slate800,
    fontWeight: '600',
    marginTop: 2,
  },
  complaintBox: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  statementBox: {
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  rulingBox: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  boxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  complaintTitle: {
    fontSize: fontSize.xs,
    color: colors.errorFg,
    fontWeight: '700',
  },
  statementTitle: {
    fontSize: fontSize.xs,
    color: colors.blueDark,
    fontWeight: '700',
  },
  rulingTitle: {
    fontSize: fontSize.xs,
    color: colors.successFg,
    fontWeight: '700',
  },
  blockquoteRose: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.error,
    paddingLeft: spacing.sm,
  },
  blockquoteBlue: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.blue,
    paddingLeft: spacing.sm,
  },
  blockquoteGreen: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.success,
    paddingLeft: spacing.sm,
  },
  remediationWrap: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rulingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rulingActionFlex: {
    flex: 1,
  },
});
