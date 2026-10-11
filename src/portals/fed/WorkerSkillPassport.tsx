import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  societyName,
  type CertificationStatus,
  type FedWorker,
} from './fedData';
import { exportDemoText } from './fedExport';
import {
  ActBtn,
  Avatar,
  Card2,
  Drawer,
  KV,
  ProgressRow,
  Row,
  StatusBadge,
  type IconName,
} from './fedUI';
import { colors } from '../../theme/theme';

/**
 * Worker Skill Passport — ported from
 * workconnect/src/portals/fed/WorkerSkillPassport.tsx.
 *
 * The web version delegated the body to `SkillPassportView` and only supplied a
 * `PassportData` projection. There is no shared equivalent in the mobile app yet
 * (the customer-side `WorkerDetailScreen` has its own layout), so the passport
 * body is rendered here directly from the same `FedWorker` record. The privacy
 * note and the locality-only framing are preserved, because that is a product
 * commitment rather than incidental styling.
 */

/** The web version's `workerToPassport` projection, kept as a named mapping. */
const workerToPassport = (worker: FedWorker) => ({
  name: worker.name,
  tradeLabel: worker.trade,
  area: worker.location,
  cooperativeName: societyName(worker.societyId),
  verificationStatus: worker.verification === 'Verified' ? 'Cooperative Verified' : worker.verification,
  experienceYears: worker.experience,
  skills: worker.skills,
  certifications: worker.certifications.map((cert) => ({
    name: cert.name,
    issuer: cert.issuer,
    id: `DEMO-${worker.id.toUpperCase()}-${cert.issuer.toUpperCase()}`,
    status: cert.status === 'Certified' ? 'Verified' : cert.status,
    expiry: cert.expiry,
  })),
  availability: worker.availability,
  serviceRadiusKm: worker.serviceRadiusKm,
  rating: worker.rating,
  reviewCount: Math.round(worker.completedJobs * 0.62),
  welfareSupported: worker.welfare === 'Covered',
});

