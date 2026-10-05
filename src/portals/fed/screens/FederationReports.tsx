import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_REPORT_METRICS,
  FED_REPORT_SERIES,
  FED_SOCIETIES,
  FED_TOTAL_SOCIETIES,
  FED_TOTAL_WORKERS,
} from '../fedData';
import { CHART_COLORS, HBarList, LineChart } from '../fedCharts';
import { exportCsv, exportPrintableReport } from '../fedExport';
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
  Row,
  ScreenHeader,
  SectionTitle,
  type SelectOption,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Reports & Governance — ported from
 * workconnect/src/portals/fed/screens/Reports.tsx.
 *
 * The web "Download PDF" opened a popup containing an HTML document with an
 * inline "Save as PDF" button. The mobile equivalent shares a print-ready HTML
 * document through the system share sheet
 * (see `exportPrintableReport` in ../fedExport.ts).
 */

/** The 12-entry report library from the web screen. */
const REPORTS = [
  { id: 'workforce', title: 'Workforce Report', metric: 'Registered members', value: () => FED_TOTAL_WORKERS.toLocaleString('en-IN') },
  { id: 'societies', title: 'Society Directory', metric: 'Affiliated societies', value: () => `${FED_TOTAL_SOCIETIES}` },
  { id: 'trade', title: 'Trade-wise Demand', metric: 'Trades analysed', value: () => '11' },
  { id: 'location', title: 'Location Coverage', metric: 'Localities covered', value: () => '10' },
  { id: 'earnings', title: 'Worker Earnings', metric: 'Weekly payout run rate', value: () => '₹14.9 L' },
  { id: 'revenue', title: 'Cooperative Revenue', metric: 'Monthly service value', value: () => '₹1.86 Cr' },
  { id: 'welfare', title: 'Welfare Fund', metric: 'Pooled fund value', value: () => '₹2.4 Cr' },
  { id: 'insurance', title: 'Insurance Coverage', metric: 'Policy holders', value: () => '89%' },
  { id: 'utilization', title: 'Workforce Utilization', metric: 'Utilized / earning', value: () => '71%' },
  { id: 'ratings', title: 'Ratings & Complaints', metric: 'Average job rating', value: () => '4.6' },
  { id: 'forecast', title: 'Demand Forecast', metric: '30-day demand index', value: () => '518' },
  { id: 'training', title: 'Training & Certification', metric: 'Certified and current', value: () => '82%' },
] as const;

const DATE_RANGES = [
  { label: 'Last 4 weeks', value: '4w' },
  { label: 'Last 8 weeks', value: '8w' },
  { label: 'Last quarter', value: 'q' },
];

