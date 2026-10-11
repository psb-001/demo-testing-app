import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_SHORTAGE_TRADES,
  FED_SURPLUS_TRADES,
  FED_TRADE_LABOR,
  FED_WORKERS,
  FED_WORKFORCE,
  societyName,
  type FedWorker,
} from '../fedData';
import { CHART_COLORS, HBarList, StackedBar } from '../fedCharts';
import { FederationWorkerPassport } from '../WorkerSkillPassport';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  FederationKpiCard,
  FedScreen,
  FilterSelect,
  Grid,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SearchInput,
  SectionTitle,
  SegmentedTabs,
  StatusBadge,
  type BadgeTone,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation Workforce — ported from
 * workconnect/src/portals/fed/screens/Workforce.tsx.
 *
 * Two tabs, as on the web: a Worker Directory (9 filters + a 10-column table,
 * now a card list) and Supply & Demand Intelligence (dual-segment bars,
 * shortage/surplus lists and the utilization split).
 */

const TONE_MAP: Record<string, BadgeTone> = {
  green: 'green',
  blue: 'blue',
  amber: 'amber',
  red: 'red',
  slate: 'slate',
};

const WORKLOAD_TONE: Record<string, BadgeTone> = { Low: 'green', Medium: 'amber', High: 'red' };

