import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { COOP_SOCIETIES } from '../data/mockData';
import { COP_WORKERS, COP_REQUESTS, PAYMENT_METRICS, AREA_DEMAND, SKILL_GAPS } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

export default function AdminScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Admin'>>();
  const [tab, setTab] = useState<'forecast' | 'societies' | 'fairshare'>(route.params?.tab || 'forecast');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.warm }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.h1}>Federation Analytics (Demo)</Text>
      <View style={styles.tabs}>
        {(['forecast', 'societies', 'fairshare'] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.on]} onPress={() => setTab(t)}>
            <Text style={[styles.tabT, tab === t && { color: '#fff' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab === 'forecast' && (
        <View style={styles.card}>
          <Text style={styles.h2}>Demand forecast</Text>
          {AREA_DEMAND.slice(0, 8).map((d, i) => (
            <Text key={i} style={styles.li}>{d.area} • {d.trade} • {d.level} demand</Text>
          ))}
          <Text style={[styles.h2, { marginTop: 10 }]}>Skill gaps</Text>
          {SKILL_GAPS.slice(0, 6).map((g, i) => (
            <Text key={i} style={styles.li}>{g.trade}: +{g.gap} needed</Text>
          ))}
        </View>
      )}
      {tab === 'societies' && (
        <View>
          {COOP_SOCIETIES.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.h2}>{s.name}</Text>
              <Text style={styles.li}>{s.reg} • {s.members} members</Text>
              <Text style={styles.li}>{s.area} • {s.fundsDisbursed} disbursed</Text>
            </View>
          ))}
        </View>
      )}
      {tab === 'fairshare' && (
        <View style={styles.card}>
          <Text style={styles.h2}>Fair-share allocation</Text>
          <Text style={styles.li}>Overloaded: {COP_WORKERS.filter((w) => w.workload === 'Overloaded').length} • Underutilized: {COP_WORKERS.filter((w) => w.workload === 'Underutilized').length}</Text>
          <Text style={styles.li}>Open requests: {COP_REQUESTS.filter((r) => r.status === 'New' || r.status === 'Matching').length}</Text>
          <Text style={styles.li}>Gross ₹{PAYMENT_METRICS.totalGross.toLocaleString('en-IN')} • Workers ₹{PAYMENT_METRICS.totalWorker.toLocaleString('en-IN')} • Welfare ₹{PAYMENT_METRICS.totalWelfare.toLocaleString('en-IN')}</Text>
          <Text style={styles.li}>Next queue routes to light verified members — same logic as web.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '900', color: colors.ink },
  h2: { fontWeight: '800', color: colors.ink, fontSize: 15 },
  tabs: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  tab: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, alignItems: 'center' },
  on: { backgroundColor: colors.forest, borderColor: colors.forest },
  tabT: { fontWeight: '800', color: colors.ink },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  li: { fontSize: 13, color: colors.ink, marginTop: 3 },
});
