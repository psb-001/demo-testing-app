import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Booking, Dispute, Review, DemandForecast, WorkforceAllocation } from '../../types';
import { mockDemandForecasts, mockWorkforceAllocations } from '../../data/mockAppData';
import {
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  Star,
  IndianRupee,
  ChevronRight,
  UserPlus,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import { AppLanguage, mobileTranslations, getLocalizedTrade } from '../../data/mobileTranslations';
import { Badge, Card, Segmented, SectionTitle, StatBox, Subtitle, Title, ToneBadge } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CooperativeOverviewProps {
  bookings: Booking[];
  disputes: Dispute[];
  reviews: Review[];
  onNavigateTab: (tab: string) => void;
  onOpenAddMember: () => void;
  currentLang?: AppLanguage;
}

const accent = roleAccent.cooperative;
type OverviewSection = 'overview' | 'ai_forecast';

export const CooperativeOverview: React.FC<CooperativeOverviewProps> = ({
  bookings,
  disputes,
  reviews,
  onNavigateTab,
  onOpenAddMember,
  currentLang = 'en'
}) => {
  const [activeSection, setActiveSection] = useState<OverviewSection>('overview');
  const [forecasts, _setForecasts] = useState<DemandForecast[]>(mockDemandForecasts);
  const [allocations, setAllocations] = useState<WorkforceAllocation[]>(mockWorkforceAllocations);
  const [rebalanceToast, setRebalanceToast] = useState<string | null>(null);
  const t = mobileTranslations[currentLang];

  const activeBookingsCount = bookings.filter(b => ['accepted', 'active', 'in_progress'].includes(b.status)).length;
  const pendingRequestsCount = bookings.filter(b => b.status === 'requested').length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const openDisputesCount = disputes.filter(d => d.status !== 'resolved').length;

  const dynamicReserveFund = 142800 + completedBookings.reduce((acc, b) => acc + b.coopFund, 0);

  const maxRecommended = Math.max(...forecasts.map(f => f.recommendedWorkers), 1);

  const handleSimulateRebalance = () => {
    setAllocations(prev => prev.map(a => {
      if (a.ward.includes('14')) {
        return {
          ...a,
          assignedWorkersCount: a.assignedWorkersCount + 4,
          utilizationRate: 82,
          status: 'Optimal',
          suggestedAction: currentLang === 'hi'
            ? 'वार्ड 12 से 4 आरक्षित तकनीशियन जुटाए गए। ईटीए <12 मिनट पर स्थिर।'
            : currentLang === 'mr'
            ? 'वॉर्ड 12 मधून 4 राखीव तंत्रज्ञ तैनात केले. ईटीए <12 मिनिटांवर स्थिर.'
            : '4 reserve technicians mobilized from Ward 12. ETA stabilized at <12m.'
        };
      }
      return a;
    }));

    const toastMsg = currentLang === 'hi'
      ? 'एआई पुनर्संतुलन प्रेषित: वार्ड 14 में 4 तकनीशियन तैनात किए गए। काम का समान वितरण।'
      : currentLang === 'mr'
      ? 'एआय पुनर्संतुलन पाठवले: वॉर्ड 14 मध्ये 4 तंत्रज्ञ नियुक्त केले. कामाचे समान वाटप.'
      : 'AI Rebalance Dispatched: 4 technicians assigned to Ward 14. Zero worker burnout.';
    setRebalanceToast(toastMsg);
    setTimeout(() => setRebalanceToast(null), 4000);
  };

  const getLocalizedForecastReason = (reason: string) => {
    if (reason.includes('Evening peak')) {
      return currentLang === 'hi'
        ? 'शाम के व्यस्त समय में वापसी। एसी व ट्रिपिंग मरम्मत की अधिक मांग अपेक्षित।'
        : currentLang === 'mr'
        ? 'संध्याकाळच्या गर्दीच्या वेळेत परतणे. एसी व ट्रिपिंग दुरुस्तीची जास्त मागणी अपेक्षित.'
        : reason;
    }
    if (reason.includes('Post-office')) {
      return currentLang === 'hi'
        ? 'कार्यालय उपरांत नियमित मरम्मत और प्रकाश व्यवस्था रखरखाव अनुरोध।'
        : currentLang === 'mr'
        ? 'कार्यालय संपल्यानंतर नियमित दुरुस्ती आणि रोषणाई देखभाल विनंत्या.'
        : reason;
    }
    return reason;
  };

  const getLocalizedAction = (action: string) => {
    if (action.includes('Optimal balance')) {
      return currentLang === 'hi'
        ? 'संतुलित आवंटन। 12 मिनट से कम का प्रतिक्रिया समय।'
        : currentLang === 'mr'
        ? 'संतुलित वाटप. १२ मिनिटांपेक्षा कमी प्रतिसाद वेळ.'
        : action;
    }
    if (action.includes('mobilized')) {
      return currentLang === 'hi'
        ? 'वार्ड 12 से तकनीशियन जुटाए गए।'
        : currentLang === 'mr'
        ? 'वॉर्ड 12 मधून तंत्रज्ञ तैनात केले.'
        : action;
    }
    return action;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.banner}>
        <View style={styles.bannerTopRow}>
          <View style={styles.bannerBadgeRow}>
            <Building2 size={14} color={accent} />
            <SectionTitle>{t.cooperative.overview.hubWard}</SectionTitle>
          </View>
          <Badge color={colors.textSecondary} bg={colors.slate100}>
            {t.cooperative.overview.regNumber}
          </Badge>
        </View>

        <Title style={styles.bannerTitle}>
          {t.cooperative.overview.societyName}
        </Title>
        <Subtitle>
          {t.cooperative.overview.collectiveSubtitle}
        </Subtitle>

        <View style={styles.bannerStatsRow}>
          <StatBox
            label={t.cooperative.overview.memberOwners}
            value="48"
            color={colors.textPrimary}
            icon={<Users size={16} color={colors.textPrimary} />}
          />
          <StatBox
            label={t.cooperative.overview.onActiveDuty}
            value="36"
            color={accent}
            icon={<Briefcase size={16} color={accent} />}
          />
          <StatBox
            label={t.cooperative.overview.wardQuality}
            value="4.93★"
            color={colors.amber}
            icon={<Star size={16} color={colors.amber} fill={colors.amber} />}
          />
        </View>
      </Card>

      <Segmented<OverviewSection>
        options={[
          { value: 'overview', label: t.cooperative.overview.wardOperations },
          { value: 'ai_forecast', label: t.cooperative.overview.smartDemandTab },
        ]}
        value={activeSection}
        onChange={setActiveSection}
        accent={accent}
      />

      {activeSection === 'overview' && (
        <View style={styles.section}>
          {openDisputesCount > 0 && (
            <Pressable
              onPress={() => onNavigateTab('disputes')}
              style={({ pressed }) => [styles.grievanceAlert, pressed && styles.pressed]}
            >
              <View style={styles.grievanceAlertLeft}>
                <View style={styles.grievanceIconWrap}>
                  <AlertCircle size={20} color={colors.white} />
                </View>
                <View style={styles.grievanceTextWrap}>
                  <Text style={styles.grievanceTitle}>
                    {t.cooperative.overview.grievanceAlert.replace('{count}', String(openDisputesCount))}
                  </Text>
                  <Text style={styles.grievanceDesc}>{t.cooperative.overview.grievanceAlertDesc}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.errorFg} />
            </Pressable>
          )}

          <View style={styles.metricsRow}>
            <Pressable
              onPress={() => onNavigateTab('bookings')}
              style={({ pressed }) => [styles.metricCard, pressed && styles.pressed]}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.activeJobs}</Text>
                <Briefcase size={16} color={accent} />
              </View>
              <Text style={styles.metricValue}>{activeBookingsCount}</Text>
              <View style={styles.metricFooter}>
                <Clock size={12} color={accent} />
                <Text style={styles.metricFooterText}>
                  {t.cooperative.overview.newIncoming.replace('{count}', String(pendingRequestsCount))}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => onNavigateTab('members')}
              style={({ pressed }) => [styles.metricCard, pressed && styles.pressed]}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.workerOwners}</Text>
                <Users size={16} color={accent} />
              </View>
              <Text style={styles.metricValue}>48</Text>
              <Text style={styles.metricFooterText}>{t.cooperative.overview.democraticVoting}</Text>
            </Pressable>
          </View>

          <View style={styles.metricsRow}>
            <Card style={styles.metricCardStatic}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.retainedReserve}</Text>
                <IndianRupee size={16} color={colors.emeraldDark} />
              </View>
              <Text style={[styles.metricValue, styles.metricValueEmerald]}>₹{dynamicReserveFund.toLocaleString('en-IN')}</Text>
              <Text style={styles.metricFooterText}>{t.cooperative.overview.coopSocialFund}</Text>
            </Card>

            <Pressable
              onPress={() => onNavigateTab('reviews')}
              style={({ pressed }) => [styles.metricCard, pressed && styles.pressed]}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.reviews}</Text>
                <Star size={16} color={colors.amber} fill={colors.amber} />
              </View>
              <Text style={styles.metricValue}>{reviews.length + 140}</Text>
              <Text style={styles.metricFooterTextPositive}>{t.cooperative.overview.positiveRating}</Text>
            </Pressable>
          </View>

          <Card style={styles.governanceCard}>
            <SectionTitle>{t.cooperative.overview.cooperativeOperations}</SectionTitle>

            <View style={styles.governanceRow}>
              <Pressable
                onPress={onOpenAddMember}
                style={({ pressed }) => [styles.governanceAction, pressed && styles.pressed]}
              >
                <UserPlus size={16} color={accent} />
                <View style={styles.governanceActionTextWrap}>
                  <Text style={styles.governanceActionTitle}>{t.cooperative.overview.enrollMember}</Text>
                  <Text style={styles.governanceActionDesc}>{t.cooperative.overview.enrollMemberDesc}</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => onNavigateTab('disputes')}
                style={({ pressed }) => [styles.governanceAction, pressed && styles.pressed]}
              >
                <ShieldCheck size={16} color={accent} />
                <View style={styles.governanceActionTextWrap}>
                  <Text style={styles.governanceActionTitle}>{t.cooperative.overview.peerCouncil}</Text>
                  <Text style={styles.governanceActionDesc}>{t.cooperative.overview.peerCouncilDesc}</Text>
                </View>
              </Pressable>
            </View>
          </Card>
        </View>
      )}

      {activeSection === 'ai_forecast' && (
        <View style={styles.section}>
          <Card style={styles.aiBanner}>
            <View style={styles.bannerTopRow}>
              <Badge color={accent} bg={colors.purpleLight}>
                {t.cooperative.overview.smartSuiteBadge}
              </Badge>
              <Badge color={colors.textSecondary} bg={colors.slate100}>
                {t.cooperative.overview.predictiveModel}
              </Badge>
            </View>
            <Title style={styles.aiBannerTitle}>{t.cooperative.overview.aiHeadline}</Title>
            <Text style={styles.aiBannerDesc}>
              {t.cooperative.overview.aiDescription}
            </Text>
          </Card>

          {rebalanceToast && (
            <Card style={styles.rebalanceToast}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.rebalanceToastText}>{rebalanceToast}</Text>
            </Card>
          )}

          <Card style={styles.forecastCard}>
            <View style={styles.cardHeaderRow}>
              <SectionTitle>{t.cooperative.overview.hourlyDemandTitle}</SectionTitle>
              <Text style={styles.cardAside}>{t.cooperative.overview.next12Hours}</Text>
            </View>

            <View style={styles.forecastList}>
              {forecasts.map((f, i) => (
                <View key={i} style={styles.forecastItem}>
                  <View style={styles.forecastTopRow}>
                    <View style={styles.forecastTradeGroup}>
                      <Text style={styles.forecastHour}>{f.hourSlot}</Text>
                      <Badge color={colors.slate700} bg={colors.slate100}>
                        {getLocalizedTrade(f.trade, currentLang)}
                      </Badge>
                    </View>
                    <ToneBadge
                      tone={
                        f.expectedDemandLevel === 'Surge Peak'
                          ? { fg: colors.errorFg, bg: colors.errorLight }
                          : { fg: colors.successFg, bg: colors.successLight }
                      }
                      label={
                        f.expectedDemandLevel === 'Surge Peak'
                          ? (currentLang === 'hi' ? 'चरम मांग' : currentLang === 'mr' ? 'कमाल मागणी' : 'Surge Peak')
                          : (currentLang === 'hi' ? 'सामान्य मांग' : currentLang === 'mr' ? 'सामान्य मागणी' : 'Normal')
                      }
                    />
                  </View>

                  <Text style={styles.forecastReason}>
                    {getLocalizedForecastReason(f.predictedReason)}
                  </Text>

                  <View style={styles.forecastBarBlock}>
                    <View style={styles.forecastBarTrack}>
                      <View style={[styles.forecastBarFill, { width: `${(f.recommendedWorkers / maxRecommended) * 100}%`, backgroundColor: accent }]} />
                    </View>
                    <View style={styles.forecastBarTrack}>
                      <View style={[styles.forecastBarFill, { width: `${(f.activeWorkers / maxRecommended) * 100}%`, backgroundColor: colors.success }]} />
                    </View>
                  </View>

                  <View style={styles.forecastFootRow}>
                    <Text style={styles.forecastFootText}>
                      {t.cooperative.overview.activeVsRecommended.replace('{active}', String(f.activeWorkers)).replace('{recommended}', String(f.recommendedWorkers))}
                    </Text>
                    {f.gapOrSurplus < 0 ? (
                      <Text style={styles.forecastShortfall}>
                        {t.cooperative.overview.technicianShortfall.replace('{count}', String(Math.abs(f.gapOrSurplus)))}
                      </Text>
                    ) : (
                      <Text style={styles.forecastAdequate}>{t.cooperative.overview.adequateCapacity}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.forecastCard}>
            <View style={styles.cardHeaderRow}>
              <SectionTitle>{t.cooperative.overview.crossWardTitle}</SectionTitle>
              <Pressable
                onPress={handleSimulateRebalance}
                style={({ pressed }) => [styles.rebalanceBtn, pressed && styles.pressed]}
              >
                <Text style={styles.rebalanceBtnText}>{t.cooperative.overview.autoRebalanceBtn}</Text>
              </Pressable>
            </View>

            <View style={styles.allocList}>
              {allocations.map((a, i) => (
                <View key={i} style={styles.allocItem}>
                  <View style={styles.forecastTopRow}>
                    <Text style={styles.forecastHour}>{a.ward}</Text>
                    <ToneBadge
                      tone={
                        a.status === 'Optimal'
                          ? { fg: colors.successFg, bg: colors.successLight }
                          : { fg: colors.warningFg, bg: colors.warningLight }
                      }
                      label={
                        a.status === 'Optimal'
                          ? (currentLang === 'hi' ? 'इष्टतम' : currentLang === 'mr' ? 'इष्टतम' : 'Optimal')
                          : (currentLang === 'hi' ? 'संतुलित' : currentLang === 'mr' ? 'संतुलित' : a.status)
                      }
                    />
                  </View>
                  <Text style={styles.allocInfo}>
                    {currentLang === 'hi' ? 'कौशल: ' : currentLang === 'mr' ? 'कौशल्य: ' : 'Trade: '}
                    <Text style={styles.allocInfoBold}>{getLocalizedTrade(a.trade, currentLang)}</Text>{' • '}
                    {t.cooperative.overview.assigned.replace('{count}', String(a.assignedWorkersCount))}
                    {' • '}
                    {t.cooperative.overview.utilization.replace('{rate}', String(a.utilizationRate))}
                  </Text>
                  <View style={styles.utilBarTrack}>
                    <View style={[styles.utilBarFill, { width: `${a.utilizationRate}%`, backgroundColor: a.status === 'Optimal' ? colors.success : colors.warning }]} />
                  </View>
                  <Text style={styles.suggestionBox}>
                    {getLocalizedAction(a.suggestedAction)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      )}

      <Card style={styles.principlesCard}>
        <View style={styles.principlesTitleRow}>
          <Award size={16} color={accent} />
          <Text style={styles.principlesTitle}>{t.cooperative.overview.platformGovTitle}</Text>
        </View>
        <Text style={styles.principlesDesc}>
          {t.cooperative.overview.platformGovDesc}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
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
  bannerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerTitle: {
    marginTop: spacing.sm,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  grievanceAlert: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grievanceAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  grievanceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.control,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grievanceTextWrap: {
    flexShrink: 1,
  },
  grievanceTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.errorFg,
  },
  grievanceDesc: {
    fontSize: fontSize.xs,
    color: colors.errorFg,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  metricCardStatic: {
    flex: 1,
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    flexShrink: 1,
  },
  metricValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricValueEmerald: {
    color: colors.emeraldDark,
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricFooterText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    flexShrink: 1,
  },
  metricFooterTextPositive: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: '600',
  },
  governanceCard: {
    gap: spacing.md,
  },
  governanceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  governanceAction: {
    flex: 1,
    minHeight: 80,
    padding: spacing.md,
    backgroundColor: colors.purpleLight,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  governanceActionTextWrap: {
    gap: 2,
  },
  governanceActionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.purpleDark,
  },
  governanceActionDesc: {
    fontSize: fontSize.xs,
    color: accent,
  },
  aiBanner: {
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  aiBannerTitle: {
    fontSize: fontSize.sm,
  },
  aiBannerDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rebalanceToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  rebalanceToastText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
    flex: 1,
  },
  forecastCard: {
    gap: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardAside: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  forecastList: {
    gap: spacing.sm,
  },
  forecastItem: {
    padding: spacing.md,
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  forecastTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  forecastTradeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  forecastHour: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  forecastReason: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  forecastBarBlock: {
    gap: 3,
  },
  forecastBarTrack: {
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
    overflow: 'hidden',
  },
  forecastBarFill: {
    height: 4,
    borderRadius: radius.full,
  },
  forecastFootRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
  },
  forecastFootText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  forecastShortfall: {
    fontSize: fontSize.xs,
    color: colors.error,
    fontWeight: '700',
  },
  forecastAdequate: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
    fontWeight: '700',
  },
  rebalanceBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.control,
    backgroundColor: colors.purpleLight,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  rebalanceBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.purpleDark,
  },
  allocList: {
    gap: spacing.sm,
  },
  allocItem: {
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.slate50,
    gap: spacing.xs,
  },
  allocInfo: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  allocInfoBold: {
    fontWeight: '700',
  },
  utilBarTrack: {
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.slate100,
    overflow: 'hidden',
  },
  utilBarFill: {
    height: 4,
    borderRadius: radius.full,
  },
  suggestionBox: {
    fontSize: fontSize.xs,
    color: colors.infoFg,
    backgroundColor: colors.surface,
    padding: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    lineHeight: 15,
  },
  principlesCard: {
    gap: spacing.sm,
    backgroundColor: colors.slate50,
  },
  principlesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  principlesTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  principlesDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});
