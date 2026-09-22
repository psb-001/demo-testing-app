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
import { md3 } from '../../theme';
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

  // Distinct portal color schemes: Customer (Blue), Worker-Owner (Green), Cooperative (Purple)
  // MD3 role repoint — no new hexes, all three states track the brand token layer (theme.ts → md3.colors).
  const roleTheme = {
    customer: {
      color: md3.colors.secondary,
      indicator: md3.colors.secondary,
      badge: md3.colors.secondary,
    },
    worker: {
      color: md3.colors.primary,
      indicator: md3.colors.primary,
      badge: md3.colors.primary,
    },
    cooperative: {
      color: md3.colors.tertiary,
      indicator: md3.colors.tertiary,
      badge: md3.colors.tertiary,
    },
  }[currentRole];

  const getTabsForRole = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'home', label: t.tabs.home, icon: <Home size={20} /> },
          { id: 'book', label: t.tabs.book, icon: <Search size={20} /> },
          {
            id: 'bookings',
            label: t.tabs.bookings,
            icon: <Calendar size={20} />,
            badge:
              badgeCounts.customerBookings && badgeCounts.customerBookings > 0
                ? badgeCounts.customerBookings
                : undefined,
          },
          { id: 'invoices', label: t.tabs.invoices, icon: <FileText size={20} /> },
          { id: 'support', label: t.tabs.support, icon: <LifeBuoy size={20} /> },
        ];

      case 'worker':
        return [
          {
            id: 'jobs',
            label: t.tabs.jobs,
            icon: <Briefcase size={20} />,
            badge:
              badgeCounts.workerJobs && badgeCounts.workerJobs > 0
                ? badgeCounts.workerJobs
                : undefined,
          },
          {
            id: 'requests',
            label: t.tabs.requests,
            icon: <Radio size={20} />,
            badge:
              badgeCounts.workerRequests && badgeCounts.workerRequests > 0
                ? badgeCounts.workerRequests
                : undefined,
          },
          { id: 'reviews', label: t.tabs.reviews, icon: <Star size={20} /> },
          { id: 'disputes', label: t.tabs.disputes, icon: <ShieldAlert size={20} /> },
          { id: 'profile', label: t.tabs.profile, icon: <UserCheck size={20} /> },
        ];

      case 'cooperative':
        return [
          { id: 'overview', label: t.tabs.overview, icon: <LayoutDashboard size={20} /> },
          { id: 'members', label: t.tabs.members, icon: <Users size={20} /> },
          { id: 'bookings', label: t.tabs.bookings, icon: <Calendar size={20} /> },
          {
            id: 'disputes',
            label: t.tabs.disputes,
            icon: <ShieldAlert size={20} />,
            badge:
              badgeCounts.coopDisputes && badgeCounts.coopDisputes > 0
                ? badgeCounts.coopDisputes
                : undefined,
          },
          { id: 'reviews', label: t.tabs.reviews, icon: <Star size={20} /> },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.tabBar}>
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconColor = isActive ? roleTheme.color : '#94a3b8';
          const icon =
            React.isValidElement<{ color?: string }>(tab.icon)
              ? React.cloneElement(tab.icon, { color: iconColor })
              : tab.icon;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={({ pressed }) => [
                styles.tabBtn,
                pressed && styles.tabBtnPressed,
              ]}
            >
              {/* Icon Container with Badge */}
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconWrap,
                    isActive ? styles.iconWrapActive : styles.iconWrapInactive,
                  ]}
                >
                  {icon}
                </View>
                {tab.badge !== undefined && (
                  <View style={[styles.badge, { backgroundColor: roleTheme.badge }]}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>

              {/* Label */}
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  isActive
                    ? { color: roleTheme.color, fontWeight: '700' }
                    : styles.labelInactive,
                ]}
              >
                {tab.label}
              </Text>

              {/* Active Indicator Bar */}
              {isActive && (
                <View
                  style={[styles.indicator, { backgroundColor: roleTheme.indicator }]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBtn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  tabBtnPressed: {
    transform: [{ scale: 0.9 }],
  },
  iconContainer: {
    position: 'relative',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    transform: [{ scale: 1.1 }],
  },
  iconWrapInactive: {},
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 15,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.2,
    maxWidth: '100%',
  },
  labelInactive: {
    color: '#64748b',
    fontWeight: '500',
  },
  indicator: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginTop: 2,
  },
});