function optionsFrom(values: (string | undefined)[], allLabel: string): SelectOption[] {
  const unique = [...new Set(values.filter((v): v is string => !!v))].sort();
  return [{ label: allLabel, value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationWorkforce: React.FC = () => {
  const { go } = useFedStore();
  const t = useFedT();
  const [tab, setTab] = useState<'directory' | 'supply'>('directory');

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_workforce')}
        subtitle="Workforce availability, fair allocation signals and demand coverage across every affiliated society."
        tag={<CoopDemoTag />}
        action={<ActBtn label="Workforce map" icon="map-outline" tone="ghost" onPress={() => go('fedMap')} />}
      />

      <Grid minWidth="46%">
        {FED_WORKFORCE.map((m) => (
          <FederationKpiCard
            key={m.label}
            label={m.label}
            value={m.value.toLocaleString('en-IN')}
            sub={m.sub}
            tone={TONE_MAP[m.tone ?? 'green']}
          />
        ))}
      </Grid>

      <SegmentedTabs
        tabs={[
          { id: 'directory', label: 'Worker Directory' },
          { id: 'supply', label: 'Supply & Demand' },
        ]}
        active={tab}
        onChange={(id) => setTab(id as 'directory' | 'supply')}
      />

      {tab === 'directory' ? <WorkerDirectory /> : <SupplyDemand onGoAllocation={() => go('allocation')} />}
    </FedScreen>
  );
};

/* ── Worker directory ──────────────────────────────────────────────────── */

const WorkerDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [society, setSociety] = useState('');
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [verification, setVerification] = useState('');
  const [certification, setCertification] = useState('');
  const [workload, setWorkload] = useState('');
  const [welfare, setWelfare] = useState('');
  const [openWorker, setOpenWorker] = useState<FedWorker | null>(null);

  const societyOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => societyName(w.societyId)), 'All societies'), []);
  const tradeOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.trade), 'All trades'), []);
  const locationOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.location), 'All locations'), []);
  const availabilityOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.availability), 'All'), []);
  const verificationOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.verification), 'All'), []);
  const certificationOptions = useMemo(
    () => optionsFrom(FED_WORKERS.flatMap((w) => w.certifications.map((c) => c.status)), 'All'),
    [],
  );
  const workloadOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.workload), 'All'), []);
  const welfareOptions = useMemo(() => optionsFrom(FED_WORKERS.map((w) => w.welfare), 'All'), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FED_WORKERS.filter((w) => {
      if (society && societyName(w.societyId) !== society) return false;
      if (trade && w.trade !== trade) return false;
      if (location && w.location !== location) return false;
      if (availability && w.availability !== availability) return false;
      if (verification && w.verification !== verification) return false;
      if (certification && !w.certifications.some((c) => c.status === certification)) return false;
      if (workload && w.workload !== workload) return false;
      if (welfare && w.welfare !== welfare) return false;
      if (q && !`${w.name} ${w.trade} ${w.location} ${w.skills.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, society, trade, location, availability, verification, certification, workload, welfare]);

  const clearFilters = () => {
    setQuery('');
    setSociety('');
    setTrade('');
    setLocation('');
    setAvailability('');
    setVerification('');
    setCertification('');
    setWorkload('');
    setWelfare('');
  };

  const hasFilters = !!(query || society || trade || location || availability || verification || certification || workload || welfare);

  return (
    <>
      <Card2 style={{ gap: 9 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search worker, trade, skill…" />
        <Grid minWidth="31%">
          <FilterSelect label="Society" value={society} options={societyOptions} onChange={setSociety} allLabel="All societies" />
          <FilterSelect label="Trade" value={trade} options={tradeOptions} onChange={setTrade} allLabel="All trades" />
          <FilterSelect label="Location" value={location} options={locationOptions} onChange={setLocation} allLabel="All locations" />
          <FilterSelect label="Availability" value={availability} options={availabilityOptions} onChange={setAvailability} />
          <FilterSelect label="Verification" value={verification} options={verificationOptions} onChange={setVerification} />
          <FilterSelect label="Certification" value={certification} options={certificationOptions} onChange={setCertification} />
          <FilterSelect label="Workload" value={workload} options={workloadOptions} onChange={setWorkload} />
          <FilterSelect label="Welfare" value={welfare} options={welfareOptions} onChange={setWelfare} />
        </Grid>
        {hasFilters ? <ActBtn label="Clear filters" tone="ghost" onPress={clearFilters} style={{ alignSelf: 'flex-start' }} /> : null}
      </Card2>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No workers match these filters">
        {filtered.map((worker) => (
          <RecordCard
            key={worker.id}
            title={worker.name}
            subtitle={`${worker.trade} · ${worker.location}`}
            badge={{ label: worker.availability }}
            onPress={() => setOpenWorker(worker)}
            fields={[
              { label: 'Society', value: societyName(worker.societyId) },
              { label: 'Experience', value: `${worker.experience} yrs` },
              { label: 'Workload', value: worker.workload },
              { label: 'Rating', value: `${worker.rating}` },
              { label: 'Utilization', value: `${worker.utilization}%` },
              { label: 'Verification', value: worker.verification },
            ]}
            trailing={
              <StatusBadge value={worker.workload} tone={WORKLOAD_TONE[worker.workload] ?? 'slate'} />
            }
          />
        ))}
      </RecordList>

      <FederationWorkerPassport worker={openWorker} onClose={() => setOpenWorker(null)} />
    </>
  );
};

/* ── Supply & demand intelligence ──────────────────────────────────────── */

const SupplyDemand: React.FC<{ onGoAllocation: () => void }> = ({ onGoAllocation }) => {
  return (
    <>
      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Expected demand against available workforce, per trade.">
          Trade Labour Balance
        </SectionTitle>
        {FED_TRADE_LABOR.map((row) => {
          // `available - gap` is the expected demand figure used on the web.
          const demand = row.available - row.gap;
          const scale = Math.max(demand, row.available) || 1;
          const shortage = row.gap < 0;
          return (
            <View key={row.trade} style={styles.tradeRow}>
              <Row>
                <Text style={styles.tradeName} numberOfLines={1}>{row.trade}</Text>
                <StatusBadge value={row.demand} />
                <View style={{ flex: 1 }} />
                <Text style={[styles.tradeGap, shortage ? styles.gapShort : styles.gapSurplus]}>
                  {shortage ? `−${Math.abs(row.gap)}` : `+${row.gap}`}
                </Text>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Text style={styles.tradeMeta}>Demand {demand}</Text>
                <View style={{ flex: 1 }}>
                  <StackedBar
                    height={8}
                    segments={[
                      { label: 'Available', value: row.available, color: CHART_COLORS.brand },
                      { label: 'Demand', value: demand, color: CHART_COLORS.amber },
                    ]}
                    total={scale * 2}
                  />
                </View>
                <Text style={styles.tradeMeta}>{row.available} avail</Text>
              </Row>
              <Text style={styles.tradeLocation}>{row.location} · {row.time}</Text>
            </View>
          );
        })}
      </Card2>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Trades where expected demand exceeds available workers.">Priority shortages</SectionTitle>
        <HBarList
          rows={FED_SHORTAGE_TRADES.slice(0, 6).map((t) => ({
            label: t.trade,
            value: Math.abs(t.gap),
            max: 32,
            right: `−${Math.abs(t.gap)}`,
            tone: CHART_COLORS.amber,
          }))}
        />
      </Card2>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Spare capacity available to absorb new demand.">Spare capacity</SectionTitle>
        <HBarList
          rows={FED_SURPLUS_TRADES.slice(0, 6).map((t) => ({
            label: t.trade,
            value: t.gap,
            max: 120,
            right: `+${t.gap}`,
            tone: CHART_COLORS.brandDeep,
          }))}
        />
      </Card2>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle>Workforce Utilization</SectionTitle>
        <HBarList
          rows={[
            { label: 'Utilized / earning', value: 71, max: 100, right: '71%' },
            { label: 'Available / on shift', value: 18, max: 100, right: '18%', tone: CHART_COLORS.brandDeep },
            { label: 'Underutilized', value: 8, max: 100, right: '8%', tone: CHART_COLORS.amber },
            { label: 'Emergency reserve', value: 3, max: 100, right: '3%', tone: colors.sage },
          ]}
        />
      </Card2>

      <Card2 style={{ gap: 10 }}>
        <Text style={styles.signalTitle}>Fair opportunity signal</Text>
        <Text style={styles.signalBody}>
          <Text style={{ fontWeight: '900', color: colors.ink }}>317 workers are underutilized. </Text>
          The allocation engine considers recent job distribution before recommending the next eligible member.
        </Text>
        <ActBtn label="Open AI workforce allocation" icon="sparkles" onPress={onGoAllocation} style={{ alignSelf: 'flex-start' }} />
      </Card2>
    </>
  );
};

const styles = StyleSheet.create({
  tradeRow: { paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  tradeName: { color: colors.ink, fontSize: 12, fontWeight: '900', flexShrink: 1 },
  tradeGap: { fontSize: 12, fontWeight: '900' },
  gapShort: { color: colors.danger },
  gapSurplus: { color: CHART_COLORS.brand },
  tradeMeta: { color: colors.sage, fontSize: 9, fontWeight: '800', width: 62 },
  tradeLocation: { color: colors.sage, fontSize: 9, marginTop: 4 },
  signalTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  signalBody: { color: colors.sage, fontSize: 11, lineHeight: 16 },
});