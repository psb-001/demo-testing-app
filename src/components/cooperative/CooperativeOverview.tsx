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
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Layers 
} from 'lucide-react-native';
import { AppLanguage, mobileTranslations, getLocalizedTrade } from '../../data/mobileTranslations';

interface CooperativeOverviewProps {
  bookings: Booking[];
  disputes: Dispute[];
  reviews: Review[];
  onNavigateTab: (tab: string) => void;
  onOpenAddMember: () => void;
  currentLang?: AppLanguage;
}

export const CooperativeOverview: React.FC<CooperativeOverviewProps> = ({
  bookings,
  disputes,
  reviews,
  onNavigateTab,
  onOpenAddMember,
  currentLang = 'en'
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'ai_forecast'>('overview');
  const [forecasts, _setForecasts] = useState<DemandForecast[]>(mockDemandForecasts);
  const [allocations, setAllocations] = useState<WorkforceAllocation[]>(mockWorkforceAllocations);
  const [rebalanceToast, setRebalanceToast] = useState<string | null>(null);
  const t = mobileTranslations[currentLang];

  const activeBookingsCount = bookings.filter(b => ['accepted', 'active', 'in_progress'].includes(b.status)).length;
  const pendingRequestsCount = bookings.filter(b => b.status === 'requested').length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const openDisputesCount = disputes.filter(d => d.status !== 'resolved').length;

  // Dynamic calculation of retained reserve fund
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
      {/* Cooperative Ward Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerInner}>
          <View style={styles.bannerTopRow}>
            <Text style={styles.bannerBadge}>
              <Building2 size={14} color="#c4b5fd" /> {t.cooperative.overview.hubWard}
            </Text>
            <Text style={styles.bannerRegNumber}>
              {t.cooperative.overview.regNumber}
            </Text>
          </View>

          <Text style={styles.bannerTitle}>
            {t.cooperative.overview.societyName}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {t.cooperative.overview.collectiveSubtitle}
          </Text>

          <View style={styles.bannerStatsRow}>
            <View style={styles.bannerStatCell}>
              <Text style={styles.bannerStatValue}>48</Text>
              <Text style={styles.bannerStatLabel}>{t.cooperative.overview.memberOwners}</Text>
            </View>
            <View style={styles.bannerStatCell}>
              <Text style={[styles.bannerStatValue, styles.bannerStatValuePurple]}>36</Text>
              <Text style={[styles.bannerStatLabel, styles.bannerStatLabelPurple]}>{t.cooperative.overview.onActiveDuty}</Text>
            </View>
            <View style={styles.bannerStatCell}>
              <Text style={[styles.bannerStatValue, styles.bannerStatValueAmber]}>4.93★</Text>
              <Text style={[styles.bannerStatLabel, styles.bannerStatLabelAmber]}>{t.cooperative.overview.wardQuality}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sub-navigation: Operations vs Smart Demand Allocation */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setActiveSection('overview')}
          style={[styles.tabButton, activeSection === 'overview' && styles.tabButtonActive]}
        >
          <Layers size={14} color="#7c3aed" />
          <Text style={[styles.tabButtonText, activeSection === 'overview' && styles.tabButtonTextActive]}>
            {t.cooperative.overview.wardOperations}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveSection('ai_forecast')}
          style={[styles.tabButton, activeSection === 'ai_forecast' && styles.tabButtonActive]}
        >
          <BrainCircuit size={14} color="#9333ea" />
          <Text style={[styles.tabButtonText, activeSection === 'ai_forecast' && styles.tabButtonTextActive]}>
            {t.cooperative.overview.smartDemandTab}
          </Text>
        </Pressable>
      </View>

      {/* SECTION 1: WARD OPERATIONS */}
      {activeSection === 'overview' && (
        <View style={styles.section}>
          {/* Operational Attention Alerts */}
          {openDisputesCount > 0 && (
            <Pressable
              onPress={() => onNavigateTab('disputes')}
              style={styles.grievanceAlert}
            >
              <View style={styles.grievanceAlertLeft}>
                <View style={styles.grievanceIconWrap}>
                  <AlertCircle size={20} color="#ffffff" />
                </View>
                <View style={styles.grievanceTextWrap}>
                  <Text style={styles.grievanceTitle}>
                    {t.cooperative.overview.grievanceAlert.replace('{count}', String(openDisputesCount))}
                  </Text>
                  <Text style={styles.grievanceDesc}>{t.cooperative.overview.grievanceAlertDesc}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#be123c" />
            </Pressable>
          )}

          {/* Primary Key Metrics Grid */}
          <View style={styles.metricsRow}>
            <Pressable
              onPress={() => onNavigateTab('bookings')}
              style={styles.metricCard}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.activeJobs}</Text>
                <Briefcase size={16} color="#059669" />
              </View>
              <Text style={styles.metricValue}>{activeBookingsCount}</Text>
              <View style={styles.metricFooter}>
                <Clock size={12} color="#059669" />
                <Text style={styles.metricFooterText}>
                  {t.cooperative.overview.newIncoming.replace('{count}', String(pendingRequestsCount))}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => onNavigateTab('members')}
              style={styles.metricCard}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.workerOwners}</Text>
                <Users size={16} color="#4f46e5" />
              </View>
              <Text style={styles.metricValue}>48</Text>
              <Text style={styles.metricFooterText}>{t.cooperative.overview.democraticVoting}</Text>
            </Pressable>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.retainedReserve}</Text>
                <IndianRupee size={16} color="#0d9488" />
              </View>
              <Text style={[styles.metricValue, styles.metricValueEmerald]}>₹{dynamicReserveFund.toLocaleString('en-IN')}</Text>
              <Text style={styles.metricFooterText}>{t.cooperative.overview.coopSocialFund}</Text>
            </View>

            <Pressable
              onPress={() => onNavigateTab('reviews')}
              style={styles.metricCard}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{t.cooperative.overview.reviews}</Text>
                <Star size={16} color="#f59e0b" />
              </View>
              <Text style={styles.metricValue}>{reviews.length + 140}</Text>
              <Text style={styles.metricFooterTextPositive}>{t.cooperative.overview.positiveRating}</Text>
            </Pressable>
          </View>

          {/* Quick Governance & Management Actions */}
          <View style={styles.governanceCard}>
            <Text style={styles.governanceTitle}>
              {t.cooperative.overview.cooperativeOperations}
            </Text>

            <View style={styles.governanceRow}>
              <Pressable
                onPress={onOpenAddMember}
                style={styles.governanceAction}
              >
                <UserPlus size={16} color="#7c3aed" />
                <View style={styles.governanceActionTextWrap}>
                  <Text style={styles.governanceActionTitle}>{t.cooperative.overview.enrollMember}</Text>
                  <Text style={styles.governanceActionDesc}>{t.cooperative.overview.enrollMemberDesc}</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => onNavigateTab('disputes')}
                style={styles.governanceAction}
              >
                <ShieldCheck size={16} color="#7c3aed" />
                <View style={styles.governanceActionTextWrap}>
                  <Text style={styles.governanceActionTitle}>{t.cooperative.overview.peerCouncil}</Text>
                  <Text style={styles.governanceActionDesc}>{t.cooperative.overview.peerCouncilDesc}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* SECTION 2: SMART DEMAND ALLOCATION */}
      {activeSection === 'ai_forecast' && (
        <View style={styles.section}>
          {/* AI Banner */}
          <View style={styles.aiBanner}>
            <View style={styles.bannerTopRow}>
              <Text style={styles.aiBannerBadge}>
                <Sparkles size={14} color="#a78bfa" /> {t.cooperative.overview.smartSuiteBadge}
              </Text>
              <Text style={styles.aiBannerModelBadge}>
                {t.cooperative.overview.predictiveModel}
              </Text>
            </View>
            <Text style={styles.aiBannerTitle}>{t.cooperative.overview.aiHeadline}</Text>
            <Text style={styles.aiBannerDesc}>
              {t.cooperative.overview.aiDescription}
            </Text>
          </View>

          {/* Rebalance Toast */}
          {rebalanceToast && (
            <View style={styles.rebalanceToast}>
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.rebalanceToastText}>{rebalanceToast}</Text>
            </View>
          )}

          {/* Forecast Time Slots */}
          <View style={styles.forecastCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{t.cooperative.overview.hourlyDemandTitle}</Text>
              <Text style={styles.cardAside}>{t.cooperative.overview.next12Hours}</Text>
            </View>

            <View style={styles.forecastList}>
              {forecasts.map((f, i) => (
                <View key={i} style={styles.forecastItem}>
                  <View style={styles.forecastTopRow}>
                    <View style={styles.forecastTradeGroup}>
                      <Text style={styles.forecastHour}>{f.hourSlot}</Text>
                      <Text style={styles.forecastTradeChip}>
                        {getLocalizedTrade(f.trade, currentLang)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.forecastLevelBadge,
                      f.expectedDemandLevel === 'Surge Peak' ? styles.levelSurge : styles.levelNormal
                    ]}>
                      {f.expectedDemandLevel === 'Surge Peak' 
                        ? (currentLang === 'hi' ? 'चरम मांग' : currentLang === 'mr' ? 'कमाल मागणी' : 'Surge Peak') 
                        : (currentLang === 'hi' ? 'सामान्य मांग' : currentLang === 'mr' ? 'सामान्य मागणी' : 'Normal')}
                    </Text>
                  </View>

                  <Text style={styles.forecastReason}>
                    {getLocalizedForecastReason(f.predictedReason)}
                  </Text>

                  {/* AI Forecast Demand Bars */}
                  <View style={styles.forecastBarBlock}>
                    <View style={styles.forecastBarTrack}>
                      <View style={[styles.forecastBarFillRec, { width: `${(f.recommendedWorkers / maxRecommended) * 100}%` }]} />
                    </View>
                    <View style={styles.forecastBarTrack}>
                      <View style={[styles.forecastBarFillActive, { width: `${(f.activeWorkers / maxRecommended) * 100}%` }]} />
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
          </View>

          {/* Allocation Rebalancing Card */}
          <View style={styles.forecastCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{t.cooperative.overview.crossWardTitle}</Text>
              <Pressable onPress={handleSimulateRebalance} style={styles.rebalanceBtn}>
                <Sparkles size={12} color="#9333ea" />
                <Text style={styles.cardAside}>{t.cooperative.overview.autoRebalanceBtn}</Text>
              </Pressable>
            </View>

            <View style={styles.allocList}>
              {allocations.map((a, i) => (
                <View key={i} style={styles.allocItem}>
                  <View style={styles.forecastTopRow}>
                    <Text style={styles.forecastHour}>{a.ward}</Text>
                    <Text style={[
                      styles.forecastLevelBadge,
                      a.status === 'Optimal' ? styles.levelNormal : styles.levelRebalance
                    ]}>
                      {a.status === 'Optimal' 
                        ? (currentLang === 'hi' ? 'इष्टतम' : currentLang === 'mr' ? 'इष्टतम' : 'Optimal') 
                        : (currentLang === 'hi' ? 'संतुलित' : currentLang === 'mr' ? 'संतुलित' : a.status)}
                    </Text>
                  </View>
                  <Text style={styles.allocInfo}>
                    {currentLang === 'hi' ? 'कौशल: ' : currentLang === 'mr' ? 'कौशल्य: ' : 'Trade: '}
                    <Text style={styles.allocInfoBold}>{getLocalizedTrade(a.trade, currentLang)}</Text>{' • '}
                    {t.cooperative.overview.assigned.replace('{count}', String(a.assignedWorkersCount))}
                    {' • '}
                    {t.cooperative.overview.utilization.replace('{rate}', String(a.utilizationRate))}
                  </Text>
                  <View style={styles.utilBarTrack}>
                    <View style={[styles.utilBarFill, { width: `${a.utilizationRate}%`, backgroundColor: a.status === 'Optimal' ? '#059669' : '#f59e0b' }]} />
                  </View>
                  <Text style={styles.suggestionBox}>
                    💡 {getLocalizedAction(a.suggestedAction)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Cooperative Principles Card */}
      <View style={styles.principlesCard}>
        <View style={styles.principlesTitleRow}>
          <Award size={16} color="#059669" />
          <Text style={styles.principlesTitle}>{t.cooperative.overview.platformGovTitle}</Text>
        </View>
        <Text style={styles.principlesDesc}>
          {t.cooperative.overview.platformGovDesc}
        </Text>
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
  section: {
    gap: 16,
  },
  // Banner
  banner: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bannerInner: {
    position: 'relative',
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerBadge: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#c4b5fd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerRegNumber: {
    fontSize: 10,
    backgroundColor: 'rgba(91,33,182,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: '600',
    color: '#f3e8ff',
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 8,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 2,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  bannerStatCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    alignItems: 'center',
  },
  bannerStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  bannerStatValuePurple: {
    color: '#c4b5fd',
  },
  bannerStatValueAmber: {
    color: '#fbbf24',
  },
  bannerStatLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 2,
  },
  bannerStatLabelPurple: {
    color: '#e9d5ff',
  },
  bannerStatLabelAmber: {
    color: '#fde68a',
  },
  // Sub-navigation tabs
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    backgroundColor: 'rgba(226,232,240,0.8)',
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#3b0764',
  },
  // Grievance alert
  grievanceAlert: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  grievanceAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  grievanceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grievanceTextWrap: {
    flexShrink: 1,
  },
  grievanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#881337',
  },
  grievanceDesc: {
    fontSize: 11,
    color: '#be123c',
    marginTop: 2,
  },
  // Metric cards
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricValueEmerald: {
    color: '#047857',
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricFooterText: {
    fontSize: 11,
    color: '#94a3b8',
    flexShrink: 1,
  },
  metricFooterTextPositive: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  // Governance actions
  governanceCard: {
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
  governanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#64748b',
  },
  governanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  governanceAction: {
    flex: 1,
    height: 80,
    padding: 12,
    backgroundColor: '#f5f3ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    justifyContent: 'space-between',
  },
  governanceActionTextWrap: {
    gap: 2,
  },
  governanceActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4c1d95',
  },
  governanceActionDesc: {
    fontSize: 10,
    color: '#7c3aed',
  },
  // AI Banner
  aiBanner: {
    backgroundColor: '#4c1d95',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  aiBannerBadge: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#c4b5fd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiBannerModelBadge: {
    fontSize: 10,
    backgroundColor: 'rgba(107,33,168,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: '600',
    color: '#ffffff',
    overflow: 'hidden',
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  aiBannerDesc: {
    fontSize: 12,
    color: '#e9d5ff',
    lineHeight: 18,
  },
  // Rebalance toast
  rebalanceToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  rebalanceToastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064e3b',
    flex: 1,
  },
  // Forecast / allocation cards
  forecastCard: {
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#334155',
  },
  cardAside: {
    fontSize: 10,
    color: '#94a3b8',
  },
  forecastList: {
    gap: 10,
  },
  forecastItem: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
  },
  forecastTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  forecastTradeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  forecastHour: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  forecastTradeChip: {
    fontSize: 10,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
    color: '#334155',
    overflow: 'hidden',
  },
  forecastLevelBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  levelSurge: {
    backgroundColor: '#ffe4e6',
    color: '#9f1239',
  },
  levelNormal: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  levelRebalance: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  forecastReason: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  forecastBarBlock: {
    gap: 3,
  },
  forecastBarTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  forecastBarFillRec: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#7c3aed',
  },
  forecastBarFillActive: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  forecastFootRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 4,
  },
  forecastFootText: {
    fontSize: 11,
    color: '#64748b',
    flexShrink: 1,
  },
  forecastShortfall: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '700',
  },
  forecastAdequate: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  rebalanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  allocList: {
    gap: 8,
  },
  allocItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  allocInfo: {
    fontSize: 11,
    color: '#475569',
  },
  allocInfoBold: {
    fontWeight: '700',
  },
  utilBarTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  utilBarFill: {
    height: 4,
    borderRadius: 999,
  },
  suggestionBox: {
    fontSize: 10,
    color: '#312e81',
    backgroundColor: 'rgba(238,242,255,0.8)',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    marginTop: 4,
    lineHeight: 15,
  },
  // Cooperative principles
  principlesCard: {
    backgroundColor: 'rgba(241,245,249,0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  principlesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  principlesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  principlesDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 17,
  },
});