import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_DEMAND_FORECAST,
  FED_FORECAST_NOTE,
  FED_FORECAST_SERIES,
} from '../fedData';
import { CHART_COLORS, GroupedBarChart, HBarList, LegendRow, LineChart } from '../fedCharts';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  DetailStat,
  FederationAlert,
  FedScreen,
  FilterSelect,
  Grid,
  KV,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Demand Forecast — ported from
 * workconnect/src/portals/fed/screens/Forecast.tsx.
 *
 * The horizon control (7d / 30d / 60d) multiplies the per-trade series on the
 * web; the same multiplier is applied here. The chart's three-phase colouring
 * (historical / current / predicted) is preserved through `colorMap`.
 */

const HORIZONS = [
  { id: '7d', label: 'Next 7 days', multiplier: 1 },
  { id: '30d', label: 'Next 30 days', multiplier: 1.6 },
  { id: '60d', label: 'Next 60 days', multiplier: 2.2 },
] as const;

type HorizonId = (typeof HORIZONS)[number]['id'];

function optionsFrom(values: (string | undefined)[], allLabel: string): SelectOption[] {
  const unique = [...new Set(values.filter((v): v is string => !!v))].sort();
  return [{ label: allLabel, value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationForecast: React.FC = () => {
  const { go, showToast } = useFedStore();
  const t = useFedT();

  const [horizon, setHorizon] = useState<HorizonId>('7d');
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notified, setNotified] = useState(false);

  const tradeOptions = useMemo(() => optionsFrom(FED_DEMAND_FORECAST.map((r) => r.trade), 'All trades'), []);
  const locationOptions = useMemo(() => optionsFrom(FED_DEMAND_FORECAST.map((r) => r.location), 'All locations'), []);
  const dateOptions = useMemo(() => optionsFrom(FED_DEMAND_FORECAST.map((r) => r.date), 'All dates'), []);
  const timeOptions = useMemo(() => optionsFrom(FED_DEMAND_FORECAST.map((r) => r.time), 'All times'), []);

  const filtered = useMemo(
    () =>
      FED_DEMAND_FORECAST.filter((r) => {
        if (trade && r.trade !== trade) return false;
        if (location && r.location !== location) return false;
        if (date && r.date !== date) return false;
        if (time && r.time !== time) return false;
        return true;
      }),
    [trade, location, date, time],
  );

  const active = HORIZONS.find((h) => h.id === horizon) ?? HORIZONS[0];
  const scaled = filtered.map((r) => ({
    ...r,
    available: Math.round(r.available * active.multiplier),
  }));

  const hasFilters = !!(trade || location || date || time);
  const clearFilters = () => {
    setTrade('');
    setLocation('');
    setDate('');
    setTime('');
  };

  const totalDemand = scaled.reduce((sum, r) => sum + (r.available - r.gap * active.multiplier), 0);
  const totalAvailable = scaled.reduce((sum, r) => sum + r.available, 0);
  const totalGap = Math.round(totalDemand - totalAvailable);
  const topShortage = [...filtered].sort((a, b) => a.gap - b.gap)[0];

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_forecast')}
        subtitle="Expected service demand against available workforce, by trade and locality."
        tag={<CoopDemoTag />}
      />

      <Row wrap>
        {HORIZONS.map((h) => (
          <ActBtn
            key={h.id}
            label={h.label}
            tone={horizon === h.id ? 'dark' : 'ghost'}
            onPress={() => setHorizon(h.id)}
          />
        ))}
      </Row>

      <Card2 style={{ gap: 9 }}>
        <Grid minWidth="31%">
          <FilterSelect label="Trade" value={trade} options={tradeOptions} onChange={setTrade} allLabel="All trades" />
          <FilterSelect label="Location" value={location} options={locationOptions} onChange={setLocation} allLabel="All locations" />
          <FilterSelect label="Date" value={date} options={dateOptions} onChange={setDate} allLabel="All dates" />
          <FilterSelect label="Time" value={time} options={timeOptions} onChange={setTime} allLabel="All times" />
        </Grid>
        {hasFilters ? <ActBtn label="Clear filters" tone="ghost" onPress={clearFilters} style={{ alignSelf: 'flex-start' }} /> : null}
      </Card2>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Expected demand versus available workforce for the selected horizon.">
          Demand vs workforce
        </SectionTitle>
        <GroupedBarChart
          rows={scaled.map((r) => ({
            label: r.trade,
            primary: Math.max(0, Math.round(r.available - r.gap * active.multiplier)),
            secondary: r.available,
            primaryLabel: 'Demand',
            secondaryLabel: 'Available',
          }))}
        />
      </Card2>

      <Card2 style={styles.aiCard}>
        <SectionTitle>AI Recommendation</SectionTitle>
        {topShortage ? (
          <>
            <Text style={styles.aiLead}>
              {topShortage.trade} demand in {topShortage.location} is projected to exceed available workforce by{' '}
              {Math.abs(Math.round(topShortage.gap * active.multiplier))} over {active.label.toLowerCase()}.
            </Text>
            <Grid minWidth="30%" style={{ marginTop: 12 }}>
              <DetailStat label="Expected demand" value={`${Math.round(totalDemand).toLocaleString('en-IN')}`} tone="amber" />
              <DetailStat label="Available" value={totalAvailable.toLocaleString('en-IN')} tone="green" />
              <DetailStat label="Net gap" value={`${totalGap > 0 ? '+' : ''}${totalGap.toLocaleString('en-IN')}`} tone={totalGap > 0 ? 'red' : 'green'} />
            </Grid>
            <View style={{ marginTop: 14, gap: 7 }}>
              {[
                'Prioritise allocation of underutilized ' + (topShortage.trade.toLowerCase()) + ' members.',
                'Notify affiliated societies with spare ' + (topShortage.trade.toLowerCase()) + ' capacity.',
                'Open a targeted training intake for the shortage trade.',
                'Extend emergency on-call rota for the affected localities.',
                'Review service radius coverage for the demand hotspot.',
              ].map((action, i) => (
                <View key={action} style={styles.actionRow}>
                  <View style={styles.actionIndex}>
                    <Text style={styles.actionIndexText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
            <Row style={{ marginTop: 14 }} wrap>
              <ActBtn label="View allocation" tone="dark" onPress={() => go('allocation')} style={{ flex: 1 }} />
              <ActBtn
                label={notified ? 'Societies notified' : 'Notify societies'}
                icon="notifications"
                tone="ghost"
                onPress={() => {
                  setNotified(true);
                  showToast('Affiliated societies notified about the shortage.');
                }}
                style={{ flex: 1 }}
              />
              <ActBtn label="Open training plan" tone="ghost" onPress={() => go('training')} style={{ flex: 1 }} />
            </Row>
          </>
        ) : null}
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Demand index across the observed and predicted window.">Demand trend</SectionTitle>
        <LineChart
          points={FED_FORECAST_SERIES.map((p) => ({ label: p.week, value: Math.round(p.value * active.multiplier), phase: p.phase }))}
          colorMap={{ historical: '#94A3B8', current: CHART_COLORS.brand, predicted: CHART_COLORS.amber }}
          height={180}
        />
        <LegendRow
          items={[
            { color: '#94A3B8', label: 'Historical' },
            { color: CHART_COLORS.brand, label: 'Current' },
            { color: CHART_COLORS.amber, label: 'Predicted' },
          ]}
        />
        <FederationAlert tone="info" title="Prototype forecast" body={FED_FORECAST_NOTE} />
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Localities with the highest expected shortfall.">Demand hotspots</SectionTitle>
        {[...filtered]
          .sort((a, b) => a.gap - b.gap)
          .slice(0, 6)
          .map((r) => (
            <View key={`${r.trade}-${r.location}`} style={styles.hotspotRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.hotspotTrade} numberOfLines={1}>{r.trade}</Text>
                <Text style={styles.hotspotMeta} numberOfLines={1}>
                  {r.location} · {r.time} · {r.societyIds.length} societies
                </Text>
              </View>
              <StatusBadge value={`${r.gap < 0 ? '−' : '+'}${Math.abs(r.gap)}`} tone={r.gap < 0 ? 'red' : 'green'} />
            </View>
          ))}
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle>Time & season signals</SectionTitle>
        <HBarList
          rows={[
            { label: 'Morning (6–10 AM)', value: 84, max: 100, right: '84%', tone: CHART_COLORS.brand },
            { label: 'Evening (4–8 PM)', value: 72, max: 100, right: '72%', tone: CHART_COLORS.amber },
            { label: 'Weekends', value: 61, max: 100, right: '61%', tone: CHART_COLORS.brandDeep },
            { label: 'Monsoon (Jun–Sep)', value: 55, max: 100, right: '55%', tone: colors.sage },
            { label: 'Festive season', value: 38, max: 100, right: '38%', tone: colors.sage },
          ]}
        />
      </Card2>

      <Card2 style={{ gap: 4 }}>
        <KV k="Horizon" v={active.label} />
        <KV k="Trades analysed" v={`${filtered.length}`} mono />
        <KV k="Societies in scope" v={`${new Set(filtered.flatMap((r) => r.societyIds)).size}`} mono />
        <KV k="Source" v="Deterministic local demo series" />
      </Card2>
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  aiCard: { backgroundColor: '#F2FAF6', borderColor: 'rgba(22,138,91,0.2)' },
  aiLead: { color: colors.forest, fontSize: 12, fontWeight: '800', lineHeight: 18 },
  actionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  actionIndex: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  actionIndexText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  actionText: { color: colors.ink, fontSize: 11, lineHeight: 16, flex: 1 },
  hotspotRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  hotspotTrade: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  hotspotMeta: { color: colors.sage, fontSize: 9, marginTop: 2 },
});