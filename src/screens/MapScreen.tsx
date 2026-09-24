import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { filterNearby, formatDistance, withComputedDistance, type WorkerWithDistance } from '../services/mapService';
import { StatusPill } from '../components/portal';

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const { userLocation, setUserLocation } = useAppState();
  const [trade, setTrade] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selected, setSelected] = useState<WorkerWithDistance | null>(null);
  const [locating, setLocating] = useState(false);
  const nearby = useMemo(() => {
    const all = filterNearby(withComputedDistance(WORKERS_LIST, userLocation), 30, 60);
    return all.filter((worker) => (trade === 'all' || worker.trade === trade) && (!emergencyOnly || worker.isEmergencyReady));
  }, [emergencyOnly, trade, userLocation]);
  const trades = useMemo(() => SERVICES_LIST.filter((service) => WORKERS_LIST.some((worker) => worker.trade === service.slug)).slice(0, 8), []);

  const useMyLocation = async () => {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const position = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, label: 'My GPS location' });
    }
    setLocating(false);
  };

  return (
    <View style={styles.root}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: userLocation.lat, longitude: userLocation.lng, latitudeDelta: 0.14, longitudeDelta: 0.14 }}
        region={{ latitude: userLocation.lat, longitude: userLocation.lng, latitudeDelta: 0.14, longitudeDelta: 0.14 }}
        onPress={(event) => { setSelected(null); setUserLocation({ lat: event.nativeEvent.coordinate.latitude, lng: event.nativeEvent.coordinate.longitude, label: 'Pinned service location' }); }}
      >
        <Marker coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }} title="Your service location" description={userLocation.label || 'Pune'} pinColor={colors.forest} />
        {nearby.map((worker) => <Marker key={worker.id} coordinate={{ latitude: worker.lat, longitude: worker.lng }} title={worker.name} description={`${worker.tradeLabel} · ${formatDistance(worker.computedDistanceKm)}`} pinColor={selected?.id === worker.id ? colors.forest : worker.isEmergencyReady ? colors.danger : colors.leaf} onPress={() => setSelected(worker)} />)}
      </MapView>
      <View style={styles.topOverlay}><View style={styles.overlayTitle}><Ionicons name="map" size={16} color={colors.forest} /><Text style={styles.overlayTitleText}>Nearby cooperative workers</Text></View><Pressable style={styles.locationButton} onPress={useMyLocation}><Ionicons name="locate" size={17} color={locating ? colors.sage : colors.forest} /></Pressable></View>
      <View style={styles.filterOverlay}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}><Pressable onPress={() => setTrade('all')} style={[styles.filterChip, trade === 'all' && styles.filterChipActive]}><Text style={[styles.filterText, trade === 'all' && styles.filterTextActive]}>All trades</Text></Pressable>{trades.map((service) => <Pressable key={service.slug} onPress={() => setTrade(service.slug)} style={[styles.filterChip, trade === service.slug && styles.filterChipActive]}><Text style={[styles.filterText, trade === service.slug && styles.filterTextActive]}>{service.name}</Text></Pressable>)}<Pressable onPress={() => setEmergencyOnly((value) => !value)} style={[styles.filterChip, emergencyOnly && styles.filterChipAlert]}><Ionicons name="flash" size={13} color={emergencyOnly ? colors.danger : colors.sage} /><Text style={[styles.filterText, emergencyOnly && { color: colors.danger }]}>Emergency</Text></Pressable></ScrollView></View>
      {selected ? <View style={styles.preview}><View style={styles.previewHandle} /><View style={styles.previewHeader}><View><Text style={styles.previewKicker}>SELECTED WORKER</Text><Text style={styles.previewName}>{selected.name}</Text></View><Pressable onPress={() => setSelected(null)}><Ionicons name="close" size={18} color={colors.sage} /></Pressable></View><Text style={styles.previewMeta}>{selected.tradeLabel} · {formatDistance(selected.computedDistanceKm)} · {selected.area}</Text><View style={styles.previewBottom}><StatusPill label={selected.isEmergencyReady ? 'Emergency ready' : selected.availableToday ? 'Available today' : 'Busy'} tone={selected.isEmergencyReady ? 'red' : selected.availableToday ? 'green' : 'slate'} /><View style={styles.previewActions}><Pressable style={styles.previewSecondary} onPress={() => navigation.navigate('WorkerDetail', { workerId: selected.id })}><Text style={styles.previewSecondaryText}>Passport</Text></Pressable><Pressable style={styles.previewPrimary} onPress={() => navigation.navigate('Booking', { workerId: selected.id })}><Text style={styles.previewPrimaryText}>Book ₹{selected.floorPrice}</Text></Pressable></View></View></View> : <View style={styles.bottomHint}><View style={styles.hintIcon}><Ionicons name="information-circle-outline" size={18} color={colors.leaf} /></View><Text style={styles.hintText}>{nearby.length} workers shown · tap a pin to preview, book, or open a passport</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm },
  topOverlay: { position: 'absolute', top: 12, left: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  overlayTitle: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  overlayTitleText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  locationButton: { width: 32, height: 32, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  filterOverlay: { position: 'absolute', top: 68, left: 0, right: 0 },
  filterContent: { paddingHorizontal: 12, gap: 6 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: colors.border, borderRadius: 17, paddingHorizontal: 10, paddingVertical: 7 },
  filterChipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  filterChipAlert: { backgroundColor: '#FFF0F0', borderColor: '#F2B8B8' },
  filterText: { color: colors.sage, fontSize: 9, fontWeight: '800' },
  filterTextActive: { color: '#fff' },
  preview: { position: 'absolute', left: 12, right: 12, bottom: 82, backgroundColor: '#fff', borderRadius: radius.lg, padding: 13, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 12, elevation: 7 },
  previewHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D5DEDA', alignSelf: 'center', marginBottom: 10 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  previewKicker: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  previewName: { color: colors.ink, fontSize: 15, fontWeight: '900', marginTop: 3 },
  previewMeta: { color: colors.sage, fontSize: 10, marginTop: 3 },
  previewBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 },
  previewActions: { flexDirection: 'row', gap: 6 },
  previewSecondary: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 8 },
  previewSecondaryText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  previewPrimary: { backgroundColor: colors.cta, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  previewPrimaryText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  bottomHint: { position: 'absolute', left: 12, right: 12, bottom: 82, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 13, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 8 },
  hintIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  hintText: { color: colors.ink, fontSize: 10, fontWeight: '800', flex: 1, lineHeight: 15 },
});
