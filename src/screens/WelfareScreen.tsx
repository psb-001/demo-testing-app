import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { COOP_SOCIETIES } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { SectionTitle } from '../components/ui';

export default function WelfareScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.warm }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.h1}>Welfare & Insurance</Text>
      <Text style={styles.sub}>8% of every fare funds accident + tool cover, pensions, training. Members keep 92%.</Text>
      <SectionTitle title="How it works" />
      <View style={styles.card}>
        <Text style={styles.li}>• Accident insurance (PM-JAY linked policy per worker profile)</Text>
        <Text style={styles.li}>• Tool insurance for trade kits</Text>
        <Text style={styles.li}>• Welfare fund from cooperative share</Text>
        <Text style={styles.li}>• Claims via your society office — same IDs as web</Text>
      </View>
      <SectionTitle title="Member societies" />
      {COOP_SOCIETIES.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.name}>{s.name}</Text>
          <Text style={styles.sub}>{s.reg} • {s.members} members • Since {s.established}</Text>
          <Text style={styles.sub}>{s.area} • Disbursed {s.fundsDisbursed}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 13, color: colors.sage, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  name: { fontWeight: '800', color: colors.ink },
  li: { fontSize: 13, color: colors.ink, marginTop: 3 },
});
