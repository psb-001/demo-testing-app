import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Star, CheckCircle2, MessageSquare, Award } from 'lucide-react-native';
import { Review } from '../../types';
import { Button, Card, Title, Subtitle, EmptyState, Badge } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CustomerReviewsProps {
  reviews: Review[];
  onNavigateTab: (tab: string) => void;
}

const accent = roleAccent.customer;

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  onNavigateTab
}) => {
  return (
    <View style={styles.root}>
      <View>
        <Title>Your Reviews & Ratings</Title>
        <Subtitle>
          Authentic feedback supporting worker-owner quality and cooperative dividends
        </Subtitle>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Total Reviews Given</Text>
          <Text style={styles.summaryValue}>{reviews.length} Verified</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Cooperative Impact</Text>
          <View style={styles.summaryImpactRow}>
            <Award size={14} color={colors.success} />
            <Text style={styles.summaryImpactText}>Fair Dividend Audited</Text>
          </View>
        </View>
      </Card>

      <View style={styles.reviewsList}>
        {reviews.length === 0 ? (
          <Card>
            <EmptyState
              icon={<MessageSquare size={40} color={colors.slate300} />}
              title="You have not submitted any reviews yet."
              action={
                <Button color={accent} onPress={() => onNavigateTab('bookings')}>
                  View Completed Bookings
                </Button>
              }
            />
          </Card>
        ) : (
          reviews.map((rev) => (
            <Card key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewTopLeft}>
                  <Text style={styles.reviewWorkerName}>{rev.workerName}</Text>
                  <Text style={styles.reviewTrade}>{rev.trade}</Text>
                </View>
                <Badge color={colors.warningFg} bg={colors.amberLight}>
                  ★ {rev.rating} / 5
                </Badge>
              </View>

              <Text style={styles.reviewQuote}>"{rev.text}"</Text>

              <View style={styles.reviewFooter}>
                <Text style={styles.reviewDate}>Date: {rev.date}</Text>
                <View style={styles.verifiedRow}>
                  <CheckCircle2 size={12} color={accent} />
                  <Text style={styles.verifiedText}>Cooperative Verified</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  summaryLeft: {
    flexShrink: 1,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  summaryImpactText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  reviewsList: {
    gap: spacing.md,
  },
  reviewCard: {
    gap: spacing.sm,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  reviewTopLeft: {
    flex: 1,
    minWidth: 0,
  },
  reviewWorkerName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewTrade: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: accent,
    marginTop: 1,
  },
  reviewQuote: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  reviewDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  verifiedText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: accent,
  },
});
