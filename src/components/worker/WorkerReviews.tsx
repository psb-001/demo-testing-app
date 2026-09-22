import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Star,
  Award,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react-native';
import { Review } from '../../types';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedReview,
} from '../../data/mobileTranslations';
import { Badge, Card, EmptyState, Section, ToneBadge } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface WorkerReviewsProps {
  reviews: Review[];
  currentLang?: AppLanguage;
}

const accent = roleAccent.worker;

export const WorkerReviews: React.FC<WorkerReviewsProps> = ({ reviews, currentLang = 'en' }) => {
  const t = mobileTranslations[currentLang];

  const workerReviews = reviews.filter(
    (r) =>
      r.workerId === 'w1' ||
      r.workerId === 'w-ramesh-jadhav' ||
      r.workerName.toLowerCase().includes('ramesh')
  );

  const ratingBars = [
    { stars: '5★', pct: '92%', width: '92%' },
    { stars: '4★', pct: '8%', width: '8%' },
    { stars: '3★', pct: '0%', width: '0%' },
  ];

  return (
    <View style={styles.container}>
      <Card style={styles.scoreCard}>
        <View style={styles.scoreHeaderRow}>
          <View>
            <Badge color={colors.emeraldDark} bg={colors.emeraldLight}>
              {t.worker.reviews.trustMetric}
            </Badge>
            <Text style={styles.scoreHeaderTitle}>{t.worker.reviews.customerReputation}</Text>
          </View>
          <Badge color={colors.emeraldDark} bg={colors.emeraldLight}>
            {t.worker.reviews.tierAVerified}
          </Badge>
        </View>

        <View style={styles.scoreBox}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreValue}>4.94</Text>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={colors.amber} color={colors.amber} />
              ))}
            </View>
            <Text style={styles.totalRatings}>
              {workerReviews.length + 80} {t.worker.reviews.totalRatings}
            </Text>
          </View>

          <View style={styles.ratingBars}>
            {ratingBars.map((bar) => (
              <View key={bar.stars} style={styles.ratingBarRow}>
                <Text style={styles.ratingBarLabel}>{bar.stars}</Text>
                <View style={styles.ratingBarTrack}>
                  <View style={[styles.ratingBarFill, { width: bar.width as `${number}%` }]} />
                </View>
                <Text style={styles.ratingBarPct}>{bar.pct}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.highlightsRow}>
          <View style={styles.highlight}>
            <Award size={20} color={accent} />
            <View style={styles.highlightTextWrap}>
              <Text style={styles.highlightTitle}>99.4% On-Time</Text>
              <Text style={styles.highlightSub}>Ward 14 Leader</Text>
            </View>
          </View>
          <View style={styles.highlight}>
            <ThumbsUp size={20} color={accent} />
            <View style={styles.highlightTextWrap}>
              <Text style={styles.highlightTitle}>100% Fair Pricing</Text>
              <Text style={styles.highlightSub}>No Price Gouging</Text>
            </View>
          </View>
        </View>
      </Card>

      <Section
        title={`${t.worker.reviews.recentCustomerFeedback} (${workerReviews.length})`}
      >
        {workerReviews.length === 0 ? (
          <Card>
            <EmptyState
              icon={<MessageSquare size={32} color={colors.slate300} />}
              title="No reviews recorded yet"
            />
          </Card>
        ) : (
          workerReviews.map((rev) => (
            <Card key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeaderRow}>
                <View style={styles.reviewHeaderLeft}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.customerName}>{rev.customerName}</Text>
                    <ToneBadge
                      tone={{ fg: colors.successFg, bg: colors.successLight }}
                      label={t.worker.reviews.verifiedBooking}
                    />
                  </View>
                  <Text style={styles.reviewMeta}>
                    {rev.date} • {getLocalizedTrade(rev.trade, currentLang)}
                  </Text>
                </View>

                <Badge color={colors.warningFg} bg={colors.amberLight}>
                  ★ {rev.rating}.0
                </Badge>
              </View>

              <Text style={styles.reviewText}>
                {"\u201C"}
                {getLocalizedReview(rev.text, currentLang)}
                {"\u201D"}
              </Text>
            </Card>
          ))
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
  scoreCard: {
    gap: spacing.md,
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  scoreHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreLeft: {
    alignItems: 'center',
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    flexShrink: 0,
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 34,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    gap: 2,
  },
  totalRatings: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  ratingBars: {
    flex: 1,
    gap: spacing.xs,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingBarLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 14,
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.slate200,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: radius.full,
  },
  ratingBarPct: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    width: 26,
    textAlign: 'right',
  },
  highlightsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  highlight: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.sm,
  },
  highlightTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  highlightSub: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
  },
  highlightTextWrap: {
    flexShrink: 1,
  },
  reviewCard: {
    gap: spacing.sm,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  reviewHeaderLeft: {
    flexShrink: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  customerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  reviewText: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    lineHeight: 18,
    backgroundColor: colors.slate50,
    padding: spacing.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
