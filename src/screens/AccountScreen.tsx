import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppState';
import { colors, radius } from '../theme/theme';
import { SectionHeader } from '../components/portal';

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage, bookings, favoriteWorkerIds } = useAppState();
  const [name, setName] = useState(user?.name || '');
  const [notifications, setNotifications] = useState({ booking: true, worker: true, payment: false });
  if (!user) return null;
  const roleLabel = user.role === 'customer' ? 'Customer' : user.role === 'worker' ? 'Worker member' : user.role === 'cooperative' ? 'Cooperative admin' : 'Federation admin';
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHero}><View style={styles.avatar}><Text style={styles.avatarText}>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View style={{ flex: 1, marginLeft: 11 }}><Text style={styles.profileName}>{user.name}</Text><Text style={styles.profileMeta}>{roleLabel} · {user.city || 'Pune'}</Text><View style={styles.verifiedRow}><Ionicons name="checkmark-circle" size={13} color="#B7F0CD" /><Text style={styles.verifiedText}>Verified WorkConnect member</Text></View></View></View>
      <SectionHeader title="Profile" />
      <View style={styles.card}><Text style={styles.fieldLabel}>Full name</Text><TextInput value={name} onChangeText={setName} onBlur={() => updateProfile({ name })} style={styles.input} /><Text style={styles.fieldLabel}>Phone</Text><TextInput value={user.phone} editable={false} style={[styles.input, styles.readonly]} /><Text style={styles.fieldLabel}>Preferred language</Text><View style={styles.languageRow}>{(['en', 'hi', 'mr', 'ta', 'te', 'bn'] as const).map((item) => <Pressable key={item} onPress={() => setLanguage(item)} style={[styles.language, language === item && styles.languageActive]}><Text style={[styles.languageText, language === item && styles.languageTextActive]}>{item.toUpperCase()}</Text></Pressable>)}</View></View>
      <SectionHeader title="Notifications" />
      <View style={styles.card}><SettingRow icon="calendar-outline" label="Booking updates" value={notifications.booking} onChange={() => setNotifications((previous) => ({ ...previous, booking: !previous.booking }))} /><SettingRow icon="navigate-outline" label="Worker arrival updates" value={notifications.worker} onChange={() => setNotifications((previous) => ({ ...previous, worker: !previous.worker }))} /><SettingRow icon="wallet-outline" label="Payments and invoices" value={notifications.payment} onChange={() => setNotifications((previous) => ({ ...previous, payment: !previous.payment }))} /></View>
      <SectionHeader title="Your activity" />
      <View style={styles.activityRow}><Activity icon="calendar-outline" label={user.role === 'customer' ? 'Bookings' : user.role === 'worker' ? 'Jobs' : 'Operations'} value={String(bookings.length)} /><Activity icon="heart-outline" label="Saved workers" value={String(favoriteWorkerIds.length)} /><Activity icon="shield-checkmark-outline" label="Trust status" value="Verified" /></View>
      {user.role === 'customer' ? <><SectionHeader title="Customer tools" /><View style={styles.toolRow}><Pressable style={styles.toolCard} onPress={() => navigation.navigate('SavedWorkers')}><Ionicons name="heart-outline" size={19} color={colors.leaf} /><Text style={styles.toolTitle}>Saved workers</Text><Text style={styles.toolBody}>Your shortlist</Text></Pressable><Pressable style={styles.toolCard} onPress={() => navigation.navigate('CustomerPayments')}><Ionicons name="receipt-outline" size={19} color={colors.teal} /><Text style={styles.toolTitle}>Payments</Text><Text style={styles.toolBody}>Invoices and splits</Text></Pressable></View></> : null}
      <View style={styles.helpCard}><View style={styles.helpIcon}><Ionicons name="help-circle-outline" size={20} color={colors.leaf} /></View><View style={{ flex: 1 }}><Text style={styles.helpTitle}>Need help?</Text><Text style={styles.helpText}>Contact your cooperative welfare desk or ask Rozgar AI.</Text></View><Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'AI' })}><Ionicons name="chevron-forward" size={17} color={colors.sage} /></Pressable></View>
      <Pressable style={styles.logout} onPress={logout}><Ionicons name="log-out-outline" size={17} color={colors.danger} /><Text style={styles.logoutText}>Log out of WorkConnect</Text></Pressable>
      <Text style={styles.footer}>Demo account · data is stored locally on this device</Text>
    </ScrollView>
  );
}

function SettingRow({ icon, label, value, onChange }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: boolean; onChange: () => void }) {
  return <View style={styles.settingRow}><View style={styles.settingIcon}><Ionicons name={icon} size={16} color={colors.teal} /></View><Text style={styles.settingLabel}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ true: colors.leaf }} /></View>;
}

function Activity({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return <View style={styles.activity}><Ionicons name={icon} size={16} color={colors.leaf} /><Text style={styles.activityLabel}>{label}</Text><Text style={styles.activityValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F3' },
  content: { padding: 16, paddingBottom: 34 },
  profileHero: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 16, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#2E8B57', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 17, fontWeight: '900' },
  profileName: { color: '#fff', fontSize: 16, fontWeight: '900' },
  profileMeta: { color: '#D5F0DF', fontSize: 10, marginTop: 3 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  verifiedText: { color: '#B7F0CD', fontSize: 9, fontWeight: '800' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13 },
  fieldLabel: { color: colors.sage, fontSize: 10, fontWeight: '800', marginTop: 9 },
  input: { backgroundColor: colors.warm, borderWidth: 1, borderColor: colors.border, borderRadius: 9, padding: 9, marginTop: 5, color: colors.ink, fontSize: 11 },
  readonly: { color: colors.sage },
  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 7 },
  language: { borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 9, paddingVertical: 6 },
  languageActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  languageText: { color: colors.sage, fontSize: 9, fontWeight: '900' },
  languageTextActive: { color: '#fff' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0F3F1' },
  settingIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, color: colors.ink, fontSize: 11, fontWeight: '800' },
  activityRow: { flexDirection: 'row', gap: 7 },
  activity: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10 },
  activityLabel: { color: colors.sage, fontSize: 9, marginTop: 7 },
  activityValue: { color: colors.ink, fontSize: 13, fontWeight: '900', marginTop: 3 },
  toolRow: { flexDirection: 'row', gap: 8 },
  toolCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 11 },
  toolTitle: { color: colors.ink, fontSize: 11, fontWeight: '900', marginTop: 8 },
  toolBody: { color: colors.sage, fontSize: 9, marginTop: 3 },
  helpCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 13, flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  helpIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  helpTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  helpText: { color: colors.sage, fontSize: 10, lineHeight: 15, marginTop: 3 },
  logout: { minHeight: 42, borderWidth: 1, borderColor: '#F1B8B8', borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 15 },
  logoutText: { color: colors.danger, fontSize: 11, fontWeight: '900' },
  footer: { color: colors.sage, fontSize: 10, textAlign: 'center', marginTop: 17 },
});
