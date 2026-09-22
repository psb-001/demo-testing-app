import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Review } from '../../types';
import {
  MessageSquare,
  Search
} from 'lucide-react-native';
import { Badge, Card, Chip, EmptyState, TextField, Title, Subtitle } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedReview
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CooperativeReviewsProps {
  reviews: Review[];
  currentLang?: AppLanguage;
}

const accent = roleAccent.cooperative;

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

  const allLabel = currentLang === 'hi' ? 'सभी रेटिंग्स' : currentLang === 'mr' ? 'सर्व रेटिंग्ज' : 'All Ratings';
  const noMatchLabel = currentLang === 'hi' ? 'इस मानदंड से कोई समीक्षा मेल नहीं खाती' : currentLang === 'mr' ? 'या निकषाशी कोणतेही पुनरावलोकन जुळत नाही' : 'No reviews matching this criteria';
  const assignedLabel = currentLang === 'hi' ? 'आवंटित सदस्य:' : currentLang === 'mr' ? 'नियुक्त सदस्य:' : 'Assigned Member:';

  return (
    <View style={styles.container}>
      <Card style={styles.benchmarkCard}>
        <View style={styles.benchmarkHeader}>
          <View style={styles.benchmarkTextWrap}>
            <Title style={styles.benchmarkTitle}>{t.cooperative.reviews.title}</Title>
            <Subtitle>{t.cooperative.reviews.subtitle}</Subtitle>
          </View>
          <Badge color={colors.warningFg} bg={colors.amberLight}>
            ★ {t.cooperative.reviews.avgScore.replace('{score}', '4.93')}
          </Badge>
        </View>

        <View style={styles.benchmarkStats}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>98.4%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.punctuality}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.fairInvoicing}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>0.2%</Text>
            <Text style={styles.statLabel}>{t.cooperative.reviews.disputeRate}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.filterWrap}>
        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t.cooperative.reviews.searchPlaceholder}
            style={styles.searchField}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ratingChips}>
          <Chip
            label={`${allLabel} (${reviews.length})`}
            selected={filterRating === 'all'}
            color={accent}
            onPress={() => setFilterRating('all')}
          />
          {[5, 4, 3].map((star) => (
            <Chip
              key={star}
              label={`${star}★`}
              selected={filterRating === star}
              color={colors.amber}
              onPress={() => setFilterRating(star)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.reviewList}>
        {filteredReviews.length === 0 ? (
          <Card>
            <EmptyState
              icon={<MessageSquare size={32} color={colors.slate300} />}
              title={noMatchLabel}
            />
          </Card>
        ) : (
          filteredReviews.map((rev) => (
            <Card key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewTopRow}>
                <View style={styles.reviewMain}>
                  <View style={styles.reviewHeaderLine}>
                    <Text style={styles.customerName}>{rev.customerName}</Text>
                    <Text style={styles.reviewDate}>• {rev.date}</Text>
                  </View>
                  <View style={styles.assignedLine}>
                    <Text style={styles.assignedLabel}>
                      {assignedLabel}
                      {' '}
                      <Text style={styles.assignedWorker}>{rev.workerName}</Text>
                    </Text>
                    <Text style={styles.reviewTrade}>({getLocalizedTrade(rev.trade, currentLang)})</Text>
                  </View>
                </View>

                <Badge color={colors.warningFg} bg={colors.amberLight}>
                  ★ {rev.rating}.0
                </Badge>
              </View>

              <Text style={styles.reviewText}>
                "{getLocalizedReview(rev.text, currentLang)}"
              </Text>
            </Card>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  benchmarkCard: {
    gap: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  benchmarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  benchmarkTextWrap: {
    flexShrink: 1,
  },
  benchmarkTitle: {
    fontSize: fontSize.sm,
  },
  benchmarkStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCell: {
    flex: 1,
    borderRadius: radius.control,
    padding: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.successFg,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
    marginTop: 2,
    textAlign: 'center',
  },
  filterWrap: {
    gap: spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
  },
  ratingChips: {
    gap: 6,
    paddingBottom: spacing.xs,
  },
  reviewList: {
    gap: spacing.md,
  },
  reviewCard: {
    gap: spacing.sm,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  reviewMain: {
    flexShrink: 1,
  },
  reviewHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  customerName: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  assignedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
    gap: spacing.xs,
  },
  assignedLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  assignedWorker: {
    color: colors.slate800,
    fontWeight: '700',
  },
  reviewTrade: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
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
