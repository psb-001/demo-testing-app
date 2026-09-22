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
import { Badge, Button, Card, ListRow, Section } from '../../ui';
import { colors, radius, spacing, fontSize, cardShadow, roleAccent } from '../../theme';

interface CustomerHomeProps {
  customer: CustomerProfile;
  bookings: Booking[];
  currentLang?: AppLanguage;
  onNavigateTab: (tab: string) => void;
  onSelectWorkerForBooking: (worker: Worker) => void;
}

const accent = roleAccent.customer;

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  customer,
  bookings,
  currentLang = 'en',
  onNavigateTab,
  onSelectWorkerForBooking
}) => {
  const t = mobileTranslations[currentLang];

  const currentActiveBooking = bookings.find(
    b => b.status === 'requested' || b.status === 'accepted' || b.status === 'in_progress'
  );

  const topWorkers = mockWorkers.slice(0, 4);

  const activeStatusLabel = currentActiveBooking
    ? currentActiveBooking.status === 'requested'
      ? t.customer.home.waitingWorker
      : currentActiveBooking.status === 'accepted'
      ? t.customer.home.workerEnRoute
      : t.customer.home.workUnderway
    : '';

  return (
    <View style={styles.root}>

      <Card style={styles.greetingCard}>
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

        <View style={styles.localityRow}>
          <View style={styles.localityLeft}>
            <MapPin size={14} color={accent} />
            <Text style={styles.localityText}>
              {t.customer.home.wardHub} <Text style={styles.localityStrong}>{customer.locality}</Text>
            </Text>
          </View>
          <Badge color={accent} bg={colors.blueLight}>
            {t.customer.home.zone}
          </Badge>
        </View>
      </Card>

      {currentActiveBooking && (
        <Card style={styles.activeCard}>
          <View style={styles.activeTop}>
            <Badge color={colors.infoFg} bg={colors.infoLight}>
              {activeStatusLabel}
            </Badge>
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

          <Button
            variant="soft"
            color={accent}
            block
            onPress={() => onNavigateTab('bookings')}
          >
            {t.customer.home.trackStatus}
          </Button>
        </Card>
      )}

      <Section title={t.customer.home.quickActions}>
        <View style={styles.quickRow}>
          <Pressable
            onPress={() => onNavigateTab('book')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={styles.quickIconWrap}>
              <Search size={20} color={accent} />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.bookWorker}</Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigateTab('bookings')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={styles.quickIconWrap}>
              <Calendar size={20} color={accent} />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.myBookings}</Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigateTab('support')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <View style={[styles.quickIconWrap, styles.quickIconWrapAmber]}>
              <ShieldAlert size={20} color={colors.warningFg} />
            </View>
            <Text style={styles.quickLabel}>{t.customer.home.raiseDispute}</Text>
          </Pressable>
        </View>
      </Section>

      <Section
        title={t.customer.home.nearbyWorkers}
        action={
          <Pressable
            onPress={() => onNavigateTab('book')}
            style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}
          >
            <Text style={styles.viewAllText}>{t.customer.home.viewAll}</Text>
            <ChevronRight size={14} color={accent} />
          </Pressable>
        }
      >
        <View style={styles.workerList}>
          {topWorkers.map((worker) => (
            <ListRow
              key={worker.id}
              leading={
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
              }
              title={
                <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
              }
              subtitle={
                <Text style={styles.workerTrade} numberOfLines={1}>
                  {getLocalizedTrade(worker.primaryTradeLabel, currentLang)}
                </Text>
              }
              meta={
                <View style={styles.workerMeta}>
                  <View style={styles.ratingRow}>
                    <Star size={12} color={colors.amber} fill={colors.amber} />
                    <Text style={styles.ratingText}>{worker.rating}</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>
                    {worker.etaMinutes} {t.customer.home.minsAway}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.feeText}>₹{worker.baseVisitFee}</Text>
                </View>
              }
              trailing={
                <Pressable
                  onPress={() => onSelectWorkerForBooking(worker)}
                  style={({ pressed }) => [styles.requestBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.requestBtnText}>{t.customer.home.requestBtn}</Text>
                </Pressable>
              }
            />
          ))}
        </View>
      </Section>

      <Card style={styles.guaranteeCard}>
        <View style={styles.guaranteeHeader}>
          <ShieldCheck size={20} color={accent} />
          <Text style={styles.guaranteeTitle}>{t.customer.home.guaranteeTitle}</Text>
        </View>
        <View style={styles.guaranteeGrid}>
          <View style={styles.guaranteeItem}>
            <Award size={14} color={accent} />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint1}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <TrendingUp size={14} color={accent} />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint2}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <ShieldCheck size={14} color={accent} />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint3}</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <ShieldCheck size={14} color={accent} />
            <Text style={styles.guaranteePoint}>{t.customer.home.guaranteePoint4}</Text>
          </View>
        </View>
      </Card>

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
  greetingCard: {
    borderLeftWidth: 3,
    borderLeftColor: accent,
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
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  greetingName: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.textPrimary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  localityRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  localityStrong: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activeCard: {
    gap: spacing.md,
  },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeId: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  activeWorkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activeWorkerImg: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeWorkerInfo: {
    flex: 1,
    minWidth: 0,
  },
  activeWorkerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activeWorkerTask: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  activeWorkerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  activeTrade: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: accent,
  },
  activeSlot: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickCard: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.control,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconWrapAmber: {
    backgroundColor: colors.amberLight,
  },
  quickLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
    textAlign: 'center',
    lineHeight: 15,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
  },
  viewAllText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: accent,
  },
  workerList: {
    gap: spacing.sm,
  },
  workerImgWrap: {
    position: 'relative',
  },
  workerImg: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: colors.success,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  workerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  workerTrade: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: accent,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.warningFg,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  feeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requestBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.control,
    backgroundColor: accent,
    minHeight: 36,
    justifyContent: 'center',
  },
  requestBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
  guaranteeCard: {
    gap: spacing.sm,
  },
  guaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  guaranteeTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  guaranteeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  guaranteeItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guaranteePoint: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
});
