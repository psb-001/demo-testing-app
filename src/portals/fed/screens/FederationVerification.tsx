import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_TOTAL_WORKERS,
  FED_VERIFY_BY_TRADE,
  FED_VERIFY_CHECKS,
  FED_VERIFY_TOTALS,
} from '../fedData';
import { CHART_COLORS, StackedBar } from '../fedCharts';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  DetailStat,
  FedScreen,
  Grid,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
  type BadgeTone,
} from '../fedUI';
import { useFedStore } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Worker Verification — ported from
 * workconnect/src/portals/fed/screens/Verification.tsx.
 *
 * The web screen had two `Chip` filters that returned `true` for both branches,
 * i.e. they were inert. They are not reproduced here; the trade table renders
 * unfiltered, which is what the user actually saw.
 */

export const FederationVerification: React.FC = () => {
  const { showToast } = useFedStore();
  const [reviewed, setReviewed] = useState<string[]>([]);
  const totals = FED_VERIFY_TOTALS;

  const states = useMemo(
    () =>
      [
        { key: 'verified', label: 'Verified', value: totals.verified, tone: 'green' as BadgeTone, icon: 'shield-checkmark' as const },
        { key: 'pending', label: 'Pending', value: totals.pending, tone: 'amber' as BadgeTone, icon: 'time-outline' as const },
        { key: 'needsReview', label: 'Needs review', value: totals.needsReview, tone: 'red' as BadgeTone, icon: 'alert-circle-outline' as const },
        { key: 'expired', label: 'Expired', value: totals.expired, tone: 'slate' as BadgeTone, icon: 'close-circle-outline' as const },
      ].map((s) => ({ ...s, pct: FED_TOTAL_WORKERS ? (s.value / FED_TOTAL_WORKERS) * 100 : 0 })),
    [totals],
  );

  const queue = (key: string, label: string) => {
    if (reviewed.includes(key)) {
      showToast(`${label} queue already actioned in this session.`);
      return;
    }
    setReviewed((prev) => [...prev, key]);
    showToast(`${label} queue opened — ${totals[key as keyof typeof totals]} workers.`);
  };

  return (
    <FedScreen>
      <ScreenHeader
        title="Worker Verification"
        subtitle="Verification state across the federation workforce, and the checks behind it."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="46%">
        {states.map((s) => (
          <Card2 key={s.key} style={{ gap: 6 }}>
            <Row>
              <StatusBadge value={s.label} tone={s.tone} />
              <View style={{ flex: 1 }} />
              <Text style={[styles.statePct, { color: TONE_COLOR[s.tone] }]}>{s.pct.toFixed(1)}%</Text>
            </Row>
            <Text style={styles.stateValue}>{s.value.toLocaleString('en-IN')}</Text>
            <Text style={styles.stateLabel}>of {FED_TOTAL_WORKERS.toLocaleString('en-IN')} workers</Text>
          </Card2>
        ))}
      </Grid>

      <Card2 style={{ gap: 14 }}>
        <SectionTitle hint="Each bar shows verified, in-review and expired shares for that trade.">
          Verification by trade
        </SectionTitle>
        <View style={styles.tradeList}>
          {FED_VERIFY_BY_TRADE.map((row) => {
            const total = row.verified + row.pending + row.needsReview + row.expired;
            return (
              <View key={row.trade} style={styles.tradeRow}>
                <Row>
                  <Text style={styles.tradeName} numberOfLines={1}>{row.trade}</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.tradeVerified}>{row.verified}</Text>
                  <Text style={styles.tradeTotal}>/{total}</Text>
                </Row>
                <View style={{ marginTop: 5 }}>
                  <StackedBar
                    height={9}
                    total={total}
                    segments={[
                      { label: 'Verified', value: row.verified, color: CHART_COLORS.brand },
                      { label: 'Pending + review', value: row.pending + row.needsReview, color: CHART_COLORS.amber },
                      { label: 'Expired', value: row.expired, color: '#DC2626' },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
        <Row wrap>
          <LegendSwatch color={CHART_COLORS.brand} label="Verified" />
          <LegendSwatch color={CHART_COLORS.amber} label="Pending / review" />
          <LegendSwatch color="#DC2626" label="Expired" />
        </Row>
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Every worker must clear these before a Skill Passport is issued.">Verification checks</SectionTitle>
        {FED_VERIFY_CHECKS.map((check) => (
          <View key={check} style={styles.checkRow}>
            <View style={styles.checkTick}>
              <Text style={styles.checkTickText}>✓</Text>
            </View>
            <Text style={styles.checkText}>{check}</Text>
          </View>
        ))}
        <Row wrap style={{ marginTop: 4 }}>
          <ActBtn label="Process pending" tone="ghost" onPress={() => queue('pending', 'Pending')} />
          <ActBtn label="Review flagged" tone="ghost" onPress={() => queue('needsReview', 'Needs review')} />
          <ActBtn label="Re-issue expired" tone="ghost" onPress={() => queue('expired', 'Expired')} />
        </Row>
      </Card2>

      <Grid minWidth="30%">
        <DetailStat label="Passport coverage" value={`${((FED_VERIFY_TOTALS.verified / FED_TOTAL_WORKERS) * 100).toFixed(1)}%`} tone="green" />
        <DetailStat label="In review" value={`${totals.pending + totals.needsReview}`} tone="amber" />
        <DetailStat label="Expired" value={`${totals.expired}`} tone="red" />
      </Grid>

      <Card2 style={styles.trustCard}>
        <Row>
          <StatusBadge value="Consumer trust" tone="green" />
        </Row>
        <Text style={styles.trustBody}>
          A verified Skill Passport is what lets a customer book with confidence and a worker be matched to fair, formal work.
          Verification is issued by the member society and countersigned by the federation.
        </Text>
      </Card2>
    </FedScreen>
  );
};

const LegendSwatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const TONE_COLOR: Record<BadgeTone, string> = {
  green: CHART_COLORS.brand,
  amber: '#B45309',
  red: colors.danger,
  slate: colors.sage,
  blue: '#1D4E89',
};

const styles = StyleSheet.create({
  statePct: { fontSize: 12, fontWeight: '900' },
  stateValue: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  stateLabel: { color: colors.sage, fontSize: 9 },
  tradeList: { gap: 4 },
  tradeRow: { paddingVertical: 8 },
  tradeName: { color: colors.ink, fontSize: 11, fontWeight: '800', flex: 1 },
  tradeVerified: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  tradeTotal: { color: colors.sage, fontSize: 10, fontWeight: '700' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: colors.sage, fontSize: 10, fontWeight: '700' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkTick: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkTickText: { color: colors.forest, fontSize: 10, fontWeight: '900' },
  checkText: { color: colors.ink, fontSize: 11, lineHeight: 16, flex: 1 },
  trustCard: { backgroundColor: '#F2FAF6', borderColor: 'rgba(22,138,91,0.2)', gap: 8 },
  trustBody: { color: colors.ink, fontSize: 11, lineHeight: 16 },
});