function societyOptions(): SelectOption[] {
  const unique = [...new Set(FED_SOCIETIES.map((s) => s.area))].sort();
  return [{ label: 'All locations', value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

function tradeOptions(): SelectOption[] {
  const unique = [...new Set(FED_SOCIETIES.map((s) => s.trade))].sort();
  return [{ label: 'All trades', value: '' }, ...unique.map((v) => ({ label: v, value: v }))];
}

export const FederationReports: React.FC = () => {
  const { showToast } = useFedStore();
  const t = useFedT();

  const [range, setRange] = useState('8w');
  const [area, setArea] = useState('');
  const [trade, setTrade] = useState('');
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  const weeks = range === '4w' ? 4 : range === 'q' ? FED_REPORT_SERIES.length : 8;
  const series = useMemo(() => FED_REPORT_SERIES.slice(-weeks), [weeks]);

  const scoped = useMemo(
    () =>
      FED_SOCIETIES.filter((s) => {
        if (area && s.area !== area) return false;
        if (trade && s.trade !== trade) return false;
        return true;
      }),
    [area, trade],
  );

  const openReport = REPORTS.find((r) => r.id === openReportId);

  const buildRows = () => {
    const rows: string[][] = [['Metric', 'Value']];
    for (const m of FED_REPORT_METRICS) rows.push([m.label, String(m.value), m.sub]);
    for (const r of REPORTS) rows.push([r.title, r.metric, r.value()]);
    return rows;
  };

  const onExportCsv = async () => {
    const result = await exportCsv(
      'rozgar-federation-report.csv',
      ['Metric', 'Value', 'Detail'],
      [
        ...FED_REPORT_METRICS.map((m) => [m.label, m.value, m.sub]),
        ...REPORTS.map((r) => [r.title, r.metric, r.value()]),
      ],
    );
    showToast(result.ok ? 'Federation report exported.' : 'Export failed — could not write the file.');
  };

  const onExportReport = async () => {
    if (!openReport) return;
    const result = await exportPrintableReport(`${openReport.title} · Rozgar Federation`, [
      { heading: 'Scope', rows: [
        ['Date range', DATE_RANGES.find((r) => r.value === range)?.label ?? range],
        ['Location', area || 'All locations'],
        ['Trade', trade || 'All trades'],
        ['Societies in scope', `${scoped.length} of ${FED_TOTAL_SOCIETIES}`],
      ] },
      { heading: 'Key figures', rows: buildRows().slice(1) },
    ]);
    setOpenReportId(null);
    showToast(result.ok ? 'Printable report ready to share.' : 'Could not create the report file.');
  };

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_reports')}
        subtitle="Governance reporting across workforce, demand, earnings, welfare and verification."
        tag={<CoopDemoTag />}
        action={
          <>
            <ActBtn label="CSV" icon="document-text-outline" tone="ghost" onPress={onExportCsv} />
          </>
        }
      />

      <Card2 style={{ gap: 9 }}>
        <Grid minWidth="31%">
          <FilterSelect label="Date range" value={range} options={DATE_RANGES} onChange={setRange} allLabel="All dates" />
          <FilterSelect label="Location" value={area} options={societyOptions()} onChange={setArea} allLabel="All locations" />
          <FilterSelect label="Trade" value={trade} options={tradeOptions()} onChange={setTrade} allLabel="All trades" />
        </Grid>
      </Card2>

      <Grid minWidth="46%">
        {FED_REPORT_METRICS.slice(0, 6).map((m, i) => (
          <FederationKpiCard
            key={m.label}
            label={m.label}
            value={String(m.value)}
            sub={m.sub}
            tone={(['green', 'blue', 'amber', 'green', 'slate', 'red'] as const)[i % 6]}
          />
        ))}
      </Grid>

      <Card2 style={{ gap: 18 }}>
        <SectionTitle hint={`Weekly federation performance across the selected ${range} window.`}>
          Federation performance
        </SectionTitle>
        <View style={{ gap: 16 }}>
          <View>
            <Text style={styles.chartLabel}>Jobs completed</Text>
            <LineChart points={series.map((p) => ({ label: p.week, value: p.jobs }))} height={150} />
          </View>
          <View>
            <Text style={styles.chartLabel}>Worker earnings · ₹ lakh</Text>
            <LineChart points={series.map((p) => ({ label: p.week, value: p.earningsLakh }))} height={150} colorMap={{ default: CHART_COLORS.brandDeep }} />
          </View>
          <View>
            <Text style={styles.chartLabel}>Demand index</Text>
            <LineChart points={series.map((p) => ({ label: p.week, value: p.demand }))} height={150} colorMap={{ default: CHART_COLORS.amber }} />
          </View>
          <View>
            <Text style={styles.chartLabel}>Utilization %</Text>
            <LineChart points={series.map((p) => ({ label: p.week, value: p.utilization }))} height={150} colorMap={{ default: colors.sage }} />
          </View>
          <View>
            <Text style={styles.chartLabel}>Welfare coverage %</Text>
            <LineChart points={series.map((p) => ({ label: p.week, value: p.welfare }))} height={150} colorMap={{ default: CHART_COLORS.brand }} />
          </View>
          <View>
            <Text style={[styles.chartLabel, { marginBottom: 8 }]}>Satisfaction score</Text>
            <HBarList
              rows={series.map((p) => ({ label: p.week, value: p.satisfaction, max: 100, right: `${p.satisfaction}` }))}
            />
          </View>
        </View>
      </Card2>

      <View>
        <SectionTitle hint="Tap a report to preview and export it.">Report library</SectionTitle>
        <Grid minWidth="46%">
          {REPORTS.map((r) => (
            <Card2
              key={r.id}
              style={{ gap: 5 }}
            >
              <Row>
                <Text style={styles.reportTitle} numberOfLines={2}>{r.title}</Text>
              </Row>
              <Text style={styles.reportMetric}>{r.metric}</Text>
              <Text style={styles.reportValue}>{r.value()}</Text>
              <ActBtn label="Open" tone="ghost" onPress={() => setOpenReportId(r.id)} />
            </Card2>
          ))}
        </Grid>
      </View>

      <Drawer
        title={openReport?.title ?? 'Report'}
        subtitle={openReport?.metric}
        open={!!openReport}
        onClose={() => setOpenReportId(null)}
        footer={
          <>
            <ActBtn label="Export CSV" tone="ghost" onPress={onExportCsv} style={{ flex: 1 }} />
            <ActBtn label="Share / print" icon="share-outline" onPress={onExportReport} style={{ flex: 1 }} />
          </>
        }
      >
        {openReport ? (
          <>
            <Grid minWidth="30%">
              <DetailStat label={openReport.metric} value={openReport.value()} tone="green" />
              <DetailStat label="Date range" value={DATE_RANGES.find((r) => r.value === range)?.label ?? range} />
              <DetailStat label="Location" value={area || 'All'} />
              <DetailStat label="Trade" value={trade || 'All'} />
            </Grid>

            <Card2 style={{ gap: 4 }}>
              <SectionTitle>Preview</SectionTitle>
              {FED_REPORT_METRICS.map((m) => (
                <View key={m.label} style={styles.previewRow}>
                  <Text style={styles.previewLabel} numberOfLines={1}>{m.label}</Text>
                  <Text style={styles.previewValue}>{String(m.value)}</Text>
                </View>
              ))}
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Societies in scope</Text>
                <Text style={styles.previewValue}>{scoped.length} / {FED_TOTAL_SOCIETIES}</Text>
              </View>
            </Card2>
          </>
        ) : null}
      </Drawer>
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  chartLabel: { color: colors.sage, fontSize: 11, fontWeight: '800', marginBottom: 5 },
  reportTitle: { color: colors.ink, fontSize: 12, fontWeight: '900', flex: 1 },
  reportMetric: { color: colors.sage, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  reportValue: { color: colors.cta, fontSize: 17, fontWeight: '900' },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  previewLabel: { color: colors.sage, fontSize: 11, fontWeight: '700', flex: 1 },
  previewValue: { color: colors.ink, fontSize: 11, fontWeight: '900' },
});