import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert, Platform } from 'react-native';
import {
  Bell,
  RotateCcw,
  ChevronDown,
  LogOut,
  Globe,
} from 'lucide-react-native';
import { UserRole, UserProfile } from '../../types';
import { colors, radius, fontSize, roleAccent, roleAccentLight } from '../../theme';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';

interface MobileHeaderProps {
  currentRole: UserRole;
  activeProfile?: UserProfile | null;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenRoleSelect: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onResetData: () => void;
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentRole,
  activeProfile,
  currentLang,
  onLanguageChange,
  onOpenRoleSelect,
  onOpenNotifications,
  unreadNotificationsCount,
  onResetData,
  onLogout,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<any>(null);
  const t = mobileTranslations[currentLang];
  const isWeb = Platform.OS === 'web';
  const accent = roleAccent[currentRole];
  const accentBg = roleAccentLight[currentRole];

  useEffect(() => {
    if (!isWeb) return;
    const dom = globalThis as any;
    const handleClickOutside = (e: any) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    if (typeof dom.window?.addEventListener === 'function') {
      dom.window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (typeof dom.window?.removeEventListener === 'function') {
        dom.window.removeEventListener('mousedown', handleClickOutside);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetPress = () => {
    if (isWeb) {
      const dom = globalThis as any;
      if (dom.window.confirm(t.header.resetConfirm)) {
        onResetData();
      }
    } else {
      Alert.alert(t.header.resetConfirm, '', [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.common.confirm, onPress: onResetData },
      ]);
    }
  };

  const langTriggerLabel =
    currentLang === 'en' ? 'EN' : currentLang === 'hi' ? 'हिं' : 'मरा';
  const roleLabel = activeProfile
    ? activeProfile.name.split(' ')[0]
    : currentRole === 'customer'
    ? t.roles.customer
    : currentRole === 'worker'
    ? t.roles.worker
    : t.roles.cooperative;

  return (
    <View style={styles.header}>
      <View style={[styles.accentRule, { backgroundColor: accent }]} />
      <View style={styles.inner}>
        <View style={styles.left}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <View style={styles.brandCol}>
            <Text style={styles.brandName}>Rojgar</Text>
            <Text style={styles.brandTagline} numberOfLines={1}>
              {t.tagline}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.langWrap} ref={langMenuRef}>
            <Pressable
              onPress={() => setShowLangMenu(!showLangMenu)}
              accessibilityLabel="Change language"
              accessibilityRole="button"
              style={({ pressed }) => [styles.langTrigger, pressed && styles.pressed]}
            >
              <Globe size={12} color={colors.textSecondary} />
              <Text style={styles.langTriggerText}>{langTriggerLabel}</Text>
              <ChevronDown size={10} color={colors.textSecondary} style={styles.langChevron} />
            </Pressable>

            {showLangMenu && (
              <View style={styles.langMenu}>
                {(
                  [
                    { key: 'en' as AppLanguage, label: 'English (EN)' },
                    { key: 'hi' as AppLanguage, label: 'हिंदी (HI)' },
                    { key: 'mr' as AppLanguage, label: 'मराठी (MR)' },
                  ]
                ).map((lang) => {
                  const active = currentLang === lang.key;
                  return (
                    <Pressable
                      key={lang.key}
                      onPress={() => {
                        onLanguageChange(lang.key);
                        setShowLangMenu(false);
                      }}
                      style={({ pressed }) => [
                        styles.langMenuItem,
                        active && { backgroundColor: accentBg },
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.langMenuText,
                          active && { color: accent, fontWeight: '700' },
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <Pressable
            onPress={onOpenRoleSelect}
            accessibilityRole="button"
            accessibilityLabel={`Switch portal. Current: ${roleLabel}`}
            style={({ pressed }) => [
              styles.rolePill,
              { backgroundColor: accentBg, borderColor: accent + '55' },
              pressed && styles.pressed,
            ]}
          >
            {activeProfile?.avatar ? (
              <Image source={{ uri: activeProfile.avatar }} style={styles.avatar} />
            ) : null}
            <Text style={[styles.rolePillLabel, { color: accent }]} numberOfLines={1}>
              {roleLabel}
            </Text>
            <ChevronDown size={10} color={accent} style={styles.roleChevron} />
          </Pressable>

          <Pressable
            onPress={onOpenNotifications}
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${unreadNotificationsCount} unread`}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <Bell size={16} color={colors.slate600} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={onLogout}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <LogOut size={14} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={handleResetPress}
            accessibilityRole="button"
            accessibilityLabel="Reset demo data"
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <RotateCcw size={12} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  accentRule: {
    height: 3,
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: radius.control,
    backgroundColor: colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  brandCol: {
    flexDirection: 'column',
    flexShrink: 1,
    minWidth: 0,
  },
  brandName: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    letterSpacing: -0.2,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 13,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  langWrap: {
    position: 'relative',
    zIndex: 60,
    elevation: 60,
  },
  langTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.control,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 32,
  },
  langTriggerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate700,
  },
  langChevron: {
    opacity: 0.6,
  },
  langMenu: {
    position: 'absolute',
    right: 0,
    top: 36,
    width: 128,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 4,
    zIndex: 50,
    shadowColor: colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  langMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  langMenuText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.slate700,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    maxWidth: 120,
    minHeight: 32,
  },
  rolePillPressed: {
    opacity: 0.85,
  },
  rolePillLabel: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: 70,
  },
  roleChevron: {
    opacity: 0.7,
  },
  avatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconBtn: {
    padding: 7,
    borderRadius: radius.full,
    position: 'relative',
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    paddingHorizontal: 2,
    borderRadius: 7,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 11,
  },
});
