import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Calendar,
  Clock,
  Star
} from 'lucide-react-native';
import { Booking, BookingStatus } from '../../types';
import { Badge, EmptyState, StarRating, TextField, AppModal, Button } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTrade,
  getLocalizedSlot,
  getLocalizedTask,
  getLocalizedReview
} from '../../data/mobileTranslations';

interface CustomerBookingsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus, note?: string) => void;
  onSubmitReview: (bookingId: string, rating: number, text: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onSubmitReview,
  onNavigateTab
}) => {
  const t = mobileTranslations[currentLang];
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'disputed'>('all');

  // Rate & Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'active') return b.status === 'requested' || b.status === 'accepted' || b.status === 'in_progress';
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'disputed') return b.status === 'disputed';
    return true;
  });

  const handleOpenReview = (b: Booking) => {
    setReviewBooking(b);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSendReview = () => {
    if (!reviewBooking) return;
    onSubmitReview(reviewBooking.id, reviewRating, reviewComment);
    setReviewBooking(null);
  };

  const getStatusBadge = (status: BookingStatus) => {
    const label = getLocalizedStatus(status, currentLang);
    switch (status) {
      case 'requested':
        return <Badge color="#92400e" bg="#fef3c7">{label}</Badge>;
      case 'accepted':
      case 'in_progress':
        return <Badge color="#1e40af" bg="#dbeafe">{label}</Badge>;
      case 'completed':
        return <Badge color="#065f46" bg="#d1fae5">{label}</Badge>;
      case 'disputed':
        return <Badge color="#991b1b" bg="#fee2e2">{label}</Badge>;
      case 'declined':
      case 'expired':
      default:
        return <Badge color="#334155" bg="#f1f5f9">{label}</Badge>;
    }
  };

  const isPastRequested = (b: Booking) =>
    b.status !== 'requested' && b.status !== 'declined' && b.status !== 'expired';

  const isWorkDone = (b: Booking) =>
    b.status === 'in_progress' || b.status === 'completed';

  const renderTimelineCircle = (
    active: boolean,
    emerald: boolean,
    amber: boolean,
    content: string
  ) => {
    const bg = amber ? '#f59e0b' : emerald ? '#059669' : active ? '#2563eb' : '#e2e8f0';
    const color = active || emerald || amber ? '#ffffff' : '#94a3b8';
    return (
      <View style={[styles.stageCircle, { backgroundColor: bg }]}>
        <Text style={[styles.stageCircleText, { color }]}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>

      {/* Header */}
      <View>
        <Text style={styles.headerTitle}>{t.customer.bookings.title}</Text>
        <Text style={styles.headerSubtitle}>{t.customer.bookings.subtitle}</Text>
      </View>

      {/* Filter Segmented Control */}
      <View style={styles.filterBar}>
        <Pressable
          onPress={() => setActiveFilter('all')}
          style={({ pressed }) => [
            styles.filterBtn,
            activeFilter === 'all' && styles.filterBtnActive,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            {t.customer.bookings.filterAll} ({bookings.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveFilter('active')}
          style={({ pressed }) => [
            styles.filterBtn,
            activeFilter === 'active' && styles.filterBtnActive,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.filterText, activeFilter === 'active' && styles.filterTextActive]}>
            {t.customer.bookings.filterActive}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveFilter('completed')}
          style={({ pressed }) => [
            styles.filterBtn,
            activeFilter === 'completed' && styles.filterBtnActive,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.filterTextActive]}>
            {t.customer.bookings.filterCompleted}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveFilter('disputed')}
          style={({ pressed }) => [
            styles.filterBtn,
            activeFilter === 'disputed' && styles.filterBtnActive,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.filterText, activeFilter === 'disputed' && styles.filterTextActive]}>
            {t.customer.bookings.filterDisputes}
          </Text>
        </Pressable>
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={<Calendar size={40} color="#cbd5e1" />}
            title={t.customer.bookings.emptyBookings}
            action={
              <Button color="#2563eb" onPress={() => onNavigateTab('book')}>
                {t.customer.bookings.bookWorkerNow}
              </Button>
            }
          />
        ) : (
          filteredBookings.map((b) => (
            <View key={b.id} style={styles.bookingCard}>
              {/* Card top bar */}
              <View style={styles.bookingTop}>
                <Text style={styles.bookingId}>#{b.id}</Text>
                {getStatusBadge(b.status)}
              </View>

              {/* Worker & Task details */}
              <View style={styles.bookingWorkerRow}>
                <Image
                  source={{ uri: b.workerPhoto }}
                  style={styles.bookingWorkerImg}
                  resizeMode="cover"
                />
                <View style={styles.bookingWorkerInfo}>
                  <Text style={styles.bookingWorkerName} numberOfLines={1}>{b.workerName}</Text>
                  <Text style={styles.bookingTrade}>{getLocalizedTrade(b.workerTrade, currentLang)}</Text>
                  <Text style={styles.bookingTask}>{getLocalizedTask(b.taskDescription, currentLang)}</Text>
                </View>
              </View>

              {/* Slot & Fare strip */}
              <View style={styles.slotFareStrip}>
                <View style={styles.slotRow}>
                  <Clock size={14} color="#94a3b8" />
                  <Text style={styles.slotText}>{getLocalizedSlot(b.scheduledSlot, currentLang)}</Text>
                </View>
                <Text style={styles.slotFare}>
                  ₹{b.totalAmount}{' '}
                  <Text style={styles.slotFareNote}>({t.customer.bookings.directPayoutPercent})</Text>
                </Text>
              </View>

              {/* 6-Stage Timeline Progress Tracker */}
              <View style={styles.timelineWrap}>
                <Text style={styles.timelineLabel}>{t.customer.bookings.serviceLifecycle}</Text>

                <View style={styles.timelineRow}>
                  <View style={styles.timelineLine} />

                  {/* Stage 1: Dispatched */}
                  <View style={styles.stageCol}>
                    {renderTimelineCircle(true, false, false, '✓')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageSent}</Text>
                  </View>

                  {/* Stage 2: Accepted */}
                  <View style={styles.stageCol}>
                    {renderTimelineCircle(
                      isPastRequested(b),
                      false,
                      false,
                      isPastRequested(b) ? '✓' : '2'
                    )}
                    <Text style={styles.stageText}>{t.customer.bookings.stageConfirmed}</Text>
                  </View>

                  {/* Stage 3: In Progress */}
                  <View style={styles.stageCol}>
                    {renderTimelineCircle(isWorkDone(b), false, false, isWorkDone(b) ? '✓' : '3')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageWork}</Text>
                  </View>

                  {/* Stage 4: Completed */}
                  <View style={styles.stageCol}>
                    {renderTimelineCircle(b.status === 'completed', b.status === 'completed', false, b.status === 'completed' ? '✓' : '4')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageDone}</Text>
                  </View>

                  {/* Stage 5: Reviewed */}
                  <View style={styles.stageCol}>
                    {renderTimelineCircle(!!b.rating, false, !!b.rating, b.rating ? '★' : '5')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageRated}</Text>
                  </View>
                </View>
              </View>

              {/* Prototype Lifecycle Controls & Actions */}
              <View style={styles.actionsBar}>
                {b.status === 'accepted' && (
                  <Pressable
                    onPress={() => onUpdateBookingStatus(b.id, 'in_progress', 'Worker arrived at service address and initiated task.')}
                    style={({ pressed }) => [styles.actionBtnBlue, pressed && styles.pressed]}
                  >
                    <Text style={styles.actionBtnBlueText}>{t.customer.bookings.demoWorkStarted}</Text>
                  </Pressable>
                )}

                {b.status === 'in_progress' && (
                  <Pressable
                    onPress={() => onUpdateBookingStatus(b.id, 'completed', 'Job completed with 30-day rework warranty.')}
                    style={({ pressed }) => [styles.actionBtnEmerald, pressed && styles.pressed]}
                  >
                    <Text style={styles.actionBtnEmeraldText}>{t.customer.bookings.demoMarkCompleted}</Text>
                  </Pressable>
                )}

                {b.status === 'completed' && !b.rating && (
                  <Pressable
                    onPress={() => handleOpenReview(b)}
                    style={({ pressed }) => [styles.rateBtn, pressed && styles.pressed]}
                  >
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.rateBtnText}>
                      {t.customer.bookings.rateWorker.replace('{name}', b.workerName)}
                    </Text>
                  </Pressable>
                )}

                {b.rating && (
                  <View style={styles.ratedBox}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratedText}>
                      {t.customer.bookings.ratedScore.replace('{rating}', String(b.rating))}
                    </Text>
                    <Text style={styles.ratedReview} numberOfLines={1}>
                      "{getLocalizedReview(b.reviewText || '', currentLang)}"
                    </Text>
                  </View>
                )}

                {b.status !== 'disputed' && (b.status === 'completed' || b.status === 'active' || b.status === 'in_progress') && (
                  <Pressable
                    onPress={() => onNavigateTab('support')}
                    style={({ pressed }) => [styles.raiseIssueBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.raiseIssueText}>{t.customer.bookings.raiseIssue}</Text>
                  </Pressable>
                )}
              </View>

            </View>
          ))
        )}
      </View>

      {/* Rate & Review Bottom Sheet Modal */}
      <AppModal
        visible={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        title={reviewBooking ? t.customer.bookings.reviewTitle.replace('{name}', reviewBooking.workerName) : ''}
        subtitle={
          reviewBooking
            ? `#${reviewBooking.id} • ${getLocalizedTrade(reviewBooking.workerTrade, currentLang)}`
            : ''
        }
      >
        {/* Star rating selector */}
        <View style={styles.reviewField}>
          <Text style={styles.reviewLabel}>{t.customer.bookings.selectRating}</Text>
          <View style={styles.starRow}>
            <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
            <Text style={styles.ratingText}>{reviewRating} / 5</Text>
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.reviewField}>
          <Text style={styles.reviewLabel}>{t.customer.bookings.feedbackLabel}</Text>
          <TextField
            value={reviewComment}
            onChangeText={setReviewComment}
            placeholder={t.customer.bookings.feedbackPlaceholder}
            multiline
            numberOfLines={3}
          />
        </View>

        <Button block color="#2563eb" onPress={handleSendReview}>
          {t.customer.bookings.submitReview}
        </Button>
      </AppModal>

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderRadius: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#0f172a',
  },
  bookingsList: {
    gap: 14,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 14,
  },
  bookingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  bookingWorkerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bookingWorkerImg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bookingWorkerInfo: {
    flex: 1,
    minWidth: 0,
  },
  bookingWorkerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  bookingTrade: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  bookingTask: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  slotFareStrip: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  slotText: {
    fontSize: 12,
    color: '#475569',
    flexShrink: 1,
  },
  slotFare: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  slotFareNote: {
    fontSize: 10,
    fontWeight: '400',
    color: '#1d4ed8',
  },
  timelineWrap: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  timelineLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 8,
  },
  timelineLine: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  stageCol: {
    alignItems: 'center',
    zIndex: 1,
  },
  stageCircle: {
    width: 16,
    height: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCircleText: {
    fontSize: 9,
    fontWeight: '700',
  },
  stageText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsBar: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnBlue: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBtnBlueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  actionBtnEmerald: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#059669',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBtnEmeraldText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  rateBtn: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350f',
    textAlign: 'center',
  },
  ratedBox: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  ratedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  ratedReview: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
    flexShrink: 1,
  },
  raiseIssueBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  raiseIssueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  reviewField: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginLeft: 8,
  },
});