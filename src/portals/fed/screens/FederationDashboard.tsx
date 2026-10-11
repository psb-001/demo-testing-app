import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FED_ACTIVITY,
  FED_ACTIVE_REQUESTS,
  FED_FORECAST_SERIES,
  FED_KPIS,
  FED_NOTICES,
  FED_SOCIETIES,
  FED_TOTAL_SOCIETIES,
  FED_TOTAL_WORKERS,
  FED_WELFARE_COVERAGE_PCT,
  FEDERATION_NAME,
  FEDERATION_REGION,
  type FedKpi,
} from '../fedData';
import { HBarList, LegendRow, LineChart } from '../fedCharts';
import { FederationKpiCard } from '../fedUI';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  FederationAlert,
  FedScreen,
  Grid,
  RecordCard,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
  type BadgeTone,
  type IconName,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation Dashboard — ported from
 * workconnect/src/portals/fed/screens/Dashboard.tsx.
 *
 * Layout adaptations for a phone:
 *  - The 9-column "Federation Network" table became a `RecordCard` list (each
 *    society a tappable card with a 2-up field grid).
 *  - The 7-node ecosystem strip became a 2-column grid of `FlowNode`s.
 *  - The two side-by-side cards (Activity / AI Outlook) are stacked.
 */

/** KPI id -> icon, mirroring the web `KPI_ICONS` map. */
const KPI_ICONS: Record<string, IconName> = {
  societies: 'business-outline',
  verified: 'shield-checkmark-outline',
  available: 'people-outline',
  requests: 'pulse-outline',
  completed: 'briefcase-outline',
  earnings: 'wallet-outline',
  welfare: 'heart-outline',
  demand: 'trending-up-outline',
};

const TONE_MAP: Record<string, BadgeTone> = {
  green: 'green',
  blue: 'blue',
  amber: 'amber',
  red: 'red',
  slate: 'slate',
};

