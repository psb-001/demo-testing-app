import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COOP_SOCIETIES } from '../data/mockData';
import { AREA_DEMAND, SKILL_GAPS } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import { DemoPill, SectionHeader, StatusPill } from '../components/portal';

type Mode = 'societies' | 'demand' | 'coverage' | 'more';

export default function FederationModuleScreen({ mode }: { mode: Mode }) {
  const navigation = useNavigation<any>();
  const title = mode === 'societies' ? 'Member societies' : mode === 'demand' ? 'Demand planning' : mode === 'coverage' ? 'Coverage view' : 'More tools';
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>FEDERATION NETWORK</Text><Text style={styles.heading}>{title}</Text></View><View style={styles.headingIcon}><Ionicons name={mode === 'societies' ? 'business-outline' : mode === 'demand' ? 'trending-up-outline' : mode === 'coverage' ? 'map-outline' : 'ellipsis-horizontal'} size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>{mode === 'societies' ? 'Track cooperative coverage, membership, and verification.' : mode === 'demand' ? 'See where demand is rising and which skills need support.' : mode === 'coverage' ? 'Understand geographic coverage across member societies.' : 'Reports, welfare, settings and federation-level AI.'}</Text>
      {mode === 'societies' ? <View style={styles.listCard}>{COOP_SOCIETIES.map((society) => <View key={society.id} style={styles.row}><View style={styles.mark}><Text style={styles.markText}>{society.name.slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{society.name}</Text><Text style={styles.rowMeta}>{society.reg} · {society.members} members · Since {society.established}</Text><Text style={styles.rowBody}>{society.area} · {society.fundsDisbursed} disbursed</Text></View><StatusPill label="Verified" tone="green" /></View>)}</View> : null}
      {mode === 'demand' ? <><SectionHeader title="Skill gaps" /><View style={styles.listCard}>{SKILL_GAPS.map((gap) => <View key={gap.trade} style={styles.row}><View style={styles.mark}><Ionicons name="analytics-outline" size={17} color={colors.alert} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{gap.trade}</Text><Text style={styles.rowMeta}>Network demand signal</Text></View><StatusPill label={`+${gap.gap}`} tone="amber" /></View>)}</View><SectionHeader title="High-demand areas" /><View style={styles.listCard}>{AREA_DEMAND.filter((item) => item.level === 'High').map((item) => <View key={`${item.area}-${item.trade}`} style={styles.row}><View style={styles.mark}><Ionicons name="location-outline" size={17} color={colors.danger} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.area}</Text><Text style={styles.rowMeta}>{item.trade}</Text></View><StatusPill label="High" tone="red" /></View>)}</View></> : null}
      {mode === 'coverage' ? <><View style={styles.mapPreview}><Ionicons name="map" size={30} color={colors.leaf} /><Text style={styles.mapPreviewTitle}>Interactive coverage map</Text><Text style={styles.mapPreviewText}>Open the native map to explore workers and service areas.</Text><Pressable style={styles.mapButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })}><Text style={styles.mapButtonText}>Open map</Text></Pressable></View><SectionHeader title="Coverage snapshot" /><View style={styles.listCard}>{AREA_DEMAND.slice(0, 9).map((item) => <View key={`${item.area}-${item.trade}`} style={styles.row}><View style={styles.mark}><Text style={styles.markText}>{item.area.slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.area}</Text><Text style={styles.rowMeta}>{item.trade} · {item.level} demand</Text></View></View>)}</View></> : null}
      {mode === 'more' ? <View style={styles.listCard}>{[{ icon: 'file-tray-full-outline' as const, title: 'Reports & exports', body: 'Download federation summaries.' }, { icon: 'heart-outline' as const, title: 'Welfare oversight', body: 'Monitor member wellbeing and insurance.' }, { icon: 'sparkles-outline' as const, title: 'Federation AI', body: 'Ask questions about the network.' }, { icon: 'settings-outline' as const, title: 'Settings', body: 'Manage roles and notifications.' }].map((item) => <Pressable key={item.title} style={styles.row} onPress={() => item.title === 'Federation AI' ? navigation.navigate('MainTabs', { screen: 'AI' }) : undefined}><View style={styles.mark}><Ionicons name={item.icon} size={17} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.rowBody}>{item.body}</Text></View><Ionicons name="chevron-forward" size={16} color={colors.sage} /></Pressable>)}</View> : null}
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>Federation view is a demo aggregation layer.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 3 },
  headingIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  subheading: { color: colors.sage, fontSize: 12, lineHeight: 17, marginTop: 5 },
  listCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13, marginTop: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  mark: { width: 35, height: 35, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  markText: { color: colors.forest, fontSize: 14, fontWeight: '900' },
  rowTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  rowMeta: { color: colors.sage, fontSize: 9, marginTop: 3 },
  rowBody: { color: colors.sage, fontSize: 10, marginTop: 3 },
  mapPreview: { backgroundColor: colors.forest, borderRadius: radius.lg, padding: 20, alignItems: 'center', marginTop: 15 },
  mapPreviewTitle: { color: '#fff', fontSize: 15, fontWeight: '900', marginTop: 9 },
  mapPreviewText: { color: '#D5F0DF', fontSize: 10, textAlign: 'center', marginTop: 4 },
  mapButton: { backgroundColor: '#fff', borderRadius: 9, paddingHorizontal: 14, paddingVertical: 8, marginTop: 12 },
  mapButtonText: { color: colors.forest, fontSize: 10, fontWeight: '900' },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
