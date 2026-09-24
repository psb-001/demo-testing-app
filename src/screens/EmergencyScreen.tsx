import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WORKERS_LIST } from '../data/mockData';
import { colors } from '../theme/theme';
import { WorkerCard } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';

const TYPES = ['Electrical spark', 'Burst pipe / flooding', 'Gas leak smell', 'AC breakdown', 'Lockout'];

export default function EmergencyScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Emergency'>>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [type, setType] = useState(route.params?.type || TYPES[0]);
  const ready = WORKERS_LIST.filter((w) => w.isEmergencyReady && w.availableToday);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF7F7' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.h1}>🚨 Emergency lane</Text>
      <Text style={styles.sub}>Verified dispatch in 15–20 min • +₹50 priority fee • 92% to worker</Text>
      <Text style={styles.label}>What happened?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TYPES.map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, type === t && styles.on]} onPress={() => setType(t)}>
            <Text style={[styles.chipT, type === t && { color: '#fff' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.label, { marginTop: 14 }]}>{ready.length} emergency-ready workers</Text>
      {ready.map((w) => (
        <WorkerCard key={w.id} worker={w} onBook={() => nav.navigate('Booking', { workerId: w.id, emergency: true })} onView={() => nav.navigate('WorkerDetail', { workerId: w.id })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '900', color: colors.danger },
  sub: { fontSize: 13, color: colors.ink, marginTop: 4 },
  label: { fontWeight: '800', color: colors.ink, marginTop: 10, marginBottom: 6 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  on: { backgroundColor: colors.danger, borderColor: colors.danger },
  chipT: { fontWeight: '700', fontSize: 12, color: colors.ink },
});
