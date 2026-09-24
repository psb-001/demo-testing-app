import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { useAppState } from '../context/AppState';
import { SectionTitle, WorkerCard } from '../components/ui';
import { colors } from '../theme/theme';

export default function WorkersScreen() {
  const nav = useNavigation<any>();
  const { searchQuery, selectedServiceSlug, setSelectedServiceSlug } = useAppState();
  const filtered = useMemo(() => WORKERS_LIST.filter((w) => {
    if (selectedServiceSlug && w.trade !== selectedServiceSlug) return false;
    if (searchQuery.trim() && !`${w.name} ${w.tradeLabel} ${w.specialty} ${w.skills.join(' ')}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [selectedServiceSlug, searchQuery]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.warm }} contentContainerStyle={{ padding: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: !selectedServiceSlug ? colors.forest : '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 }}
            onPress={() => setSelectedServiceSlug(null)}
          >
            <Text style={{ fontWeight: '700', color: !selectedServiceSlug ? '#fff' : colors.ink }}>All</Text>
          </TouchableOpacity>
          {SERVICES_LIST.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: selectedServiceSlug === s.slug ? colors.forest : '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 }}
              onPress={() => setSelectedServiceSlug(s.slug)}
            >
              <Text style={{ fontWeight: '700', fontSize: 12, color: selectedServiceSlug === s.slug ? '#fff' : colors.ink }}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <SectionTitle title={`Workers (${filtered.length})`} subtitle="Verified • Floor pricing • 92% to worker" />
      {filtered.map((w) => (
        <WorkerCard key={w.id} worker={w} onBook={() => nav.navigate('Booking', { workerId: w.id })} onView={() => nav.navigate('WorkerDetail', { workerId: w.id })} />
      ))}
    </ScrollView>
  );
}
