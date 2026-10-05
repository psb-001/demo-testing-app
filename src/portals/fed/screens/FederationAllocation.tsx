import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FED_ALLOCATIONS,
  FED_ALLOCATION_NOTE,
  workerById,
  type AllocationCandidate,
} from '../fedData';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  ConfirmDialog,
  FederationAlert,
  FedScreen,
  ProgressRow,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * AI Workforce Allocation — ported from
 * workconnect/src/portals/fed/screens/Allocation.tsx.
 *
 * The "fair boost" ranking is preserved exactly as the web computed it:
 *   `matchScore + workload*0.18 + recentJobs*-0.55`
 * i.e. workers who have done fewer recent jobs rank higher, which is the
 * anti-hoarding behaviour the federation promises.
 */

const FACTORS: { key: keyof AllocationCandidate; label: string }[] = [
  { key: 'skill', label: 'Skill match' },
  { key: 'availability', label: 'Availability' },
  { key: 'experience', label: 'Experience' },
  { key: 'location', label: 'Location proximity' },
  { key: 'certification', label: 'Certification' },
  { key: 'workload', label: 'Workload opportunity' },
  { key: 'reliability', label: 'Reliability' },
];

/** Replicates the web fair-boost re-sort. */
function rank(candidates: AllocationCandidate[], fairBoost: boolean): AllocationCandidate[] {
  const list = [...candidates];
  if (!fairBoost) return list;
  return list.sort(
    (a, b) =>
      b.matchScore + b.workload * 0.18 - b.recentJobs * 0.55 -
      (a.matchScore + a.workload * 0.18 - a.recentJobs * 0.55),
  );
}

export const FederationAllocation: React.FC = () => {
  const { showToast, onOpenAI } = useFedStore();
  const t = useFedT();
  const [jobId, setJobId] = useState(FED_ALLOCATIONS[0]?.id ?? '');
  const [fairBoost, setFairBoost] = useState(true);
  const [confirming, setConfirming] = useState<AllocationCandidate | null>(null);

  const job = useMemo(() => FED_ALLOCATIONS.find((j) => j.id === jobId), [jobId]);
  const ranked = useMemo(() => (job ? rank(job.candidates, fairBoost) : []), [job, fairBoost]);

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_allocation')}
        subtitle="Explainable, fair-opportunity matching across every affiliated society."
        tag={<CoopDemoTag />}
        action={<ActBtn label="Ask Rozgar AI" icon="sparkles" tone="dark" onPress={onOpenAI} />}
      />

      <Card2 style={{ gap: 8 }}>
        <SectionTitle hint="The weights below decide who is recommended first.">How fair allocation works</SectionTitle>
        <Text style={styles.note}>{FED_ALLOCATION_NOTE}</Text>
        <View style={styles.factorList}>
          {[
            'Skill match against the job requirement',
            'Current availability (Available beats Busy)',
            'Years of experience in the trade',
            'Distance from the service location',
            'Certification and verification status',
            'Workload balance — favours underutilized workers',
            'Reliability from completed jobs and ratings',
            'Recent job distribution (anti-hoarding)',
          ].map((factor, i) => (
            <View key={factor} style={styles.factorRow}>
              <View style={styles.factorIndex}>
                <Text style={styles.factorIndexText}>{i + 1}</Text>
              </View>
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      </Card2>

      <View>
        <SectionTitle hint="Choose a job awaiting allocation.">Open jobs</SectionTitle>
        <View style={{ gap: 8 }}>
          {FED_ALLOCATIONS.map((j) => (
            <Card2
              key={j.id}
              style={[styles.jobCard, j.id === jobId && styles.jobCardActive]}
            >
              <Row>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{j.title}</Text>
                  <Text style={styles.jobMeta} numberOfLines={1}>
                    {j.trade} · {j.area} · {j.when} {j.slot}
                  </Text>
                  <Text style={styles.jobMeta} numberOfLines={1}>{j.customerType} · {j.candidates.length} candidates</Text>
                </View>
                <ActBtn
                  label={j.id === jobId ? 'Selected' : 'Review'}
                  tone={j.id === jobId ? 'dark' : 'ghost'}
                  onPress={() => setJobId(j.id)}
                />
              </Row>
            </Card2>
          ))}
        </View>
      </View>

      {job ? (
        <>
          <Card2 style={{ gap: 10 }}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailTitle}>{job.title}</Text>
                <Text style={styles.detailMeta}>{job.area} · {job.when} · {job.slot}</Text>
              </View>
              <ActBtn
                label={fairBoost ? 'Fair boost on' : 'Fair boost off'}
                icon="sparkles"
                tone={fairBoost ? 'dark' : 'ghost'}
                onPress={() => setFairBoost((v) => !v)}
              />
            </Row>
            <FederationAlert
              title="Fair-opportunity ranking"
              body={
                fairBoost
                  ? 'Ranking adds a workload bonus and a recent-jobs penalty so underutilized workers are surfaced first.'
                  : 'Ranking is by raw match score only.'
              }
              tone={fairBoost ? 'success' : 'info'}
            />
          </Card2>

          <View style={{ gap: 10 }}>
            {ranked.map((candidate, index) => {
              const worker = workerById(candidate.workerId);
              return (
                <Card2 key={candidate.workerId} style={{ gap: 10 }}>
                  <Row>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.candName} numberOfLines={1}>{worker?.name ?? candidate.workerId}</Text>
                      <Text style={styles.candMeta} numberOfLines={1}>
                        {worker?.trade ?? ''} · {worker?.location ?? ''}
                      </Text>
                    </View>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchText}>{candidate.matchScore}%</Text>
                      <Text style={styles.matchLabel}>match</Text>
                    </View>
                  </Row>

                  <View style={{ gap: 7 }}>
                    {FACTORS.map((f) => (
                      <ProgressRow
                        key={f.key}
                        label={f.label}
                        pct={Number(candidate[f.key]) || 0}
                        right={`${candidate[f.key]}`}
                      />
                    ))}
                  </View>

                  <View style={styles.statStrip}>
                    <View style={styles.statCell}>
                      <Text style={styles.statLabel}>Distance</Text>
                      <Text style={styles.statValue}>{candidate.distanceKm} km</Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={styles.statLabel}>Jobs / 14d</Text>
                      <Text style={styles.statValue}>{candidate.recentJobs}</Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={styles.statLabel}>Workload</Text>
                      <Text style={styles.statValue}>{candidate.workload}</Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={styles.statLabel}>Reliability</Text>
                      <Text style={styles.statValue}>{candidate.reliability}</Text>
                    </View>
                  </View>

                  <View style={styles.whyBox}>
                    <Row>
                      <Ionicons name="help-circle" size={13} color={colors.teal} />
                      <Text style={styles.whyLabel}>Why this worker?</Text>
                    </Row>
                    <Text style={styles.whyText}>{candidate.why}</Text>
                  </View>

                  {worker ? (
                    <Row>
                      <StatusBadge value={worker.availability} />
                      <StatusBadge value={worker.verification} />
                      <StatusBadge value={worker.welfare} />
                    </Row>
                  ) : null}

                  <ActBtn
                    label="Confirm allocation"
                    icon="checkmark"
                    onPress={() => setConfirming(candidate)}
                  />
                </Card2>
              );
            })}
          </View>

          <Card2 style={{ gap: 6 }}>
            <SectionTitle>Decision rationale</SectionTitle>
            <Text style={styles.rationale}>{job.fairReason}</Text>
          </Card2>

          <Row>
            <ActBtn label="Re-run ranking" icon="refresh" tone="ghost" onPress={() => { setFairBoost((v) => !v); showToast('Ranking recomputed.'); }} style={{ flex: 1 }} />
            <ActBtn label="Push to society pool" icon="people-outline" tone="ghost" onPress={() => showToast('Job pushed to the member society pool.')} style={{ flex: 1 }} />
          </Row>

          <Grid3>
            <Guardrail icon="lock-closed" title="Location privacy" body="Exact customer addresses are never shown to workers." />
            <Guardrail icon="shield-checkmark" title="Verified first" body="Unverified workers are never auto-allocated." />
            <Guardrail icon="git-branch" title="Explainable" body="Every score is broken down into visible factors." />
          </Grid3>
        </>
      ) : null}

      <ConfirmDialog
        visible={!!confirming}
        title="Confirm allocation"
        body={
          confirming
            ? `Assign ${workerById(confirming.workerId)?.name ?? confirming.workerId} to this job at ${confirming.matchScore}% match? The cooperative and welfare shares will be applied automatically.`
            : ''
        }
        confirmLabel="Confirm"
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          const name = confirming ? workerById(confirming.workerId)?.name ?? confirming.workerId : '';
          setConfirming(null);
          showToast(`${name} allocated to ${job?.id ?? 'job'}.`);
        }}
      />
    </FedScreen>
  );
};