export const FederationDashboard: React.FC = () => {
  const { go, onOpenAI, openSociety } = useFedStore();
  const t = useFedT();
  const networkSocieties = FED_SOCIETIES.slice(0, 5);

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_dashboard')}
        subtitle="Monitor affiliated societies, workforce availability, service demand, fair allocation, worker welfare and cooperative performance."
        tag={<CoopDemoTag />}
        action={<ActBtn label="Ask Rozgar AI" icon="sparkles" tone="dark" onPress={onOpenAI} />}
      />

      <View style={styles.identityStrip}>
        <Row>
          <Ionicons name="business" size={14} color={colors.forest} />
          <Text style={styles.identityName}>{FEDERATION_NAME}</Text>
        </Row>
        <Text style={styles.identityMeta}>
          {FEDERATION_REGION} · {FED_TOTAL_SOCIETIES} affiliated societies
        </Text>
      </View>

      <View>
        <Row style={{ marginBottom: 8 }}>
          <Text style={styles.inlineHeading}>Federation at a glance</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.inlineHint}>Reconciled demo period · 25 Sep 2026</Text>
        </Row>
        <Grid minWidth="46%">
          {FED_KPIS.map((kpi: FedKpi) => (
            <FederationKpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              sub={kpi.sub}
              tone={TONE_MAP[kpi.tone] ?? 'green'}
              icon={KPI_ICONS[kpi.id]}
            />
          ))}
        </Grid>
      </View>

      <Card2>
        <SectionTitle
          hint={`${FED_TOTAL_SOCIETIES} affiliated Labour Cooperative Societies · showing five priority societies; open the network for all ${FED_TOTAL_SOCIETIES}.`}
          action={<ActBtn label="View full network" tone="ghost" onPress={() => go('societies')} style={{ paddingVertical: 6 }} />}
        >
          Federation Network
        </SectionTitle>
        <View style={{ gap: 8 }}>
          {networkSocieties.map((society) => (
            <RecordCard
              key={society.id}
              onPress={() => openSociety(society.id)}
              title={society.name}
              subtitle={society.reg}
              trailing={<StatusBadge value={society.demand} />}
              fields={[
                { label: 'Location', value: society.area },
                { label: 'Members', value: `${society.workers}` },
                { label: 'Available', value: `${society.availableToday}` },
                { label: 'Active jobs', value: `${society.activeJobs}` },
                { label: 'Completed', value: society.completedJobs.toLocaleString('en-IN') },
                { label: 'Welfare', value: `${society.welfarePct}%` },
              ]}
            />
          ))}
        </View>
      </Card2>

      <Card2>
        <SectionTitle hint="Service demand and workforce availability across operating localities.">
          Federation Activity
        </SectionTitle>
        <View style={{ gap: 7 }}>
          {FED_ACTIVITY.map((item) => (
            <View key={item.label} style={styles.activityRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.activityLabel} numberOfLines={1}>{item.label}</Text>
                <Text style={styles.activitySub} numberOfLines={1}>{item.sub}</Text>
              </View>
              <View style={[styles.activityDot, { backgroundColor: DOT_COLOR[item.tone] ?? colors.sage }]} />
              <Text style={styles.activityValue}>{item.value.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>
      </Card2>

      <Card2 style={styles.outlookCard}>
        <SectionTitle>AI Demand Outlook</SectionTitle>
        <Text style={styles.outlookLead}>
          Electrician demand is projected to increase in Pune East over the next 7 days.
        </Text>
        <View style={{ marginTop: 10, gap: 2 }}>
          {[
            ['Expected electrician demand', '128'],
            ['Available workforce', '96'],
            ['Expected shortage', '32'],
            ['Forecast confidence', '86%'],
          ].map(([label, value], i, arr) => (
            <View key={label} style={[styles.outlookRow, i < arr.length - 1 && styles.outlookRowBorder]}>
              <Text style={styles.outlookLabel}>{label}</Text>
              <Text style={styles.outlookValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Row style={{ marginTop: 12 }}>
          <ActBtn label="View forecast" onPress={() => go('forecast')} style={{ flex: 1 }} />
          <ActBtn label="View allocation" tone="ghost" onPress={() => go('allocation')} style={{ flex: 1 }} />
        </Row>
      </Card2>

      <Card2>
        <SectionTitle hint="A consistent view of demand, work opportunity, earnings and protection across the federation.">
          Federation Performance
        </SectionTitle>
        <View style={{ gap: 16 }}>
          <View>
            <Text style={styles.chartLabel}>Jobs completed / week</Text>
            <LineChart
              points={FED_FORECAST_SERIES.slice(-8).map((p) => ({ label: p.week, value: Math.round(p.value * 2.4) }))}
              height={125}
            />
            <LegendRow items={[{ color: '#168A5B', label: 'Completed jobs' }]} />
          </View>
          <View>
            <Text style={styles.chartLabel}>Worker earnings · ₹ lakh / week</Text>
            <LineChart
              points={[11.2, 11.8, 12.3, 12, 12.9, 13.7, 14.3, 14.9].map((value, i) => ({ label: `W${i + 1}`, value }))}
              height={125}
              colorMap={{ default: '#0F766E' }}
            />
            <LegendRow items={[{ color: '#0F766E', label: 'Worker payouts' }]} />
          </View>
          <View>
            <Text style={[styles.chartLabel, { marginBottom: 8 }]}>Society activity · active jobs</Text>
            <HBarList
              rows={FED_SOCIETIES.slice(0, 5).map((s) => ({
                label: s.trade,
                value: s.activeJobs,
                right: `${s.activeJobs} jobs`,
              }))}
            />
          </View>
        </View>
      </Card2>

      {/* Closed-loop ecosystem strip — the dark hero band on the web. */}
      <Card2 style={styles.ecosystem}>
        <Text style={styles.ecosystemKicker}>Closed-loop cooperative ecosystem</Text>
        <Text style={styles.ecosystemTitle}>
          Federation → Societies → Workers → Demand → Fair Jobs → Payments → Welfare
        </Text>
        <Grid minWidth="47%" style={{ marginTop: 14 }}>
          <FlowNode icon="business" label="Federation" value="1 apex body" onPress={() => go('dashboard')} />
          <FlowNode icon="business-outline" label="Societies" value={`${FED_TOTAL_SOCIETIES} affiliated`} onPress={() => go('societies')} />
          <FlowNode icon="people-outline" label="Workers" value={`${FED_TOTAL_WORKERS.toLocaleString('en-IN')} registered`} onPress={() => go('workforce')} />
          <FlowNode icon="pulse-outline" label="Demand" value={`${FED_ACTIVE_REQUESTS} active`} onPress={() => go('forecast')} />
          <FlowNode icon="sparkles-outline" label="AI + Fairness" value="Explainable match" onPress={() => go('allocation')} />
          <FlowNode icon="briefcase-outline" label="Jobs" value="8,642 completed" onPress={() => go('jobs')} />
          <FlowNode icon="heart-outline" label="Protection" value={`${FED_WELFARE_COVERAGE_PCT}% covered`} onPress={() => go('welfare')} />
        </Grid>
        <View style={styles.ecosystemFooter}>
          <Text style={styles.ecosystemFooterText}>• Locality-level geo matching</Text>
          <Text style={styles.ecosystemFooterText}>• Transparent settlements</Text>
          <Text style={styles.ecosystemFooterText}>• Verified Skill Passports</Text>
          <RecordCard
            onPress={onOpenAI}
            title="Ask the federation data"
            variant="dark"
            style={{ borderTopWidth: 0, paddingTop: 0, paddingHorizontal: 0, marginTop: 4 }}
            compact
          />
        </View>
      </Card2>

      <Card2>
        <SectionTitle
          hint="Tap an alert to jump straight to the operational area that needs action."
          action={<ActBtn label="All notifications" tone="ghost" onPress={() => go('notifications')} style={{ paddingVertical: 6 }} />}
        >
          Federation Alerts
        </SectionTitle>
        <View style={{ gap: 8 }}>
          {FED_NOTICES.slice(0, 4).map((notice) => (
            <FederationAlert
              key={notice.id}
              title={notice.title}
              body={notice.body}
              tone={notice.tone}
              onPress={() => go(notice.tab)}
            />
          ))}
        </View>
      </Card2>
    </FedScreen>
  );
};

const FlowNode: React.FC<{ icon: IconName; label: string; value: string; onPress: () => void }> = ({
  icon,
  label,
  value,
  onPress,
}) => (
  <View style={{ minWidth: '47%', flexGrow: 1, flexBasis: 0 }}>
    <RecordCard
      onPress={onPress}
      title={label}
      subtitle={value}
      compact
      variant="dark"
      leading={<Ionicons name={icon} size={15} color="#A7F3D0" />}
      showChevron={false}
    />
  </View>
);

const DOT_COLOR: Record<string, string> = {
  green: '#168A5B',
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  slate: '#94A3B8',
};

const styles = StyleSheet.create({
  identityStrip: { backgroundColor: '#F0F9F4', borderWidth: 1, borderColor: 'rgba(22,138,91,0.18)', borderRadius: 12, padding: 11, gap: 4 },
  identityName: { color: colors.forest, fontSize: 12, fontWeight: '900', flex: 1 },
  identityMeta: { color: colors.sage, fontSize: 10, fontWeight: '700' },
  inlineHeading: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  inlineHint: { color: colors.sage, fontSize: 9, fontWeight: '700' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.warm, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9 },
  activityLabel: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  activitySub: { color: colors.sage, fontSize: 9, marginTop: 2 },
  activityDot: { width: 6, height: 6, borderRadius: 3 },
  activityValue: { color: colors.ink, fontSize: 13, fontWeight: '900', minWidth: 44, textAlign: 'right' },
  outlookCard: { backgroundColor: '#F2FAF6', borderColor: 'rgba(22,138,91,0.22)' },
  outlookLead: { color: colors.forest, fontSize: 12, fontWeight: '900', lineHeight: 17 },
  outlookRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingVertical: 6 },
  outlookRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(22,138,91,0.12)' },
  outlookLabel: { color: colors.sage, fontSize: 11, flex: 1 },
  outlookValue: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  chartLabel: { color: colors.sage, fontSize: 11, fontWeight: '800', marginBottom: 5 },
  ecosystem: { backgroundColor: colors.forest, borderColor: colors.forest },
  ecosystemKicker: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  ecosystemTitle: { color: '#fff', fontSize: 14, fontWeight: '900', marginTop: 5, lineHeight: 20 },
  ecosystemFooter: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', gap: 5 },
  ecosystemFooterText: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700' },
});