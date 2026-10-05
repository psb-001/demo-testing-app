import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FED_JOBS,
  FED_PAYMENT_METRICS,
  FED_PAYMENT_POLICY,
  FED_TRANSACTIONS,
  workerById,
  type FedTxn,
} from '../fedData';
import { CHART_COLORS, StackedBar } from '../fedCharts';
import { exportCsv, exportDemoText } from '../fedExport';
import {
  ActBtn,
  Card2,
  Chip,
  DetailStat,
  Drawer,
  FederationKpiCard,
  FedScreen,
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
  type BadgeTone,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Payments & Settlements — ported from
 * workconnect/src/portals/fed/screens/Payments.tsx.
 *
 * The export is the substantive change: the web version built a CSV Blob and
 * clicked a synthetic `<a download>`; here the same columns are written to a
 * file in the cache directory and handed to the system share sheet
 * (`src/portals/fed/fedExport.ts`).
 */

const STATUS_TABS: { id: string; label: string; tone: BadgeTone }[] = [
  { id: '', label: 'All', tone: 'slate' },
  { id: 'Paid', label: 'Paid', tone: 'green' },
  { id: 'Pending', label: 'Pending', tone: 'amber' },
  { id: 'Processing', label: 'Processing', tone: 'blue' },
  { id: 'Failed', label: 'Failed', tone: 'red' },
  { id: 'Refunded', label: 'Refunded', tone: 'slate' },
];

/** CSV column order, matching the web export. */
const EXPORT_HEADERS = [
  'Transaction',
  'Booking',
  'Customer',
  'Worker',
  'Cooperative',
  'Service',
  'Amount',
  'Worker share',
  'Cooperative share',
  'Welfare share',
  'Status',
  'Date',
  'Society',
];

export const FederationPayments: React.FC = () => {
  const { showToast } = useFedStore();
  const t = useFedT();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [openTxn, setOpenTxn] = useState<FedTxn | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FED_TRANSACTIONS.filter((txn) => {
      if (status && txn.status !== status) return false;
      if (q && !`${txn.id} ${txn.bookingId} ${txn.customer} ${txn.worker} ${txn.service}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, status]);

  const onExport = async () => {
    const result = await exportCsv(
      'rozgar-federation-settlements.csv',
      EXPORT_HEADERS,
      filtered.map((txn) => [
        txn.id,
        txn.bookingId,
        txn.customer,
        txn.worker,
        txn.cooperative,
        txn.service,
        txn.amount,
        txn.workerShare,
        txn.coopShare,
        txn.welfareShare,
        txn.status,
        txn.date,
        txn.societyId,
      ]),
    );
    showToast(
      result.ok
        ? `Exported ${filtered.length} settlement${filtered.length === 1 ? '' : 's'}.`
        : 'Export failed — could not write the file.',
    );
  };

  const m = FED_PAYMENT_METRICS;

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_payments')}
        subtitle="Transparent, configurable settlements between customers, workers, cooperatives and the welfare fund."
        action={<ActBtn label="Export" icon="download-outline" onPress={onExport} />}
      />

      <Card2 style={styles.policyBanner}>
        <Row>
          <Ionicons name="warning" size={16} color="#B45309" />
          <Text style={styles.policyText}>{FED_PAYMENT_POLICY.note}</Text>
        </Row>
      </Card2>

      <Grid minWidth="31%">
        <FederationKpiCard label="Service value" value={`₹${m.totalRevenue.toLocaleString('en-IN')}`} sub="total booked value" tone="green" icon="wallet-outline" />
        <FederationKpiCard label="Worker payouts" value={`₹${m.workerPayouts.toLocaleString('en-IN')}`} sub={`${FED_PAYMENT_POLICY.workerPct}% to workers`} tone="blue" icon="people-outline" />
        <FederationKpiCard label="Cooperative share" value={`₹${m.coopShare.toLocaleString('en-IN')}`} sub={`${FED_PAYMENT_POLICY.coopPct}% society operations`} tone="green" icon="business-outline" />
        <FederationKpiCard label="Welfare allocation" value={`₹${m.welfareShare.toLocaleString('en-IN')}`} sub={`${FED_PAYMENT_POLICY.welfarePct}% welfare fund`} tone="amber" icon="heart-outline" />
        <FederationKpiCard label="Pending" value={m.pendingSettlements.toLocaleString('en-IN')} sub={`${m.pendingCount} awaiting settlement`} tone="red" icon="time-outline" />
      </Grid>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="How a customer payment becomes a worker payout.">Settlement flow</SectionTitle>
        <PaymentFlow />
        <StackedBar
          showLabels
          segments={[
            { label: 'Worker', value: FED_PAYMENT_POLICY.workerPct, color: CHART_COLORS.brand },
            { label: 'Cooperative', value: FED_PAYMENT_POLICY.coopPct, color: CHART_COLORS.brandDeep },
            { label: 'Welfare', value: FED_PAYMENT_POLICY.welfarePct, color: CHART_COLORS.amber },
          ]}
          total={100}
        />
      </Card2>

      <Card2 style={{ gap: 9 }}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search transaction, customer, worker…" />
        <Row wrap>
          {STATUS_TABS.map((s) => (
            <Chip key={s.id} active={status === s.id} tone={s.tone} onPress={() => setStatus(s.id)}>
              {s.label}
            </Chip>
          ))}
        </Row>
      </Card2>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No settlements match this filter">
        {filtered.map((txn) => (
          <RecordCard
            key={txn.id}
            title={txn.customer}
            subtitle={`${txn.id} · ${txn.service}`}
            badge={{ label: txn.status }}
            onPress={() => setOpenTxn(txn)}
            fields={[
              { label: 'Amount', value: `₹${txn.amount.toLocaleString('en-IN')}` },
              { label: 'Worker share', value: `₹${txn.workerShare.toLocaleString('en-IN')}` },
              { label: 'Cooperative', value: txn.cooperative },
              { label: 'Worker', value: txn.worker },
              { label: 'Date', value: txn.date },
              { label: 'Booking', value: txn.bookingId },
            ]}
          />
        ))}
      </RecordList>

      <TransactionDetailDrawer
        txn={openTxn}
        onClose={() => setOpenTxn(null)}
        onDownload={async (txn) => {
          const result = await exportDemoText(
            `rozgar-settlement-${txn.id}.txt`,
            `Rozgar Settlement Receipt · ${txn.id}`,
            [
              `Booking: ${txn.bookingId}`,
              `Customer: ${txn.customer}`,
              `Worker: ${txn.worker}`,
              `Cooperative: ${txn.cooperative}`,
              `Service: ${txn.service}`,
              `Amount: ₹${txn.amount.toLocaleString('en-IN')}`,
              `Worker share: ₹${txn.workerShare.toLocaleString('en-IN')}`,
              `Cooperative share: ₹${txn.coopShare.toLocaleString('en-IN')}`,
              `Welfare share: ₹${txn.welfareShare.toLocaleString('en-IN')}`,
              `Status: ${txn.status}`,
              `Date: ${txn.date}`,
            ],
          );
          setOpenTxn(null);
          showToast(result.ok ? 'Receipt shared.' : 'Could not create the receipt file.');
        }}
      />
    </FedScreen>
  );
};

const TransactionDetailDrawer: React.FC<{
  txn: FedTxn | null;
  onClose: () => void;
  onDownload: (txn: FedTxn) => void;
}> = ({ txn, onClose, onDownload }) => {
  if (!txn) return null;
  const worker = workerById(
    FED_JOBS.find((j) => j.id === txn.bookingId)?.workerId,
  );
  return (
    <Drawer
      title={txn.id}
      subtitle={`${txn.service} · ${txn.date}`}
      open
      onClose={onClose}
      footer={<ActBtn label="Share receipt" icon="share-outline" tone="ghost" onPress={() => onDownload(txn)} style={{ flex: 1 }} />}
    >
      <View style={styles.amountHero}>
        <Text style={styles.amountLabel}>Settlement amount</Text>
        <Text style={styles.amountValue}>₹{txn.amount.toLocaleString('en-IN')}</Text>
        <StatusBadge value={txn.status} />
      </View>

      <Card2 style={{ gap: 10 }}>
        <SectionTitle>Settlement split</SectionTitle>
        <KV k="Worker share" v={`₹${txn.workerShare.toLocaleString('en-IN')}`} mono />
        <KV k="Cooperative share" v={`₹${txn.coopShare.toLocaleString('en-IN')}`} mono />
        <KV k="Welfare share" v={`₹${txn.welfareShare.toLocaleString('en-IN')}`} mono />
        <StackedBar
          height={10}
          segments={[
            { label: 'Worker', value: txn.workerShare, color: CHART_COLORS.brand },
            { label: 'Cooperative', value: txn.coopShare, color: CHART_COLORS.brandDeep },
            { label: 'Welfare', value: txn.welfareShare, color: CHART_COLORS.amber },
          ]}
          total={txn.amount}
        />
      </Card2>

      <Grid minWidth="30%">
        <DetailStat label="Booking" value={txn.bookingId} />
        <DetailStat label="Customer" value={txn.customer} />
        <DetailStat label="Worker" value={txn.worker} />
        <DetailStat label="Cooperative" value={txn.cooperative} />
      </Grid>

      {worker ? (
        <Card2 style={{ gap: 4 }}>
          <SectionTitle>Worker payout profile</SectionTitle>
          <KV k="Trade" v={worker.trade} />
          <KV k="Verification" v={<StatusBadge value={worker.verification} />} />
          <KV k="Welfare" v={worker.welfare} />
          <KV k="Rating" v={`${worker.rating}/5`} />
        </Card2>
      ) : null}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  policyBanner: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  policyText: { color: '#92400E', fontSize: 11, lineHeight: 16, flex: 1, fontWeight: '700' },
  amountHero: { backgroundColor: colors.forest, borderRadius: 14, padding: 16, alignItems: 'center', gap: 5 },
  amountLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  amountValue: { color: '#fff', fontSize: 28, fontWeight: '900' },
});