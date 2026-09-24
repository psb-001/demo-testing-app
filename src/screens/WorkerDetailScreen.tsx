import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { PrimaryButton, GhostButton, SectionTitle } from '../components/ui';
import { matchFactors } from '../services/matchingService';
import type { RootStackParamList } from '../navigation/types';

export default function WorkerDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkerDetail'>>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const worker = WORKERS_LIST.find((w) => w.id === route.params.workerId);
  if (!worker) return <View style={{ padding: 20 }}><Text>Worker not found</Text></View>;
  const factors = matchFactors(worker);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.warm }} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <Image source={{ uri: worker.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{worker.name} {worker.verified ? '✓ Verified' : ''}</Text>
        <Text style={styles.sub}>{worker.tradeLabel} • {worker.specialty} • {worker.experienceYears} yrs</Text>
        <Text style={styles.sub}>⭐ {worker.rating} ({worker.reviewCount}) • {worker.area} • {worker.distanceKm} km</Text>
        <Text style={styles.sub}>{worker.cooperativeName}</Text>
        <Text style={styles.sub}>Reg {worker.societyRegNo} • {worker.ncctCertId} • {worker.insurancePolicyId}</Text>
        <Text style={styles.price}>Floor ₹{worker.floorPrice} • {worker.availableToday ? 'Available today' : 'Busy'} {worker.isEmergencyReady ? '• Emergency-ready' : ''}</Text>
        <Text style={styles.sub}>📞 {worker.phone}</Text>
      </View>

      <SectionTitle title="Digital Skill Passport" subtitle="Skills, match factors, welfare cover" />
      <View style={styles.card}>
        {worker.skills.map((s) => <Text key={s} style={styles.li}>• {s}</Text>)}
        <Text style={[styles.sub, { marginTop: 8, fontWeight: '700' }]}>Why this match:</Text>
        <Text style={styles.li}>Skill fit {factors.skillFit} • Exp {factors.experience} • Location {factors.location}</Text>
        <Text style={styles.li}>Availability {factors.availability} • Workload {factors.workload} • Cert {factors.certification}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <PrimaryButton label={`Book • ₹${worker.floorPrice}`} onPress={() => nav.navigate('Booking', { workerId: worker.id })} />
        </View>
        <View style={{ flex: 1 }}>
          <GhostButton label="Emergency" onPress={() => nav.navigate('Booking', { workerId: worker.id, emergency: true })} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.mint },
  name: { fontSize: 18, fontWeight: '900', color: colors.ink, marginTop: 8 },
  sub: { fontSize: 13, color: colors.sage, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '800', color: colors.forest, marginTop: 6 },
  li: { fontSize: 13, color: colors.ink, marginTop: 2 },
});
