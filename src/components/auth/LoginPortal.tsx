import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ArrowRight, Globe, ShieldCheck } from 'lucide-react-native';
import { UserRole, UserProfile } from '../../types';
import { demoProfiles } from '../../data/mockAppData';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';
import { Card, Row, Chip, TextField, PrimaryButton, Section } from '../../ui';
import { colors, radius, fontSize, roleAccent, roleAccentLight, spacing } from '../../theme';

interface LoginPortalProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogin: (profile: UserProfile) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  currentLang,
  onLanguageChange,
  onLogin,
}) => {
  const t = mobileTranslations[currentLang];
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [trade, setTrade] = useState('electrician');
  const [coopName, setCoopName] = useState('');

  const accent = roleAccent[selectedRole];
  const accentBg = roleAccentLight[selectedRole];

  const handleUseDemoProfile = () => {
    onLogin(demoProfiles[selectedRole]);
  };

  const handleSubmitForm = () => {
    const fallbackProfile = demoProfiles[selectedRole];
    const tradeLabels: Record<string, string> = {
      electrician: 'Master Electrician',
      plumber: 'Sanitary Plumber',
      carpenter: 'Furniture Carpenter',
      cleaning: 'Deep Cleaning Specialist',
      appliance: 'Appliance Repair Technician',
    };

    const customProfile: UserProfile = {
      id: `${selectedRole}-${Date.now().toString().slice(-4)}`,
      role: selectedRole,
      name: name.trim() || fallbackProfile.name,
      title:
        selectedRole === 'customer'
          ? 'Registered Household Customer'
          : selectedRole === 'worker'
          ? `${tradeLabels[trade] || 'Certified Technician'} & Co-owner`
          : 'Cooperative Society Administrator',
      phone: phone.trim() || fallbackProfile.phone,
      email: `${(name.trim() || 'user').toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatar: fallbackProfile.avatar,
      locality: locality.trim() || fallbackProfile.locality,
      wardHub: fallbackProfile.wardHub,
      coopId: fallbackProfile.coopId,
      coopName:
        selectedRole === 'cooperative' && coopName.trim()
          ? coopName.trim()
          : fallbackProfile.coopName,
      memberId: fallbackProfile.memberId,
      verificationBadge: fallbackProfile.verificationBadge,
      equityTier: fallbackProfile.equityTier,
    };

    onLogin(customProfile);
  };

  const roleTabs: { key: UserRole; label: string }[] = [
    { key: 'customer', label: t.roles.customer },
    { key: 'worker', label: t.roles.worker },
    { key: 'cooperative', label: t.roles.cooperative },
  ];

  const langTabs: { key: AppLanguage; label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'hi', label: 'हिं' },
    { key: 'mr', label: 'मरा' },
  ];

  const trades: { key: string; label: string }[] = [
    { key: 'electrician', label: t.trades.electrician },
    { key: 'plumber', label: t.trades.plumber },
    { key: 'carpenter', label: t.trades.carpenter },
    { key: 'cleaning', label: t.trades.cleaning },
    { key: 'appliance', label: t.trades.appliances },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Row between style={styles.topHeader}>
          <Row style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>R</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Rojgar</Text>
              <Text style={styles.tagline}>{t.tagline}</Text>
            </View>
          </Row>

          <Row style={styles.langSelector}>
            <Globe size={12} color={colors.textMuted} />
            {langTabs.map((lang) => {
              const active = currentLang === lang.key;
              return (
                <Pressable
                  key={lang.key}
                  onPress={() => onLanguageChange(lang.key)}
                  accessibilityRole="button"
                  style={[styles.langTab, active && styles.langTabActive]}
                >
                  <Text style={[styles.langTabText, active && styles.langTabTextActive]}>
                    {lang.label}
                  </Text>
                </Pressable>
              );
            })}
          </Row>
        </Row>

        <Text style={styles.pageTitle}>
          {authMode === 'login' ? t.auth.loginTab : t.auth.signupTab}
        </Text>

        <Section title={t.auth.chooseRole}>
          <Row style={styles.roleRow}>
            {roleTabs.map((role) => {
              const active = selectedRole === role.key;
              const c = roleAccent[role.key];
              return (
                <Pressable
                  key={role.key}
                  onPress={() => setSelectedRole(role.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.roleTab,
                    active && { backgroundColor: c, borderColor: c },
                  ]}
                >
                  <Text numberOfLines={1} style={[styles.roleTabText, active && styles.roleTabTextActive]}>
                    {role.label}
                  </Text>
                </Pressable>
              );
            })}
          </Row>
        </Section>

        <View style={[styles.demoBlock, { borderColor: accent + '44', backgroundColor: accentBg }]}>
          <Row between>
            <Text style={[styles.demoTitle, { color: accent }]}>
              {currentLang === 'hi'
                ? 'त्वरित मूल्यांकन पहुँच'
                : currentLang === 'mr'
                ? 'जलद मूल्यमापन प्रवेश'
                : 'Fast Evaluation Access'}
            </Text>
            <Text style={[styles.roleBadge, { backgroundColor: colors.surface, color: accent }]}>
              {selectedRole === 'customer'
                ? t.roles.customer
                : selectedRole === 'worker'
                ? t.roles.worker
                : t.roles.cooperative}
            </Text>
          </Row>

          <Text style={styles.demoNotice}>{t.auth.quickDemoNotice}</Text>

          <PrimaryButton
            label={t.auth.useDemoBtn}
            color={accent}
            onPress={handleUseDemoProfile}
            style={styles.demoBtn}
          />
        </View>

        <Row style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>
            {currentLang === 'hi'
              ? 'या विवरण दर्ज करें'
              : currentLang === 'mr'
              ? 'किंवा तपशील भरा'
              : 'or enter details'}
          </Text>
          <View style={styles.orLine} />
        </Row>

        <Card style={styles.formCard}>
          <TextField
            label={t.auth.fullName}
            value={name}
            onChangeText={setName}
            placeholder={t.auth.fullNamePlaceholder}
          />

          <TextField
            label={t.auth.phone}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.auth.phonePlaceholder}
            keyboardType="phone-pad"
          />

          <TextField
            label={t.auth.locality}
            value={locality}
            onChangeText={setLocality}
            placeholder={t.auth.localityPlaceholder}
          />

          {selectedRole === 'worker' && (
            <View>
              <Text style={styles.fieldLabel}>{t.auth.primaryTrade}</Text>
              <Row wrap style={styles.tradeRow}>
                {trades.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    selected={trade === item.key}
                    color={roleAccent.worker}
                    onPress={() => setTrade(item.key)}
                  />
                ))}
              </Row>
            </View>
          )}

          {selectedRole === 'cooperative' && (
            <TextField
              label={t.auth.coopName}
              value={coopName}
              onChangeText={setCoopName}
              placeholder={t.auth.coopNamePlaceholder}
            />
          )}

          <PrimaryButton
            label={authMode === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            color={colors.slate900}
            onPress={handleSubmitForm}
          />
        </Card>

        <Row style={styles.footer}>
          <ShieldCheck size={14} color={colors.emerald} />
          <Text style={styles.footerText}>
            {currentLang === 'hi'
              ? 'श्रमिक-स्वामित्व और सहकारी रूप से संचालित'
              : currentLang === 'mr'
              ? 'कामगार-मालकी आणि सहकारी नियंत्रित'
              : 'Worker-Owned & Cooperative Governed'}
          </Text>
        </Row>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 40,
  },
  topHeader: {
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
    flexWrap: 'wrap',
  },
  brandRow: {
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    backgroundColor: colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '800',
  },
  brandName: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  tagline: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 1,
  },
  langSelector: {
    gap: 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    padding: 4,
  },
  langTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    minHeight: 28,
    justifyContent: 'center',
  },
  langTabActive: {
    backgroundColor: colors.emerald,
  },
  langTabText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate700,
  },
  langTabTextActive: {
    color: colors.white,
  },
  pageTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  roleRow: {
    gap: 8,
  },
  roleTab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: radius.control,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    minHeight: 44,
  },
  roleTabText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate700,
    textAlign: 'center',
  },
  roleTabTextActive: {
    color: colors.white,
  },
  demoBlock: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  demoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    flexShrink: 1,
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  demoNotice: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  demoBtn: {
    marginTop: 4,
  },
  orRow: {
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  formCard: {
    gap: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  tradeRow: {
    gap: 8,
    flexWrap: 'wrap',
  },
  footer: {
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
