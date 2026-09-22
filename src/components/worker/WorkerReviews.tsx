import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Star,
  ShieldCheck,
  Award,
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react-native';
import { Review } from '../../types';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedReview,
} from '../../data/mobileTranslations';

interface WorkerReviewsProps {
  reviews: Review[];
  currentLang?: AppLanguage;
}

export const WorkerReviews: React.FC<WorkerReviewsProps> = ({ reviews, currentLang = 'en' }) => {
  const t = mobileTranslations[currentLang];

  // Reviews for Ramesh Jadhav
  const workerReviews = reviews.filter(
    (r) =>
      r.workerId === 'w1' ||
      r.workerId === 'w-ramesh-jadhav' ||
      r.workerName.toLowerCase().includes('ramesh')
  );

  return (
    <View style={styles.container}>
      {/* Score Header Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeaderRow}>
          <View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>{t.worker.reviews.trustMetric}</Text>
            </View>
            <Text style={styles.scoreHeaderTitle}>{t.worker.reviews.customerReputation}</Text>
          </View>
          <View style={styles.tierBadge}>
            <ShieldCheck size={16} color="#059669" />
            <Text style={styles.tierBadgeText}>{t.worker.reviews.tierAVerified}</Text>
          </View>
        </View>

        <View style={styles.scoreBox}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreValue}>4.94</Text>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </View>
            <Text style={styles.totalRatings}>
              {workerReviews.length + 80} {t.worker.reviews.totalRatings}
            </Text>
          </View>

          <View style={styles.ratingBars}>
            <View style={styles.ratingBarRow}>
              <Text style={styles.ratingBarLabel}>5★</Text>
              <View style={styles.ratingBarTrack}>
                <View style={[styles.ratingBarFill, { width: '92%' }]} />
              </View>
              <Text style={styles.ratingBarPct}>92%</Text>
            </View>
            <View style={styles.ratingBarRow}>
              <Text style={styles.ratingBarLabel}>4★</Text>
              <View style={styles.ratingBarTrack}>
                <View style={[styles.ratingBarFill, { width: '8%' }]} />
              </View>
              <Text style={styles.ratingBarPct}>8%</Text>
            </View>
            <View style={styles.ratingBarRow}>
              <Text style={styles.ratingBarLabel}>3★</Text>
              <View style={styles.ratingBarTrack}>
                <View style={[styles.ratingBarFill, { width: '0%' }]} />
              </View>
              <Text style={styles.ratingBarPct}>0%</Text>
            </View>
          </View>
        </View>

        {/* Quality highlights */}
        <View style={styles.highlightsRow}>
          <View style={styles.highlightEmerald}>
            <Award size={20} color="#059669" />
            <View style={styles.highlightTextWrap}>
              <Text style={styles.highlightEmeraldTitle}>99.4% On-Time</Text>
              <Text style={styles.highlightEmeraldSub}>Ward 14 Leader</Text>
            </View>
          </View>
          <View style={styles.highlightTeal}>
            <ThumbsUp size={20} color="#0d9488" />
            <View style={styles.highlightTextWrap}>
              <Text style={styles.highlightTealTitle}>100% Fair Pricing</Text>
              <Text style={styles.highlightTealSub}>No Price Gouging</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Customer Reviews Feed */}
      <View style={styles.feed}>
        <Text style={styles.feedHeader}>
          {t.worker.reviews.recentCustomerFeedback} ({workerReviews.length})
        </Text>

        {workerReviews.length === 0 ? (
          <View style={styles.emptyBox}>
            <MessageSquare size={32} color="#cbd5e1" />
            <Text style={styles.emptyText}>No reviews recorded yet</Text>
          </View>
        ) : (
          workerReviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeaderRow}>
                <View style={styles.reviewHeaderLeft}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.customerName}>{rev.customerName}</Text>
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={12} color="#059669" />
                      <Text style={styles.verifiedBadgeText}>{t.worker.reviews.verifiedBooking}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewMeta}>
                    {rev.date} • {getLocalizedTrade(rev.trade, currentLang)}
                  </Text>
                </View>

                <View style={styles.ratingPill}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <Text style={styles.ratingPillText}>{rev.rating}.0</Text>
                </View>
              </View>

              <Text style={styles.reviewText}>
                {"\u201C"}
                {getLocalizedReview(rev.text, currentLang)}
                {"\u201D"}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  trustBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  scoreLeft: {
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    flexShrink: 0,
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 34,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 2,
  },
  totalRatings: {
    fontSize: 10,
    color: '#64748b',
  },
  ratingBars: {
    flex: 1,
    gap: 4,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    width: 12,
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 999,
  },
  ratingBarPct: {
    fontSize: 10,
    color: '#94a3b8',
    width: 24,
    textAlign: 'right',
  },
  highlightsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  highlightEmerald: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: 'rgba(167,243,208,0.6)',
    borderRadius: 12,
    padding: 10,
  },
  highlightEmeraldTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064e3b',
  },
  highlightEmeraldSub: {
    fontSize: 10,
    color: '#047857',
  },
  highlightTeal: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: 'rgba(153,246,228,0.6)',
    borderRadius: 12,
    padding: 10,
  },
  highlightTealTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#134e4a',
  },
  highlightTealSub: {
    fontSize: 10,
    color: '#0f766e',
  },
  highlightTextWrap: {
    flexShrink: 1,
  },
  feed: {
    gap: 12,
  },
  feedHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  reviewHeaderLeft: {
    flexShrink: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  reviewMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#fde68a',
    flexShrink: 0,
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
  },
  reviewText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
});