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
  X,
  ArrowRight,
  Radio,
  Sparkles,
  Building2
} from 'lucide-react-native';
import { Worker, Booking, CustomerProfile } from '../../types';
import { mockWorkers } from '../../data/workersData';
import { Host, BottomSheet } from '@expo/ui';
import { TextField, Chip } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedSlot,
  getLocalizedTask
} from '../../data/mobileTranslations';

interface CustomerBookProps {
  customer: CustomerProfile;
  currentLang?: AppLanguage;
  initialSelectedWorker?: Worker | null;
  onClearInitialWorker?: () => void;
  onCreateBooking: (newBooking: Booking) => void;
  onNavigateTab: (tab: string) => void;
}

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

  // Selection & Request State
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(initialSelectedWorker || null);
  const [isDrafting, setIsDrafting] = useState(false);

  // Form fields
  const [taskDescription, setTaskDescription] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('Immediate (within 30 mins)');
  const [address, setAddress] = useState('Flat 402, Shanti Heights, Paud Road, Kothrud');

  // 5-Min Countdown active state for prototype demo
  const [activeRequestedBooking, setActiveRequestedBooking] = useState<Booking | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(300); // 5 mins

  useEffect(() => {
    if (initialSelectedWorker) {
      setSelectedWorker(initialSelectedWorker);
      setIsDrafting(true);
    }
  }, [initialSelectedWorker]);

  // Countdown timer for request
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

  // Filter workers
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

  // Demo actions during the 5-minute decision window
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

      {/* Search & Locality Selector */}
      <View style={styles.searchCard}>
        <View style={styles.localityLabelRow}>
          <MapPin size={14} color="#2563eb" />
          <Text style={styles.localityLabelText}>{t.customer.book.selectWardHub}</Text>
        </View>
        <View style={styles.localityChips}>
          {localities.map((loc) => (
            <Chip
              key={loc}
              label={loc}
              selected={selectedLocality === loc}
              color="#2563eb"
              onPress={() => setSelectedLocality(loc)}
            />
          ))}
        </View>

        {/* Search input */}
        <View style={styles.searchWrap}>
          <View style={styles.searchIconWrap}>
            <Search size={16} color="#94a3b8" />
          </View>
          <TextField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t.customer.book.searchPlaceholder}
          />
        </View>

        {/* Trade Category Horizontal Scroll */}
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
              color="#2563eb"
              onPress={() => setSelectedTrade(trade.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Workers List Header */}
      <View style={styles.workersHeader}>
        <Text style={styles.workersCount}>
          {t.customer.book.workersNearbyCount.replace('{count}', String(filteredWorkers.length))}
        </Text>
        <Text style={styles.workersSorted}>{t.customer.book.sortedBy}</Text>
      </View>

      {/* Workers Cards */}
      <View style={styles.workersList}>
        {filteredWorkers.map((worker) => (
          <View key={worker.id} style={styles.workerCard}>
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
                  <View style={styles.feePill}>
                    <Text style={styles.feePillText}>₹{worker.baseVisitFee}</Text>
                  </View>
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
                    {worker.completedJobs} {t.customer.home.jobsDone}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={styles.etaRow}>
                    <Clock size={12} color="#047857" />
                    <Text style={styles.etaText}>
                      {worker.etaMinutes}m ({worker.distanceKm}km)
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Cooperative Affiliation Tag */}
            {worker.cooperativeSociety && (
              <View style={styles.coopTag}>
                <View style={styles.coopTagLeft}>
                  <Building2 size={14} color="#1d4ed8" />
                  <Text style={styles.coopTagText} numberOfLines={1}>
                    {worker.cooperativeSociety}
                  </Text>
                </View>
                <View style={styles.coopBadge}>
                  <Text style={styles.coopBadgeText}>{t.customer.book.coopBadge}</Text>
                </View>
              </View>
            )}

            {/* Skills pills */}
            <View style={styles.skillsRow}>
              {worker.skills.slice(0, 3).map((skill, idx) => (
                <View key={idx} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* Action button */}
            <Pressable
              onPress={() => handleStartDrafting(worker)}
              style={({ pressed }) => [styles.requestBtn, pressed && styles.pressed]}
            >
              <Text style={styles.requestBtnText}>{t.customer.book.sendRequestBtn}</Text>
              <ArrowRight size={14} color="#ffffff" />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Bottom Sheet: Request Form */}
      {isDrafting && selectedWorker && (
      <Host>
        <BottomSheet
          isPresented
          onDismiss={handleCloseDrafting}
          containerColor="#ffffff"
          contentPadding={0}
        >
          <View style={styles.sheet}>

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                {selectedWorker && (
                  <Image
                    source={{ uri: selectedWorker.photo }}
                    style={styles.sheetWorkerImg}
                    resizeMode="cover"
                  />
                )}
                <View>
                  <Text style={styles.sheetTitle}>
                    {t.customer.book.requestWorker.replace('{name}', selectedWorker?.name || '')}
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    {selectedWorker
                      ? `${getLocalizedTrade(selectedWorker.primaryTradeLabel, currentLang)} • ${selectedWorker.etaMinutes} ${t.customer.home.minsAway}`
                      : ''}
                  </Text>
                </View>
              </View>
              <Pressable onPress={handleCloseDrafting} style={({ pressed }) => [styles.sheetCloseBtn, pressed && styles.pressed]}>
                <X size={20} color="#94a3b8" />
              </Pressable>
            </View>

            {/* Form inputs */}
            <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>{t.customer.book.describeTask}</Text>
                <TextField
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  placeholder={t.customer.book.describeTaskPlaceholder}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>{t.customer.book.preferredSlot}</Text>
                <View style={styles.slotChips}>
                  {slots.map((slot) => (
                    <Chip
                      key={slot.value}
                      label={slot.label}
                      selected={scheduledSlot === slot.value}
                      color="#2563eb"
                      onPress={() => setScheduledSlot(slot.value)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>{t.customer.book.serviceAddress}</Text>
                <TextField value={address} onChangeText={setAddress} />
              </View>

              {/* Transparent Cooperative Rate Breakdown */}
              <View style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>{t.customer.book.transparentPricing}</Text>

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

                <View style={styles.payoutNoteRow}>
                  <Sparkles size={14} color="#2563eb" />
                  <Text style={styles.payoutNote}>
                    {t.customer.book.directPayoutNote
                      .replace('{amount}', String(Math.round((selectedWorker?.baseVisitFee ?? 0) * 0.88)))
                      .replace('{name}', selectedWorker?.name || '')}
                  </Text>
                </View>
              </View>

              {/* Submit CTA */}
              <Pressable
                onPress={handleSubmitRequest}
                style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              >
                <Text style={styles.submitBtnText}>{t.customer.book.sendRequestBtn}</Text>
                <ArrowRight size={16} color="#ffffff" />
              </Pressable>

            </ScrollView>
          </View>
        </BottomSheet>
      </Host>
      )}

      {/* 5-Minute Live Countdown Modal with Demo Controls */}
      <Modal
        visible={!!activeRequestedBooking}
        transparent
        animationType="fade"
        onRequestClose={handleExpireRequest}
      >
        <View style={styles.countdownBackdrop}>
          <View style={styles.countdownSheet}>

            {/* Pulsing Radar Ring */}
            <View style={styles.radarWrap}>
              <View style={styles.radarPing} />
              <View style={styles.radarCore}>
                <Radio size={28} color="#2563eb" />
              </View>
            </View>

            <View style={styles.countdownCenter}>
              <Text style={styles.countdownDispatchLabel}>
                {activeRequestedBooking
                  ? t.customer.book.dispatchedTo.replace('{name}', activeRequestedBooking.workerName)
                  : ''}
              </Text>
              <Text style={styles.countdownTimer}>{formatTimer(secondsLeft)}</Text>
              <Text style={styles.countdownWaiting}>{t.customer.book.waitingConfirmation}</Text>
            </View>

            {/* Booking Summary Box */}
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

            {/* Prototype Demo Controls */}
            <View style={styles.demoControls}>
              <Text style={styles.demoControlsLabel}>{t.customer.book.demoControls}</Text>
              <View style={styles.demoBtns}>
                <Pressable
                  onPress={handleAcceptRequest}
                  style={({ pressed }) => [styles.demoAcceptBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.demoAcceptText}>{t.customer.book.demoAccept}</Text>
                </Pressable>
                <Pressable
                  onPress={handleDeclineRequest}
                  style={({ pressed }) => [styles.demoDeclineBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.demoDeclineText}>{t.customer.book.demoDecline}</Text>
                </Pressable>
                <Pressable
                  onPress={handleExpireRequest}
                  style={({ pressed }) => [styles.demoExpireBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.demoExpireText}>{t.customer.book.demoExpire}</Text>
                </Pressable>
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
    padding: 16,
    gap: 16,
    paddingBottom: 96,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  searchCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  localityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  localityLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  localityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  searchWrap: {
    position: 'relative',
  },
  searchIconWrap: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  tradeChips: {
    gap: 6,
    paddingBottom: 4,
  },
  workersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  workersCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  workersSorted: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  workersList: {
    gap: 12,
  },
  workerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  workerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  workerImgWrap: {
    position: 'relative',
  },
  workerImg: {
    width: 56,
    height: 56,
    borderRadius: 16,
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
    gap: 4,
  },
  workerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 1,
  },
  feePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  feePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  workerTrade: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
    marginTop: 1,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
  metaDot: {
    fontSize: 11,
    color: '#64748b',
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  coopTag: {
    backgroundColor: 'rgba(239,246,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coopTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  coopTagText: {
    fontSize: 11,
    color: '#1e3a8a',
    flexShrink: 1,
  },
  coopBadge: {
    marginLeft: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  coopBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1e40af',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  skillPillText: {
    fontSize: 10,
    color: '#475569',
  },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  requestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  sheet: {
    backgroundColor: '#ffffff',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetWorkerImg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 18,
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#93c5fd',
    marginTop: 1,
  },
  sheetCloseBtn: {
    padding: 4,
    borderRadius: 999,
  },
  sheetBody: {
    padding: 16,
    gap: 14,
  },
  formField: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  slotChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  pricingCard: {
    backgroundColor: 'rgba(239,246,255,0.8)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(191,219,254,0.8)',
    gap: 8,
  },
  pricingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingLabel: {
    fontSize: 12,
    color: '#475569',
  },
  pricingValue: {
    fontSize: 12,
    color: '#475569',
  },
  pricingTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe',
  },
  pricingTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  pricingTotalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  payoutNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  payoutNote: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#1e40af',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  countdownBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(15,23,42,0.7)',
  },
  countdownSheet: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  radarWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarPing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: 'rgba(96,165,250,0.75)',
    opacity: 0.4,
  },
  radarCore: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  countdownCenter: {
    alignItems: 'center',
    gap: 4,
  },
  countdownDispatchLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  countdownTimer: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    fontVariant: ['tabular-nums'],
  },
  countdownWaiting: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  summaryBox: {
    alignSelf: 'stretch',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  summaryValueBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    maxWidth: 180,
    flexShrink: 1,
  },
  summaryValue: {
    fontSize: 12,
    color: '#475569',
    flexShrink: 1,
  },
  summaryValueTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  demoControls: {
    alignSelf: 'stretch',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  demoControlsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  demoBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  demoAcceptBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  demoAcceptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  demoDeclineBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  demoDeclineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  demoExpireBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  demoExpireText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
    textAlign: 'center',
  },
});