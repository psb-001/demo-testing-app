import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Booking, BookingStatus } from '../../types';
import {
  Briefcase,
  User,
  Search
} from 'lucide-react-native';
import { Badge, Button, Card, EmptyState, Segmented, StatusBadge, TextField, Title, Subtitle } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedStatus,
  getLocalizedTask,
  getLocalizedSlot
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CooperativeBookingsProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  currentLang?: AppLanguage;
}

const accent = roleAccent.cooperative;
type CoopBookingFilter = 'all' | 'pending' | 'active' | 'completed';

export const CooperativeBookings: React.FC<CooperativeBookingsProps> = ({
  bookings,
  onUpdateBookingStatus,
  currentLang = 'en'
}) => {
  const [filter, setFilter] = useState<CoopBookingFilter>('all');
  const [search, setSearch] = useState('');
  const t = mobileTranslations[currentLang];

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.taskDescription.toLowerCase().includes(search.toLowerCase()) ||
                          b.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          b.workerName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'pending') return b.status === 'requested';
    if (filter === 'active') return ['accepted', 'active', 'in_progress'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  const getFilterLabel = (f: CoopBookingFilter) => {
    switch (f) {
      case 'all': return t.customer.bookings.filterAll;
      case 'pending': return currentLang === 'hi' ? 'लंबित' : currentLang === 'mr' ? 'प्रलंबित' : 'Pending';
      case 'active': return t.customer.bookings.filterActive;
      case 'completed': return t.customer.bookings.filterCompleted;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Title style={styles.headerTitle}>{t.cooperative.bookings.title}</Title>
          <Subtitle>{t.cooperative.bookings.subtitle}</Subtitle>
        </View>
        <Badge color={colors.purpleDark} bg={colors.purpleLight}>
          {t.cooperative.bookings.totalLogs.replace('{count}', String(bookings.length))}
        </Badge>
      </View>

      <View style={styles.filterWrap}>
        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t.cooperative.bookings.searchPlaceholder}
            style={styles.searchField}
          />
        </View>

        <Segmented<CoopBookingFilter>
          options={(['all', 'pending', 'active', 'completed'] as const).map((f) => ({
            value: f,
            label: getFilterLabel(f),
          }))}
          value={filter}
          onChange={setFilter}
          accent={accent}
        />
      </View>

      <View style={styles.bookingList}>
        {filteredBookings.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Briefcase size={32} color={colors.slate300} />}
              title={t.cooperative.bookings.noMatch}
            />
          </Card>
        ) : (
          filteredBookings.map((b) => {
            const isPending = b.status === 'requested';
            const isActive = ['accepted', 'active', 'in_progress'].includes(b.status);

            return (
              <Card key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingTopRow}>
                  <View style={styles.bookingMain}>
                    <View style={styles.bookingIdRow}>
                      <Text style={styles.bookingId}>
                        #{b.id.slice(-6).toUpperCase()}
                      </Text>
                      <StatusBadge status={b.status} label={getLocalizedStatus(b.status, currentLang)} />
                    </View>
                    <Text style={styles.taskTitle}>
                      {getLocalizedTask(b.taskDescription, currentLang)}
                    </Text>
                  </View>

                  <View style={styles.bookingAmountWrap}>
                    <Text style={styles.bookingAmount}>₹{b.totalAmount}</Text>
                    <Text style={styles.toCoopText}>
                      {t.cooperative.bookings.toCoop.replace('{amount}', String(b.coopFund))}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingDetailBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailCustomer}>
                      {t.worker.jobs.customer} <Text style={styles.detailCustomerStrong}>{b.customerName}</Text>
                    </Text>
                    <Text style={styles.detailSlot}>
                      {getLocalizedSlot(b.scheduledSlot, currentLang)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailAssigned}>
                      {currentLang === 'hi' ? 'आवंटित: ' : currentLang === 'mr' ? 'नियुक्त: ' : 'Assigned: '}
                      <Text style={styles.detailAssignedStrong}>{b.workerName}</Text>
                    </Text>
                    <Text style={styles.detailLocality}>{b.locality}</Text>
                  </View>
                </View>

                {isPending && (
                  <View style={styles.pendingActions}>
                    <Button
                      color={accent}
                      style={styles.pendingActionFlex}
                      onPress={() => onUpdateBookingStatus(b.id, 'accepted')}
                    >
                      {t.cooperative.bookings.promptAcceptHub}
                    </Button>
                    <Button
                      variant="soft"
                      color={colors.slate700}
                      style={styles.pendingActionFlex}
                      onPress={() => onUpdateBookingStatus(b.id, 'declined')}
                    >
                      {t.cooperative.bookings.reassignBtn}
                    </Button>
                  </View>
                )}

                {isActive && (
                  <View style={styles.activeBanner}>
                    <Text style={styles.activeBannerText}>{t.cooperative.bookings.activeExecution}</Text>
                    <Button
                      variant="outline"
                      color={colors.info}
                      onPress={() => onUpdateBookingStatus(b.id, 'completed')}
                    >
                      {t.cooperative.bookings.markDoneBtn}
                    </Button>
                  </View>
                )}
              </Card>
            );
          })
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerTextWrap: {
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: fontSize.sm,
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
  bookingList: {
    gap: spacing.md,
  },
  bookingCard: {
    gap: spacing.sm,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  bookingMain: {
    flexShrink: 1,
  },
  bookingIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  bookingId: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  taskTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  bookingAmountWrap: {
    alignItems: 'flex-end',
  },
  bookingAmount: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  toCoopText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: '600',
    marginTop: 2,
  },
  bookingDetailBox: {
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  detailCustomer: {
    fontSize: fontSize.xs,
    color: colors.slate800,
    fontWeight: '600',
  },
  detailCustomerStrong: {
    color: colors.slate800,
    fontWeight: '400',
  },
  detailSlot: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  detailAssigned: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    flexShrink: 1,
  },
  detailAssignedStrong: {
    fontWeight: '700',
  },
  detailLocality: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  pendingActionFlex: {
    flex: 1,
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.info,
    backgroundColor: colors.infoLight,
    gap: spacing.sm,
  },
  activeBannerText: {
    fontSize: fontSize.xs,
    color: colors.infoFg,
    fontWeight: '500',
    flexShrink: 1,
  },
});
