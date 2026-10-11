import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { useAppState } from '../context/AppState';
import { colors, radius } from '../theme/theme';
import { DemoPill, MiniWorkerCard, SectionHeader, StatusPill } from '../components/portal';

export default function ServicesScreen() {
  const navigation = useNavigation<any>();
  const { searchQuery, setSearchQuery, selectedServiceSlug, setSelectedServiceSlug, favoriteWorkerIds, toggleFavorite } = useAppState();
  const selected = SERVICES_LIST.find((service) => service.slug === selectedServiceSlug);
  const services = useMemo(() => SERVICES_LIST.filter((service) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${service.name} ${service.shortDesc}`.toLowerCase().includes(query);
  }), [searchQuery]);
  const workers = WORKERS_LIST.filter((worker) => !selectedServiceSlug || worker.trade === selectedServiceSlug);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>SERVICE CATALOGUE</Text><Text style={styles.heading}>Find trusted help</Text></View><View style={styles.headingIcon}><Ionicons name="grid" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>Choose a service and see verified cooperative workers with clear floor pricing.</Text>
      <View style={styles.searchBox}><Ionicons name="search" size={17} color={colors.sage} /><TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search services or workers" placeholderTextColor={colors.sage} style={styles.searchInput} />{searchQuery ? <Pressable onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={17} color={colors.sage} /></Pressable> : null}</View>

      {!selected ? <>
        <SectionHeader title="All services" action="Clear" onAction={() => { setSearchQuery(''); setSelectedServiceSlug(null); }} />
        <View style={styles.serviceGrid}>{services.map((service) => <Pressable key={service.id} onPress={() => setSelectedServiceSlug(service.slug)} style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}><View style={styles.serviceIcon}><Text style={styles.serviceIconText}>{service.name.slice(0, 1)}</Text></View><View style={styles.serviceCopy}><Text style={styles.serviceName} numberOfLines={2}>{service.name}</Text><Text style={styles.serviceDesc} numberOfLines={1}>{service.shortDesc}</Text><Text style={styles.servicePrice}>{service.floorPrice ? `From ₹${service.floorPrice}` : 'Ask for quote'}</Text></View><Ionicons name="chevron-forward" size={15} color={colors.sage} /></Pressable>)}</View>
        {services.length === 0 ? <View style={styles.noResults}><Ionicons name="search-outline" size={24} color={colors.sage} /><Text style={styles.noResultsText}>No services match that search.</Text></View> : null}
      </> : <>
        <Pressable onPress={() => setSelectedServiceSlug(null)} style={styles.backLink}><Ionicons name="arrow-back" size={15} color={colors.teal} /><Text style={styles.backLinkText}>All services</Text></Pressable>
        <View style={styles.detailCard}><View style={styles.detailTop}><View style={styles.detailIcon}><Text style={styles.detailIconText}>{selected.name.slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={styles.detailTitle}>{selected.name}</Text><Text style={styles.detailDesc}>{selected.shortDesc}</Text></View><DemoPill /></View><View style={styles.detailBadges}><StatusPill label={selected.floorPrice ? `From ₹${selected.floorPrice}` : 'Cooperative quote'} /><StatusPill label={`${workers.length} verified`} tone="slate" /><StatusPill label="Insured" tone="green" /></View><View style={styles.included}><Text style={styles.includedTitle}>What is included</Text><Text style={styles.includedText}>Cooperative floor rate · Verified worker profile · Digital service record · Welfare contribution shown before booking</Text></View><View style={styles.detailActions}><Pressable style={styles.primaryAction} onPress={() => navigation.navigate('Map')}><Ionicons name="map-outline" size={15} color="#fff" /><Text style={styles.primaryText}>See on map</Text></Pressable><Pressable style={styles.secondaryAction} onPress={() => { setSelectedServiceSlug(null); setSearchQuery(''); }}><Text style={styles.secondaryText}>Change service</Text></Pressable></View></View>
        <SectionHeader title={`${selected.name}s near you`} action="Map view" onAction={() => navigation.navigate('Map')} />
        {workers.length ? workers.map((worker) => <MiniWorkerCard key={worker.id} worker={worker} saved={favoriteWorkerIds.includes(worker.id)} onToggleSaved={() => toggleFavorite(worker.id)} onPress={() => navigation.navigate('WorkerDetail', { workerId: worker.id })} onBook={() => navigation.navigate('Booking', { workerId: worker.id })} />) : <View style={styles.noResults}><Text style={styles.noResultsText}>No workers are available for this service right now.</Text></View>}
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 3 },
  headingIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5, maxWidth: 320 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingHorizontal: 12, minHeight: 44, marginTop: 15 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, paddingHorizontal: 8, paddingVertical: 9 },
  serviceGrid: { gap: 8 },
  serviceCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 11, flexDirection: 'row', alignItems: 'center' },
  serviceIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  serviceIconText: { color: colors.forest, fontSize: 18, fontWeight: '900' },
  serviceCopy: { flex: 1, minWidth: 0 },
  serviceName: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  serviceDesc: { color: colors.sage, fontSize: 10, marginTop: 2 },
  servicePrice: { color: colors.leaf, fontSize: 10, fontWeight: '900', marginTop: 4 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  noResults: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 20, alignItems: 'center' },
  noResultsText: { color: colors.sage, fontSize: 12, marginTop: 7 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 16, marginBottom: 8 },
  backLinkText: { color: colors.teal, fontSize: 12, fontWeight: '900' },
  detailCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14 },
  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  detailIconText: { color: colors.forest, fontSize: 22, fontWeight: '900' },
  detailTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  detailDesc: { color: colors.sage, fontSize: 11, marginTop: 3 },
  detailBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 13 },
  included: { backgroundColor: colors.mint, borderRadius: 12, padding: 11, marginTop: 13 },
  includedTitle: { color: colors.forest, fontSize: 11, fontWeight: '900' },
  includedText: { color: colors.ink, fontSize: 10, lineHeight: 15, marginTop: 4 },
  detailActions: { flexDirection: 'row', gap: 7, marginTop: 13 },
  primaryAction: { flex: 1, minHeight: 38, backgroundColor: colors.cta, borderRadius: 10, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  secondaryAction: { minHeight: 38, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: colors.ink, fontSize: 11, fontWeight: '900' },
});
