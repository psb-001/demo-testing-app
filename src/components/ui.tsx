import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import type { WorkerProfile } from '../types';
import { colors, radius } from '../theme/theme';
import { jobMatchScore } from '../services/matchingService';

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.primary} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.primaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ghost} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.ghostText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function WorkerCard({
  worker, onBook, onView,
}: {
  worker: WorkerProfile;
  onBook: () => void;
  onView: () => void;
}) {
  const score = jobMatchScore(worker);
  return (
    <TouchableOpacity style={styles.card} onPress={onView} activeOpacity={0.9}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Image source={{ uri: worker.avatarUrl }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{worker.name} {worker.verified ? '✓' : ''}</Text>
          <Text style={styles.trade}>{worker.tradeLabel} • {worker.specialty}</Text>
          <Text style={styles.meta}>⭐ {worker.rating} ({worker.reviewCount}) • {worker.distanceKm} km • {worker.area}</Text>
          <Text style={styles.meta}>{worker.cooperativeName}</Text>
          <Text style={styles.price}>₹{worker.floorPrice} floor • Match {score}% • {worker.availableToday ? 'Available today' : 'Busy'}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <TouchableOpacity style={[styles.primary, { flex: 1 }]} onPress={onBook}>
          <Text style={styles.primaryText}>Book • ₹{worker.floorPrice}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ghost, { flex: 1 }]} onPress={onView}>
          <Text style={styles.ghostText}>View Passport</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.sage, marginTop: 2 },
  primary: {
    backgroundColor: colors.cta, paddingVertical: 11, paddingHorizontal: 14,
    borderRadius: radius.md, alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  ghost: {
    backgroundColor: '#fff', paddingVertical: 11, paddingHorizontal: 14,
    borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  ghostText: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: radius.lg, padding: 12, marginVertical: 6,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.mint },
  name: { fontSize: 15, fontWeight: '800', color: colors.ink },
  trade: { fontSize: 13, color: colors.ink, marginTop: 1 },
  meta: { fontSize: 12, color: colors.sage, marginTop: 1 },
  price: { fontSize: 12, color: colors.forest, fontWeight: '700', marginTop: 3 },
});
