import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_JOBS,
  FED_TOTAL_SOCIETIES,
  FED_TOTAL_WORKERS,
  FED_WELFARE,
  type FedSociety,
} from '../fedData';
import { StackedBar, CHART_COLORS } from '../fedCharts';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  DetailStat,
  Drawer,
  FederationKpiCard,
  FedScreen,
  FilterSelect,
  Grid,
  KV,
  ProgressRow,
  RecordCard,
  RecordList,
  ScreenHeader,
  SearchInput,
  SectionTitle,
  SegmentedTabs,
  StatusBadge,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation Network — ported from
 * workconnect/src/portals/fed/screens/Societies.tsx.
 *
 * Adaptation: the web screen renders the same dataset twice (an 11-column
 * `<table>` at `lg:` and a card grid below). Only the card grid is needed here,
 * so the duplicate table render was dropped and the native `<select>` filters
 * became `FilterSelect` bottom sheets.
 */

/** The 7 inner tabs of the society detail drawer. */
const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'workers', label: 'Workers' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'skills', label: 'Skills' },
  { id: 'payments', label: 'Payments' },
  { id: 'welfare', label: 'Welfare' },
  { id: 'demand', label: 'Demand' },
] as const;

type DetailTab = (typeof DETAIL_TABS)[number]['id'];

