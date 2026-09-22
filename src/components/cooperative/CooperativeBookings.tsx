import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Booking, BookingStatus } from '../../types';
import { 
  Briefcase, 
  User, 
  Search 
} from 'lucide-react-native';
import { TextField } from '../../ui';
import { 
  AppLanguage, 
  mobileTranslations, 
  getLocalizedStatus, 
  getLocalizedTask, 
  getLocalizedSlot 
} from '../../data/mobileTranslations';

interface CooperativeBookingsProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  currentLang?: AppLanguage;
}

export const CooperativeBookings: React.FC<CooperativeBookingsProps> = ({
  bookings,
  onUpdateBookingStatus,
  currentLang = 'en'
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
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

  const getFilterLabel = (f: 'all' | 'pending' | 'active' | 'completed') => {
    switch (f) {
      case 'all': return t.customer.bookings.filterAll;
      case 'pending': return currentLang === 'hi' ? 'लंबित' : currentLang === 'mr' ? 'प्रलंबित' : 'Pending';
      case 'active': return t.customer.bookings.filterActive;
      case 'completed': return t.customer.bookings.filterCompleted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{t.cooperative.bookings.title}</Text>
          <Text style={styles.headerSubtitle}>{t.cooperative.bookings.subtitle}</Text>
        </View>
        <Text style={styles.totalLogsBadge}>
          {t.cooperative.bookings.totalLogs.replace('{count}', String(bookings.length))}
        </Text>
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
            placeholder={t.cooperative.bookings.searchPlaceholder}
            inputStyle={styles.searchInput}
          />
        </View>

        <View style={styles.filterBar}>
          {(['all', 'pending', 'active', 'completed'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            >
              <Text style={[styles.filterButtonText, filter === f && styles.filterButtonTextActive]}>
                {getFilterLabel(f)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bookings List */}
      <View style={styles.bookingList}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase size={32} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>{t.cooperative.bookings.noMatch}</Text>
          </View>
        ) : (
          filteredBookings.map((b) => {
            const isPending = b.status === 'requested';
            const isActive = ['accepted', 'active', 'in_progress'].includes(b.status);
            const isCompleted = b.status === 'completed';

            return (
              <View key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingTopRow}>
                  <View style={styles.bookingMain}>
                    <View style={styles.bookingIdRow}>
                      <Text style={styles.bookingId}>
                        #{b.id.slice(-6).toUpperCase()}
                      </Text>
                      <Text style={[
                        styles.statusBadge,
                        isActive ? styles.statusActive :
                        isPending ? styles.statusPending :
                        isCompleted ? styles.statusCompleted : styles.statusDefault
                      ]}>
                        {getLocalizedStatus(b.status, currentLang)}
                      </Text>
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
                      <User size={12} color="#059669" /> {currentLang === 'hi' ? 'आवंटित: ' : currentLang === 'mr' ? 'नियुक्त: ' : 'Assigned: '}
                      <Text style={styles.detailAssignedStrong}>{b.workerName}</Text>
                    </Text>
                    <Text style={styles.detailLocality}>{b.locality}</Text>
                  </View>
                </View>

                {/* Dispatch interventions */}
                {isPending && (
                  <View style={styles.pendingActions}>
                    <Pressable
                      onPress={() => onUpdateBookingStatus(b.id, 'accepted')}
                      style={styles.acceptBtn}
                    >
                      <Text style={styles.acceptBtnText}>{t.cooperative.bookings.promptAcceptHub}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onUpdateBookingStatus(b.id, 'declined')}
                      style={styles.reassignBtn}
                    >
                      <Text style={styles.reassignBtnText}>{t.cooperative.bookings.reassignBtn}</Text>
                    </Pressable>
                  </View>
                )}

                {isActive && (
                  <View style={styles.activeBanner}>
                    <Text style={styles.activeBannerText}>{t.cooperative.bookings.activeExecution}</Text>
                    <Pressable onPress={() => onUpdateBookingStatus(b.id, 'completed')}>
                      <Text style={styles.markDoneText}>{t.cooperative.bookings.markDoneBtn}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerTextWrap: {
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  totalLogsBadge: {
    fontSize: 12,
    backgroundColor: '#f5f3ff',
    color: '#6b21a8',
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    overflow: 'hidden',
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
  filterBar: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  filterButtonTextActive: {
    fontWeight: '700',
    color: '#0f172a',
  },
  bookingList: {
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
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  bookingMain: {
    flexShrink: 1,
  },
  bookingIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusDefault: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  bookingAmountWrap: {
    alignItems: 'flex-end',
  },
  bookingAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  toCoopText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  bookingDetailBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailCustomer: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
  },
  detailCustomerStrong: {
    color: '#1e293b',
    fontWeight: '400',
  },
  detailSlot: {
    fontSize: 10,
    color: '#64748b',
  },
  detailAssigned: {
    fontSize: 12,
    color: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  detailAssignedStrong: {
    fontWeight: '700',
  },
  detailLocality: {
    fontSize: 10,
    color: '#64748b',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  reassignBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassignBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    backgroundColor: 'rgba(238,242,255,0.7)',
    gap: 8,
  },
  activeBannerText: {
    fontSize: 11,
    color: '#4338ca',
    fontWeight: '500',
    flexShrink: 1,
  },
  markDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3730a3',
    textDecorationLine: 'underline',
  },
});