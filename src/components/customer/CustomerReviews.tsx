import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Star, CheckCircle2, MessageSquare, Award } from 'lucide-react-native';
import { Review } from '../../types';
import { Button } from '../../ui';

interface CustomerReviewsProps {
  reviews: Review[];
  onNavigateTab: (tab: string) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  onNavigateTab
}) => {
  return (
    <View style={styles.root}>

      {/* Header */}
      <View>
        <Text style={styles.headerTitle}>Your Reviews & Ratings</Text>
        <Text style={styles.headerSubtitle}>
          Authentic feedback supporting worker-owner quality and cooperative dividends
        </Text>
      </View>

      {/* Summary metric card */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total Reviews Given</Text>
          <Text style={styles.summaryValue}>{reviews.length} Verified</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Cooperative Impact</Text>
          <View style={styles.summaryImpactRow}>
            <Award size={14} color="#6ee7b7" />
            <Text style={styles.summaryImpactText}>Fair Dividend Audited</Text>
          </View>
        </View>
      </View>

      {/* Reviews list */}
      <View style={styles.reviewsList}>
        {reviews.length === 0 ? (
          <View style={styles.emptyCard}>
            <MessageSquare size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>You have not submitted any reviews yet.</Text>
            <Button color="#2563eb" onPress={() => onNavigateTab('bookings')}>
              View Completed Bookings
            </Button>
          </View>
        ) : (
          reviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewTopLeft}>
                  <Text style={styles.reviewWorkerName}>{rev.workerName}</Text>
                  <Text style={styles.reviewTrade}>{rev.trade}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.ratingPillText}>{rev.rating} / 5</Text>
                </View>
              </View>

              <Text style={styles.reviewQuote}>"{rev.text}"</Text>

              <View style={styles.reviewFooter}>
                <Text style={styles.reviewDate}>Date: {rev.date}</Text>
                <View style={styles.verifiedRow}>
                  <CheckCircle2 size={12} color="#2563eb" />
                  <Text style={styles.verifiedText}>Cooperative Verified</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

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
  summaryCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#93c5fd',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  summaryImpactText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6ee7b7',
  },
  reviewsList: {
    gap: 12,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    marginVertical: 12,
    textAlign: 'center',
  },
  reviewCard: {
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
    gap: 10,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  reviewTopLeft: {
    flex: 1,
    minWidth: 0,
  },
  reviewWorkerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewTrade: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  reviewQuote: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    fontStyle: 'italic',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  reviewDate: {
    fontSize: 10.5,
    color: '#94a3b8',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1d4ed8',
  },
});