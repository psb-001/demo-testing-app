import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Scale,
} from 'lucide-react-native';
import { Dispute } from '../../types';
import { Button, Card, EmptyState, Section, TextField, ToneBadge } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTrade,
  getLocalizedStatement,
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface WorkerDisputesProps {
  disputes: Dispute[];
  currentLang?: AppLanguage;
  onWorkerRespond: (disputeId: string, response: string) => void;
}

const accent = roleAccent.worker;

export const WorkerDisputes: React.FC<WorkerDisputesProps> = ({
  disputes,
  currentLang = 'en',
  onWorkerRespond,
}) => {
  const t = mobileTranslations[currentLang];

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

  const disputeTone = (isResolved: boolean) =>
    isResolved
      ? { fg: colors.successFg, bg: colors.successLight }
      : { fg: colors.warningFg, bg: colors.warningLight };

  return (
    <View style={styles.container}>
      <Card style={styles.banner}>
        <View style={styles.bannerRow}>
          <Scale size={20} color={accent} />
          <Text style={styles.bannerTitle}>{t.worker.disputes.peerPanel}</Text>
        </View>
        <Text style={styles.bannerSubtitle}>{t.worker.disputes.disputesSubtitle}</Text>
      </Card>

      <Section
        title={`${t.worker.disputes.disputeCases} (${workerDisputes.length})`}
      >
        {workerDisputes.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CheckCircle2 size={40} color={colors.success} />}
              title={t.worker.disputes.noActiveDisputes}
              description={t.worker.disputes.allClearDesc}
            />
          </Card>
        ) : (
          workerDisputes.map((dispute) => {
            const isResolved = dispute.status === 'resolved';

            return (
              <Card key={dispute.id} style={styles.disputeCard}>
                <View style={styles.disputeHeaderRow}>
                  <View style={styles.disputeHeaderLeft}>
                    <View style={styles.disputeMetaRow}>
                      <Text style={styles.disputeId}>
                        Dispute #{dispute.id.slice(-6).toUpperCase()}
                      </Text>
                      <Text style={styles.bookingIdBadge}>
                        Booking #{dispute.bookingId.slice(-6).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.disputeTitle}>
                      {getLocalizedTrade(dispute.workerTrade, currentLang)} Service
                    </Text>
                    <Text style={styles.disputeMeta}>
                      Filed by: {dispute.customerName} • {dispute.createdAt}
                    </Text>
                  </View>

                  <ToneBadge
                    tone={disputeTone(isResolved)}
                    label={getLocalizedStatus(dispute.status, currentLang)}
                  />
                </View>

                <View style={styles.complaintBox}>
                  <View style={styles.boxLabelRow}>
                    <AlertCircle size={14} color={colors.error} />
                    <Text style={styles.complaintLabel}>{t.worker.disputes.claimDetails}</Text>
                  </View>
                  <Text style={styles.blockQuoteRose}>
                    {getLocalizedStatement(dispute.issue, currentLang)}
                  </Text>
                </View>

                {dispute.workerResponse && (
                  <View style={styles.responseBox}>
                    <View style={styles.boxLabelRow}>
                      <User size={14} color={colors.blueDark} />
                      <Text style={styles.responseLabel}>{t.worker.disputes.yourStatement}</Text>
                    </View>
                    <Text style={styles.blockQuoteBlue}>
                      {getLocalizedStatement(dispute.workerResponse, currentLang)}
                    </Text>
                  </View>
                )}

                {dispute.resolutionNotes && (
                  <View style={styles.resolutionBox}>
                    <View style={styles.boxLabelRow}>
                      <CheckCircle2 size={14} color={colors.successFg} />
                      <Text style={styles.resolutionLabel}>{t.worker.disputes.peerCouncilRuling}</Text>
                    </View>
                    <Text style={styles.blockQuoteGreen}>
                      {getLocalizedStatement(dispute.resolutionNotes, currentLang)}
                    </Text>
                  </View>
                )}

                {!isResolved && (
                  <View style={styles.replyForm}>
                    <TextField
                      label={t.worker.disputes.provideExplanation}
                      value={responseTexts[dispute.id] || ''}
                      onChangeText={(text) => handleTextChange(dispute.id, text)}
                      placeholder={t.worker.disputes.explanationPlaceholder}
                      multiline
                    />
                    <Button
                      block
                      color={accent}
                      disabled={!responseTexts[dispute.id]?.trim()}
                      onPress={() => handleSendResponse(dispute.id)}
                    >
                      <View style={styles.sendBtnInner}>
                        <Send size={14} color={colors.white} />
                        <Text style={styles.sendBtnText}>{t.worker.disputes.submitResponseBtn}</Text>
                      </View>
                    </Button>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  banner: {
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  disputeCard: {
    gap: spacing.md,
    overflow: 'hidden',
  },
  disputeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  disputeHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  disputeMetaRow: {
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
    letterSpacing: 0.5,
  },
  bookingIdBadge: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.blueDark,
    backgroundColor: colors.blueLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  disputeTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
    flexShrink: 1,
  },
  disputeMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
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
  responseBox: {
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  resolutionBox: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  boxLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  complaintLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.errorFg,
  },
  responseLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.blueDark,
  },
  resolutionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  blockQuoteRose: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.error,
    paddingLeft: spacing.sm,
  },
  blockQuoteBlue: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.blue,
    paddingLeft: spacing.sm,
  },
  blockQuoteGreen: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.success,
    paddingLeft: spacing.sm,
  },
  replyForm: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sendBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sendBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
});
