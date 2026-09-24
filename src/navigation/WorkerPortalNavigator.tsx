import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { PortalTopBar } from '../components/portal';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import WorkerPortalScreen from '../screens/WorkerPortalScreen';
import WorkerJobsScreen from '../screens/WorkerJobsScreen';
import WorkerPassportScreen from '../screens/WorkerPassportScreen';
import WorkerEarningsScreen from '../screens/WorkerEarningsScreen';
import AccountScreen from '../screens/AccountScreen';

const WorkerTab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={21} color={color} />;
}

export function WorkerPortalNavigator() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <PortalTopBar roleLabel="Worker portal" userName={user?.name || 'Worker'} userMeta={user?.tradeLabel || 'Cooperative member'} onLogout={logout} onOpenAI={() => navigation.navigate('MainTabs', { screen: 'AI' })} notificationCount={4} />
      <WorkerTab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.forest, tabBarInactiveTintColor: colors.sage, tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginBottom: 3 }, tabBarStyle: { height: 70, paddingTop: 7, backgroundColor: '#fff', borderTopColor: colors.border } }}>
        <WorkerTab.Screen name="Home" component={WorkerPortalScreen} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} /> }} />
        <WorkerTab.Screen name="Jobs" component={WorkerJobsScreen} options={{ tabBarLabel: 'Jobs', tabBarIcon: ({ color }) => <TabIcon name="briefcase-outline" color={color} /> }} />
        <WorkerTab.Screen name="Passport" component={WorkerPassportScreen} options={{ tabBarLabel: 'Passport', tabBarIcon: ({ color }) => <TabIcon name="shield-checkmark-outline" color={color} /> }} />
        <WorkerTab.Screen name="Earnings" component={WorkerEarningsScreen} options={{ tabBarLabel: 'Earnings', tabBarIcon: ({ color }) => <TabIcon name="wallet-outline" color={color} /> }} />
        <WorkerTab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: 'Account', tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} /> }} />
      </WorkerTab.Navigator>
    </View>
  );
}
