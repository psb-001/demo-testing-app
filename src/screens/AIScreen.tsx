import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DemoRozgarAIBackend, AI_LANGUAGES, type AILanguage, type AIPlatformAction } from '../services/rozgarAIService';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';

const backend = new DemoRozgarAIBackend();

interface Msg { from: 'user' | 'ai'; text: string; actions?: AIPlatformAction[] }

export default function AIScreen() {
  const nav = useNavigation<any>();
  const { userArea, bookings } = useAppState();
  const { user } = useAuth();
  const [lang, setLang] = useState<AILanguage>('en');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'ai', text: 'Namaste! I am Rozgar AI. Ask for a service, worker, price, booking, or worker help — English, हिन्दी, मराठी.' },
  ]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    setMsgs((m) => [...m, { from: 'user', text: q }]);
    setBusy(true);
    const workersByTrade: Record<string, number> = {};
    WORKERS_LIST.forEach((w) => { workersByTrade[w.trade] = (workersByTrade[w.trade] ?? 0) + 1; });
    const reply = await backend.respond(q, {
      language: lang,
      role: user?.role ?? null,
      userArea,
      bookingsCount: bookings.length,
      serviceCatalog: SERVICES_LIST.map((s) => ({ slug: s.slug, name: s.name, floorPrice: s.floorPrice })),
      totalWorkers: WORKERS_LIST.length,
      workersByTrade,
    });
    setMsgs((m) => [...m, { from: 'ai', text: reply.text, actions: reply.actions }]);
    setBusy(false);
  };

  const runAction = (a: AIPlatformAction) => {
    switch (a.type) {
      case 'select-service':
      case 'book-worker':
        nav.navigate('Workers');
        break;
      case 'open-map':
        nav.navigate('Map');
        break;
      case 'open-register':
        nav.navigate('Auth', { mode: 'signup' });
        break;
      case 'open-emergency':
        nav.navigate('Emergency', {});
        break;
      case 'open-admin':
        nav.navigate('Admin', { tab: 'forecast' });
        break;
      default:
        nav.navigate('Workers');
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.warm }}>
      <View style={styles.bar}>
        {AI_LANGUAGES.map((l) => (
          <TouchableOpacity key={l.code} style={[styles.lang, lang === l.code && styles.on]} onPress={() => setLang(l.code)}>
            <Text style={[styles.langT, lang === l.code && { color: '#fff' }]}>{l.native}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.demo}>Demo assistant — guided help</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
        {msgs.map((m, i) => (
          <View key={i} style={[styles.bubble, m.from === 'user' ? styles.me : styles.ai]}>
            <Text style={m.from === 'user' ? { color: '#fff' } : { color: colors.ink }}>{m.text}</Text>
            {m.actions?.map((a, j) => (
              <TouchableOpacity key={j} style={styles.act} onPress={() => runAction(a)}>
                <Text style={styles.actT}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {busy ? <Text style={{ color: colors.sage, marginTop: 6 }}>Thinking…</Text> : null}
      </ScrollView>
      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type your message…" onSubmitEditing={() => send(input)} />
        <TouchableOpacity style={styles.send} onPress={() => send(input)}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: colors.border },
  lang: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  on: { backgroundColor: colors.forest, borderColor: colors.forest },
  langT: { fontWeight: '700', fontSize: 12, color: colors.ink },
  demo: { fontSize: 11, color: colors.sage, marginLeft: 'auto' },
  bubble: { borderRadius: radius.md, padding: 10, marginVertical: 4, maxWidth: '88%' },
  me: { backgroundColor: colors.forest, alignSelf: 'flex-end' },
  ai: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' },
  act: { marginTop: 6, backgroundColor: colors.mint, borderRadius: 8, padding: 8 },
  actT: { color: colors.forest, fontWeight: '800', fontSize: 13 },
  inputBar: { flexDirection: 'row', gap: 8, padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.border },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, color: colors.ink },
  send: { backgroundColor: colors.cta, borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center' },
});
