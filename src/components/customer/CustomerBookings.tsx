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
import { Button, Card, EmptyState, StarRating, TextField, AppModal, Segmented, StatusBadge, Title, Subtitle, SectionTitle } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTrade,
  getLocalizedSlot,
  getLocalizedTask,
  getLocalizedReview
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CustomerBookingsProps {
  bookings: Booking[];
  currentLang?: AppLanguage;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus, note?: string) => void;
  onSubmitReview: (bookingId: string, rating: number, text: string) => void;
  onNavigateTab: (tab: string) => void;
}

const accent = roleAccent.customer;
type BookingFilter = 'all' | 'active' | 'completed' | 'disputed';

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({
  bookings,
  currentLang = 'en',
  onUpdateBookingStatus,
  onSubmitReview,
  onNavigateTab
}) => {
  const t = mobileTranslations[currentLang];
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');

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

  const isPastRequested = (b: Booking) =>
    b.status !== 'requested' && b.status !== 'declined' && b.status !== 'expired';

  const isWorkDone = (b: Booking) =>
    b.status === 'in_progress' || b.status === 'completed';

  const renderTimelineCircle = (
    active: boolean,
    done: boolean,
    warn: boolean,
    content: string
  ) => {
    const bg = warn ? colors.amber : done ? colors.success : active ? accent : colors.slate200;
    const color = active || done || warn ? colors.white : colors.textMuted;
    return (
      <View style={[styles.stageCircle, { backgroundColor: bg }]}>
        <Text style={[styles.stageCircleText, { color }]}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>

      <View>
        <Title>{t.customer.bookings.title}</Title>
        <Subtitle>{t.customer.bookings.subtitle}</Subtitle>
      </View>

      <Segmented<BookingFilter>
        options={[
          { value: 'all', label: `${t.customer.bookings.filterAll} (${bookings.length})` },
          { value: 'active', label: t.customer.bookings.filterActive },
          { value: 'completed', label: t.customer.bookings.filterCompleted },
          { value: 'disputed', label: t.customer.bookings.filterDisputes },
        ]}
        value={activeFilter}
        onChange={setActiveFilter}
        accent={accent}
      />

      <View style={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar size={40} color={colors.slate300} />}
              title={t.customer.bookings.emptyBookings}
              action={
                <Button color={accent} onPress={() => onNavigateTab('book')}>
                  {t.customer.bookings.bookWorkerNow}
                </Button>
              }
            />
          </Card>
        ) : (
          filteredBookings.map((b) => (
            <Card key={b.id} style={styles.bookingCard}>
              <View style={styles.bookingTop}>
                <Text style={styles.bookingId}>#{b.id}</Text>
                <StatusBadge status={b.status} label={getLocalizedStatus(b.status, currentLang)} />
              </View>

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

              <View style={styles.slotFareStrip}>
                <View style={styles.slotRow}>
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={styles.slotText}>{getLocalizedSlot(b.scheduledSlot, currentLang)}</Text>
                </View>
                <Text style={styles.slotFare}>
                  ₹{b.totalAmount}{' '}
                  <Text style={styles.slotFareNote}>({t.customer.bookings.directPayoutPercent})</Text>
                </Text>
              </View>

              <View style={styles.timelineWrap}>
                <SectionTitle>{t.customer.bookings.serviceLifecycle}</SectionTitle>

                <View style={styles.timelineRow}>
                  <View style={styles.timelineLine} />

                  <View style={styles.stageCol}>
                    {renderTimelineCircle(true, false, false, '✓')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageSent}</Text>
                  </View>

                  <View style={styles.stageCol}>
                    {renderTimelineCircle(
                      isPastRequested(b),
                      false,
                      false,
                      isPastRequested(b) ? '✓' : '2'
                    )}
                    <Text style={styles.stageText}>{t.customer.bookings.stageConfirmed}</Text>
                  </View>

                  <View style={styles.stageCol}>
                    {renderTimelineCircle(isWorkDone(b), false, false, isWorkDone(b) ? '✓' : '3')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageWork}</Text>
                  </View>

                  <View style={styles.stageCol}>
                    {renderTimelineCircle(b.status === 'completed', b.status === 'completed', false, b.status === 'completed' ? '✓' : '4')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageDone}</Text>
                  </View>

                  <View style={styles.stageCol}>
                    {renderTimelineCircle(!!b.rating, false, !!b.rating, b.rating ? '★' : '5')}
                    <Text style={styles.stageText}>{t.customer.bookings.stageRated}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsBar}>
                {b.status === 'accepted' && (
                  <Button
                    block
                    color={accent}
                    onPress={() => onUpdateBookingStatus(b.id, 'in_progress', 'Worker arrived at service address and initiated task.')}
                  >
                    {t.customer.bookings.demoWorkStarted}
                  </Button>
                )}

                {b.status === 'in_progress' && (
                  <Button
                    block
                    color={colors.success}
                    onPress={() => onUpdateBookingStatus(b.id, 'completed', 'Job completed with 30-day rework warranty.')}
                  >
                    {t.customer.bookings.demoMarkCompleted}
                  </Button>
                )}

                {b.status === 'completed' && !b.rating && (
                  <Button
                    block
                    variant="soft"
                    color={colors.amber}
                    onPress={() => handleOpenReview(b)}
                  >
                    {t.customer.bookings.rateWorker.replace('{name}', b.workerName)}
                  </Button>
                )}

                {b.rating && (
                  <View style={styles.ratedBox}>
                    <Star size={14} color={colors.amber} fill={colors.amber} />
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

            </Card>
          ))
        )}
      </View>

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
        <View style={styles.reviewField}>
          <Text style={styles.reviewLabel}>{t.customer.bookings.selectRating}</Text>
          <View style={styles.starRow}>
            <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
            <Text style={styles.ratingText}>{reviewRating} / 5</Text>
          </View>
        </View>

        <View style={styles.reviewField}>
          <TextField
            label={t.customer.bookings.feedbackLabel}
            value={reviewComment}
            onChangeText={setReviewComment}
            placeholder={t.customer.bookings.feedbackPlaceholder}
            multiline
            numberOfLines={3}
          />
        </View>

        <Button block color={accent} onPress={handleSendReview}>
          {t.customer.bookings.submitReview}
        </Button>
      </AppModal>

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
  bookingsList: {
    gap: spacing.md,
  },
  bookingCard: {
    gap: spacing.md,
  },
  bookingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingId: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bookingWorkerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  bookingWorkerImg: {
    width: 48,
    height: 48,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookingWorkerInfo: {
    flex: 1,
    minWidth: 0,
  },
  bookingWorkerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bookingTrade: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: accent,
    marginTop: 1,
  },
  bookingTask: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  slotFareStrip: {
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  slotFare: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  slotFareNote: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    color: accent,
  },
  timelineWrap: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: spacing.sm,
  },
  timelineLine: {
    position: 'absolute',
    top: 8,
    left: spacing.lg,
    right: spacing.lg,
    height: 2,
    backgroundColor: colors.border,
  },
  stageCol: {
    alignItems: 'center',
    zIndex: 1,
  },
  stageCircle: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
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
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  actionsBar: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  ratedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.control,
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  ratedText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.warningFg,
  },
  ratedReview: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  raiseIssueBtn: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  raiseIssueText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  reviewField: {
    marginBottom: spacing.md,
  },
  reviewLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.slate800,
    marginLeft: spacing.sm,
  },
});