export const FederationWorkerPassport: React.FC<{
  worker: FedWorker | null;
  onClose: () => void;
}> = ({ worker, onClose }) => {
  if (!worker) return null;
  const passport = workerToPassport(worker);

  const download = () => {
    void exportDemoText(
      `rozgar-skill-passport-${worker.id}.txt`,
      `${worker.name} · Digital Skill Passport`,
      [
        `Trade: ${worker.trade}`,
        `Society: ${societyName(worker.societyId)}`,
        `Locality: ${worker.location}`,
        `Experience: ${worker.experience} years`,
        `Skills: ${worker.skills.join(', ')}`,
        `Certification: ${worker.certifications.map((c) => `${c.name} (${c.status})`).join(', ')}`,
        `Verification: ${worker.verification}`,
        `Availability: ${worker.availability}`,
        `Service radius: ${worker.serviceRadiusKm} km`,
        `Rating: ${worker.rating}/5`,
        `Completed jobs: ${worker.completedJobs}`,
        `Current workload: ${worker.workload}`,
        `Welfare coverage: ${worker.welfare}`,
      ],
    );
  };

  return (
    <Drawer
      title={`${worker.name} · Skill Passport`}
      subtitle={`${worker.trade} · ${societyName(worker.societyId)}`}
      open
      onClose={onClose}
      footer={<ActBtn label="Share passport" icon="share-outline" tone="ghost" onPress={download} style={{ flex: 1 }} />}
    >
      <Card2 style={styles.headerCard}>
        <Avatar name={worker.name} size={46} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.headerName} numberOfLines={1}>{worker.name}</Text>
          <Text style={styles.headerMeta} numberOfLines={1}>{worker.trade} · {societyName(worker.societyId)}</Text>
          <Row style={{ marginTop: 6 }} wrap>
            <StatusBadge value={worker.availability} />
            <StatusBadge value={worker.verification} />
            {worker.emergencyReady ? <StatusBadge value="Emergency ready" tone="blue" /> : null}
          </Row>
        </View>
      </Card2>

      <Grid4>
        <PassportStat icon="briefcase-outline" label="Completed jobs" value={`${worker.completedJobs}`} />
        <PassportStat icon="navigate-outline" label="Service radius" value={`${worker.serviceRadiusKm} km`} />
        <PassportStat icon="heart-outline" label="Welfare" value={worker.welfare} />
        <PassportStat icon="shield-checkmark-outline" label="Utilization" value={`${worker.utilization}%`} />
      </Grid4>

      <View style={styles.privacyNote}>
        <Ionicons name="lock-closed" size={14} color="#B45309" />
        <Text style={styles.privacyText}>
          <Text style={{ fontWeight: '900' }}>Privacy-safe federation view: </Text>
          this passport shows the worker’s service locality and radius, never an exact home or customer address.
        </Text>
      </View>

      <Card2 style={{ gap: 4 }}>
        <KV k="Verification" v={passport.verificationStatus} />
        <KV k="Experience" v={`${passport.experienceYears} years`} />
        <KV k="Availability" v={passport.availability} />
        <KV k="Service radius" v={`${passport.serviceRadiusKm} km`} />
        <KV k="Rating" v={`${passport.rating}/5 · ${passport.reviewCount} reviews`} />
        <KV k="Welfare supported" v={passport.welfareSupported ? 'Yes' : 'No'} />
        <KV k="Languages" v={worker.languages.join(', ')} />
        <KV k="Jobs (14 days)" v={`${worker.recentJobs14d}`} mono />
        <KV k="Current workload" v={worker.workload} />
      </Card2>

      <Card2 style={{ gap: 9 }}>
        <Text style={styles.sectionLabel}>Skills</Text>
        <Row wrap>
          {passport.skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{skill}</Text>
            </View>
          ))}
        </Row>
      </Card2>

      <Card2 style={{ gap: 10 }}>
        <Text style={styles.sectionLabel}>Certifications</Text>
        {passport.certifications.length === 0 ? (
          <Text style={styles.muted}>No certifications on record.</Text>
        ) : (
          passport.certifications.map((cert) => (
            <View key={cert.name} style={styles.certRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certMeta}>{cert.issuer}</Text>
                <Text style={styles.certMeta}>{cert.id}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <StatusBadge value={cert.status} />
                <Text style={styles.certMeta}>Exp {cert.expiry}</Text>
              </View>
            </View>
          ))
        )}
      </Card2>

      <Card2 style={{ gap: 10 }}>
        <Text style={styles.sectionLabel}>Fair-workload indicators</Text>
        <ProgressRow label="Utilization" pct={worker.utilization} right={`${worker.utilization}%`} />
        <ProgressRow
          label="Jobs completed (last 14 days)"
          pct={Math.min(100, worker.recentJobs14d * 10)}
          right={`${worker.recentJobs14d} jobs`}
          color={colors.teal}
        />
        <ProgressRow
          label="Welfare coverage"
          pct={worker.welfare === 'Covered' ? 100 : 0}
          right={worker.welfare}
          color={worker.welfare === 'Covered' ? colors.cta : colors.alert}
        />
      </Card2>
    </Drawer>
  );
};

const PassportStat: React.FC<{ icon: IconName; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.stat}>
    <Row>
      <Ionicons name={icon} size={12} color={colors.sage} />
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </Row>
    <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
  </View>
);

/** 4-up grid without the `minWidth` gymnastics — for fixed-count stat rows. */
const Grid4: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.grid4}>{children}</View>
);

export type { CertificationStatus };

const styles = StyleSheet.create({
  headerCard: { backgroundColor: '#F2FAF6', borderColor: 'rgba(22,138,91,0.2)', flexDirection: 'row', alignItems: 'center', gap: 11 },
  headerName: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  headerMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '47.5%', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 10 },
  statLabel: { color: colors.sage, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3, flex: 1 },
  statValue: { color: colors.ink, fontSize: 14, fontWeight: '900', marginTop: 4 },
  privacyNote: { flexDirection: 'row', gap: 8, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 11, padding: 11 },
  privacyText: { color: '#92400E', fontSize: 10, lineHeight: 15, flex: 1 },
  sectionLabel: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  muted: { color: colors.sage, fontSize: 10 },
  skillChip: { backgroundColor: colors.mint, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  skillChipText: { color: colors.forest, fontSize: 10, fontWeight: '800' },
  certRow: { flexDirection: 'row', gap: 10, paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#F0F3F1' },
  certName: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  certMeta: { color: colors.sage, fontSize: 9, marginTop: 2 },
});