import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/theme';
import { jobMatchScore } from '../services/matchingService';
import { BookingTimeline, DemoPill, MetricCard, MiniWorkerCard, QuickAction, SectionHeader, StatusPill } from '../components/portal';

export default function CustomerDashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { bookings, userArea, userLocation, searchQuery, setSearchQuery, setSelectedServiceSlug, favoriteWorkerIds, toggleFavorite } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const active = bookings.find((booking) => booking.status === 'in_progress');
  const upcoming = bookings.find((booking) => booking.status === 'confirmed');
  const completed = bookings.filter((booking) => booking.status === 'completed');
  const recommended = useMemo(() => [...WORKERS_LIST].sort((a, b) => jobMatchScore(b) - jobMatchScore(a)).slice(0, 3), []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 450);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.leaf} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroCircleOne} />
        <View style={styles.heroCircleTwo} />
        <Text style={styles.heroKicker}>CUSTOMER HOME · {userArea.toUpperCase()}</Text>
        <Text style={styles.heroTitle}>Good to see you, {user?.name.split(' ')[0] || 'there'}.</Text>
        <Text style={styles.heroSubtitle}>Trusted help for your home.</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={17} color={colors.sage} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => navigation.navigate('Services')}
            placeholder="What service do you need?"
            placeholderTextColor={colors.sage}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <Pressable onPress={() => navigation.navigate('Services')} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Find</Text>
          </Pressable>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#B7F0CD" />
          <Text style={styles.locationText}>{userLocation.label || userArea}</Text>
          <Ionicons name="chevron-down" size={13} color="#B7F0CD" />
        </View>
      </View>

      <View style={styles.quickGrid}>
        <QuickAction icon="grid-outline" label="Book a service" onPress={() => navigation.navigate('Services')} />
        <QuickAction icon="map-outline" label="Nearby map" onPress={() => navigation.navigate('Map')} />
        <QuickAction icon="calendar-outline" label="My bookings" onPress={() => navigation.navigate('Bookings')} />
        <QuickAction icon="sparkles-outline" label="Ask Rozgar AI" onPress={() => navigation.navigate('AI')} tone="dark" />
      </View>

      <View style={styles.metricsRow}>
        <MetricCard label="Upcoming" value={String(bookings.filter((booking) => booking.status === 'confirmed').length)} detail="bookings" icon="calendar-outline" />
        <MetricCard label="Active" value={String(bookings.filter((booking) => booking.status === 'in_progress').length)} detail="in progress" accent icon="pulse-outline" />
        <MetricCard label="Completed" value={String(completed.length)} detail="services" icon="checkmark-circle-outline" />
        <MetricCard label="Saved" value={String(favoriteWorkerIds.length)} detail="workers" icon="heart-outline" />
      </View>

      {active ? (
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <View style={styles.activeTitleRow}><View style={styles.liveDot} /><Text style={styles.activeLabel}>ACTIVE SERVICE</Text></View>
            <StatusPill label="On the way" tone="green" />
          </View>
          <Text style={styles.activeService}>{active.tradeLabel} · {active.workerName}</Text>
          <Text style={styles.activeMeta}>{active.cooperativeName} · {active.address}</Text>
          <BookingTimeline status={active.status} />
          <View style={styles.activeActions}>
            <Pressable style={styles.activeSecondary} onPress={() => navigation.navigate('Bookings')}><Text style={styles.activeSecondaryText}>View booking</Text></Pressable>
            <Pressable style={styles.activePrimary} onPress={() => navigation.navigate('Map')}><Ionicons name="navigate" size={14} color="#fff" /><Text style={styles.activePrimaryText}>Track on map</Text></Pressable>
          </View>
        </View>
      ) : upcoming ? (
        <View style={styles.upcomingCard}>
          <View style={styles.activeHeader}><Text style={styles.activeLabel}>NEXT BOOKING</Text><StatusPill label="Confirmed" /></View>
          <Text style={styles.activeService}>{upcoming.tradeLabel} · {upcoming.workerName}</Text>
          <Text style={styles.activeMeta}>{upcoming.serviceDate} · {upcoming.serviceTime}</Text>
          <Pressable style={styles.activePrimary} onPress={() => navigation.navigate('Bookings')}><Text style={styles.activePrimaryText}>Open booking details</Text></Pressable>
        </View>
      ) : null}

      <SectionHeader title="Recommended for you" action="See all" onAction={() => navigation.navigate('Services')} />
      <View style={styles.workerList}>
        {recommended.map((worker) => (
          <MiniWorkerCard
            key={worker.id}
            worker={worker}
            saved={favoriteWorkerIds.includes(worker.id)}
            onToggleSaved={() => toggleFavorite(worker.id)}
            onPress={() => navigation.navigate('WorkerDetail', { workerId: worker.id })}
            onBook={() => navigation.navigate('Booking', { workerId: worker.id })}
          />
        ))}
      </View>

      <SectionHeader title="Popular services" action="Browse all" onAction={() => navigation.navigate('Services')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroller}>
        <View style={styles.serviceRow}>
          {SERVICES_LIST.slice(0, 8).map((service) => (
            <Pressable key={service.id} style={styles.serviceCard} onPress={() => { setSelectedServiceSlug(service.slug); navigation.navigate('Services'); }}>
              <View style={styles.serviceIcon}><Text style={styles.serviceIconText}>{service.name.slice(0, 1)}</Text></View>
              <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.floorPrice ? `From ₹${service.floorPrice}` : 'Ask for quote'}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <SectionHeader title="Why WorkConnect" />
      <View style={styles.trustCard}>
        <View style={styles.trustIcon}><Ionicons name="shield-checkmark" size={22} color={colors.leaf} /></View>
        <View style={styles.trustCopy}><Text style={styles.trustTitle}>Fair work, visible prices</Text><Text style={styles.trustBody}>92% goes to the worker. 8% supports welfare and insurance.</Text></View>
        <Ionicons name="chevron-forward" size={17} color={colors.sage} />
      </View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Your activity is saved on this device in demo mode.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  hero: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 18, overflow: 'hidden' },
  heroCircleOne: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(46,139,87,0.28)', right: -55, top: -70 },
  heroCircleTwo: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(22,138,91,0.24)', right: 65, bottom: -55 },
  heroKicker: { color: '#B7F0CD', fontSize: 10, fontWeight: '900', letterSpacing: 0.9 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 7, maxWidth: 290 },
  heroSubtitle: { color: '#D5F0DF', fontSize: 12, marginTop: 5, lineHeight: 17 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, paddingLeft: 12, paddingRight: 4, marginTop: 16, minHeight: 46 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, paddingHorizontal: 8, paddingVertical: 9 },
  searchButton: { backgroundColor: colors.cta, borderRadius: 19, paddingHorizontal: 15, paddingVertical: 9 },
  searchButtonText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 11 },
  locationText: { color: '#D5F0DF', fontSize: 11, fontWeight: '700' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  activeCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#BFE6CE', borderLeftWidth: 4, borderLeftColor: colors.cta, borderRadius: radius.lg, padding: 14, marginTop: 16 },
  upcomingCard: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C4E8D2', borderRadius: radius.lg, padding: 14, marginTop: 16 },
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cta },
  activeLabel: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  activeService: { color: colors.ink, fontSize: 15, fontWeight: '900', marginTop: 9 },
  activeMeta: { color: colors.sage, fontSize: 11, marginTop: 3, lineHeight: 16 },
  activeActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  activeSecondary: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 9, paddingVertical: 9, alignItems: 'center' },
  activeSecondaryText: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  activePrimary: { flex: 1, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cta, borderRadius: 9, paddingVertical: 9 },
  activePrimaryText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  workerList: { gap: 0 },
  serviceScroller: { marginHorizontal: -2 },
  serviceRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 2 },
  serviceCard: { width: 108, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10 },
  serviceIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  serviceIconText: { color: colors.forest, fontSize: 15, fontWeight: '900' },
  serviceName: { color: colors.ink, fontSize: 11, fontWeight: '800', marginTop: 7 },
  servicePrice: { color: colors.leaf, fontSize: 10, fontWeight: '800', marginTop: 3 },
  trustCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, flexDirection: 'row', alignItems: 'center' },
  trustIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  trustCopy: { flex: 1, marginHorizontal: 10 },
  trustTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  trustBody: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
