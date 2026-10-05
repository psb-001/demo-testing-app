import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rozgarAI, AI_LANGUAGES, type AILanguage, type AIPlatformAction , AI_UI_STRINGS, type AIPageContext } from '../services/rozgarAIService';
import { useI18n } from '../i18n';
import { buildFedSnapshot } from '../portals/fed/fedData';
import { SERVICES_LIST, WORKERS_LIST } from '../data/mockData';
import { colors, radius } from '../theme/theme';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';

const backend = rozgarAI;

interface Msg { from: 'user' | 'ai'; text: string; actions?: AIPlatformAction[] }

export default function AIScreen() {
  const nav = useNavigation<any>();
  const { userArea, bookings } = useAppState();
  const { user } = useAuth();
  /**
   * The assistant speaks the app language. This used to be a local `lang` state
   * entirely disconnected from `AppState.language` and from the i18n provider, so
   * changing the language anywhere else left the AI still replying in English,
   * and choosing a language here changed nothing else.
   */
  const { lang: appLang } = useI18n();
  const lang = appLang as AILanguage;
  const t = AI_UI_STRINGS[lang];
  const [pageContext] = useState<AIPageContext | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'ai',
      text:
        lang === 'mr'
          ? 'नमस्कार! मी रोजगार गाइड. सेवा, बुकिंग, कामगार किंवा अॅपच्या सोप्या पायऱ्यांबद्दल विचारा.'
          : lang === 'hi'
            ? 'नमस्ते! मैं रोजगार गाइड हूँ। सेवाओं, बुकिंग, कामगारों या ऐप के चरणों के बारे में पूछें।'
            : 'Hi! I am Rozgar Guide. Ask about services, bookings, workers, or app steps.',
    },
  ]);
  const scrollRef = useRef<ScrollView | null>(null);

  const scrollToLatest = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  useEffect(() => {
    scrollToLatest();
  }, [busy, msgs.length]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', scrollToLatest);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', scrollToLatest);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
      // Federation answers now come from the same store the portal renders.
      fed: user?.role === 'federation' ? buildFedSnapshot() : null,
      pageContext,
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
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
      <View style={styles.screen}>
        <View style={styles.bar}>
          {AI_LANGUAGES.map((l) => (
            <View key={l.code} style={[styles.lang, lang === l.code && styles.on]}>
              <Text style={[styles.langT, lang === l.code && { color: '#fff' }]}>{l.native}</Text>
            </View>
          ))}
          <Text style={styles.demo} numberOfLines={1}>{t.subtitle}</Text>
        </View>
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messageContent} automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" onContentSizeChange={scrollToLatest}>
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
          {busy ? <Text style={styles.thinking}>Thinking…</Text> : null}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t.placeholder}
            placeholderTextColor={colors.sage}
            accessibilityLabel={t.placeholder}
            returnKeyType="send"
            blurOnSubmit={false}
            onFocus={scrollToLatest}
            onSubmitEditing={() => { void send(input); }}
          />
          <TouchableOpacity style={styles.send} onPress={() => { void send(input); }} accessibilityRole="button" accessibilityLabel="Send">
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm },
  screen: { flex: 1, backgroundColor: colors.warm },
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
  messages: { flex: 1 },
  messageContent: { padding: 12, paddingBottom: 18 },
  thinking: { color: colors.sage, fontSize: 11, marginTop: 6 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.border },
  input: { flex: 1, minHeight: 42, borderWidth: 1, borderColor: colors.border, borderRadius: 21, paddingHorizontal: 14, paddingVertical: 9, color: colors.ink, fontSize: 13 },
  send: { minHeight: 42, backgroundColor: colors.cta, borderRadius: 21, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '800' },
});
