import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {
  MapPin,
  Search,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react-native';
import { CustomerProfile, Booking, Worker } from '../../types';
import { mockWorkers } from '../../data/workersData';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedTask,
  getLocalizedSlot
} from '../../data/mobileTranslations';

interface CustomerHomeProps {
  customer: CustomerProfile;
  bookings: Booking[];
  currentLang?: AppLanguage;
  onNavigateTab: (tab: string) => void;
  onSelectWorkerForBooking: (worker: Worker) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  customer,
  bookings,
  currentLang = 'en',
  onNavigateTab,
  onSelectWorkerForBooking
}) => {
  const t = mobileTranslations[currentLang];

  // Find current active / pending booking if any
  const currentActiveBooking = bookings.find(
    b => b.status === 'requested' || b.status === 'accepted' || b.status === 'in_progress'
  );

  const topWorkers = mockWorkers.slice(0, 4);

  return (
    <View style={styles.root}>

      {/* Top Greeting & Locality Card */}
      <View style={styles.greetingCard}>
        <View style={styles.decoGlow} />

        <View style={styles.greetingTop}>
          <View style={styles.greetingTextWrap}>
            <Text style={styles.greetingLabel}>{t.customer.home.greeting}</Text>
            <Text style={styles.greetingName}>{customer.name}</Text>
          </View>
          <Image
            source={{ uri: customer.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        {/* Locality Selector Pill */}
        <View style={styles.localityRow}>
          <View style={styles.localityLeft}>
            <MapPin size={14} color="#93c5fd" />
            <Text style={styles.localityText}>
              {t.customer.home.wardHub} <Text style={styles.localityStrong}>{customer.locality}</Text>
            </Text>
          </View>
          <View style={styles.zonePill}>
            <Text style={styles.zonePillText}>{t.customer.home.zone}</Text>
          </View>
        </View>
      </View>

      {/* Current Active Booking Banner (if present) */}
      {currentActiveBooking && (
        <View style={styles.activeCard}>
          <View style={styles.activeTop}>
            <View style={styles.activeStatusPill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeStatusText}>
                {currentActiveBooking.status === 'requested' && t.customer.home.waitingWorker}
                {currentActiveBooking.status === 'accepted' && t.customer.home.workerEnRoute}
                {currentActiveBooking.status === 'in_progress' && t.customer.home.workUnderway}
              </Text>
            </View>
            <Text style={styles.activeId}>#{currentActiveBooking.id}</Text>
          </View>

          <View style={styles.activeWorkerRow}>
            <Image
              source={{ uri: currentActiveBooking.workerPhoto }}
              style={styles.activeWorkerImg}
              resizeMode="cover"
            />
            <View style={styles.activeWorkerInfo}>
              <Text style={styles.activeWorkerName} numberOfLines={1}>
                {currentActiveBooking.workerName}
              </Text>
              <Text style={styles.activeWorkerTask} numberOfLines={1}>
                {getLocalizedTask(currentActiveBooking.taskDescription, currentLang)}
              </Text>
              <View style={styles.activeWorkerMeta}>
                <Text style={styles.activeTrade}>
                  {getLocalizedTrade(currentActiveBooking.workerTrade, currentLang)}
                </Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.activeSlot}>
                  {getLocalizedSlot(currentActiveBooking.scheduledSlot, currentLang)}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => onNavigateTab('bookings')}
            style={({ pressed }) => [styles.trackBtn, pressed && styles.pressed]}
          >
            <Text style={styles.trackBtnText}>{t.customer.home.trackStatus}</Text>
            <ArrowRight size={14} color="#1e40af" />
          </Pressable>
        </View>
      )}

      {/* 3 Quick Action Cards */}
      <View>
        <Text style={styles.sectionLabel}>{t.customer.home.quickActions}</Text>
        <View style={styles.quickRow}>
          <Pressable
            onPress={() => onNavigateTab('book')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={styles.quickIconWrapBlue}>
              <Search size={20} color="#2563eb" />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.bookWorker}</Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigateTab('bookings')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={styles.quickIconWrapBlue}>
              <Calendar size={20} color="#1d4ed8" />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.myBookings}</Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigateTab('support')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={styles.quickIconWrapAmber}>
              <ShieldAlert size={20} color="#b45309" />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.raiseDispute}</Text>
          </Pressable>
        </View>
      </View>

      {/* Nearby Verified Worker-Owners */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t.customer.home.nearbyWorkers}</Text>
          <Pressable
            onPress={() => onNavigateTab('book')}
            style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}
          >
            <Text style={styles.viewAllText}>{t.customer.home.viewAll}</Text>
            <ChevronRight size={14} color="#2563eb" />
          </Pressable>
        </View>

        <View style={styles.workerList}>
          {topWorkers.map((worker) => (
            <View key={worker.id} style={styles.workerCard}>
              <View style={styles.workerRow}>
                <View style={styles.workerLeft}>
                  <View style={styles.workerImgWrap}>
                    <Image
                      source={{ uri: worker.photo }}
                      style={styles.workerImg}
                      resizeMode="cover"
                    />
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  </View>
                  <View style={styles.workerInfo}>
                    <View style={styles.workerNameRow}>
                      <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
                    </View>
                    <Text style={styles.workerTrade} numberOfLines={1}>
                      {getLocalizedTrade(worker.primaryTradeLabel, currentLang)}
                    </Text>
                    <View style={styles.workerMeta}>
                      <View style={styles.ratingRow}>
                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.ratingText}>{worker.rating}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaText}>
                        {worker.etaMinutes} {t.customer.home.minsAway}
                      </Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.feeText}>₹{worker.baseVisitFee}</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => onSelectWorkerForBooking(worker)}
                  style={({ pressed }) => [styles.requestBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.requestBtnText}>{t.customer.home.requestBtn}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Cooperative Guarantee Pill */}
      <View style={styles.guaranteeCard}>
        <View style={styles.guaranteeHeader}>
          <ShieldCheck size={20} color="#1d4ed8" />
          <Text style={styles.guaranteeTitle}>{t.customer.home.guaranteeTitle}</Text>
        </View>
        <View style={styles.guaranteeGrid}>
          <View style={styles.guaranteeItem}>
            <Award size={14} color="#1d4ed8" />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint1}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <TrendingUp size={14} color="#1d4ed8" />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint2}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <Sparkles size={14} color="#1d4ed8" />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint3}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <ShieldCheck size={14} color="#1d4ed8" />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint4}</Text>
          </View>
        </View>
      </View>

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
  greetingCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  decoGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  greetingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTextWrap: {
    flexShrink: 1,
  },
  greetingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#bfdbfe',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#ffffff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(147,197,253,0.6)',
  },
  localityRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(29,78,216,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  localityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  localityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#dbeafe',
  },
  localityStrong: {
    fontWeight: '700',
  },
  zonePill: {
    backgroundColor: 'rgba(23,37,84,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.4)',
  },
  zonePillText: {
    fontSize: 10,
    color: '#bfdbfe',
  },
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2563eb',
  },
  activeStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e40af',
  },
  activeId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  activeWorkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeWorkerImg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeWorkerInfo: {
    flex: 1,
    minWidth: 0,
  },
  activeWorkerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  activeWorkerTask: {
    fontSize: 12,
    color: '#475569',
  },
  activeWorkerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  activeTrade: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  activeSlot: {
    fontSize: 11,
    color: '#94a3b8',
  },
  metaDot: {
    fontSize: 11,
    color: '#94a3b8',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e40af',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#94a3b8',
    marginBottom: 10,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickCard: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickIconWrapBlue: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconWrapAmber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  workerList: {
    gap: 10,
  },
  workerCard: {
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
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  workerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  workerImgWrap: {
    position: 'relative',
  },
  workerImg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#059669',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 9,
  },
  workerInfo: {
    flex: 1,
    minWidth: 0,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  workerTrade: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
  },
  feeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  requestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  requestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  guaranteeCard: {
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191,219,254,0.8)',
    gap: 8,
  },
  guaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  guaranteeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  guaranteeItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guaranteePoint: {
    fontSize: 11,
    color: '#475569',
    flexShrink: 1,
  },
});