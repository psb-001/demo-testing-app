import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_WELFARE,
  FED_WELFARE_ALERTS,
  FED_WELFARE_PROGRAMS,
  FED_WORKERS,
  societyName,
  type WelfareProgram,
} from '../fedData';
import { CHART_COLORS, Donut, HBarList } from '../fedCharts';
import { FederationWorkerPassport } from '../WorkerSkillPassport';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  DetailStat,
  Drawer,
  FederationAlert,
  FederationKpiCard,
  FedScreen,
  Grid,
  KV,
  ProgressRow,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SectionTitle,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';
import { CRORE } from '../fedData';

/**
 * Welfare & Insurance — ported from
 * workconnect/src/portals/fed/screens/Welfare.tsx.
 *
 * The `AttentionDrawer` in the web branched on `alert.id === 'wa2' | 'wa4'` to
 * decide which workers to list. That mapping is preserved rather than guessed
 * at, so an alert keeps showing the same audience it did on the web.
 */

/** Which welfare status the alert's "review" list should show. */
const ALERT_WORKER_FILTER: Record<string, (w: (typeof FED_WORKERS)[number]) => boolean> = {
  wa1: (w) => w.welfare === 'Enrollment Due',
  wa2: (w) => w.welfare === 'Claim Review',
  wa3: (w) => w.certifications.some((c) => c.status === 'Expiring Soon'),
  wa4: (w) => w.welfare === 'Covered' && w.certifications.some((c) => c.status === 'Renewal Due'),
};

export const FederationWelfare: React.FC = () => {
  const t = useFedT();
  const { showToast } = useFedStore();
  const [reminded, setReminded] = useState<string[]>([]);
  const [openProgram, setOpenProgram] = useState<WelfareProgram | null>(null);
  const [reviewAlertId, setReviewAlertId] = useState<string | null>(null);
  const [openWorker, setOpenWorker] = useState<(typeof FED_WORKERS)[number] | null>(null);

  const w = FED_WELFARE;

  const reviewWorkers = useMemo(() => {
    if (!reviewAlertId) return [];
    const filter = ALERT_WORKER_FILTER[reviewAlertId];
    return filter ? FED_WORKERS.filter(filter) : [];
  }, [reviewAlertId]);

  const reviewAlert = useMemo(
    () => FED_WELFARE_ALERTS.find((a) => a.id === reviewAlertId),
    [reviewAlertId],
  );

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_welfare')}
        subtitle="Pooled welfare fund, insurance coverage and certification support across every member society."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="31%">
        <FederationKpiCard label="Coverage" value={`${w.coveragePct}%`} sub={`${w.covered.toLocaleString('en-IN')} of ${w.totalWorkers.toLocaleString('en-IN')} workers`} tone="green" icon="shield-checkmark-outline" />
        <FederationKpiCard label="Pending enrollment" value={`${w.pendingEnrollment}`} sub="awaiting society action" tone="amber" icon="time-outline" />
        <FederationKpiCard label="Insurance coverage" value={`${w.insuranceCoverage}%`} sub="policy holders" tone="blue" icon="document-text-outline" />
        <FederationKpiCard label="Welfare fund (FY)" value={CRORE(w.welfareFundFY)} sub="pooled federation fund" tone="green" icon="wallet-outline" />
        <FederationKpiCard label="Claims pending" value={`${w.claimsPending}`} sub={`${w.claimsThisMonth} raised this month`} tone="red" icon="alert-circle-outline" />
        <FederationKpiCard label="Expiring in 30d" value={`${w.policiesExpiring30d}`} sub={`${w.certRenewalDue} certificates due`} tone="amber" icon="calendar-outline" />
      </Grid>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Share of the federation workforce with active welfare coverage.">Federation coverage</SectionTitle>
        <Donut
          pct={w.coveragePct}
          size={130}
          label={`${w.covered.toLocaleString('en-IN')} of ${w.totalWorkers.toLocaleString('en-IN')} registered workers are covered by a member society welfare scheme.`}
        />
        <HBarList
          rows={[
            { label: 'Covered', value: w.covered, max: w.totalWorkers, right: `${w.coveragePct}%`, tone: CHART_COLORS.brand },
            { label: 'Pending enrollment', value: w.pendingEnrollment, max: w.totalWorkers, right: `${w.pendingEnrollment}`, tone: CHART_COLORS.amber },
            { label: 'Not enrolled', value: Math.max(0, w.totalWorkers - w.covered - w.pendingEnrollment), max: w.totalWorkers, right: `${Math.max(0, w.totalWorkers - w.covered - w.pendingEnrollment)}`, tone: colors.sage },
          ]}
        />
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Every booking contributes 2% of service value to the pooled fund.">Pooled welfare fund</SectionTitle>
        <Grid minWidth="46%">
          <DetailStat label="Fund value (FY)" value={CRORE(w.welfareFundFY)} tone="green" />
          <DetailStat label="Claims this month" value={`${w.claimsThisMonth}`} tone="amber" />
          <DetailStat label="Claims settled" value={CRORE(w.claimsPaid)} tone="blue" />
          <DetailStat label="Pending claims" value={`${w.claimsPending}`} tone="red" />
        </Grid>
      </Card2>

      <View>
        <SectionTitle hint="Federation-administered insurance and welfare schemes.">Insurance programs</SectionTitle>
        <RecordList>
          {FED_WELFARE_PROGRAMS.map((p) => (
            <RecordCard
              key={p.id}
              title={p.name}
              subtitle={p.detail}
              badge={{ label: `${p.coverage}%` }}
              onPress={() => setOpenProgram(p)}
              fields={[
                { label: 'Eligible', value: `${p.eligible.toLocaleString('en-IN')}` },
                { label: 'Enrolled', value: `${p.enrolled.toLocaleString('en-IN')}` },
                { label: 'Pending', value: `${p.pending}` },
                { label: 'Renewal due', value: `${p.renewalDue}` },
              ]}
            />
          ))}
        </RecordList>
      </View>

      <View>
        <SectionTitle hint="Items that need a federation decision.">Attention required</SectionTitle>
        <View style={{ gap: 8 }}>
          {FED_WELFARE_ALERTS.map((alert) => (
            <Card2 key={alert.id} style={{ gap: 9 }}>
              <Row>
                <View style={styles.alertCount}>
                  <Text style={styles.alertCountText}>{alert.count}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertBody}>{alert.body}</Text>
                </View>
              </Row>
              <Row wrap>
                <ActBtn label="Review" tone="ghost" onPress={() => setReviewAlertId(alert.id)} />
                <ActBtn
                  label={reminded.includes(alert.id) ? 'Reminder sent' : 'Send reminder'}
                  icon="notifications-outline"
                  tone="ghost"
                  onPress={() => {
                    setReminded((prev) => (prev.includes(alert.id) ? prev : [...prev, alert.id]));
                    showToast(`Reminder sent for ${alert.title.toLowerCase()}.`);
                  }}
                />
              </Row>
            </Card2>
          ))}
        </View>
      </View>

      <ProgramDrawer program={openProgram} onClose={() => setOpenProgram(null)} />

      <Drawer
        title={reviewAlert?.title ?? 'Review'}
        subtitle={reviewAlert ? `${reviewAlert.count} items` : undefined}
        open={!!reviewAlertId}
        onClose={() => setReviewAlertId(null)}
      >
        {reviewAlert ? <FederationAlert tone={reviewAlert.severity === 'danger' ? 'danger' : 'warn'} title={reviewAlert.title} body={reviewAlert.body} /> : null}
        {reviewWorkers.length === 0 ? (
          <Text style={styles.muted}>No workers in the demo dataset match this alert.</Text>
        ) : (
          <RecordList>
            {reviewWorkers.map((worker) => (
              <RecordCard
                key={worker.id}
                title={worker.name}
                subtitle={`${worker.trade} · ${worker.location}`}
                badge={{ label: worker.welfare }}
                onPress={() => setOpenWorker(worker)}
                fields={[
                  { label: 'Society', value: societyName(worker.societyId) },
                  { label: 'Verification', value: worker.verification },
                  { label: 'Certifications', value: `${worker.certifications.length}` },
                ]}
              />
            ))}
          </RecordList>
        )}
      </Drawer>

      <FederationWorkerPassport worker={openWorker} onClose={() => setOpenWorker(null)} />
    </FedScreen>
  );
};

