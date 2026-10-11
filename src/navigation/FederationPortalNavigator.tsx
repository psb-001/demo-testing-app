import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalTopBar } from '../components/portal';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import { Toast } from '../portals/fed/fedUI';
import { FedStoreProvider, useFedChrome, useFedT, type FedTab } from '../portals/fed/fedStore';

import { FederationDashboard } from '../portals/fed/screens/FederationDashboard';
import { FederationSocieties } from '../portals/fed/screens/FederationSocieties';
import { FederationWorkforce } from '../portals/fed/screens/FederationWorkforce';
import { FederationJobs } from '../portals/fed/screens/FederationJobs';
import { FederationMore } from '../portals/fed/screens/FederationMore';
import { FederationAllocation } from '../portals/fed/screens/FederationAllocation';
import { FederationForecast } from '../portals/fed/screens/FederationForecast';
import { FederationMap } from '../portals/fed/screens/FederationMap';
import { FederationEmergency } from '../portals/fed/screens/FederationEmergency';
import { FederationPayments } from '../portals/fed/screens/FederationPayments';
import { FederationWelfare } from '../portals/fed/screens/FederationWelfare';
import { FederationTraining } from '../portals/fed/screens/FederationTraining';
import { FederationVerification } from '../portals/fed/screens/FederationVerification';
import { FederationReports } from '../portals/fed/screens/FederationReports';
import { FederationNotifications } from '../portals/fed/screens/FederationNotifications';
import { FederationSettings } from '../portals/fed/screens/FederationSettings';

/**
 * Federation Administration portal navigator.
 *
 * Replaces the previous 5-tab stub, which routed four of its five tabs through
 * `FederationModuleScreen mode="..."` — one polymorphic screen covering
 * 'societies' | 'demand' | 'coverage' | 'more'. That structure could not grow
 * and could not receive route params.
 *
 * Structure now: a stack of 15 real module screens, with the five
 * highest-traffic destinations surfaced as bottom tabs and the rest reachable
 * from the grouped "More" screen. Every screen is a first-class route, so the
 * federation portal matches the website's navigation model.
 */

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/** The five modules promoted to the tab bar. */
const PRIMARY_TABS = ['dashboard', 'societies', 'workforce', 'jobs'] as const;

const SCREENS: Record<FedTab, React.ComponentType> = {
  dashboard: FederationDashboard,
  societies: FederationSocieties,
  workforce: FederationWorkforce,
  jobs: FederationJobs,
  allocation: FederationAllocation,
  forecast: FederationForecast,
  fedMap: FederationMap,
  emergency: FederationEmergency,
  payments: FederationPayments,
  welfare: FederationWelfare,
  training: FederationTraining,
  verification: FederationVerification,
  reports: FederationReports,
  notifications: FederationNotifications,
  settings: FederationSettings,
};

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={21} color={color} />;
}

/** Stack route name for a federation module. Same string as the web tab id. */
const routeOf = (tab: FedTab) => tab;

/**
 * fedText keys for the header of each stack-routed module. Kept separate from
 * FED_TAB_LABEL_KEY (which drives the More grid) because these are the longer
 * page titles. `notifications` and `settings` have no `title_*` key on the web,
 * so their nav labels are reused.
 */
const STACK_TITLE_KEY: Partial<Record<FedTab, string>> = {
  allocation: 'title_allocation',
  forecast: 'title_forecast',
  fedMap: 'title_map',
  emergency: 'title_emergency',
  payments: 'title_payments',
  welfare: 'title_welfare',
  training: 'title_training',
  verification: 'title_verification',
  reports: 'title_reports',
  notifications: 'notifications',
  settings: 'settings',
};

/**
 * Maps a federation tab id onto navigation. The four promoted modules jump
 * straight to their tab; everything else pushes the module onto the stack so it
 * gets a back button and a header.
 */
function useFederationNavigation() {
  const navigation = useNavigation<any>();
  return useCallback(
    (tab: string) => {
      if ((PRIMARY_TABS as readonly string[]).includes(tab)) {
        // `navigate` on a nested navigator: jump tabs without stacking.
        navigation.navigate('Tabs', { screen: tab });
        return;
      }
      if (tab === 'more') {
        navigation.navigate('Tabs', { screen: 'More' });
        return;
      }
      navigation.navigate(routeOf(tab as FedTab));
    },
    [navigation],
  );
}

/** Renders the transient toast above the navigator so it is never clipped. */
function FedChrome() {
  const { toast, onHide } = useFedChrome();
  return <Toast message={toast} onHide={onHide} />;
}

export function FederationPortalNavigator() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const go = useFederationNavigation();
  const fedT = useFedT();
  const STACK_TITLES = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(STACK_TITLE_KEY).map(([tab, key]) => [tab, key ? fedT(key) : tab]),
      ) as Partial<Record<FedTab, string>>,
    [fedT],
  );
  const onOpenAI = useCallback(
    () => navigation.navigate('MainTabs', { screen: 'AI' }),
    [navigation],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <PortalTopBar
        roleLabel="Federation admin"
        userName={user?.name || 'Federation admin'}
        userMeta={user?.orgName || 'Network oversight'}
        onLogout={logout}
        onOpenAI={onOpenAI}
        notificationCount={5}
      />
      <FedStoreProvider go={go} onOpenAI={onOpenAI}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: '800', fontSize: 16 },
            headerBackTitle: 'Back',
          }}
        >
          <Stack.Screen name="Tabs" component={FedTabs} options={{ headerShown: false }} />
          {PRIMARY_TABS.map((tab) => (
            <Stack.Screen
              key={tab}
              name={routeOf(tab)}
              component={SCREENS[tab]}
              options={{ headerShown: false }}
            />
          ))}
          {(
            [
              'allocation',
              'forecast',
              'fedMap',
              'emergency',
              'payments',
              'welfare',
              'training',
              'verification',
              'reports',
              'notifications',
              'settings',
            ] as const
          ).map((tab) => (
            <Stack.Screen
              key={tab}
              name={routeOf(tab)}
              component={SCREENS[tab]}
              options={{
                // Without an explicit title React Navigation falls back to the
                // route name, which leaks internal ids like "fedMap" into the UI.
                headerTitle: STACK_TITLES[tab],
                headerBackTitle: 'Back',
              }}
            />
          ))}
        </Stack.Navigator>
        <FedChrome />
      </FedStoreProvider>
    </View>
  );
}

/** The bottom tab bar: four primary modules plus More. */
function FedTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs.Navigator
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.sage,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 7),
          backgroundColor: '#fff',
          borderTopColor: colors.border,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        component={FederationDashboard}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="societies"
        component={FederationSocieties}
        options={{
          tabBarLabel: 'Network',
          tabBarIcon: ({ color }) => <TabIcon name="business-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workforce"
        component={FederationWorkforce}
        options={{
          tabBarLabel: 'Workers',
          tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        component={FederationJobs}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => <TabIcon name="briefcase-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="More"
        component={FederationMore}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color }) => <TabIcon name="ellipsis-horizontal" color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}