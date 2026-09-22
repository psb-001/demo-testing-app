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
  Building2,
  Phone,
  CheckCircle2
} from 'lucide-react-native';
import { Dispute, Booking } from '../../types';
import { AppModal, Button, Card, Chip, EmptyState, ListRow, PrimaryButton, Section, TextField, Title, Subtitle, ToneBadge } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedStatement
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CustomerSupportProps {
  disputes: Dispute[];
  bookings: Booking[];
  currentLang?: AppLanguage;
  onRaiseDispute: (bookingId: string, issue: string) => void;
}

const accent = roleAccent.customer;

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

  const disputeTone = (status: Dispute['status']) => {
    if (status === 'resolved') return { fg: colors.successFg, bg: colors.successLight };
    if (status === 'under_review') return { fg: colors.warningFg, bg: colors.warningLight };
    return { fg: colors.errorFg, bg: colors.errorLight };
  };

  return (
    <View style={styles.root}>

      <View>
        <Title>{t.customer.support.title}</Title>
        <Subtitle>{t.customer.support.subtitle}</Subtitle>
      </View>

      <Card style={styles.bannerCard}>
        <View style={styles.bannerLeft}>
          <View style={styles.councilBadge}>
            <Scale size={12} color={colors.amber} />
            <Text style={styles.councilBadgeText}>{t.customer.support.councilBadge}</Text>
          </View>
          <Text style={styles.bannerTitle}>{t.customer.support.bannerTitle}</Text>
          <Text style={styles.bannerDesc}>{t.customer.support.bannerDesc}</Text>
        </View>
        <PrimaryButton
          label={t.customer.support.raiseIssueBtn}
          color={accent}
          onPress={() => setShowRaiseModal(true)}
          style={styles.raiseBtn}
        />
      </Card>

      <Section
        title={t.customer.support.activeGrievances.replace('{count}', String(disputes.length))}
      >
        {disputes.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CheckCircle2 size={32} color={colors.success} />}
              title={t.customer.support.noDisputesTitle}
              description={t.customer.support.noDisputesDesc}
            />
          </Card>
        ) : (
          <View style={styles.disputesList}>
            {disputes.map((dsp) => {
              return (
                <Card key={dsp.id} style={styles.disputeCard}>
                  <View style={styles.disputeTop}>
                    <Text style={styles.disputeRef}>Ref #{dsp.bookingId}</Text>
                    <ToneBadge
                      tone={disputeTone(dsp.status)}
                      label={
                        dsp.status === 'under_review'
                          ? (currentLang === 'hi'
                              ? 'परिषद समीक्षा में'
                              : currentLang === 'mr'
                              ? 'समिती तपासत आहे'
                              : 'Council Reviewing')
                          : dsp.status
                      }
                    />
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

                  {dsp.workerResponse && (
                    <View style={styles.workerResponseBox}>
                      <Text style={styles.responseHeaderText}>
                        {t.customer.support.workerResponse.replace('{name}', dsp.workerName)}:
                      </Text>
                      <Text style={styles.blockquoteBlue}>
                        {getLocalizedStatement(dsp.workerResponse, currentLang)}
                      </Text>
                      {dsp.workerResponseTime && (
                        <Text style={styles.responseTime}>{dsp.workerResponseTime}</Text>
                      )}
                    </View>
                  )}

                  {dsp.resolutionNotes && (
                    <View style={styles.resolutionBox}>
                      <View style={styles.resolutionHeader}>
                        <CheckCircle2 size={14} color={colors.emeraldDark} />
                        <Text style={styles.resolutionHeaderText}>
                          {t.customer.support.councilResolution}:
                        </Text>
                      </View>
                      <Text style={styles.blockquoteGreen}>
                        {getLocalizedStatement(dsp.resolutionNotes, currentLang)}
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </Section>

      <Section title={t.customer.support.emergencyTitle}>
        <View style={styles.helpList}>
          <ListRow
            leading={
              <View style={styles.helpIcon}>
                <Phone size={20} color={accent} />
              </View>
            }
            title={<Text style={styles.helpTitle}>{t.customer.support.helplineTitle}</Text>}
            subtitle={<Text style={styles.helpSubtitle}>{t.customer.support.helplineTiming}</Text>}
            trailing={
              <Pressable
                onPress={() => Linking.openURL('tel:18002608900')}
                style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}
              >
                <Text style={styles.callBtnText}>{t.customer.support.callBtn}</Text>
              </Pressable>
            }
          />

          <ListRow
            leading={
              <View style={styles.helpIcon}>
                <Building2 size={20} color={accent} />
              </View>
            }
            title={<Text style={styles.helpTitle}>{t.customer.support.wardHubCell}</Text>}
            subtitle={<Text style={styles.helpSubtitle}>{t.customer.support.wardHubAddress}</Text>}
            trailing={
              <View style={styles.zonePill}>
                <Text style={styles.zonePillText}>Zone 4</Text>
              </View>
            }
          />
        </View>
      </Section>

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
                color={accent}
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

        <Button block color={accent} onPress={handleCreateDispute}>
          {t.customer.support.submitGrievanceBtn}
        </Button>
      </AppModal>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.xl,
  },
  pressed: {
    opacity: 0.85,
  },
  bannerCard: {
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  bannerLeft: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  councilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.amberLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  councilBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.warningFg,
  },
  bannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  raiseBtn: {
    alignSelf: 'flex-start',
  },
  disputesList: {
    gap: spacing.md,
  },
  disputeCard: {
    gap: spacing.md,
  },
  disputeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disputeRef: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  targetText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statementBox: {
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 6,
    gap: spacing.xs,
  },
  statementLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  blockquote: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.slate300,
    paddingLeft: spacing.sm,
  },
  workerResponseBox: {
    backgroundColor: colors.blueLight,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  responseHeaderText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.blueDark,
  },
  blockquoteBlue: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.blue,
    paddingLeft: spacing.sm,
  },
  responseTime: {
    fontSize: fontSize.xs,
    color: colors.blueDark,
    fontWeight: '500',
    marginTop: 2,
  },
  resolutionBox: {
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.success,
    gap: 6,
  },
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resolutionHeaderText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  blockquoteGreen: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.success,
    paddingLeft: spacing.sm,
  },
  helpList: {
    gap: spacing.sm,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.control,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  callBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.control,
    backgroundColor: colors.blueLight,
    minHeight: 36,
    justifyContent: 'center',
  },
  callBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.blueDark,
  },
  zonePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.slate100,
  },
  zonePillText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  formField: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  bookingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  protectionBox: {
    padding: spacing.md,
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  protectionText: {
    fontSize: fontSize.xs,
    color: colors.infoFg,
    lineHeight: 16,
  },
});
