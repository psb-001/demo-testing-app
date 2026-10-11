import React, { useCallback, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { OSM_TILE_URL } from '../../services/mapService';
import { colors } from '../../theme/theme';

/**
 * Reusable Leaflet map on a WebView.
 *
 * The app already renders OpenStreetMap tiles this way (`src/screens/MapScreen.tsx`),
 * and this component generalises it so the federation map and the service-address
 * picker can share one implementation instead of each writing their own
 * `buildMapHtml`.
 *
 * Two problems with the original approach are fixed here:
 *
 *  1. **No remounting.** `MapScreen` keys its WebView on the data, so every
 *     filter change and every pin move tore down the WebView, threw away the
 *     tile cache and re-initialised Leaflet. The HTML here is built once and the
 *     map is updated through an imperative JS bridge (`injectJavaScript`), so
 *     data changes never reload the page.
 *
 *  2. **Interactivity survives.** A picker needs a draggable pin and a circle
 *     overlay that persists across updates; with a full HTML rebuild there was
 *     no way to keep them.
 *
 * Reverse geocoding deliberately does NOT happen inside the WebView. It runs in
 * React Native (see `src/services/geocodingService.ts`) so there is a single
 * Nominatim code path with one throttle and one cache.
 */

export type MapCircle = {
  id: string;
  lat: number;
  lng: number;
  /** Radius in metres (Leaflet's native unit). */
  radiusM: number;
  color?: string;
  fillOpacity?: number;
  popup?: string;
};

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  /** Short body shown under the title in the popup. */
  subtitle?: string;
  color?: string;
  pulse?: boolean;
  selected?: boolean;
};

export interface LeafletMapHandle {
  /** Pan/zoom the map without remounting. */
  focus: (lat: number, lng: number, zoom?: number) => void;
  /** Fit the viewport to a set of points. */
  fitPoints: (points: { lat: number; lng: number }[], padding?: number) => void;
}

interface LeafletMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  circles?: MapCircle[];
  markers?: MapMarker[];
  /** Show a fixed centre pin (the customer / society location). */
  centerPin?: { label?: string; color?: string } | null;
  /** Enable a draggable pin; `onPinChange` fires on drag and on map tap. */
  draggablePin?: boolean;
  pin?: { lat: number; lng: number; label?: string } | null;
  onPinChange?: (point: { lat: number; lng: number }) => void;
  onMarkerPress?: (id: string) => void;
  onMapPress?: (point: { lat: number; lng: number }) => void;
  /** Rendered over the map while it loads. */
  loadingLabel?: string;
  style?: object;
  onLoadError?: () => void;
}

/** Escape a value for safe interpolation into the inline `<script>`. */
function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/** Wrap a payload in the script tag that `injectJavaScript` expects. */
function call(fn: string, ...args: unknown[]): string {
  return `window.${fn}(${args.map((a) => jsonForHtml(a)).join(',')});true;`;
}

