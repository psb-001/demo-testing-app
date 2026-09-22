import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Radio,
  Building2
} from 'lucide-react-native';
import { Worker, Booking, CustomerProfile } from '../../types';
import { mockWorkers } from '../../data/workersData';
import { TextField, Chip, Card, Badge, Button, PrimaryButton, AppModal, ListRow, SectionTitle } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedSlot,
  getLocalizedTask
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, cardShadow, roleAccent } from '../../theme';

interface CustomerBookProps {
  customer: CustomerProfile;
  currentLang?: AppLanguage;
  initialSelectedWorker?: Worker | null;
  onClearInitialWorker?: () => void;
  onCreateBooking: (newBooking: Booking) => void;
  onNavigateTab: (tab: string) => void;
}

const accent = roleAccent.customer;

export const CustomerBook: React.FC<CustomerBookProps> = ({
  customer,
  currentLang = 'en',
  initialSelectedWorker,
  onClearInitialWorker,
  onCreateBooking,
  onNavigateTab
}) => {
  const t = mobileTranslations[currentLang];
  const [selectedLocality, setSelectedLocality] = useState('Kothrud, Pune');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(initialSelectedWorker || null);
  const [isDrafting, setIsDrafting] = useState(false);

  const [taskDescription, setTaskDescription] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('Immediate (within 30 mins)');
  const [address, setAddress] = useState('Flat 402, Shanti Heights, Paud Road, Kothrud');

  const [activeRequestedBooking, setActiveRequestedBooking] = useState<Booking | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(300);

  useEffect(() => {
    if (initialSelectedWorker) {
      setSelectedWorker(initialSelectedWorker);
      setIsDrafting(true);
    }
  }, [initialSelectedWorker]);

  useEffect(() => {
    if (!activeRequestedBooking) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleExpireRequest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRequestedBooking]);

  const trades = [
    { id: 'all', label: t.trades.all },
    { id: 'electrician', label: t.trades.electrician },
    { id: 'plumber', label: t.trades.plumber },
    { id: 'cleaning', label: t.trades.cleaning },
    { id: 'carpenter', label: t.trades.carpenter },
    { id: 'painting', label: t.trades.painting },
    { id: 'appliances', label: t.trades.appliances }
  ];

  const localities = [
    'Kothrud, Pune',
    'Baner / Wakad, Pune',
    'Viman Nagar, Pune',
    'Hadapsar, Pune',
    'Aundh, Pune'
  ];

  const slots = [
    { value: 'Immediate (within 30 mins)', label: t.customer.book.slotImmediate },
    { value: 'Today, 2:00 PM - 3:00 PM', label: t.customer.book.slotAfternoon },
    { value: 'Today, 5:00 PM - 6:00 PM', label: t.customer.book.slotEvening },
    { value: 'Tomorrow Morning (9:00 AM - 11:00 AM)', label: t.customer.book.slotTomorrow }
  ];

  const filteredWorkers = mockWorkers.filter((w) => {
    const matchesTrade = selectedTrade === 'all' || w.primaryTrade === selectedTrade;
    const matchesQuery =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.primaryTradeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.cooperativeSociety && w.cooperativeSociety.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTrade && matchesQuery;
  });

  const handleStartDrafting = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDrafting(true);
  };

  const handleCloseDrafting = () => {
    setIsDrafting(false);
    setSelectedWorker(null);
    if (onClearInitialWorker) onClearInitialWorker();
  };

  const handleSubmitRequest = () => {
    if (!selectedWorker) return;

    const baseFee = selectedWorker.baseVisitFee;
    const coopFund = 15;
    const total = baseFee + coopFund;
    const payout = Math.round(baseFee * 0.88);

    const newBooking: Booking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      workerPhoto: selectedWorker.photo,
      workerTrade: selectedWorker.primaryTradeLabel,
      coopId: 'coop-pune-central',
      coopName: selectedWorker.cooperativeSociety || 'Pune Central Electricians Cooperative Society Ltd.',
      taskDescription: taskDescription || 'General diagnostic inspection & repair',
      category: selectedWorker.primaryTrade,
      locality: selectedLocality,
      address: address,
      scheduledSlot: scheduledSlot,
      baseFee: baseFee,
      totalAmount: total,
      workerPayout: payout,
      coopFund: coopFund,
      status: 'requested',
      timeline: [
        {
          status: 'requested',
          label: 'Request Dispatched',
          timestamp: 'Just now',
          note: `Sent directly to ${selectedWorker.name} with a live 5-minute decision window.`
        }
      ],
      createdAt: Date.now()
    };

    onCreateBooking(newBooking);
    setIsDrafting(false);
    setActiveRequestedBooking(newBooking);
    setSecondsLeft(300);
  };

  const handleAcceptRequest = () => {
    if (!activeRequestedBooking) return;
    const acceptedBooking: Booking = {
      ...activeRequestedBooking,
      status: 'active',
      timeline: [
        ...activeRequestedBooking.timeline,
        {
          status: 'accepted',
          label: 'Worker Accepted Request',
          timestamp: 'Just now',
          note: `${activeRequestedBooking.workerName} confirmed arrival for ${activeRequestedBooking.scheduledSlot}.`
        }
      ]
    };
    onCreateBooking(acceptedBooking);
    setActiveRequestedBooking(null);
    onNavigateTab('bookings');
  };

  const handleDeclineRequest = () => {
    if (!activeRequestedBooking) return;
    const declinedBooking: Booking = {
      ...activeRequestedBooking,
      status: 'declined',
      timeline: [
        ...activeRequestedBooking.timeline,
        {
          status: 'declined',
          label: 'Worker Unavailable',
          timestamp: 'Just now',
          note: `${activeRequestedBooking.workerName} is currently on an active emergency job.`
        }
      ]
    };
    onCreateBooking(declinedBooking);
    setActiveRequestedBooking(null);
  };

  const handleExpireRequest = () => {
    if (!activeRequestedBooking) return;
    const expiredBooking: Booking = {
      ...activeRequestedBooking,
      status: 'expired',
      timeline: [
        ...activeRequestedBooking.timeline,
        {
          status: 'expired',
          label: 'Window Expired',
          timestamp: 'Just now',
          note: 'No response received within 5 minutes. No cancellation fee charged.'
        }
      ]
    };
    onCreateBooking(expiredBooking);
    setActiveRequestedBooking(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.root}>

      <Card style={styles.searchCard}>
        <View style={styles.localityLabelRow}>
          <MapPin size={14} color={accent} />
          <Text style={styles.localityLabelText}>{t.customer.book.selectWardHub}</Text>
        </View>
        <View style={styles.localityChips}>
          {localities.map((loc) => (
            <Chip
              key={loc}
              label={loc}
              selected={selectedLocality === loc}
              color={accent}
              onPress={() => setSelectedLocality(loc)}
            />
          ))}
        </View>

        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t.customer.book.searchPlaceholder}
            style={styles.searchField}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tradeChips}
        >
          {trades.map((trade) => (
            <Chip
              key={trade.id}
              label={trade.label}
              selected={selectedTrade === trade.id}
              color={accent}
              onPress={() => setSelectedTrade(trade.id)}
            />
          ))}
        </ScrollView>
      </Card>

      <View style={styles.workersHeader}>
        <Text style={styles.workersCount}>
          {t.customer.book.workersNearbyCount.replace('{count}', String(filteredWorkers.length))}
        </Text>
        <Text style={styles.workersSorted}>{t.customer.book.sortedBy}</Text>
      </View>

      <View style={styles.workersList}>
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} style={styles.workerCard}>
            <View style={styles.workerTopRow}>
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
                  <Badge color={colors.textPrimary} bg={colors.slate100}>
                    ₹{worker.baseVisitFee}
                  </Badge>
                </View>

                <Text style={styles.workerTrade} numberOfLines={1}>
                  {getLocalizedTrade(worker.primaryTradeLabel, currentLang)}
                </Text>

                <View style={styles.workerMeta}>
                  <View style={styles.ratingRow}>
                    <Star size={12} color={colors.amber} fill={colors.amber} />
                    <Text style={styles.ratingText}>{worker.rating}</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>
                    {worker.completedJobs} {t.customer.home.jobsDone}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={styles.etaRow}>
                    <Clock size={12} color={colors.emeraldDark} />
                    <Text style={styles.etaText}>
                      {worker.etaMinutes}m ({worker.distanceKm}km)
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {worker.cooperativeSociety && (
              <View style={styles.coopTag}>
                <View style={styles.coopTagLeft}>
                  <Building2 size={14} color={accent} />
                  <Text style={styles.coopTagText} numberOfLines={1}>
                    {worker.cooperativeSociety}
                  </Text>
                </View>
                <Badge color={accent} bg={colors.surface} border>
                  {t.customer.book.coopBadge}
                </Badge>
              </View>
            )}

            <View style={styles.skillsRow}>
              {worker.skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} color={colors.textSecondary} bg={colors.slate100}>
                  {skill}
                </Badge>
              ))}
            </View>

            <PrimaryButton
              label={t.customer.book.sendRequestBtn}
              color={accent}
              onPress={() => handleStartDrafting(worker)}
            />
          </Card>
        ))}
      </View>

      <AppModal
        visible={isDrafting && !!selectedWorker}
        onClose={handleCloseDrafting}
        title={t.customer.book.requestWorker.replace('{name}', selectedWorker?.name || '')}
        subtitle={
          selectedWorker
            ? `${getLocalizedTrade(selectedWorker.primaryTradeLabel, currentLang)} • ${selectedWorker.etaMinutes} ${t.customer.home.minsAway}`
            : ''
        }
      >
        {selectedWorker && (
          <ListRow
            leading={
              <Image
                source={{ uri: selectedWorker.photo }}
                style={styles.sheetWorkerImg}
                resizeMode="cover"
              />
            }
            title={
              <Text style={styles.sheetWorkerName} numberOfLines={1}>
                {selectedWorker.name}
              </Text>
            }
            subtitle={
              <Text style={styles.sheetWorkerTrade} numberOfLines={1}>
                {getLocalizedTrade(selectedWorker.primaryTradeLabel, currentLang)}
              </Text>
            }
            trailing={
              <Badge color={colors.textPrimary} bg={colors.slate100}>
                ₹{selectedWorker.baseVisitFee}
              </Badge>
            }
          />
        )}

        <TextField
          label={t.customer.book.describeTask}
          value={taskDescription}
          onChangeText={setTaskDescription}
          placeholder={t.customer.book.describeTaskPlaceholder}
          multiline
          numberOfLines={2}
        />

        <View>
          <Text style={styles.formLabel}>{t.customer.book.preferredSlot}</Text>
          <View style={styles.slotChips}>
            {slots.map((slot) => (
              <Chip
                key={slot.value}
                label={slot.label}
                selected={scheduledSlot === slot.value}
                color={accent}
                onPress={() => setScheduledSlot(slot.value)}
              />
            ))}
          </View>
        </View>

        <TextField
          label={t.customer.book.serviceAddress}
          value={address}
          onChangeText={setAddress}
        />

        <Card style={styles.pricingCard}>
          <SectionTitle>{t.customer.book.transparentPricing}</SectionTitle>

          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>{t.customer.book.baseVisit}</Text>
            <Text style={styles.pricingValue}>₹{selectedWorker?.baseVisitFee ?? 0}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>{t.customer.book.coopSafetyFund}</Text>
            <Text style={styles.pricingValue}>₹15</Text>
          </View>
          <View style={styles.pricingTotalRow}>
            <Text style={styles.pricingTotalLabel}>{t.customer.book.totalPayable}</Text>
            <Text style={styles.pricingTotalValue}>₹{(selectedWorker?.baseVisitFee ?? 0) + 15}</Text>
          </View>

          <Text style={styles.payoutNote}>
            {t.customer.book.directPayoutNote
              .replace('{amount}', String(Math.round((selectedWorker?.baseVisitFee ?? 0) * 0.88)))
              .replace('{name}', selectedWorker?.name || '')}
          </Text>
        </Card>

        <PrimaryButton
          label={t.customer.book.sendRequestBtn}
          color={accent}
          onPress={handleSubmitRequest}
        />
      </AppModal>

      <Modal
        visible={!!activeRequestedBooking}
        transparent
        animationType="fade"
        onRequestClose={handleExpireRequest}
      >
        <View style={styles.countdownBackdrop}>
          <View style={styles.countdownSheet}>

            <View style={styles.radarCore}>
              <Radio size={28} color={accent} />
            </View>

            <View style={styles.countdownCenter}>
              <SectionTitle style={styles.countdownDispatchLabel}>
                {activeRequestedBooking
                  ? t.customer.book.dispatchedTo.replace('{name}', activeRequestedBooking.workerName)
                  : ''}
              </SectionTitle>
              <Text style={styles.countdownTimer}>{formatTimer(secondsLeft)}</Text>
              <Text style={styles.countdownWaiting}>{t.customer.book.waitingConfirmation}</Text>
            </View>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.customer.book.taskLabel}</Text>
                <Text style={styles.summaryValueBold} numberOfLines={1}>
                  {activeRequestedBooking
                    ? getLocalizedTask(activeRequestedBooking.taskDescription, currentLang)
                    : ''}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.customer.book.slotLabel}</Text>
                <Text style={styles.summaryValue}>
                  {activeRequestedBooking
                    ? getLocalizedSlot(activeRequestedBooking.scheduledSlot, currentLang)
                    : ''}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.customer.book.totalLabel}</Text>
                <Text style={styles.summaryValueTotal}>
                  ₹{activeRequestedBooking?.totalAmount ?? 0}
                </Text>
              </View>
            </View>

            <View style={styles.demoControls}>
              <SectionTitle style={styles.demoControlsLabel}>{t.customer.book.demoControls}</SectionTitle>
              <View style={styles.demoBtns}>
                <Button color={accent} style={styles.demoBtnFlex} onPress={handleAcceptRequest}>
                  {t.customer.book.demoAccept}
                </Button>
                <Button variant="soft" color={colors.slate700} style={styles.demoBtnFlex} onPress={handleDeclineRequest}>
                  {t.customer.book.demoDecline}
                </Button>
                <Button variant="soft" color={colors.amber} style={styles.demoBtnFlex} onPress={handleExpireRequest}>
                  {t.customer.book.demoExpire}
                </Button>
              </View>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  searchCard: {
    gap: spacing.md,
  },
  localityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  localityLabelText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  localityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
  },
  tradeChips: {
    gap: 6,
    paddingBottom: spacing.xs,
  },
  workersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  workersCount: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  workersSorted: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  workersList: {
    gap: spacing.md,
  },
  workerCard: {
    gap: spacing.md,
  },
  workerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  workerImgWrap: {
    position: 'relative',
  },
  workerImg: {
    width: 56,
    height: 56,
    borderRadius: radius.card,
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
  workerInfo: {
    flex: 1,
    minWidth: 0,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  workerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  workerTrade: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: accent,
    marginTop: 1,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
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
  metaDot: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  etaText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.emeraldDark,
  },
  coopTag: {
    backgroundColor: colors.slate50,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  coopTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  coopTagText: {
    fontSize: fontSize.xs,
    color: colors.infoFg,
    flexShrink: 1,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  sheetWorkerImg: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetWorkerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sheetWorkerTrade: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  formLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  slotChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  pricingCard: {
    backgroundColor: colors.slate50,
    gap: spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  pricingValue: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  pricingTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pricingTotalLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pricingTotalValue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  payoutNote: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.infoFg,
    paddingTop: spacing.xs,
  },
  countdownBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.overlay,
  },
  countdownSheet: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
    ...cardShadow,
  },
  radarCore: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.blueLight,
    borderWidth: 2,
    borderColor: accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCenter: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  countdownDispatchLabel: {
    textAlign: 'center',
  },
  countdownTimer: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  countdownWaiting: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  summaryValueBold: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
    maxWidth: 180,
    flexShrink: 1,
  },
  summaryValue: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  summaryValueTotal: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  demoControls: {
    alignSelf: 'stretch',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoControlsLabel: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  demoBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoBtnFlex: {
    flex: 1,
  },
});
