import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert, Platform } from 'react-native';
import { md3 } from '../../theme';
import {
  Bell,
  RotateCcw,
  ChevronDown,
  User,
  Wrench,
  Building2,
  LogOut,
  Globe,
} from 'lucide-react-native';
import { UserRole, UserProfile } from '../../types';
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

  // Role pill themes: Customer (Blue), Worker-Owner (Green), Cooperative (Purple)
  const roleBadgeConfig: Record<
    UserRole,
    { label: string; icon: React.ReactNode; badgeStyle: object; badgeColor: string }
  > = {
    customer: {
      label: activeProfile ? activeProfile.name.split(' ')[0] : t.roles.customer,
      icon: <User size={14} color={md3.colors.secondary} />,
      badgeStyle: styles.roleCustomer,
      badgeColor: md3.colors.secondary,
    },
    worker: {
      label: activeProfile ? activeProfile.name.split(' ')[0] : t.roles.worker,
      icon: <Wrench size={14} color={md3.colors.primary} />,
      badgeStyle: styles.roleWorker,
      badgeColor: md3.colors.primary,
    },
    cooperative: {
      label: activeProfile ? activeProfile.name.split(' ')[0] : t.roles.cooperative,
      icon: <Building2 size={14} color={md3.colors.tertiary} />,
      badgeStyle: styles.roleCooperative,
      badgeColor: md3.colors.tertiary,
    },
  };

  const currentBadge = roleBadgeConfig[currentRole];

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

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        {/* Left: Rojgar Brand Name & Tagline */}
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

        {/* Right Actions: Clean Language Dropdown + Role Pill + Bell + Logout */}
        <View style={styles.right}>
          {/* Language Selector Dropdown */}
          <View style={styles.langWrap} ref={langMenuRef}>
            <Pressable
              onPress={() => setShowLangMenu(!showLangMenu)}
              style={({ pressed }) => [styles.langTrigger, pressed && styles.pressed]}
            >
              <Globe size={12} color="#64748b" />
              <Text style={styles.langTriggerText}>{langTriggerLabel}</Text>
              <ChevronDown size={10} color="#64748b" style={styles.langChevron} />
            </Pressable>

            {showLangMenu && (
              <View style={styles.langMenu}>
                <Pressable
                  onPress={() => {
                    onLanguageChange('en');
                    setShowLangMenu(false);
                  }}
                  style={({ pressed }) => [
                    styles.langMenuItem,
                    currentLang === 'en' && styles.langMenuItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.langMenuText,
                      currentLang === 'en' && styles.langMenuTextActive,
                    ]}
                  >
                    English (EN)
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onLanguageChange('hi');
                    setShowLangMenu(false);
                  }}
                  style={({ pressed }) => [
                    styles.langMenuItem,
                    currentLang === 'hi' && styles.langMenuItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.langMenuText,
                      currentLang === 'hi' && styles.langMenuTextActive,
                    ]}
                  >
                    हिंदी (HI)
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onLanguageChange('mr');
                    setShowLangMenu(false);
                  }}
                  style={({ pressed }) => [
                    styles.langMenuItem,
                    currentLang === 'mr' && styles.langMenuItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.langMenuText,
                      currentLang === 'mr' && styles.langMenuTextActive,
                    ]}
                  >
                    मराठी (MR)
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Role Indicator Pill with distinct role theme */}
          <Pressable
            onPress={onOpenRoleSelect}
            style={({ pressed }) => [
              styles.rolePill,
              currentBadge.badgeStyle,
              pressed && styles.rolePillPressed,
            ]}
          >
            {activeProfile?.avatar ? (
              <Image
                source={{
                  uri: activeProfile.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              currentBadge.icon
            )}
            <Text style={[styles.rolePillLabel, { color: currentBadge.badgeColor }]} numberOfLines={1}>
              {currentBadge.label}
            </Text>
            <ChevronDown size={10} color={currentBadge.badgeColor} style={styles.roleChevron} />
          </Pressable>

          {/* Notifications Bell */}
          <Pressable
            onPress={onOpenNotifications}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.pressed,
            ]}
          >
            <Bell size={16} color="#475569" />
            {unreadNotificationsCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Switch Profile / Logout Button */}
          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <LogOut size={14} color="#94a3b8" />
          </Pressable>

          {/* Reset Demo Button */}
          <Pressable
            onPress={handleResetPress}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <RotateCcw size={12} color="#94a3b8" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226,232,240,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'md3.colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  brandCol: {
    flexDirection: 'column',
    flexShrink: 1,
    minWidth: 0,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.4,
    color: '#0f172a',
    lineHeight: 18,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '500',
    color: '#64748b',
    letterSpacing: -0.2,
    lineHeight: 11,
    marginTop: 2,
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
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  langTriggerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  langChevron: {
    opacity: 0.6,
  },
  langMenu: {
    position: 'absolute',
    right: 0,
    top: 34,
    width: 112,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 4,
    zIndex: 50,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  langMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langMenuItemActive: {
    backgroundColor: '#ecfdf5',
  },
  langMenuText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  langMenuTextActive: {
    color: 'md3.colors.tertiary',
    fontWeight: '700',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 120,
  },
  roleCustomer: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  roleWorker: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  roleCooperative: {
    backgroundColor: '#f5f3ff',
    borderColor: '#e9d5ff',
  },
  rolePillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  rolePillLabel: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: 65,
  },
  roleChevron: {
    opacity: 0.6,
  },
  avatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 999,
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 14,
    height: 14,
    paddingHorizontal: 2,
    borderRadius: 7,
    backgroundColor: '#e11d48',
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 11,
  },
});