const Guardrail: React.FC<{ icon: React.ComponentProps<typeof Ionicons>['name']; title: string; body: string }> = ({
  icon,
  title,
  body,
}) => (
  <View style={{ width: '31%', flexGrow: 1, flexBasis: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 11, gap: 5 }}>
    <Ionicons name={icon} size={16} color={colors.cta} />
    <Text style={styles.guardTitle}>{title}</Text>
    <Text style={styles.guardBody}>{body}</Text>
  </View>
);

const Grid3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.grid3}>{children}</View>
);

const styles = StyleSheet.create({
  note: { color: colors.sage, fontSize: 11, lineHeight: 16 },
  factorList: { gap: 6, marginTop: 4 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factorIndex: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  factorIndexText: { color: colors.forest, fontSize: 9, fontWeight: '900' },
  factorText: { color: colors.ink, fontSize: 11, flex: 1, lineHeight: 15 },
  jobCard: { padding: 12 },
  jobCardActive: { borderColor: colors.cta, backgroundColor: '#F2FBF6' },
  jobTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  jobMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  detailTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  detailMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  rankBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  candName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  candMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  matchBadge: { alignItems: 'flex-end' },
  matchText: { color: colors.cta, fontSize: 17, fontWeight: '900' },
  matchLabel: { color: colors.sage, fontSize: 8, fontWeight: '800', textTransform: 'uppercase' },
  statStrip: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.warm, borderRadius: 10, padding: 9, rowGap: 8 },
  statCell: { width: '50%' },
  statLabel: { color: colors.sage, fontSize: 8, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.2 },
  statValue: { color: colors.ink, fontSize: 12, fontWeight: '900', marginTop: 2 },
  whyBox: { backgroundColor: '#F2FAF6', borderRadius: 10, padding: 10, gap: 5 },
  whyLabel: { color: colors.teal, fontSize: 10, fontWeight: '900' },
  whyText: { color: colors.sage, fontSize: 10, lineHeight: 15 },
  rationale: { color: colors.ink, fontSize: 11, lineHeight: 17 },
  grid3: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  guardTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  guardBody: { color: colors.sage, fontSize: 9, lineHeight: 13 },
});