/** Build a de-duplicated, sorted option list from a field of the dataset. */
function optionsFrom(values: (string | undefined)[], allLabel: string): SelectOption[] {
  const unique = [...new Set(values.filter((v): v is string => !!v))].sort();
  return [{ label: allLabel, value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationSocieties: React.FC = () => {
  const store = useFedStore();
  const { societies, focusSocietyId, clearFocusSociety } = store;
  const t = useFedT();

  const [query, setQuery] = useState('');
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');
  const [verification, setVerification] = useState('');
  const [demand, setDemand] = useState('');

  /**
   * The drawer can be opened two ways: by tapping a row here (local state), or
   * by a deep link from the Dashboard / AI assistant which arrives as
   * `focusSocietyId` in the store. Deriving `open` from both avoids an effect
   * that mirrors store state into local state (which causes a cascading
   * re-render) and keeps the deep link authoritative while it is set.
   */
  const [local, setLocal] = useState<{ id: string; tab: DetailTab } | null>(null);
  const open = focusSocietyId ? { id: focusSocietyId, tab: 'overview' as DetailTab } : local;

  const openDetail = (id: string) => setLocal({ id, tab: 'overview' });

  const setDetailTab = (tab: DetailTab) => {
    if (open) setLocal({ id: open.id, tab });
  };

  const closeDetail = () => {
    setLocal(null);
    clearFocusSociety();
  };

  const tradeOptions = useMemo(() => optionsFrom(societies.map((s) => s.trade), 'All trades'), [societies]);
  const locationOptions = useMemo(() => optionsFrom(societies.map((s) => s.area), 'All locations'), [societies]);
  const verificationOptions = useMemo(() => optionsFrom(societies.map((s) => s.status), 'All'), [societies]);
  const demandOptions = useMemo(() => optionsFrom(societies.map((s) => s.demand), 'All'), [societies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return societies.filter((s) => {
      if (trade && s.trade !== trade) return false;
      if (location && s.area !== location) return false;
      if (verification && s.status !== verification) return false;
      if (demand && s.demand !== demand) return false;
      if (q && !`${s.name} ${s.reg} ${s.area} ${s.trade}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [societies, query, trade, location, verification, demand]);

  const stats = useMemo(
    () => ({
      workers: filtered.reduce((sum, s) => sum + s.workers, 0),
      available: filtered.reduce((sum, s) => sum + s.availableToday, 0),
      active: filtered.reduce((sum, s) => sum + s.activeJobs, 0),
      welfarePct: filtered.length
        ? Math.round(filtered.reduce((sum, s) => sum + s.welfarePct, 0) / filtered.length)
        : 0,
    }),
    [filtered],
  );

  const clearFilters = () => {
    setQuery('');
    setTrade('');
    setLocation('');
    setVerification('');
    setDemand('');
  };

  const hasFilters = !!(query || trade || location || verification || demand);
  const detail = open ? societies.find((s) => s.id === open.id) : undefined;

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_societies')}
        subtitle={`All ${FED_TOTAL_SOCIETIES} affiliated labour cooperative societies reporting into the federation.`}
        tag={<CoopDemoTag />}
      />

      <Card2 style={{ gap: 9 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search society, registration, area…" />
        <Grid minWidth="47%">
          <FilterSelect label="Trade" value={trade} options={tradeOptions} onChange={setTrade} allLabel="All trades" />
          <FilterSelect label="Location" value={location} options={locationOptions} onChange={setLocation} allLabel="All locations" />
          <FilterSelect label="Verification" value={verification} options={verificationOptions} onChange={setVerification} allLabel="All" />
          <FilterSelect label="Demand" value={demand} options={demandOptions} onChange={setDemand} allLabel="All" />
        </Grid>
        {hasFilters ? <ActBtn label="Clear filters" tone="ghost" onPress={clearFilters} style={{ alignSelf: 'flex-start' }} /> : null}
      </Card2>

      <Grid minWidth="46%">
        <FederationKpiCard label="Societies" value={`${filtered.length}`} sub={`of ${FED_TOTAL_SOCIETIES} in network`} tone="green" icon="business-outline" />
        <FederationKpiCard label="Members" value={stats.workers.toLocaleString('en-IN')} sub="registered workers" tone="blue" icon="people-outline" />
        <FederationKpiCard label="Available" value={stats.available.toLocaleString('en-IN')} sub="available today" tone="green" icon="checkmark-circle-outline" />
        <FederationKpiCard label="Avg welfare" value={`${stats.welfarePct}%`} sub={`${stats.active} active jobs`} tone="amber" icon="heart-outline" />
      </Grid>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No societies match these filters">
        {filtered.map((society) => (
          <RecordCard
            key={society.id}
            title={society.name}
            subtitle={`${society.reg} · ${society.trade}`}
            badge={{ label: society.demand }}
            onPress={() => openDetail(society.id)}
            fields={[
              { label: 'Area', value: society.area },
              { label: 'Members', value: `${society.workers}` },
              { label: 'Available', value: `${society.availableToday}` },
              { label: 'Verified', value: `${society.verified}` },
              { label: 'Active jobs', value: `${society.activeJobs}` },
              { label: 'Welfare', value: `${society.welfarePct}%` },
            ]}
          />
        ))}
      </RecordList>

      <SocietyDetailDrawer
        society={detail}
        tab={open?.tab ?? 'overview'}
        onTabChange={setDetailTab}
        open={!!detail}
        onClose={closeDetail}
      />
    </FedScreen>
  );
};

/* ── Detail drawer ─────────────────────────────────────────────────────── */

const SocietyDetailDrawer: React.FC<{
  society?: FedSociety;
  tab: DetailTab;
  onTabChange: (t: DetailTab) => void;
  open: boolean;
  onClose: () => void;
}> = ({ society, tab, onTabChange, open, onClose }) => {
  const { showToast } = useFedStore();
  if (!society) return null;

  const societyJobs = FED_JOBS.filter((j) => j.societyId === society.id);

  return (
    <Drawer title={society.name} subtitle={`${society.reg} · ${society.trade}`} open={open} onClose={onClose}>
      <Grid minWidth="30%">
        <DetailStat label="Members" value={society.workers.toLocaleString('en-IN')} />
        <DetailStat label="Available" value={society.availableToday.toLocaleString('en-IN')} tone="green" />
        <DetailStat label="Active jobs" value={`${society.activeJobs}`} tone="amber" />
        <DetailStat label="Emergency ready" value={`${society.emergencyReady}`} tone="red" />
        <DetailStat label="Welfare" value={`${society.welfarePct}%`} tone="green" />
        <DetailStat label="Rating" value={`${society.averageRating}`} tone="blue" />
      </Grid>

      <SegmentedTabs tabs={DETAIL_TABS.map((x) => ({ id: x.id, label: x.label }))} active={tab} onChange={(id) => onTabChange(id as DetailTab)} />

      {tab === 'overview' ? (
        <Card2 style={{ gap: 4 }}>
          <ProgressRow label="Worker contribution" pct={society.workers ? (society.workers / FED_TOTAL_WORKERS) * 100 * FED_TOTAL_SOCIETIES : 0} right={`${society.workers} members`} />
          <KV k="Registration" v={society.reg} mono />
          <KV k="Trade" v={society.trade} />
          <KV k="Area" v={society.area} />
          <KV k="Established" v={society.established} />
          <KV k="Monthly revenue" v={`₹${society.monthlyRevenue.toLocaleString('en-IN')}`} mono />
          <KV k="Coordinates" v={`${society.lat.toFixed(3)}, ${society.lng.toFixed(3)}`} mono />
          <KV k="Status" v={<StatusBadge value={society.status} />} />
          <KV k="Demand" v={<StatusBadge value={society.demand} />} />
        </Card2>
      ) : null}

      {tab === 'workers' ? (
        <Card2 style={{ gap: 8 }}>
          <KV k="Total members" v={society.workers.toLocaleString('en-IN')} mono />
          <KV k="Available today" v={society.availableToday.toLocaleString('en-IN')} mono />
          <KV k="Verified" v={society.verified.toLocaleString('en-IN')} mono />
          <KV k="Emergency ready" v={`${society.emergencyReady}`} mono />
          <KV k="Welfare covered" v={`${society.welfareCovered.toLocaleString('en-IN')} (${society.welfarePct}%)`} />
          <ActBtn label="Open worker directory" tone="ghost" onPress={() => showToast('Worker directory is available from the Workforce tab.')} />
        </Card2>
      ) : null}

      {tab === 'jobs' ? (
        <Card2 style={{ gap: 8 }}>
          <KV k="Active jobs" v={`${society.activeJobs}`} mono />
          <KV k="Completed (all time)" v={society.completedJobs.toLocaleString('en-IN')} mono />
          {societyJobs.length === 0 ? (
            <Text style={styles.muted}>No individual job records for this society in the demo ledger.</Text>
          ) : (
            societyJobs.map((job) => (
              <View key={job.id} style={styles.miniRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniTitle}>{job.service}</Text>
                  <Text style={styles.miniMeta}>{job.id} · {job.date} {job.time}</Text>
                </View>
                <StatusBadge value={job.status} />
              </View>
            ))
          )}
        </Card2>
      ) : null}

      {tab === 'skills' ? (
        <Card2 style={{ gap: 10 }}>
          <SectionTitle hint="Verified share of the society roster.">Skill assurance</SectionTitle>
          <ProgressRow
            label="Verified members"
            pct={society.workers ? (society.verified / society.workers) * 100 : 0}
            right={`${society.verified} of ${society.workers}`}
          />
          <ProgressRow label="Available today" pct={society.workers ? (society.availableToday / society.workers) * 100 : 0} right={`${society.availableToday}`} color={CHART_COLORS.brandDeep} />
          <ProgressRow label="Emergency ready" pct={society.workers ? (society.emergencyReady / society.workers) * 100 : 0} right={`${society.emergencyReady}`} color={CHART_COLORS.amber} />
          <KV k="Primary trade" v={society.trade} />
          <Text style={styles.muted}>Detailed per-worker certifications live in each worker&apos;s Skill Passport.</Text>
          <ActBtn label="Open Skills Passports" tone="ghost" onPress={() => showToast('Open a worker from Workforce to view their Skill Passport.')} />
        </Card2>
      ) : null}

      {tab === 'payments' ? (
        <Card2 style={{ gap: 10 }}>
          <SectionTitle hint="Every settlement follows the federation 92 / 6 / 2 split.">Settlement split</SectionTitle>
          <KV k="Monthly revenue" v={`₹${society.monthlyRevenue.toLocaleString('en-IN')}`} mono />
          <KV k="Worker payouts (92%)" v={`₹${Math.round(society.monthlyRevenue * 0.92).toLocaleString('en-IN')}`} mono />
          <KV k="Cooperative share (6%)" v={`₹${Math.round(society.monthlyRevenue * 0.06).toLocaleString('en-IN')}`} mono />
          <KV k="Welfare allocation (2%)" v={`₹${Math.round(society.monthlyRevenue * 0.02).toLocaleString('en-IN')}`} mono />
          <StackedBar
            showLabels
            segments={[
              { label: 'Worker', value: 92, color: CHART_COLORS.brand },
              { label: 'Cooperative', value: 6, color: CHART_COLORS.brandDeep },
              { label: 'Welfare', value: 2, color: CHART_COLORS.amber },
            ]}
          />
        </Card2>
      ) : null}

      {tab === 'welfare' ? (
        <Card2 style={{ gap: 10 }}>
          <KV k="Welfare covered" v={society.welfareCovered.toLocaleString('en-IN')} mono />
          <KV k="Coverage" v={`${society.welfarePct}%`} />
          <ProgressRow label="Federation average" pct={FED_WELFARE.coveragePct} right={`${FED_WELFARE.coveragePct}%`} />
          <ProgressRow
            label="This society"
            pct={society.welfarePct}
            right={`${society.welfarePct}%`}
            color={society.welfarePct >= FED_WELFARE.coveragePct ? CHART_COLORS.brand : CHART_COLORS.amber}
          />
          <KV k="Federation fund (FY)" v={`₹${FED_WELFARE.welfareFundFY.toLocaleString('en-IN')}`} mono />
        </Card2>
      ) : null}

      {tab === 'demand' ? (
        <Card2 style={{ gap: 8 }}>
          <KV k="Current demand" v={<StatusBadge value={society.demand} />} />
          <KV k="Active jobs" v={`${society.activeJobs}`} mono />
          <KV k="Completed jobs" v={society.completedJobs.toLocaleString('en-IN')} mono />
          <KV k="Emergency ready" v={`${society.emergencyReady}`} mono />
          <Text style={styles.muted}>
            Trade-level shortage and surplus signals are aggregated on the Demand Forecast and AI Workforce screens.
          </Text>
        </Card2>
      ) : null}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  muted: { color: colors.sage, fontSize: 10, lineHeight: 15 },
  miniRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  miniTitle: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  miniMeta: { color: colors.sage, fontSize: 9, marginTop: 2 },
});