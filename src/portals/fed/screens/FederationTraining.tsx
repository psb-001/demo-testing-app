import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FED_SHORTAGE_TRADES,
  FED_TRAINING_PROGRAMS,
  FED_WELFARE,
  FED_WORKERS,
  type FedWorker,
} from '../fedData';
import { CHART_COLORS, HBarList } from '../fedCharts';
import { FederationWorkerPassport } from '../WorkerSkillPassport';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
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
  StatusBadge,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Training & Skills — ported from
 * workconnect/src/portals/fed/screens/Training.tsx.
 *
 * One deliberate change: the web version's third button scrolled to the program
 * list with `document.getElementById(...).scrollIntoView()`. There is no DOM
 * here, so "Open training programs" scrolls the enclosing ScrollView instead
 * (see `scrollRef`).
 */

export const FederationTraining: React.FC = () => {
  const t = useFedT();
  const { showToast } = useFedStore();

  const [enrolled, setEnrolled] = useState<Record<string, number>>({});
  const [notified, setNotified] = useState<string[]>([]);
  const [openWorker, setOpenWorker] = useState<FedWorker | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const topShortage = FED_SHORTAGE_TRADES[0];
  const renewalQueue = useMemo(
    () => FED_WORKERS.filter((w) => w.certifications.some((c) => c.status !== 'Certified')),
    [],
  );

  const enroll = (programId: string, totalSeats: number) => {
    setEnrolled((prev) => {
      const current = prev[programId] ?? 0;
      if (current >= totalSeats) {
        showToast('All seats for this intake are filled.');
        return prev;
      }
      showToast('One worker enrolled.');
      return { ...prev, [programId]: current + 1 };
    });
  };

  return (
    <FedScreen scrollRef={scrollRef}>
      <ScreenHeader
        title={t('title_training')}
        subtitle="Close verified skill gaps with targeted training intakes run by member societies."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="46%">
        <FederationKpiCard label="Programs" value={`${FED_TRAINING_PROGRAMS.length}`} sub="active intakes" tone="green" icon="school-outline" />
        <FederationKpiCard label="Shortage trades" value={`${FED_SHORTAGE_TRADES.length}`} sub="trades below demand" tone="red" icon="trending-down-outline" />
        <FederationKpiCard label="Cert renewal due" value={`${FED_WELFARE.certRenewalDue}`} sub="certificates to renew" tone="amber" icon="refresh-outline" />
        <FederationKpiCard label="Training due" value={`${FED_WELFARE.trainingDue}`} sub="refresher assignments" tone="blue" icon="book-outline" />
      </Grid>

      {topShortage ? (
        <Card2 style={{ gap: 12 }}>
          <SectionTitle hint="The largest predicted shortfall, paired with the recommended intervention.">
            Skill shortage → training action
          </SectionTitle>
          <View style={styles.splitRow}>
            <View style={[styles.splitCard, styles.splitCardRisk]}>
              <Text style={styles.splitKicker}>Predicted shortage</Text>
              <Text style={styles.splitTitle}>{topShortage.trade}</Text>
              <Text style={styles.splitBody}>
                {Math.abs(topShortage.gap)} workers short in {topShortage.location} over the next 7 days.
              </Text>
            </View>
            <View style={[styles.splitCard, styles.splitCardFix]}>
              <Text style={styles.splitKicker}>Recommended programme</Text>
              <Text style={styles.splitTitle}>{FED_TRAINING_PROGRAMS[0]?.title ?? 'Refresher intake'}</Text>
              <Text style={styles.splitBody}>
                {FED_TRAINING_PROGRAMS[0]?.eligible ?? 0} eligible workers · {FED_TRAINING_PROGRAMS[0]?.duration ?? '—'} ·{' '}
                {FED_TRAINING_PROGRAMS[0]?.certification ?? '—'}
              </Text>
            </View>
          </View>
          <Row wrap>
            <ActBtn label="Open training programs" icon="arrow-down" tone="dark" onPress={() => scrollRef.current?.scrollToEnd({ animated: true })} />
            <ActBtn label="View workforce" icon="people-outline" tone="ghost" onPress={() => showToast('Open the Workforce tab to review eligibility.')} />
          </Row>
        </Card2>
      ) : null}

      <View>
        <SectionTitle hint="Federation-run and society-delivered certification intakes.">Training programs</SectionTitle>
        <View style={{ gap: 9 }}>
          {FED_TRAINING_PROGRAMS.map((program) => {
            const extra = enrolled[program.id] ?? 0;
            const filled = program.enrolled + extra;
            const pct = program.totalSeats ? (filled / program.totalSeats) * 100 : 0;
            return (
              <Card2 key={program.id} style={{ gap: 10 }}>
                <Row>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.programTitle} numberOfLines={1}>{program.title}</Text>
                    <Text style={styles.programMeta} numberOfLines={1}>{program.trade} · {program.location}</Text>
                  </View>
                  <StatusBadge value={`${filled}/${program.totalSeats}`} tone={pct >= 100 ? 'green' : 'amber'} />
                </Row>
                <Text style={styles.programReason}>{program.reason}</Text>
                <KV k="Duration" v={program.duration} />
                <KV k="Schedule" v={program.schedule} />
                <KV k="Certification" v={program.certification} />
                <KV k="Eligible" v={`${program.eligible}`} mono />
                <ProgressRow label="Seats filled" pct={pct} right={`${filled} of ${program.totalSeats}`} />
                <Row wrap>
                  <ActBtn
                    label={filled >= program.totalSeats ? 'Intake full' : 'Enroll a worker'}
                    icon="person-add-outline"
                    disabled={filled >= program.totalSeats}
                    onPress={() => enroll(program.id, program.totalSeats)}
                  />
                  <ActBtn
                    label={notified.includes(program.id) ? 'Societies notified' : 'Notify eligible societies'}
                    icon="notifications-outline"
                    tone="ghost"
                    onPress={() => {
                      setNotified((prev) => (prev.includes(program.id) ? prev : [...prev, program.id]));
                      showToast('Eligible societies notified about this intake.');
                    }}
                  />
                </Row>
              </Card2>
            );
          })}
        </View>
      </View>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Trades where certified supply is below expected demand.">Skill gaps to close</SectionTitle>
        <HBarList
          rows={FED_SHORTAGE_TRADES.map((trade) => ({
            label: trade.trade,
            value: Math.abs(trade.gap),
            max: Math.max(...FED_SHORTAGE_TRADES.map((t) => Math.abs(t.gap))),
            right: `−${Math.abs(trade.gap)}`,
            tone: CHART_COLORS.amber,
          }))}
        />
      </Card2>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Federation-wide certification and refresher readiness.">Training readiness</SectionTitle>
        <HBarList
          rows={[
            { label: 'Certified and current', value: 82, max: 100, right: '82%', tone: CHART_COLORS.brand },
            { label: 'Refresher training due', value: 11, max: 100, right: '11%', tone: CHART_COLORS.amber },
            { label: 'Certification expired', value: 4, max: 100, right: '4%', tone: colors.danger },
            { label: 'Awaiting assessment', value: 3, max: 100, right: '3%', tone: colors.sage },
          ]}
        />
      </Card2>

      <View>
        <SectionTitle hint="Workers with a certification that is expiring or due for renewal.">Certification renewal queue</SectionTitle>
        <RecordList isEmpty={renewalQueue.length === 0} emptyLabel="Every certification is current">
          {renewalQueue.map((worker) => {
            const due = worker.certifications.find((c) => c.status !== 'Certified');
            return (
              <RecordCard
                key={worker.id}
                title={worker.name}
                subtitle={`${worker.trade} · ${worker.location}`}
                badge={{ label: due?.status ?? 'Renewal Due', tone: due?.status === 'Expiring Soon' ? 'amber' : 'red' }}
                onPress={() => setOpenWorker(worker)}
                fields={[
                  { label: 'Certification', value: due?.name ?? '—' },
                  { label: 'Issuer', value: due?.issuer ?? '—' },
                  { label: 'Expiry', value: due?.expiry ?? '—' },
                  { label: 'Verification', value: worker.verification },
                ]}
              />
            );
          })}
        </RecordList>
      </View>

      <FederationAlert
        tone="info"
        title="Why training is federation-run"
        body="Certification is what makes a Skill Passport verifiable, so intakes are approved centrally and delivered by member societies."
      />

      <FederationWorkerPassport worker={openWorker} onClose={() => setOpenWorker(null)} />
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  splitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  splitCard: { flex: 1, minWidth: '45%', borderRadius: 12, padding: 12, gap: 4 },
  splitCardRisk: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FECACA' },
  splitCardFix: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#C5E8D2' },
  splitKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase', color: colors.sage },
  splitTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  splitBody: { color: colors.sage, fontSize: 10, lineHeight: 15 },
  programTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  programMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  programReason: { color: colors.sage, fontSize: 10, lineHeight: 15 },
});