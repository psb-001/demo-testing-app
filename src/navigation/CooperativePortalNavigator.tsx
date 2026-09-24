import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalAIButton, PortalTopBar } from '../components/portal';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import CooperativePortalScreen from '../screens/CooperativePortalScreen';
import CoopRequestsScreen from '../screens/CoopRequestsScreen';
import CoopWorkforceScreen from '../screens/CoopWorkforceScreen';
import CoopPaymentsScreen from '../screens/CoopPaymentsScreen';
import CoopMoreScreen from '../screens/CoopMoreScreen';

const CoopTab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={21} color={color} />;
}

export function CooperativePortalNavigator() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <PortalTopBar roleLabel="Cooperative admin" userName={user?.name || 'Cooperative admin'} userMeta={user?.orgName || 'Verified society'} onLogout={logout} onOpenAI={() => navigation.navigate('MainTabs', { screen: 'AI' })} notificationCount={6} />
      <CoopTab.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.forest, tabBarInactiveTintColor: colors.sage, tabBarLabelStyle: { fontSize: 10, fontWeight: '800' }, tabBarStyle: { height: 64 + insets.bottom, paddingTop: 7, paddingBottom: Math.max(insets.bottom, 7), backgroundColor: '#fff', borderTopColor: colors.border }, tabBarHideOnKeyboard: true }}>
        <CoopTab.Screen name="Dashboard" component={CooperativePortalScreen} options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} /> }} />
        <CoopTab.Screen name="Requests" component={CoopRequestsScreen} options={{ tabBarLabel: 'Requests', tabBarIcon: ({ color }) => <TabIcon name="document-text-outline" color={color} /> }} />
        <CoopTab.Screen name="Workforce" component={CoopWorkforceScreen} options={{ tabBarLabel: 'Workforce', tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} /> }} />
        <CoopTab.Screen name="Payments" component={CoopPaymentsScreen} options={{ tabBarLabel: 'Payments', tabBarIcon: ({ color }) => <TabIcon name="wallet-outline" color={color} /> }} />
        <CoopTab.Screen name="More" component={CoopMoreScreen} options={{ tabBarLabel: 'More', tabBarIcon: ({ color }) => <TabIcon name="ellipsis-horizontal" color={color} /> }} />
      </CoopTab.Navigator>
      <PortalAIButton onPress={() => navigation.navigate('MainTabs', { screen: 'AI' })} />
    </View>
  );
}
