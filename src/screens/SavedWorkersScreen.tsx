import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WORKERS_LIST } from '../data/mockData';
import { useAppState } from '../context/AppState';
import { colors } from '../theme/theme';
import { EmptyPanel, SectionHeader, MiniWorkerCard } from '../components/portal';

export default function SavedWorkersScreen() {
  const navigation = useNavigation<any>();
  const { favoriteWorkerIds, toggleFavorite } = useAppState();
  const workers = WORKERS_LIST.filter((worker) => favoriteWorkerIds.includes(worker.id));
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>YOUR SHORTLIST</Text><Text style={styles.heading}>Saved workers</Text><Text style={styles.subheading}>Keep trusted cooperative workers close for your next booking.</Text>
      <SectionHeader title={`${workers.length} saved`} />
      {workers.length ? workers.map((worker) => <MiniWorkerCard key={worker.id} worker={worker} saved onToggleSaved={() => toggleFavorite(worker.id)} onPress={() => navigation.navigate('WorkerDetail', { workerId: worker.id })} onBook={() => navigation.navigate('Booking', { workerId: worker.id })} />) : <EmptyPanel title="No saved workers yet" body="Tap the heart on a worker card to keep them here." action="Browse services" onAction={() => navigation.navigate('Services')} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 3 },
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5 },
});
