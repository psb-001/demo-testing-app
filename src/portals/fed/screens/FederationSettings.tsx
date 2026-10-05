import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FEDERATION_NAME, FEDERATION_REGION } from '../fedData';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  FedScreen,
  KV,
  Row,
  ScreenHeader,
  SectionTitle,
  Stepper,
  ToggleRow,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { useI18n } from '../../../i18n';
import { colors } from '../../../theme/theme';

/**
 * Federation Settings — ported from
 * workconnect/src/portals/fed/screens/Settings.tsx.
 *
 * The portal language control is the important change: on the web it called a
 * local `onChangeLang` prop, in a portal that had its own language state
 * alongside the global one. Here it drives the app-wide `useI18n()` language, so
 * switching it translates the entire app and persists across restarts — which is
 * what a user expects from a language setting.
 *
 * The six `<input type="range">` fairness weights became `Stepper` controls to
 * avoid adding a native slider dependency for one screen.
 */

/** Default fairness weights, matching the web screen's initial state. */
const DEFAULT_WEIGHTS = {
  skill: 30,
  fairness: 25,
  proximity: 20,
  verification: 15,
  availability: 10,
  rating: 5,
};

const WEIGHT_TOTAL = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);

export const FederationSettings: React.FC = () => {
  const { showToast } = useFedStore();
  const t = useFedT();
  const { lang, setLang, languages } = useI18n();

  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [prefs, setPrefs] = useState({
    demandAlerts: true,
    welfareAlerts: true,
    certExpiry: true,
    emergencyDispatch: true,
    weeklyDigest: false,
  });

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <FedScreen>
      <ScreenHeader
        title={t('settings')}
        subtitle="Federation identity, portal language, fair-allocation weights and alert preferences."
        tag={<CoopDemoTag />}
      />

      <Card2 style={{ gap: 4 }}>
        <SectionTitle>Federation identity</SectionTitle>
        <KV k="Name" v={FEDERATION_NAME} />
        <KV k="Region" v={FEDERATION_REGION} />
        <KV k="Portal" v="Rozgar Federation Administration" />
        <KV k="Data" v="Deterministic SIH prototype dataset" />
      </Card2>

      <Card2 style={{ gap: 10 }}>
        <SectionTitle hint="Applies to the whole app, not just this portal.">Portal language</SectionTitle>
        <Row wrap>
          {languages.map((l) => (
            <ActBtn
              key={l.code}
              label={l.native}
              tone={lang === l.code ? 'dark' : 'ghost'}
              onPress={() => {
                setLang(l.code);
                showToast(`Language set to ${l.label}.`);
              }}
            />
          ))}
        </Row>
        <Text style={styles.hint}>
          English, हिन्दी and मराठी are supported. The choice is saved on this device and applies immediately.
        </Text>
      </Card2>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="Relative influence of each factor in the AI allocation engine.">
          Fair allocation weights
        </SectionTitle>
        <Stepper label="Skill match" value={weights.skill} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, skill: v }))} />
        <Stepper label="Fairness / workload" value={weights.fairness} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, fairness: v }))} />
        <Stepper label="Proximity" value={weights.proximity} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, proximity: v }))} />
        <Stepper label="Verification" value={weights.verification} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, verification: v }))} />
        <Stepper label="Availability" value={weights.availability} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, availability: v }))} />
        <Stepper label="Rating" value={weights.rating} min={0} max={60} step={5} suffix="" onChange={(v) => setWeights((w) => ({ ...w, rating: v }))} />

        <View style={[styles.totalRow, total !== WEIGHT_TOTAL && styles.totalRowWarn]}>
          <Text style={styles.totalLabel}>Running total</Text>
          <Text style={[styles.totalValue, total !== WEIGHT_TOTAL && styles.totalValueWarn]}>
            {total} / {WEIGHT_TOTAL}
          </Text>
        </View>
        {total !== WEIGHT_TOTAL ? (
          <Text style={styles.hint}>
            Weights are normalised when ranking, so the total does not have to equal {WEIGHT_TOTAL}.
          </Text>
        ) : null}

        <ActBtn
          label="Publish weights to societies"
          icon="cloud-upload-outline"
          onPress={() => showToast(`Allocation weights published to ${FEDERATION_NAME} member societies.`)}
        />
      </Card2>

      <Card2 style={{ gap: 4 }}>
        <SectionTitle>Alert preferences</SectionTitle>
        <ToggleRow label="Demand spike alerts" hint="When trade demand exceeds available workforce" value={prefs.demandAlerts} onChange={(v) => setPrefs((p) => ({ ...p, demandAlerts: v }))} />
        <ToggleRow label="Welfare enrollment gaps" hint="Pending enrollments and claim reviews" value={prefs.welfareAlerts} onChange={(v) => setPrefs((p) => ({ ...p, welfareAlerts: v }))} />
        <ToggleRow label="Certification expiry" hint="Certificates expiring within 30 days" value={prefs.certExpiry} onChange={(v) => setPrefs((p) => ({ ...p, certExpiry: v }))} />
        <ToggleRow label="Emergency dispatch volume" hint="Priority requests above weekly average" value={prefs.emergencyDispatch} onChange={(v) => setPrefs((p) => ({ ...p, emergencyDispatch: v }))} />
        <ToggleRow label="Weekly digest" hint="A Monday summary of federation performance" value={prefs.weeklyDigest} onChange={(v) => setPrefs((p) => ({ ...p, weeklyDigest: v }))} />
        <ActBtn label="Save preferences" onPress={() => showToast('Alert preferences saved.')} style={{ marginTop: 8 }} />
      </Card2>
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  hint: { color: colors.sage, fontSize: 10, lineHeight: 15 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.mint, borderRadius: 10, padding: 11 },
  totalRowWarn: { backgroundColor: '#FFF3E5' },
  totalLabel: { color: colors.sage, fontSize: 11, fontWeight: '800' },
  totalValue: { color: colors.forest, fontSize: 13, fontWeight: '900' },
  totalValueWarn: { color: '#B45309' },
});