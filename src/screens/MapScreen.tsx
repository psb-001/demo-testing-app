import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { filterNearby, formatDistance, OSM_TILE_URL, withComputedDistance, type WorkerWithDistance } from '../services/mapService';
import { StatusPill } from '../components/portal';

function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildMapHtml(userLocation: { lat: number; lng: number; label?: string }, workers: WorkerWithDistance[], selectedId?: string): string {
  const mapWorkers = workers.map((worker) => ({
    id: worker.id,
    name: worker.name,
    trade: worker.tradeLabel,
    area: worker.area,
    lat: worker.lat,
    lng: worker.lng,
    distance: worker.computedDistanceKm,
    floorPrice: worker.floorPrice,
    emergency: worker.isEmergencyReady,
    available: worker.availableToday,
  }));
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
html, body, #map { width: 100%; height: 100%; margin: 0; background: #eef3ef; }
.leaflet-control-attribution { font-size: 9px; }
.worker-pin, .user-pin { box-sizing: border-box; border: 2px solid #fff; box-shadow: 0 2px 7px rgba(24,50,42,.35); }
.worker-pin { width: 22px; height: 22px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #2e8b57; }
.worker-pin.selected { width: 28px; height: 28px; background: #14532d; }
.worker-pin.emergency { background: #d97706; }
.user-pin { width: 20px; height: 20px; border-radius: 50%; background: #14532d; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const userLocation = ${jsonForHtml(userLocation)};
const workers = ${jsonForHtml(mapWorkers)};
const selectedId = ${jsonForHtml(selectedId || null)};
const tileUrl = ${jsonForHtml(OSM_TILE_URL)};
const map = L.map('map', { zoomControl: false, attributionControl: true }).setView([userLocation.lat, userLocation.lng], 12);
L.tileLayer(tileUrl, { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);
const bounds = [];
const userIcon = L.divIcon({ className: '', html: '<div class="user-pin"></div>', iconSize: [20, 20], iconAnchor: [10, 10] });
L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup(userLocation.label || 'Your service location').openPopup();
workers.forEach((worker) => {
  const icon = L.divIcon({ className: '', html: '<div class="worker-pin ' + (worker.id === selectedId ? 'selected ' : '') + (worker.emergency ? 'emergency' : '') + '"></div>', iconSize: [22, 22], iconAnchor: [11, 22] });
  const marker = L.marker([worker.lat, worker.lng], { icon }).addTo(map).bindPopup('<strong>' + worker.name + '</strong><br>' + worker.trade + ' · ' + worker.area + '<br>₹' + worker.floorPrice + ' · ' + worker.distance + ' km');
  marker.on('click', () => window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'worker', id: worker.id })));
  bounds.push([worker.lat, worker.lng]);
});
if (bounds.length) { bounds.push([userLocation.lat, userLocation.lng]); map.fitBounds(bounds, { padding: [42, 42], maxZoom: 13 }); }
map.on('click', (event) => window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'map', lat: event.latlng.lat, lng: event.latlng.lng })));
window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
</script>
</body>
</html>`;
}

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const { userLocation, setUserLocation } = useAppState();
  const [trade, setTrade] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selected, setSelected] = useState<WorkerWithDistance | null>(null);
  const [locating, setLocating] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const nearby = useMemo(() => {
    const all = filterNearby(withComputedDistance(WORKERS_LIST, userLocation), 30, 60);
    return all.filter((worker) => (trade === 'all' || worker.trade === trade) && (!emergencyOnly || worker.isEmergencyReady));
  }, [emergencyOnly, trade, userLocation]);
  const trades = useMemo(() => SERVICES_LIST.filter((service) => WORKERS_LIST.some((worker) => worker.trade === service.slug)).slice(0, 8), []);
  const mapHtml = useMemo(() => buildMapHtml(userLocation, nearby, selected?.id), [nearby, selected?.id, userLocation]);

  const useMyLocation = async () => {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const position = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, label: 'My GPS location' });
    }
    setLocating(false);
  };

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type: string; id?: string; lat?: number; lng?: number };
      if (message.type === 'ready') setMapLoading(false);
      if (message.type === 'worker' && message.id) setSelected(nearby.find((worker) => worker.id === message.id) || null);
      if (message.type === 'map' && typeof message.lat === 'number' && typeof message.lng === 'number') {
        setSelected(null);
        setUserLocation({ lat: message.lat, lng: message.lng, label: 'Pinned service location' });
      }
    } catch {
      setMapError(true);
    }
  };

  return (
    <View style={styles.root}>
      <WebView
        key={`${userLocation.lat}-${userLocation.lng}-${trade}-${emergencyOnly}-${selected?.id || 'none'}`}
        source={{ html: mapHtml }}
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        onLoadEnd={() => setMapLoading(false)}
        onError={() => { setMapLoading(false); setMapError(true); }}
      />
      {mapLoading && <View style={styles.mapLoading}><ActivityIndicator color={colors.forest} /><Text style={styles.mapLoadingText}>Loading OpenStreetMap…</Text></View>}
      {mapError && <View style={styles.mapError}><Ionicons name="cloud-offline-outline" size={22} color={colors.danger} /><Text style={styles.mapErrorText}>Map tiles need an internet connection.</Text><Text style={styles.mapErrorHint}>Worker list and booking still work below.</Text></View>}
      <View style={styles.topOverlay}><View style={styles.overlayTitle}><Ionicons name="map" size={16} color={colors.forest} /><Text style={styles.overlayTitleText}>Nearby cooperative workers</Text></View><Pressable style={styles.locationButton} onPress={useMyLocation}><Ionicons name="locate" size={17} color={locating ? colors.sage : colors.forest} /></Pressable></View>
      <View style={styles.filterOverlay}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}><Pressable onPress={() => setTrade('all')} style={[styles.filterChip, trade === 'all' && styles.filterChipActive]}><Text style={[styles.filterText, trade === 'all' && styles.filterTextActive]}>All trades</Text></Pressable>{trades.map((service) => <Pressable key={service.slug} onPress={() => { setTrade(service.slug); setSelected(null); }} style={[styles.filterChip, trade === service.slug && styles.filterChipActive]}><Text style={[styles.filterText, trade === service.slug && styles.filterTextActive]}>{service.name}</Text></Pressable>)}<Pressable onPress={() => { setEmergencyOnly((value) => !value); setSelected(null); }} style={[styles.filterChip, emergencyOnly && styles.filterChipAlert]}><Ionicons name="flash" size={13} color={emergencyOnly ? colors.danger : colors.sage} /><Text style={[styles.filterText, emergencyOnly && { color: colors.danger }]}>Emergency</Text></Pressable></ScrollView></View>
      {selected ? <View style={styles.preview}><View style={styles.previewHandle} /><View style={styles.previewHeader}><View><Text style={styles.previewKicker}>SELECTED WORKER</Text><Text style={styles.previewName}>{selected.name}</Text></View><Pressable onPress={() => setSelected(null)}><Ionicons name="close" size={18} color={colors.sage} /></Pressable></View><Text style={styles.previewMeta}>{selected.tradeLabel} · {formatDistance(selected.computedDistanceKm)} · {selected.area}</Text><View style={styles.previewBottom}><StatusPill label={selected.isEmergencyReady ? 'Emergency ready' : selected.availableToday ? 'Available today' : 'Busy'} tone={selected.isEmergencyReady ? 'red' : selected.availableToday ? 'green' : 'slate'} /><View style={styles.previewActions}><Pressable style={styles.previewSecondary} onPress={() => navigation.navigate('WorkerDetail', { workerId: selected.id })}><Text style={styles.previewSecondaryText}>Passport</Text></Pressable><Pressable style={styles.previewPrimary} onPress={() => navigation.navigate('Booking', { workerId: selected.id })}><Text style={styles.previewPrimaryText}>Book ₹{selected.floorPrice}</Text></Pressable></View></View></View> : <View style={styles.bottomHint}><View style={styles.hintIcon}><Ionicons name="information-circle-outline" size={18} color={colors.leaf} /></View><Text style={styles.hintText}>{nearby.length} workers shown · tap a pin to preview, book, or open a passport</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm },
  mapLoading: { position: 'absolute', top: '46%', left: 0, right: 0, alignItems: 'center' },
  mapLoadingText: { color: colors.sage, fontSize: 10, marginTop: 8 },
  mapError: { position: 'absolute', top: '42%', left: 24, right: 24, backgroundColor: '#FFF7F7', borderWidth: 1, borderColor: '#F2B8B8', borderRadius: 12, padding: 14, alignItems: 'center' },
  mapErrorText: { color: colors.danger, fontSize: 11, fontWeight: '800', marginTop: 6 },
  mapErrorHint: { color: colors.sage, fontSize: 10, marginTop: 3 },
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
