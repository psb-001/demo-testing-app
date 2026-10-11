import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LocationText } from '../../data/locationText';
import { formatOneLine, shortLocationLabel, workerServiceRadius } from '../../services/locationService';
import { geocodingService } from '../../services/geocodingService';
import { LeafletMapView, MapErrorOverlay } from '../map/LeafletMapView';
import { colors, radius } from '../../theme/theme';
import type { ServiceLocation } from '../../types';

/**
 * Map pin picker — ported from
 * workconnect/src/components/location/MapPickerMap.tsx (its Leaflet map) plus
 * the `MapPinPicker` wrapper (the draggable pin).
 *
 * This is a full-screen step rather than an inline expand, which suits a phone.
 *
 * Key point: reverse geocoding runs here in React Native, NOT inside the
 * WebView. That keeps exactly one Nominatim code path (one throttle, one cache,
 * one User-Agent) and avoids running network calls from injected HTML.
 */

export interface MapPickerMapProps {
  value: ServiceLocation;
  t: LocationText;
  onCancel: () => void;
  /** Called with the resolved point; the caller returns to the form. */
  onConfirm: (point: { lat: number; lng: number }) => void;
}

/** Fallback centre when the draft has no coordinates yet. */
const FALLBACK = { lat: 18.5308, lng: 73.8478 };

export function MapPickerMap({ value, t, onCancel, onConfirm }: MapPickerMapProps) {
  const insets = useSafeAreaInsets();
  const initial =
    value.latitude != null && value.longitude != null
      ? { lat: value.latitude, lng: value.longitude }
      : FALLBACK;

  const [point, setPoint] = useState(initial);
  const [address, setAddress] = useState<string | null>(value.formattedAddress ?? null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(false);
  const [mapError, setMapError] = useState(false);

  /**
   * Resolve a point to an address. Tapping the map fires continuously while the
   * user pans, so resolution is fire-and-forget and the label simply updates
   * when the latest answer arrives. `resolving` is set inside the async
   * callback chain rather than synchronously in the effect body, so this does
   * not cause a cascading render on every point change.
   */
  React.useEffect(() => {
    let cancelled = false;
    geocodingService
      .reverseDetails(point.lat, point.lng)
      .then((details) => {
        if (cancelled) return;
        setResolving(false);
        setResolveError(false);
        setAddress(details?.formattedAddress ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`);
      })
      .catch(() => {
        if (cancelled) return;
        setResolving(false);
        setResolveError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [point.lat, point.lng]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={onCancel} hitSlop={10} style={styles.close} accessibilityLabel={t.back}>
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{t.selectOnMap}</Text>
      </View>

      <View style={styles.mapWrap}>
        <LeafletMapView
          center={initial}
          zoom={15}
          draggablePin
          pin={{ lat: point.lat, lng: point.lng, label: address ?? t.selectOnMap }}
          onPinChange={(next) => {
            setResolving(true);
            setPoint(next);
          }}
          onLoadError={() => setMapError(true)}
          loadingLabel="Loading map…"
        />
        {mapError ? (
          <MapErrorOverlay
            message="Map tiles need an internet connection."
            hint="You can still enter your address as text."
          />
        ) : null}
        <View style={styles.hint} pointerEvents="none">
          <Ionicons name="hand-left-outline" size={12} color={colors.teal} />
          <Text style={styles.hintText}>{t.mapHint}</Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.addressBox}>
          <View style={styles.addressHead}>
            <Text style={styles.addressLabel}>{t.addressLine}</Text>
            {resolving ? <ActivityIndicator size="small" color={colors.cta} /> : null}
          </View>
          <Text style={styles.addressText} numberOfLines={3}>
            {address ?? t.addressLine}
          </Text>
          <Text style={styles.coords}>
            {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
          </Text>
          {resolveError ? <Text style={styles.error}>{t.gpsInaccurate}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.primaryBtn}
          onPress={() => onConfirm(point)}
        >
          <Text style={styles.primaryBtnText}>{t.useThisLocation}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Human-readable label for the current point, exported for the form summary. */
export function describePoint(point: { lat: number; lng: number }, loc: ServiceLocation): string {
  return formatOneLine(loc) || shortLocationLabel(loc) || `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`;
}

/** Service radius in km for the coverage overlay, when a worker is in context. */
export function radiusKm(worker: Parameters<typeof workerServiceRadius>[0]): number {
  return workerServiceRadius(worker);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '900' },
  mapWrap: { flex: 1, overflow: 'hidden' },
  hint: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  hintText: { color: colors.teal, fontSize: 10, fontWeight: '700', flex: 1 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, padding: 14, gap: 10 },
  addressBox: { backgroundColor: colors.warm, borderRadius: radius.md, padding: 11, gap: 4 },
  addressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressLabel: { color: colors.sage, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.3 },
  addressText: { color: colors.ink, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  coords: { color: colors.sage, fontSize: 9 },
  error: { color: '#B45309', fontSize: 10, fontWeight: '700' },
  primaryBtn: { backgroundColor: colors.cta, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
});