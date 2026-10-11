import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_DENSITY,
  FED_MAP_LEGEND,
  FED_TOTAL_WORKERS,
  demandColor,
  type AreaDensity,
  type DemandLevel,
} from '../fedData';
import { CHART_COLORS, HBarList } from '../fedCharts';
import {
  LeafletMapView,
  MapErrorOverlay,
  type LeafletMapHandle,
  type MapCircle,
  type MapMarker,
} from '../../../components/map/LeafletMapView';
import {
  ActBtn,
  Card2,
  Chip,
  CoopDemoTag,
  DetailStat,
  FederationKpiCard,
  FedScreen,
  FilterSelect,
  Grid,
  KV,
  ProgressRow,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
  ToggleRow,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation Workforce Map — ported from
 * workconnect/src/portals/fed/screens/FederationMap.tsx.
 *
 * The web screen used `react-leaflet` (DOM-only). Here it reuses the app's
 * existing Leaflet-in-WebView map via `LeafletMapView`, which also means the
 * demand `Circle` overlays and society markers are driven by the same imperative
 * bridge rather than a full HTML rebuild.
 *
 * Circle radii are metres, exactly as on the web: 1,350 / 2,050 / 850 by demand
 * tier. The "Workforce Clusters" table below became a card list.
 */

type Layer = 'demand' | 'availability' | 'societies';

/** Coverage radius in metres per demand tier (Leaflet uses metres natively). */
const DEMAND_RADIUS_M: Record<DemandLevel, number> = {
  'Very High': 2050,
  High: 1350,
  Medium: 850,
  Low: 850,
  Stable: 850,
};

const TRADE_OPTIONS: SelectOption[] = [
  { label: 'All trades', value: '' },
  { label: 'Electrician', value: 'Electrician' },
  { label: 'Plumber', value: 'Plumber' },
  { label: 'Carpenter', value: 'Carpenter' },
  { label: 'Cleaner', value: 'Cleaner' },
  { label: 'Technician', value: 'Technician' },
];

function societyOptions(areas: AreaDensity[]): SelectOption[] {
  const unique = [...new Set(areas.map((a) => a.area))].sort();
  return [{ label: 'All localities', value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationMap: React.FC = () => {
  const { go } = useFedStore();
  const t = useFedT();
  const mapRef = useRef<LeafletMapHandle>(null);

  const [trade, setTrade] = useState('');
  const [availability, setAvailability] = useState('');
  const [area, setArea] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [layer, setLayer] = useState<Layer>('demand');
  const [selected, setSelected] = useState<AreaDensity | null>(null);
  const [mapError, setMapError] = useState(false);

  const filtered = useMemo(
    () =>
      FED_DENSITY.filter((a) => {
        if (trade && !a.trades.includes(trade)) return false;
        if (area && a.area !== area) return false;
        if (emergencyOnly && a.emergencyReady === 0) return false;
        if (verifiedOnly && a.verified === 0) return false;
        if (availability) {
          const ratio = a.workerCount ? a.available / a.workerCount : 0;
          if (availability === 'high' && ratio < 0.3) return false;
          if (availability === 'medium' && (ratio < 0.15 || ratio >= 0.3)) return false;
          if (availability === 'low' && ratio >= 0.15) return false;
        }
        return true;
      }),
    [trade, area, emergencyOnly, verifiedOnly, availability],
  );

  /** Circles and markers are derived from the active layer. */
  const circles = useMemo<MapCircle[]>(() => {
    if (layer === 'societies') return [];
    return filtered.map((a) => ({
      id: a.area,
      lat: a.lat,
      lng: a.lng,
      radiusM: layer === 'demand' ? DEMAND_RADIUS_M[a.demand] : DEMAND_RADIUS_M.Stable,
      color: layer === 'demand' ? demandColor(a.demand) : CHART_COLORS.brand,
      fillOpacity: layer === 'demand' ? 0.13 : 0.09,
      popup: `${a.area} · ${a.workerCount} workers · ${a.demand} demand`,
    }));
  }, [filtered, layer]);

  const markers = useMemo<MapMarker[]>(() => {
    if (layer !== 'societies') return [];
    return filtered.map((a) => ({
      id: a.area,
      lat: a.lat,
      lng: a.lng,
      title: a.area,
      subtitle: `${a.workerCount} workers · ${a.available} available · ${a.societyIds.length} societies`,
      color: demandColor(a.demand),
      pulse: selected?.area === a.area,
      selected: selected?.area === a.area,
    }));
  }, [filtered, layer, selected]);

  const totalWorkers = filtered.reduce((s, a) => s + a.workerCount, 0);
  const totalAvailable = filtered.reduce((s, a) => s + a.available, 0);
  const totalEmergency = filtered.reduce((s, a) => s + a.emergencyReady, 0);

  const onMarkerPress = (id: string) => {
    const match = filtered.find((a) => a.area === id);
    if (match) setSelected(match);
  };

  const focusArea = (areaRow: AreaDensity) => {
    setSelected(areaRow);
    mapRef.current?.focus(areaRow.lat, areaRow.lng, 13);
  };

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_map')}
        subtitle="Workforce availability and service demand by locality across the federation."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="46%">
        <FederationKpiCard label="Localities" value={`${filtered.length}`} sub="mapped areas" tone="green" icon="map-outline" />
        <FederationKpiCard label="Workers" value={totalWorkers.toLocaleString('en-IN')} sub={`of ${FED_TOTAL_WORKERS.toLocaleString('en-IN')}`} tone="blue" icon="people-outline" />
        <FederationKpiCard label="Available" value={totalAvailable.toLocaleString('en-IN')} sub="available today" tone="green" icon="checkmark-circle-outline" />
        <FederationKpiCard label="Emergency ready" value={`${totalEmergency}`} sub="verified on-call" tone="red" icon="flash-outline" />
      </Grid>

      <Card2 style={{ gap: 9 }}>
        <Grid minWidth="31%">
          <FilterSelect label="Trade" value={trade} options={TRADE_OPTIONS} onChange={setTrade} allLabel="All trades" />
          <FilterSelect label="Availability" value={availability} options={[{ label: 'High (>30%)', value: 'high' }, { label: 'Medium (15–30%)', value: 'medium' }, { label: 'Low (<15%)', value: 'low' }]} onChange={setAvailability} allLabel="Any" />
          <FilterSelect label="Locality" value={area} options={societyOptions(FED_DENSITY)} onChange={setArea} allLabel="All localities" />
        </Grid>
        <ToggleRow label="Emergency ready only" hint="Only localities with verified on-call workers" value={emergencyOnly} onChange={setEmergencyOnly} />
        <ToggleRow label="Fully verified only" hint="Only localities with verified members" value={verifiedOnly} onChange={setVerifiedOnly} />
      </Card2>

      <Card2 style={{ gap: 10 }}>
        <SectionTitle hint="Switch what the map shows.">Map layer</SectionTitle>
        <Row wrap>
          <Chip active={layer === 'demand'} onPress={() => setLayer('demand')}>Service demand</Chip>
          <Chip active={layer === 'availability'} onPress={() => setLayer('availability')}>Workforce availability</Chip>
          <Chip active={layer === 'societies'} onPress={() => setLayer('societies')}>Society network</Chip>
        </Row>
        {layer !== 'societies' ? (
          <Row wrap>
            {FED_MAP_LEGEND.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </Row>
        ) : null}
      </Card2>

      <Card2 style={{ gap: 0, padding: 0, overflow: 'hidden' }}>
        <LeafletMapView
          ref={mapRef}
          style={styles.map}
          center={{ lat: 18.5204, lng: 73.8567 }}
          zoom={11}
          circles={circles}
          markers={markers}
          onMarkerPress={onMarkerPress}
          onLoadError={() => setMapError(true)}
          loadingLabel="Loading federation map…"
        />
        {mapError ? (
          <MapErrorOverlay message="Map tiles need an internet connection." hint="The locality data below still works." />
        ) : null}
      </Card2>

      {selected ? (
        <Card2 style={styles.selectedCard}>
          <Row>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.selectedTitle} numberOfLines={1}>{selected.area}</Text>
              <Text style={styles.selectedMeta} numberOfLines={1}>{selected.trades.join(' · ')}</Text>
            </View>
            <StatusBadge value={selected.demand} />
          </Row>
          <Grid minWidth="30%" style={{ marginTop: 10 }}>
            <DetailStat label="Workers" value={`${selected.workerCount}`} />
            <DetailStat label="Available" value={`${selected.available}`} tone="green" />
            <DetailStat label="Verified" value={`${selected.verified}`} tone="blue" />
            <DetailStat label="Emergency" value={`${selected.emergencyReady}`} tone="red" />
          </Grid>
          <ProgressRow
            label="Availability ratio"
            pct={selected.workerCount ? (selected.available / selected.workerCount) * 100 : 0}
            right={`${selected.workerCount ? Math.round((selected.available / selected.workerCount) * 100) : 0}%`}
          />
          <Row wrap>
            {selected.trades.map((tradeName) => (
              <View key={tradeName} style={styles.tradeChip}>
                <Text style={styles.tradeChipText}>{tradeName}</Text>
              </View>
            ))}
          </Row>
          <Row wrap>
            <ActBtn label="View workers" tone="ghost" onPress={() => go('workforce')} style={{ flex: 1 }} />
            <ActBtn label="Allocate" icon="sparkles" onPress={() => go('allocation')} style={{ flex: 1 }} />
          </Row>
        </Card2>
      ) : null}

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Worker density and availability by locality.">Workforce clusters</SectionTitle>
        <HBarList
          rows={filtered.map((a) => ({
            label: a.area,
            value: a.workerCount,
            max: Math.max(...filtered.map((x) => x.workerCount)),
            right: `${a.workerCount} workers`,
            tone: demandColor(a.demand),
          }))}
        />
      </Card2>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No localities match these filters">
        {filtered.map((a) => (
          <RecordCard
            key={a.area}
            title={a.area}
            subtitle={a.trades.join(' · ')}
            badge={{ label: a.demand }}
            onPress={() => focusArea(a)}
            fields={[
              { label: 'Workers', value: `${a.workerCount}` },
              { label: 'Available', value: `${a.available}` },
              { label: 'Verified', value: `${a.verified}` },
              { label: 'Emergency', value: `${a.emergencyReady}` },
              { label: 'Societies', value: `${a.societyIds.length}` },
              { label: 'Coordinates', value: `${a.lat.toFixed(2)}, ${a.lng.toFixed(2)}` },
            ]}
          />
        ))}
      </RecordList>

      <Card2 style={{ gap: 4 }}>
        <KV k="Localities mapped" v={`${filtered.length} of ${FED_DENSITY.length}`} mono />
        <KV k="Workers in view" v={totalWorkers.toLocaleString('en-IN')} mono />
        <KV k="Active layer" v={layer === 'demand' ? 'Service demand' : layer === 'availability' ? 'Workforce availability' : 'Society network'} />
      </Card2>
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  map: { height: 340, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: colors.sage, fontSize: 10, fontWeight: '700' },
  selectedCard: { borderColor: colors.cta, backgroundColor: '#F7FCF9' },
  selectedTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  selectedMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  tradeChip: { backgroundColor: colors.mint, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  tradeChipText: { color: colors.forest, fontSize: 10, fontWeight: '800' },
});