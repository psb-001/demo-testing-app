import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  FED_JOBS,
  societyName,
  workerById,
  type FedJob,
} from '../fedData';
import { CHART_COLORS, StackedBar } from '../fedCharts';
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
  PaymentFlow,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SearchInput,
  SectionTitle,
  StatusBadge,
  StepFlow,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';

/**
 * Jobs & Operations — ported from
 * workconnect/src/portals/fed/screens/Jobs.tsx.
 *
 * The eight clickable `PipelineCard`s become a 2-up KPI grid that also doubles
 * as a status shortcut (tapping one filters the ledger). The 10-column ledger
 * becomes a card list; the row drawer keeps the 4-step operations timeline and
 * the settlement breakdown.
 */

const PIPELINE: { status: string; count: (jobs: FedJob[]) => number; tone: 'green' | 'blue' | 'amber' | 'red' | 'slate' }[] = [
  { status: 'Incoming', count: (j) => j.filter((x) => x.status === 'Incoming').length, tone: 'blue' },
  { status: 'Matched', count: (j) => j.filter((x) => x.status === 'Matched').length, tone: 'green' },
  { status: 'Assigned', count: (j) => j.filter((x) => x.status === 'Assigned').length, tone: 'blue' },
  { status: 'In Progress', count: (j) => j.filter((x) => x.status === 'In Progress').length, tone: 'amber' },
  { status: 'Completed', count: (j) => j.filter((x) => x.status === 'Completed').length, tone: 'green' },
  { status: 'Cancelled', count: (j) => j.filter((x) => x.status === 'Cancelled').length, tone: 'red' },
  { status: 'Emergency', count: (j) => j.filter((x) => x.emergency).length, tone: 'red' },
  { status: 'Network total', count: (j) => j.length, tone: 'slate' },
];

/** Job lifecycle order, used by the operations timeline in the detail drawer. */
const STAGES = ['Incoming', 'Matched', 'Assigned', 'In Progress', 'Completed'];

function stageIndex(status: string): number {
  if (status === 'Cancelled') return 1;
  const i = STAGES.indexOf(status);
  return i === -1 ? 0 : i;
}