const ProgramDrawer: React.FC<{ program: WelfareProgram | null; onClose: () => void }> = ({ program, onClose }) => {
  if (!program) return null;
  return (
    <Drawer title={program.name} subtitle={program.detail} open onClose={onClose}>
      <Grid minWidth="30%">
        <DetailStat label="Eligible" value={program.eligible.toLocaleString('en-IN')} />
        <DetailStat label="Enrolled" value={program.enrolled.toLocaleString('en-IN')} tone="green" />
        <DetailStat label="Pending" value={`${program.pending}`} tone="amber" />
        <DetailStat label="Renewal due" value={`${program.renewalDue}`} tone="red" />
      </Grid>
      <Card2 style={{ gap: 10 }}>
        <ProgressRow label="Enrollment" pct={program.eligible ? (program.enrolled / program.eligible) * 100 : 0} right={`${program.enrolled} of ${program.eligible}`} />
        <ProgressRow label="Coverage" pct={program.coverage} right={`${program.coverage}%`} color={CHART_COLORS.brandDeep} />
        <KV k="Scheme" v={program.name} />
        <KV k="Detail" v={program.detail} />
      </Card2>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  alertCount: { minWidth: 34, height: 34, paddingHorizontal: 8, borderRadius: 17, backgroundColor: '#FFF3E5', alignItems: 'center', justifyContent: 'center' },
  alertCountText: { color: '#B45309', fontSize: 13, fontWeight: '900' },
  alertTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  alertBody: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  muted: { color: colors.sage, fontSize: 11, lineHeight: 16 },
});