import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEMO_OTP } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/theme';
import { PrimaryButton } from '../components/ui';
import type { AuthRole } from '../types';

const ROLE_OPTIONS: { key: AuthRole; label: string; description: string }[] = [
  { key: 'customer', label: 'Customer', description: 'Book verified services' },
  { key: 'worker', label: 'Worker', description: 'Find work and payouts' },
  { key: 'cooperative', label: 'Cooperative', description: 'Manage workers and requests' },
  { key: 'federation', label: 'Federation', description: 'View societies and analytics' },
];

type AuthMode = 'login' | 'signup';
type LoginMethod = 'otp' | 'password';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginPassword, loginDemo, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<LoginMethod>('otp');
  const [identifier, setIdentifier] = useState('+91 98220 91823');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AuthRole>('customer');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = method === 'otp'
        ? await login(identifier, otp || DEMO_OTP)
        : await loginPassword(identifier, password);
      if (!result) {
        setError(method === 'otp'
          ? `No account found for ${identifier}. Use demo OTP ${DEMO_OTP}, create an account, or use a demo role below.`
          : 'Phone/email or password is incorrect. Create an account or use a demo role below.');
      }
    } catch {
      setError('Authentication is temporarily unavailable. Try a demo role below.');
    } finally {
      setBusy(false);
    }
  };

  const submitSignup = async () => {
    if (busy) return;
    if (!name.trim() || !identifier.trim()) {
      setError('Enter your name and phone number to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signup({
        name: name.trim(),
        phone: identifier.trim(),
        role,
        password: password.trim() || undefined,
        language: 'en',
        city: 'Pune',
      });
    } catch {
      setError('Could not create the account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitDemo = async (demoRole: AuthRole) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await loginDemo(demoRole);
    } catch {
      setError(`Could not open the ${demoRole} demo. Please try again.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>W</Text></View>
          <Text style={styles.brandName}>WorkConnect</Text>
          <Text style={styles.brandTag}>Cooperative-powered home services</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to open your role-specific portal.'
              : 'Choose your role to open the right workspace.'}
          </Text>

          <View style={styles.modeSwitch}>
            {(['login', 'signup'] as AuthMode[]).map((item) => (
              <Pressable
                key={item}
                onPress={() => { setMode(item); setError(''); }}
                style={[styles.modeButton, mode === item && styles.modeButtonActive]}
              >
                <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>
                  {item === 'login' ? 'Login' : 'Sign up'}
                </Text>
              </Pressable>
            ))}
          </View>

          {mode === 'signup' && (
            <>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.sage}
                style={styles.input}
              />
              <Text style={styles.label}>I am signing up as</Text>
              <View style={styles.roleGrid}>
                {ROLE_OPTIONS.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => setRole(item.key)}
                    style={[styles.roleCard, role === item.key && styles.roleCardActive]}
                  >
                    <Text style={[styles.roleLabel, role === item.key && styles.roleTextActive]}>{item.label}</Text>
                    <Text style={[styles.roleDescription, role === item.key && styles.roleTextActive]}>{item.description}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>{mode === 'login' ? 'Phone number or email' : 'Phone number'}</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="+91 98220 91823"
            placeholderTextColor={colors.sage}
            autoCapitalize="none"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {mode === 'signup' && (
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password (optional)"
              placeholderTextColor={colors.sage}
              secureTextEntry
              style={styles.input}
            />
          )}

          {mode === 'login' && (
            <>
              <View style={styles.methodRow}>
                <Text style={[styles.method, method === 'otp' && styles.methodActive]}>Use OTP</Text>
                <Pressable onPress={() => setMethod(method === 'otp' ? 'password' : 'otp')}>
                  <Text style={[styles.method, method === 'password' && styles.methodActive]}>
                    Use password
                  </Text>
                </Pressable>
              </View>
              {method === 'otp' ? (
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  placeholder={`Enter OTP (demo: ${DEMO_OTP})`}
                  placeholderTextColor={colors.sage}
                  keyboardType="number-pad"
                  secureTextEntry
                  style={styles.input}
                />
              ) : (
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.sage}
                  secureTextEntry
                  style={styles.input}
                />
              )}
            </>
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.submitWrap}>
            {busy ? (
              <View style={styles.loading}><ActivityIndicator color="#fff" /></View>
            ) : (
              <PrimaryButton
                label={mode === 'login' ? 'Login to portal' : 'Create account'}
                onPress={mode === 'login' ? submitLogin : submitSignup}
              />
            )}
          </View>
        </View>

        <Text style={styles.demoTitle}>Demo access</Text>
        <Text style={styles.demoSubtitle}>Explore each role without creating an account.</Text>
        <View style={styles.demoGrid}>
          {ROLE_OPTIONS.map((item) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={`Continue as ${item.label} demo`}
              disabled={busy}
              onPress={() => { void submitDemo(item.key); }}
              style={({ pressed }) => [styles.demoCard, busy && styles.demoDisabled, pressed && styles.demoPressed]}
            >
              <Text style={styles.demoLabel}>Continue as {item.label}</Text>
              <Text style={styles.demoDescription}>{item.description}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>Demo authentication is stored locally on this device. No real SMS or payment is processed.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.warm },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  brand: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
  brandMark: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  brandName: { fontSize: 26, fontWeight: '900', color: colors.ink, marginTop: 10 },
  brandTag: { fontSize: 13, color: colors.sage, marginTop: 3 },
  card: { backgroundColor: '#fff', borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 22, fontWeight: '900', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.sage, marginTop: 5, marginBottom: 16, lineHeight: 18 },
  modeSwitch: { flexDirection: 'row', backgroundColor: colors.warm, borderRadius: radius.md, padding: 4, marginBottom: 14 },
  modeButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9 },
  modeButtonActive: { backgroundColor: colors.forest },
  modeText: { color: colors.sage, fontWeight: '800' },
  modeTextActive: { color: '#fff' },
  label: { color: colors.ink, fontSize: 13, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: colors.warm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: colors.ink },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleCard: { width: '48%', backgroundColor: colors.warm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10 },
  roleCardActive: { backgroundColor: colors.mint, borderColor: colors.leaf },
  roleLabel: { fontSize: 13, fontWeight: '800', color: colors.ink },
  roleDescription: { fontSize: 11, color: colors.sage, marginTop: 3, lineHeight: 15 },
  roleTextActive: { color: colors.forest },
  methodRow: { flexDirection: 'row', gap: 18, marginTop: 14 },
  method: { color: colors.sage, fontSize: 12, fontWeight: '700' },
  methodActive: { color: colors.forest, textDecorationLine: 'underline' },
  error: { color: colors.danger, fontSize: 12, lineHeight: 17, marginTop: 10 },
  submitWrap: { marginTop: 16 },
  loading: { height: 44, borderRadius: radius.md, backgroundColor: colors.cta, alignItems: 'center', justifyContent: 'center' },
  demoTitle: { fontSize: 15, fontWeight: '900', color: colors.ink, marginTop: 26, textAlign: 'center' },
  demoSubtitle: { color: colors.sage, fontSize: 12, textAlign: 'center', marginTop: 3 },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  demoCard: { width: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12 },
  demoPressed: { backgroundColor: colors.mint },
  demoDisabled: { opacity: 0.55 },
  demoLabel: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  demoDescription: { color: colors.sage, fontSize: 11, marginTop: 3, lineHeight: 15 },
  footer: { color: colors.sage, fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
});
