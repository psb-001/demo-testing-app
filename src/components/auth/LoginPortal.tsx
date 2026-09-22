import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Building2,
  User,
  Wrench,
  ArrowRight,
  Sparkles,
  Globe,
  ShieldCheck,
} from 'lucide-react-native';
import { UserRole, UserProfile } from '../../types';
import { demoProfiles } from '../../data/mockAppData';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';
import { Card, Row, Chip, TextField } from '../../ui';
import { colors, radius, fontSize, cardShadow } from '../../theme';

interface LoginPortalProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogin: (profile: UserProfile) => void;
}

const roleTheme: Record<UserRole, { primary: string; lightBg: string; textColor: string }> = {
  customer: { primary: '#2563eb', lightBg: '#eff6ff', textColor: '#1d4ed8' },
  worker: { primary: '#059669', lightBg: '#ecfdf5', textColor: '#065f46' },
  cooperative: { primary: '#7c3aed', lightBg: '#f5f3ff', textColor: '#6b21a8' },
};

export const LoginPortal: React.FC<LoginPortalProps> = ({
  currentLang,
  onLanguageChange,
  onLogin,
}) => {
  const t = mobileTranslations[currentLang];
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [trade, setTrade] = useState('electrician');
  const [coopName, setCoopName] = useState('');

  // 1-Tap Demo shortcut: loads the pre-configured mock profile for the chosen role
  const handleUseDemoProfile = () => {
    const demo = demoProfiles[selectedRole];
    onLogin(demo);
  };

  // Form submission: logs in / creates custom profile based on user input
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

  const currentStyle = roleTheme[selectedRole];

  const roleTabs: { key: UserRole; icon: React.ReactNode; label: string }[] = [
    { key: 'customer', icon: <User size={16} color={selectedRole === 'customer' ? '#ffffff' : '#334155'} />, label: t.roles.customer },
    { key: 'worker', icon: <Wrench size={16} color={selectedRole === 'worker' ? '#ffffff' : '#334155'} />, label: t.roles.worker },
    { key: 'cooperative', icon: <Building2 size={16} color={selectedRole === 'cooperative' ? '#ffffff' : '#334155'} />, label: t.roles.cooperative },
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
        {/* Top Clean App Header */}
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

          {/* Language Selector */}
          <Row style={styles.langSelector}>
            <Globe size={12} color="#94a3b8" />
            {langTabs.map((lang) => {
              const active = currentLang === lang.key;
              return (
                <Pressable
                  key={lang.key}
                  onPress={() => onLanguageChange(lang.key)}
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

        {/* Auth Mode Toggle: Log In vs Sign Up */}
        <Row style={styles.authModeSwitch}>
          <Pressable
            onPress={() => setAuthMode('login')}
            style={[styles.authModeTab, authMode === 'login' && styles.authModeTabActive]}
          >
            <Text style={[styles.authModeText, authMode === 'login' && styles.authModeTextActive]}>
              {t.auth.loginTab}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAuthMode('signup')}
            style={[styles.authModeTab, authMode === 'signup' && styles.authModeTabActive]}
          >
            <Text style={[styles.authModeText, authMode === 'signup' && styles.authModeTextActive]}>
              {t.auth.signupTab}
            </Text>
          </Pressable>
        </Row>

        {/* Role Selector Tabs */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>{t.auth.chooseRole}</Text>
          <Row style={styles.roleRow}>
            {roleTabs.map((role) => {
              const active = selectedRole === role.key;
              const primary = roleTheme[role.key].primary;
              return (
                <Pressable
                  key={role.key}
                  onPress={() => setSelectedRole(role.key)}
                  style={[styles.roleTab, active && { backgroundColor: primary, borderColor: primary }]}
                >
                  {role.icon}
                  <Text
                    numberOfLines={1}
                    style={[styles.roleTabText, active && styles.roleTabTextActive]}
                  >
                    {role.label}
                  </Text>
                </Pressable>
              );
            })}
          </Row>
        </View>

        {/* 1-Tap Demo Profile Shortcut Button */}
        <Card style={styles.demoCard}>
          <Row between style={styles.demoHeader}>
            <Row style={styles.demoTitleRow}>
              <Sparkles size={14} color="#f59e0b" />
              <Text style={styles.demoTitle}>
                {currentLang === 'hi' ? 'त्वरित मूल्यांकन पहुँच' : currentLang === 'mr' ? 'जलद मूल्यमापन प्रवेश' : 'Fast Evaluation Access'}
              </Text>
            </Row>
            <Text style={[styles.roleBadge, { backgroundColor: currentStyle.lightBg, color: currentStyle.textColor }]}>
              {selectedRole === 'customer' ? t.roles.customer : selectedRole === 'worker' ? t.roles.worker : t.roles.cooperative}
            </Text>
          </Row>

          <Text style={styles.demoNotice}>{t.auth.quickDemoNotice}</Text>

          <Pressable
            onPress={handleUseDemoProfile}
            style={[styles.demoBtn, { backgroundColor: currentStyle.primary }]}
          >
            <Text style={styles.demoBtnText}>{t.auth.useDemoBtn}</Text>
            <ArrowRight size={14} color="#ffffff" />
          </Pressable>
        </Card>

        {/* Or enter with custom credentials form */}
        <Row style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>
            {currentLang === 'hi' ? 'या विवरण दर्ज करें' : currentLang === 'mr' ? 'किंवा तपशील भरा' : 'or enter details'}
          </Text>
          <View style={styles.orLine} />
        </Row>

        {/* Auth Input Form */}
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

          {/* Conditional field for Worker-Owner */}
          {selectedRole === 'worker' && (
            <View>
              <Text style={styles.fieldLabel}>{t.auth.primaryTrade}</Text>
              <Row wrap style={styles.tradeRow}>
                {trades.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    selected={trade === item.key}
                    color="#059669"
                    onPress={() => setTrade(item.key)}
                  />
                ))}
              </Row>
            </View>
          )}

          {/* Conditional field for Cooperative */}
          {selectedRole === 'cooperative' && (
            <TextField
              label={t.auth.coopName}
              value={coopName}
              onChangeText={setCoopName}
              placeholder={t.auth.coopNamePlaceholder}
            />
          )}

          <Pressable onPress={handleSubmitForm} style={[styles.submitBtn]}>
            <Text style={styles.submitBtnText}>
              {authMode === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            </Text>
            <ArrowRight size={14} color="#ffffff" />
          </Pressable>
        </Card>

        {/* Footer Guarantee */}
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
    backgroundColor: '#0f172a',
    justifyContent: 'flex-start',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  topHeader: {
    alignItems: 'flex-start',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
    flexWrap: 'wrap',
  },
  brandRow: {
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  brandName: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#f8fafc',
    lineHeight: 22,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  langSelector: {
    gap: 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 4,
  },
  langTab: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  langTabActive: {
    backgroundColor: '#059669',
  },
  langTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate700,
  },
  langTabTextActive: {
    color: colors.white,
  },
  authModeSwitch: {
    backgroundColor: 'rgba(226,232,240,0.8)',
    borderRadius: radius.lg,
    padding: 4,
    gap: 4,
  },
  authModeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.md,
    paddingHorizontal: 8,
  },
  authModeTabActive: {
    backgroundColor: colors.white,
  },
  authModeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#475569',
  },
  authModeTextActive: {
    color: colors.slate900,
  },
  roleSection: {
    gap: 6,
  },
  roleLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#cbd5e1',
  },
  roleRow: {
    gap: 8,
  },
  roleTab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate700,
    textAlign: 'center',
  },
  roleTabTextActive: {
    color: colors.white,
  },
  demoCard: {
    ...cardShadow,
  },
  demoHeader: {
    gap: 8,
  },
  demoTitleRow: {
    gap: 6,
    flexShrink: 1,
  },
  demoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.slate800,
    flexShrink: 1,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  demoNotice: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 8,
  },
  demoBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: 10,
  },
  demoBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.white,
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
    textTransform: 'uppercase',
  },
  formCard: {
    gap: 12,
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
  submitBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.slate900,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.white,
  },
  footer: {
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});