export const LeafletMapView = forwardRef<LeafletMapHandle, LeafletMapProps>(function LeafletMapView(
  {
    center,
    zoom = 12,
    circles,
    markers,
    centerPin,
    draggablePin = false,
    pin,
    onPinChange,
    onMarkerPress,
    onMapPress,
    loadingLabel = 'Loading OpenStreetMap…',
    style,
    onLoadError,
  },
  ref,
) {
  const webRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  /**
   * Built once. Later prop changes are pushed over the JS bridge, so this HTML
   * deliberately embeds only the initial view state.
   */
  const html = useMemo(
    () =>
      buildMapHtml({
        center,
        zoom,
        circles: circles ?? [],
        markers: markers ?? [],
        centerPin: centerPin ?? null,
        draggablePin,
        pin: pin ?? null,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally mount-only
    [],
  );

  const inject = useCallback((script: string) => {
    webRef.current?.injectJavaScript(script);
  }, []);

  const focus = useCallback(
    (lat: number, lng: number, nextZoom?: number) => inject(call('__focus', lat, lng, nextZoom ?? null)),
    [inject],
  );

  const fitPoints = useCallback(
    (points: { lat: number; lng: number }[], padding = 48) => inject(call('__fit', points, padding)),
    [inject],
  );

  useImperativeHandle(ref, () => ({ focus, fitPoints }), [focus, fitPoints]);

  // Push prop changes across the bridge once the page is listening.
  React.useEffect(() => {
    if (!ready || !markers) return;
    inject(call('__setMarkers', markers));
  }, [ready, markers, inject]);

  React.useEffect(() => {
    if (!ready || !circles) return;
    inject(call('__setCircles', circles));
  }, [ready, circles, inject]);

  React.useEffect(() => {
    if (!ready) return;
    inject(call('__setPin', pin ?? null));
  }, [ready, pin, inject]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type: string;
        id?: string;
        lat?: number;
        lng?: number;
      };
      switch (message.type) {
        case 'ready':
          setReady(true);
          break;
        case 'marker':
          if (message.id) onMarkerPress?.(message.id);
          break;
        case 'pin':
        case 'map':
          if (typeof message.lat === 'number' && typeof message.lng === 'number') {
            onPinChange?.({ lat: message.lat, lng: message.lng });
            onMapPress?.({ lat: message.lat, lng: message.lng });
          }
          break;
        default:
          break;
      }
    } catch {
      // A malformed message means the page script threw; surface it as a load error.
      onLoadError?.();
    }
  };

  return (
    <View style={[styles.root, style]}>
      <WebView
        ref={webRef}
        source={{ html, baseUrl: 'https://unpkg.com' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        // The map owns its gestures; a parent ScrollView must not steal pans.
        nestedScrollEnabled
        onMessage={handleMessage}
        onLoadEnd={() => setReady(true)}
        onError={onLoadError}
        setSupportMultipleWindows={false}
      />
      {!ready ? (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color={colors.forest} />
          <Text style={styles.loadingText}>{loadingLabel}</Text>
        </View>
      ) : null}
    </View>
  );
});

/* ── The injected page ─────────────────────────────────────────────────── */

function buildMapHtml(opts: {
  center: { lat: number; lng: number };
  zoom: number;
  circles: MapCircle[];
  markers: MapMarker[];
  centerPin: { label?: string; color?: string } | null;
  draggablePin: boolean;
  pin: { lat: number; lng: number; label?: string } | null;
}): string {
  const { center, zoom, circles, markers, centerPin, draggablePin, pin } = opts;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { width: 100%; height: 100%; margin: 0; background: #eef3ef; }
  .leaflet-control-attribution { font-size: 9px; }
  .pin { box-sizing: border-box; border: 2px solid #fff; box-shadow: 0 2px 7px rgba(24,50,42,.35); }
  .pin-teardrop { width: 22px; height: 22px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); }
  .pin-dot { width: 20px; height: 20px; border-radius: 50%; }
  .pin-selected { width: 28px; height: 28px; }
  .pin-drag { width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); cursor: grab; }
  .pin-pulse { animation: pulse 1.6s ease-out infinite; }
  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(22,138,91,.55); }
    70%  { box-shadow: 0 0 0 14px rgba(22,138,91,0); }
    100% { box-shadow: 0 0 0 0 rgba(22,138,91,0); }
  }
  .leaflet-popup-content { font-family: -apple-system, system-ui, sans-serif; font-size: 12px; }
  .leaflet-popup-content b { font-size: 13px; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function () {
  var tileUrl = ${jsonForHtml(OSM_TILE_URL)};
  var BRAND = '#168A5B';
  var FOREST = '#14532D';
  var AMBER = '#D97706';

  var map = L.map('map', { zoomControl: false, attributionControl: true })
    .setView([${center.lat}, ${center.lng}], ${zoom});
  L.tileLayer(tileUrl, { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  var markerLayer = L.layerGroup().addTo(map);
  var circleLayer = L.layerGroup().addTo(map);
  var markerIndex = {};
  var circleIndex = {};

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(color, selected, pulse) {
    var cls = 'pin pin-teardrop' + (selected ? ' pin-selected' : '') + (pulse ? ' pin-pulse' : '');
    return L.divIcon({
      className: '',
      html: '<div class="' + cls + '" style="background:' + (color || BRAND) + '"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 22],
      popupAnchor: [0, -20],
    });
  }

  window.__setMarkers = function (list) {
    markerLayer.clearLayers();
    markerIndex = {};
    (list || []).forEach(function (m) {
      var marker = L.marker([m.lat, m.lng], { icon: icon(m.color, m.selected, m.pulse) }).addTo(markerLayer);
      var html = '<b>' + escapeHtml(m.title) + '</b>' + (m.subtitle ? '<br>' + escapeHtml(m.subtitle) : '');
      marker.bindPopup(html);
      marker.on('click', function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker', id: m.id }));
      });
      markerIndex[m.id] = marker;
    });
  };

  window.__setCircles = function (list) {
    circleLayer.clearLayers();
    circleIndex = {};
    (list || []).forEach(function (c) {
      var circle = L.circle([c.lat, c.lng], {
        radius: c.radiusM,
        color: c.color || BRAND,
        weight: 1.5,
        fillColor: c.color || BRAND,
        fillOpacity: c.fillOpacity == null ? 0.12 : c.fillOpacity,
      }).addTo(circleLayer);
      if (c.popup) circle.bindPopup(escapeHtml(c.popup));
      circleIndex[c.id] = circle;
    });
  };

  window.__focus = function (lat, lng, z) {
    if (typeof z === 'number' && z > 0) map.setView([lat, lng], z);
    else map.setView([lat, lng], map.getZoom());
  };

  window.__fit = function (points, padding) {
    if (!points || !points.length) return;
    if (points.length === 1) { map.setView([points[0].lat, points[0].lng], 13); return; }
    var bounds = L.latLngBounds(points.map(function (p) { return [p.lat, p.lng]; }));
    map.fitBounds(bounds, { padding: [padding || 48, padding || 48], maxZoom: 13 });
  };

  // Fixed centre pin (customer or society location).
  if (${jsonForHtml(centerPin)}) {
    L.marker([${center.lat}, ${center.lng}], {
      icon: L.divIcon({
        className: '',
        html: '<div class="pin pin-dot" style="background:' + (${jsonForHtml(centerPin)}['color'] || FOREST) + '"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).addTo(map).bindPopup(escapeHtml((${jsonForHtml(centerPin)}['label'] || 'Location'))).openPopup();
  }

  // Draggable pin for the service-address picker.
  if (${draggablePin ? 'true' : 'false'}) {
    var initialPin = ${jsonForHtml(pin)};
    if (initialPin) {
      var dragIcon = L.divIcon({
        className: '',
        html: '<div class="pin pin-drag" style="background:' + AMBER + '"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -24],
      });
      var dragMarker = L.marker([initialPin.lat, initialPin.lng], { icon: dragIcon, draggable: true }).addTo(map);
      dragMarker.bindPopup(escapeHtml(initialPin.label || 'Service location'));
      dragMarker.on('dragend', function (e) {
        var ll = e.target.getLatLng();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pin', lat: ll.lat, lng: ll.lng }));
      });
      map.on('click', function (event) {
        dragMarker.setLatLng(event.latlng);
        dragMarker.openPopup();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'map', lat: event.latlng.lat, lng: event.latlng.lng }));
      });
    }
  } else {
    map.on('click', function (event) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'map', lat: event.latlng.lat, lng: event.latlng.lng }));
    });
  }

  window.__setMarkers(${jsonForHtml(markers)});
  window.__setCircles(${jsonForHtml(circles)});

  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
})();
</script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm, overflow: 'hidden' },
  loading: { position: 'absolute', top: '42%', left: 0, right: 0, alignItems: 'center' },
  loadingText: { color: colors.sage, fontSize: 10, marginTop: 8 },
  error: { position: 'absolute', top: '42%', left: 24, right: 24, backgroundColor: '#FFF7F7', borderWidth: 1, borderColor: '#F2B8B8', borderRadius: 12, padding: 14, alignItems: 'center' },
  errorText: { color: colors.danger, fontSize: 11, fontWeight: '800', marginTop: 6 },
  errorHint: { color: colors.sage, fontSize: 10, marginTop: 3 },
});

/** Shared overlay used by screens that host the map. */
export function MapErrorOverlay({ message, hint }: { message: string; hint?: string }) {
  return (
    <View style={styles.error} pointerEvents="none">
      <Ionicons name="cloud-offline-outline" size={22} color={colors.danger} />
      <Text style={styles.errorText}>{message}</Text>
      {hint ? <Text style={styles.errorHint}>{hint}</Text> : null}
    </View>
  );
}