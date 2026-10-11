import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AREA_DEMAND, SKILL_GAPS } from '../portals/coop/coopData';
import { colors, radius } from '../theme/theme';
import { DemoPill, SectionHeader, StatusPill } from '../components/portal';

export default function CoopMoreScreen() {
  const navigation = useNavigation<any>();
  const links = [
    { icon: 'school-outline' as const, title: 'Training & skills', body: 'NCCT programs and skill-gap plans' },
    { icon: 'heart-outline' as const, title: 'Welfare & insurance', body: 'Policies, claims and member support' },
    { icon: 'chatbubble-ellipses-outline' as const, title: 'Ratings & complaints', body: 'Resolve service feedback' },
    { icon: 'bar-chart-outline' as const, title: 'Reports & analytics', body: 'Demand, revenue and welfare reports' },
    { icon: 'settings-outline' as const, title: 'Cooperative settings', body: 'Roles, members and preferences' },
  ];
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}><View><Text style={styles.kicker}>OPERATIONS TOOLKIT</Text><Text style={styles.heading}>More</Text></View><View style={styles.headingIcon}><Ionicons name="ellipsis-horizontal" size={20} color={colors.forest} /></View></View>
      <Text style={styles.subheading}>The work behind the dashboard: care, training, reporting and cooperative settings.</Text>
      <View style={styles.linkList}>{links.map((link) => <Pressable key={link.title} style={styles.linkCard} onPress={() => link.title === 'Reports & analytics' ? navigation.navigate('MainTabs', { screen: 'Map' }) : undefined}><View style={styles.linkIcon}><Ionicons name={link.icon} size={19} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.linkTitle}>{link.title}</Text><Text style={styles.linkBody}>{link.body}</Text></View><Ionicons name="chevron-forward" size={16} color={colors.sage} /></Pressable>)}</View>
      <SectionHeader title="Skill gaps to close" />
      <View style={styles.gapCard}>{SKILL_GAPS.slice(0, 5).map((gap) => <View key={gap.trade} style={styles.gapRow}><Text style={styles.gapTrade}>{gap.trade}</Text><StatusPill label={`+${gap.gap} needed`} tone="amber" /></View>)}</View>
      <SectionHeader title="Demand by area" />
      <View style={styles.gapCard}>{AREA_DEMAND.slice(0, 6).map((item) => <View key={`${item.area}-${item.trade}`} style={styles.gapRow}><View style={{ flex: 1 }}><Text style={styles.gapTrade}>{item.area}</Text><Text style={styles.gapBody}>{item.trade}</Text></View><StatusPill label={item.level} tone={item.level === 'High' ? 'red' : 'slate'} /></View>)}</View>
      <View style={styles.demoRow}><DemoPill /><Text style={styles.demoText}>More modules are ready to connect to backend services.</Text></View>
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
  linkList: { gap: 8, marginTop: 15 },
  linkCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  linkIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  linkBody: { color: colors.sage, fontSize: 10, marginTop: 3 },
  gapCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 13 },
  gapRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  gapTrade: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  gapBody: { color: colors.sage, fontSize: 9, marginTop: 2 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  demoText: { color: colors.sage, fontSize: 10, flex: 1 },
});
