import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Home,
  Search,
  Calendar,
  Star,
  LifeBuoy,
  Briefcase,
  Radio,
  ShieldAlert,
  UserCheck,
  LayoutDashboard,
  Users,
  FileText,
} from 'lucide-react-native';
import { UserRole } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, fontSize, roleAccent } from '../../theme';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';

interface BottomTabBarProps {
  currentRole: UserRole;
  currentLang?: AppLanguage;
  activeTab: string;
  onTabChange: (tab: string) => void;
  badgeCounts: {
    customerBookings?: number;
    workerJobs?: number;
    workerRequests?: number;
    coopDisputes?: number;
  };
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentRole,
  currentLang = 'en',
  activeTab,
  onTabChange,
  badgeCounts,
}) => {
  const t = mobileTranslations[currentLang];
  const accent = roleAccent[currentRole];
  const insets = useSafeAreaInsets();

  const getTabsForRole = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'home', label: t.tabs.home, icon: Home },
          { id: 'book', label: t.tabs.book, icon: Search },
          {
            id: 'bookings',
            label: t.tabs.bookings,
            icon: Calendar,
            badge: badgeCounts.customerBookings,
          },
          { id: 'invoices', label: t.tabs.invoices, icon: FileText },
          { id: 'support', label: t.tabs.support, icon: LifeBuoy },
        ];

      case 'worker':
        return [
          {
            id: 'jobs',
            label: t.tabs.jobs,
            icon: Briefcase,
            badge: badgeCounts.workerJobs,
          },
          {
            id: 'requests',
            label: t.tabs.requests,
            icon: Radio,
            badge: badgeCounts.workerRequests,
          },
          { id: 'reviews', label: t.tabs.reviews, icon: Star },
          { id: 'disputes', label: t.tabs.disputes, icon: ShieldAlert },
          { id: 'profile', label: t.tabs.profile, icon: UserCheck },
        ];

      case 'cooperative':
        return [
          { id: 'overview', label: t.tabs.overview, icon: LayoutDashboard },
          { id: 'members', label: t.tabs.members, icon: Users },
          { id: 'bookings', label: t.tabs.bookings, icon: Calendar },
          {
            id: 'disputes',
            label: t.tabs.disputes,
            icon: ShieldAlert,
            badge: badgeCounts.coopDisputes,
          },
          { id: 'reviews', label: t.tabs.reviews, icon: Star },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const iconColor = isActive ? accent : colors.textMuted;
          const badge = tab.badge !== undefined && tab.badge > 0 ? tab.badge : undefined;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={({ pressed }) => [styles.tabBtn, pressed && styles.tabBtnPressed]}
            >
              <View style={styles.iconWrap}>
                <Icon size={20} color={iconColor} strokeWidth={isActive ? 2.4 : 2} />
                {badge !== undefined && (
                  <View style={[styles.badge, { backgroundColor: accent }]}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  isActive ? { color: accent, fontWeight: '700' } : styles.labelInactive,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[styles.indicator, isActive ? { backgroundColor: accent } : null]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  tabBtn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 52,
    gap: 2,
  },
  tabBtnPressed: {
    opacity: 0.75,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 14,
  },
  label: {
    fontSize: 11,
    maxWidth: '100%',
  },
  labelInactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  indicator: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
});
