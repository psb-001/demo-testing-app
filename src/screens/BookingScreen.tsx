import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { PrimaryButton } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import type { Booking } from '../types';

const SLOTS = ['10:00 AM - 11:30 AM', '12:00 PM - 1:30 PM', '4:00 PM - 5:30 PM', '6:00 PM - 7:30 PM'];

export default function BookingScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Booking'>>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addBooking, userLocation } = useAppState();
  const worker = WORKERS_LIST.find((w) => w.id === route.params.workerId);
  const [date, setDate] = useState<'today' | 'tomorrow'>('today');
  const [slot, setSlot] = useState(SLOTS[0]);
  const [emergency, setEmergency] = useState(!!route.params.emergency);
  const [name, setName] = useState('Amit Deshmukh');
  const [phone, setPhone] = useState('+91 98220 91823');
  const [address, setAddress] = useState(userLocation.label || 'Flat 402, Rohan Viti, Kothrud, Pune - 411038');
  const [pay, setPay] = useState<'upi' | 'cash'>('upi');
  const [btype, setBtype] = useState<'home' | 'society' | 'office' | 'institution'>('home');
  const [notes, setNotes] = useState('');

  if (!worker) return <View style={{ padding: 20 }}><Text>Worker not found</Text></View>;

  const baseFare = worker.floorPrice;
  const emergencyFee = emergency ? 50 : 0;
  const totalFare = baseFare + emergencyFee;
  const workerEarnings = Math.round(totalFare * 0.92);
  const coopWelfareShare = totalFare - workerEarnings;

  const confirm = () => {
    const booking: Booking = {
      id: `BK-COOP-${Date.now().toString().slice(-6)}`,
      workerId: worker.id, workerName: worker.name, workerAvatar: worker.avatarUrl,
      tradeLabel: worker.tradeLabel, cooperativeName: worker.cooperativeName,
      serviceDate: date === 'today' ? 'Today' : 'Tomorrow',
      serviceTime: emergency ? 'Immediate Dispatch (15-20 min ETA)' : slot,
      address, serviceLat: userLocation.lat, serviceLng: userLocation.lng,
      customerName: name, customerPhone: phone, isEmergency: emergency,
      baseFare, emergencyFee, totalFare, workerEarnings, coopWelfareShare,
      paymentMethod: pay, status: 'confirmed', createdAt: new Date().toISOString(),
      bookingType: btype, instructions: notes.trim() || undefined,
    };
    addBooking(booking);
    Alert.alert('Booking confirmed', `#${booking.id} assigned to ${booking.workerName}. ₹${totalFare} (worker ₹${workerEarnings} + welfare ₹${coopWelfareShare})`);
    nav.goBack();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.warm }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.h1}>Book {worker.name}</Text>
      <Text style={styles.sub}>{worker.tradeLabel} • {worker.cooperativeName} • Floor ₹{baseFare}</Text>

      <Text style={styles.label}>Date</Text>
      <View style={styles.row}>
        {(['today', 'tomorrow'] as const).map((d) => (
          <TouchableOpacity key={d} style={[styles.chip, date === d && styles.chipOn]} onPress={() => setDate(d)}>
            <Text style={[styles.chipT, date === d && { color: '#fff' }]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Time slot</Text>
      <View style={{ gap: 8 }}>
        {SLOTS.map((s) => (
          <TouchableOpacity key={s} style={[styles.opt, slot === s && styles.optOn]} onPress={() => setSlot(s)}>
            <Text style={slot === s ? { color: '#fff', fontWeight: '700' } : { color: colors.ink }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.opt, emergency && styles.optOn, { marginTop: 10 }]} onPress={() => setEmergency(!emergency)}>
        <Text style={emergency ? { color: '#fff', fontWeight: '800' } : { color: colors.ink }}>
          {emergency ? 'URGENT selected (+₹50, 15–20 min dispatch)' : 'Mark as Emergency (+₹50)'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Contact</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
      <TextInput style={[styles.input, { height: 70 }]} value={address} onChangeText={setAddress} placeholder="Service address" multiline />

      <Text style={styles.label}>Booking type</Text>
      <View style={styles.row}>
        {(['home', 'society', 'office', 'institution'] as const).map((b) => (
          <TouchableOpacity key={b} style={[styles.chip, btype === b && styles.chipOn]} onPress={() => setBtype(b)}>
            <Text style={[styles.chipT, btype === b && { color: '#fff' }]}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Payment</Text>
      <View style={styles.row}>
        {(['upi', 'cash'] as const).map((p) => (
          <TouchableOpacity key={p} style={[styles.chip, pay === p && styles.chipOn]} onPress={() => setPay(p)}>
            <Text style={[styles.chipT, pay === p && { color: '#fff' }]}>{p.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Instructions (optional)</Text>
      <TextInput style={[styles.input, { height: 60 }]} value={notes} onChangeText={setNotes} placeholder="Gate code, issue details…" multiline />

      <View style={styles.bill}>
        <Text style={styles.billT}>Base ₹{baseFare} + Emergency ₹{emergencyFee} = Total ₹{totalFare}</Text>
        <Text style={styles.billS}>Worker gets ₹{workerEarnings} (92%) • Welfare ₹{coopWelfareShare} (8%)</Text>
        <Text style={styles.billS}>No hidden charges • Insured • Cooperative verified</Text>
      </View>

      <PrimaryButton label={`Confirm booking • ₹${totalFare}`} onPress={confirm} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 13, color: colors.sage, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '800', color: colors.ink, marginTop: 14, marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipT: { fontWeight: '700', color: colors.ink, fontSize: 13 },
  opt: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12 },
  optOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10, marginTop: 8, color: colors.ink },
  bill: { backgroundColor: colors.mint, borderRadius: radius.md, padding: 12, marginVertical: 14 },
  billT: { fontWeight: '800', color: colors.ink },
  billS: { fontSize: 12, color: colors.ink, marginTop: 2 },
});
