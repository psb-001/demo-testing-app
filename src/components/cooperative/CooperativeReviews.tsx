import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Review } from '../../types';
import { 
  Star, 
  MessageSquare, 
  Search
} from 'lucide-react-native';
import { TextField } from '../../ui';
import { 
  AppLanguage, 
  mobileTranslations, 
  getLocalizedTrade, 
  getLocalizedReview 
} from '../../data/mobileTranslations';

interface CooperativeReviewsProps {
  reviews: Review[];
  currentLang?: AppLanguage;
}

export const CooperativeReviews: React.FC<CooperativeReviewsProps> = ({ 
  reviews,
  currentLang = 'en'
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const t = mobileTranslations[currentLang];

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          r.workerName.toLowerCase().includes(search.toLowerCase()) ||
                          r.text.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  return (
    <View style={styles.container}>
      {/* Cooperative Quality Benchmark */}
      <View style={styles.benchmarkCard}>
        <View style={styles.benchmarkHeader}>
          <View style={styles.benchmarkTextWrap}>
            <Text style={styles.benchmarkTitle}>{t.cooperative.reviews.title}</Text>
            <Text style={styles.benchmarkSubtitle}>{t.cooperative.reviews.subtitle}</Text>
          </View>
          <View style={styles.avgBadge}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.avgBadgeText}>{t.cooperative.reviews.avgScore.replace('{score}', '4.93')}</Text>
          </View>
        </View>

        <View style={styles.benchmarkStats}>
          <View style={[styles.statCell, styles.statCellEmerald]}>
            <Text style={styles.statValue}>98.4%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.punctuality}</Text>
          </View>
          <View style={[styles.statCell, styles.statCellIndigo]}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.fairInvoicing}</Text>
          </View>
          <View style={[styles.statCell, styles.statCellTeal]}>
            <Text style={styles.statValue}>0.2%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.disputeRate}</Text>
          </View>
        </View>
      </View>

      {/* Filter and Search */}
      <View style={styles.filterWrap}>
        <View style={styles.searchWrap}>
          <View style={styles.searchIconWrap} pointerEvents="none">
            <Search size={16} color="#94a3b8" />
          </View>
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t.cooperative.reviews.searchPlaceholder}
            inputStyle={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ratingChips}>
          <Pressable
            onPress={() => setFilterRating('all')}
            style={[styles.ratingChip, filterRating === 'all' ? styles.ratingChipAllActive : styles.ratingChipIdle]}
          >
            <Text style={[styles.ratingChipText, filterRating === 'all' && styles.ratingChipTextActive]}>
              {currentLang === 'hi' ? 'सभी रेटिंग्स' : currentLang === 'mr' ? 'सर्व रेटिंग्ज' : 'All Ratings'} ({reviews.length})
            </Text>
          </Pressable>
          {[5, 4, 3].map((star) => (
            <Pressable
              key={star}
              onPress={() => setFilterRating(star)}
              style={[styles.ratingChip, filterRating === star ? styles.ratingChipStarActive : styles.ratingChipIdle]}
            >
              <Text style={[styles.ratingChipText, filterRating === star && styles.ratingChipTextActive]}>
                {star}★
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewList}>
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={32} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>
              {currentLang === 'hi' ? 'इस मानदंड से कोई समीक्षा मेल नहीं खाती' : currentLang === 'mr' ? 'या निकषाशी कोणतेही पुनरावलोकन जुळत नाही' : 'No reviews matching this criteria'}
            </Text>
          </View>
        ) : (
          filteredReviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewTopRow}>
                <View style={styles.reviewMain}>
                  <View style={styles.reviewHeaderLine}>
                    <Text style={styles.customerName}>{rev.customerName}</Text>
                    <Text style={styles.reviewDate}>• {rev.date}</Text>
                  </View>
                  <View style={styles.assignedLine}>
                    <Text style={styles.assignedLabel}>
                      {currentLang === 'hi' ? 'आवंटित सदस्य:' : currentLang === 'mr' ? 'नियुक्त सदस्य:' : 'Assigned Member:'}
                      {' '}
                      <Text style={styles.assignedWorker}>{rev.workerName}</Text>
                    </Text>
                    <Text style={styles.reviewTrade}>({getLocalizedTrade(rev.trade, currentLang)})</Text>
                  </View>
                </View>

                <View style={styles.ratingBadge}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingBadgeText}>{rev.rating}.0</Text>
                </View>
              </View>

              <Text style={styles.reviewText}>
                "{getLocalizedReview(rev.text, currentLang)}"
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
  benchmarkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  benchmarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  benchmarkTextWrap: {
    flexShrink: 1,
  },
  benchmarkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  benchmarkSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  avgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  avgBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  benchmarkStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statCell: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  statCellEmerald: {
    backgroundColor: 'rgba(236,253,245,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(167,243,208,0.5)',
  },
  statCellIndigo: {
    backgroundColor: 'rgba(238,242,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(199,210,254,0.5)',
  },
  statCellTeal: {
    backgroundColor: 'rgba(240,253,250,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(153,246,228,0.5)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065f46',
  },
  statLabel: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
    textAlign: 'center',
  },
  filterWrap: {
    gap: 8,
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
    zIndex: 2,
  },
  searchInput: {
    paddingLeft: 36,
  },
  ratingChips: {
    gap: 6,
    paddingBottom: 4,
  },
  ratingChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  ratingChipAllActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  ratingChipStarActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  ratingChipIdle: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  ratingChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  ratingChipTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  reviewList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  reviewMain: {
    flexShrink: 1,
  },
  reviewHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  assignedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
    gap: 4,
  },
  assignedLabel: {
    fontSize: 11,
    color: '#475569',
  },
  assignedWorker: {
    color: '#1e293b',
    fontWeight: '700',
  },
  reviewTrade: {
    fontSize: 10,
    color: '#94a3b8',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingBadgeText: {
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