function optionsFrom(values: (string | undefined)[], allLabel: string): SelectOption[] {
  const unique = [...new Set(values.filter((v): v is string => !!v))].sort();
  return [{ label: allLabel, value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationJobs: React.FC = () => {
  const { go, showToast } = useFedStore();
  const t = useFedT();

  const [query, setQuery] = useState('');
  const [trade, setTrade] = useState('');
  const [society, setSociety] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [openJob, setOpenJob] = useState<FedJob | null>(null);

  const tradeOptions = useMemo(() => optionsFrom(FED_JOBS.map((j) => j.trade), 'All trades'), []);
  const societyOptions = useMemo(() => optionsFrom(FED_JOBS.map((j) => societyName(j.societyId)), 'All societies'), []);
  const locationOptions = useMemo(() => optionsFrom(FED_JOBS.map((j) => j.location), 'All locations'), []);
  const dateOptions = useMemo(() => optionsFrom(FED_JOBS.map((j) => j.date), 'All dates'), []);
  const statusOptions = useMemo(() => optionsFrom(FED_JOBS.map((j) => j.status), 'All statuses'), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FED_JOBS.filter((j) => {
      if (trade && j.trade !== trade) return false;
      if (society && societyName(j.societyId) !== society) return false;
      if (location && j.location !== location) return false;
      if (date && j.date !== date) return false;
      if (status === 'Emergency' && !j.emergency) return false;
      if (status && status !== 'Emergency' && j.status !== status) return false;
      if (q && !`${j.id} ${j.service} ${j.location} ${j.trade}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, trade, society, location, date, status]);

  const clearFilters = () => {
    setQuery('');
    setTrade('');
    setSociety('');
    setLocation('');
    setDate('');
    setStatus('');
  };
  const hasFilters = !!(query || trade || society || location || date || status);

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_jobs')}
        subtitle="Every service job across the federation, from incoming request to settled payout."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="31%">
        {PIPELINE.map((p) => (
          <View key={p.status} style={{ minWidth: '31%', flexGrow: 1, flexBasis: 0 }}>
            <ActBtn
              label={`${p.status} · ${p.count(FED_JOBS)}`}
              tone={status === p.status ? 'dark' : 'ghost'}
              onPress={() => setStatus(status === p.status ? '' : p.status)}
              style={{ justifyContent: 'flex-start' }}
            />
          </View>
        ))}
      </Grid>

      <Card2 style={{ gap: 9 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search job ID, service, location…" />
        <Grid minWidth="31%">
          <FilterSelect label="Trade" value={trade} options={tradeOptions} onChange={setTrade} allLabel="All trades" />
          <FilterSelect label="Society" value={society} options={societyOptions} onChange={setSociety} allLabel="All societies" />
          <FilterSelect label="Location" value={location} options={locationOptions} onChange={setLocation} allLabel="All locations" />
          <FilterSelect label="Date" value={date} options={dateOptions} onChange={setDate} allLabel="All dates" />
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} allLabel="All statuses" />
        </Grid>
        {hasFilters ? <ActBtn label="Clear filters" tone="ghost" onPress={clearFilters} style={{ alignSelf: 'flex-start' }} /> : null}
      </Card2>

      <Grid minWidth="46%">
        <FederationKpiCard label="Matching" value={`${FED_JOBS.filter((j) => j.status === 'Matched').length}`} sub="jobs in allocation" tone="amber" icon="sparkles-outline" />
        <FederationKpiCard label="Service value" value={`₹${FED_JOBS.reduce((s, j) => s + j.amount, 0).toLocaleString('en-IN')}`} sub="across the ledger" tone="green" icon="wallet-outline" />
        <FederationKpiCard label="Emergency" value={`${FED_JOBS.filter((j) => j.emergency).length}`} sub="priority requests" tone="red" icon="warning-outline" />
        <FederationKpiCard label="Avg rating" value={`${(FED_JOBS.filter((j) => j.rating).reduce((s, j) => s + (j.rating ?? 0), 0) / Math.max(1, FED_JOBS.filter((j) => j.rating).length)).toFixed(2)}`} sub="across rated jobs" tone="blue" icon="star-outline" />
      </Grid>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No jobs match these filters">
        {filtered.map((job) => (
          <RecordCard
            key={job.id}
            title={job.service}
            subtitle={`${job.id} · ${job.location}`}
            badge={{ label: job.status }}
            onPress={() => setOpenJob(job)}
            fields={[
              { label: 'Trade', value: job.trade },
              { label: 'Society', value: societyName(job.societyId) },
              { label: 'When', value: `${job.date} ${job.time}` },
              { label: 'Worker', value: job.workerId ? workerById(job.workerId)?.name ?? job.workerId : 'Unassigned' },
              { label: 'Customer', value: job.customerType },
              { label: 'Amount', value: `₹${job.amount.toLocaleString('en-IN')}` },
              { label: 'Payment', value: job.payment },
              { label: 'Rating', value: job.rating ? `${job.rating}` : '—' },
            ]}
            trailing={job.emergency ? <StatusBadge value="Emergency" tone="red" /> : null}
          />
        ))}
      </RecordList>

      <JobDetailDrawer
        job={openJob}
        onClose={() => setOpenJob(null)}
        onOpenAllocation={() => {
          setOpenJob(null);
          go('allocation');
        }}
        onRefresh={() => showToast(`Status refreshed for ${openJob?.id ?? 'job'}.`)}
      />
    </FedScreen>
  );
};

const JobDetailDrawer: React.FC<{
  job: FedJob | null;
  onClose: () => void;
  onOpenAllocation: () => void;
  onRefresh: () => void;
}> = ({ job, onClose, onOpenAllocation, onRefresh }) => {
  if (!job) return null;
  const worker = workerById(job.workerId);

  return (
    <Drawer
      title={`${job.id} · ${job.service}`}
      subtitle={`${job.trade} · ${job.location}`}
      open
      onClose={onClose}
      footer={
        <>
          <ActBtn label="Open AI allocation" tone="ghost" onPress={onOpenAllocation} style={{ flex: 1 }} />
          <ActBtn label="Refresh status" icon="refresh" onPress={onRefresh} style={{ flex: 1 }} />
        </>
      }
    >
      <Row wrap>
        <StatusBadge value={job.status} />
        <StatusBadge value={job.payment} />
        {job.emergency ? <StatusBadge value="Emergency" tone="red" /> : null}
        {job.rating ? <StatusBadge value={`${job.rating} ★`} tone="blue" /> : null}
      </Row>

      <Grid minWidth="30%">
        <DetailStat label="Service value" value={`₹${job.amount.toLocaleString('en-IN')}`} />
        <DetailStat label="Worker payout" value={`₹${job.workerPayout.toLocaleString('en-IN')}`} tone="green" />
        <DetailStat label="Cooperative" value={`₹${job.cooperativeAllocation.toLocaleString('en-IN')}`} tone="blue" />
        <DetailStat label="Welfare" value={`₹${job.welfareContribution.toLocaleString('en-IN')}`} tone="amber" />
      </Grid>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle>Operations timeline</SectionTitle>
        <StepFlow steps={STAGES} currentIndex={stageIndex(job.status)} />
      </Card2>

      <Card2 style={{ gap: 4 }}>
        <KV k="Job ID" v={job.id} mono />
        <KV k="Service" v={job.service} />
        <KV k="Trade" v={job.trade} />
        <KV k="Location" v={job.location} />
        <KV k="Customer type" v={job.customerType} />
        <KV k="Society" v={societyName(job.societyId)} />
        <KV k="Worker" v={worker ? worker.name : 'Unassigned'} />
        <KV k="Date & time" v={`${job.date} · ${job.time}`} />
        <KV k="Emergency" v={job.emergency ? 'Yes' : 'No'} />
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Every booking settles on the federation 92 / 6 / 2 split.">Payment flow</SectionTitle>
        <PaymentFlow compact />
        <StackedBar
          showLabels
          segments={[
            { label: 'Worker', value: job.workerPayout, color: CHART_COLORS.brand },
            { label: 'Cooperative', value: job.cooperativeAllocation, color: CHART_COLORS.brandDeep },
            { label: 'Welfare', value: job.welfareContribution, color: CHART_COLORS.amber },
          ]}
          total={job.amount}
        />
        <KV k="Settlement status" v={<StatusBadge value={job.payment} />} />
      </Card2>
    </Drawer>
  );
};