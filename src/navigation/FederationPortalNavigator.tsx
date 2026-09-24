import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalTopBar } from '../components/portal';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import FederationPortalScreen from '../screens/FederationPortalScreen';
import FederationModuleScreen from '../screens/FederationModuleScreen';

const FederationTab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={21} color={color} />;
}

export function FederationPortalNavigator() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <PortalTopBar roleLabel="Federation admin" userName={user?.name || 'Federation admin'} userMeta={user?.orgName || 'Network oversight'} onLogout={logout} onOpenAI={() => navigation.navigate('MainTabs', { screen: 'AI' })} notificationCount={5} />
      <FederationTab.Navigator initialRouteName="Overview" screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.forest, tabBarInactiveTintColor: colors.sage, tabBarLabelStyle: { fontSize: 10, fontWeight: '800' }, tabBarStyle: { height: 64 + insets.bottom, paddingTop: 7, paddingBottom: Math.max(insets.bottom, 7), backgroundColor: '#fff', borderTopColor: colors.border }, tabBarHideOnKeyboard: true }}>
        <FederationTab.Screen name="Overview" component={FederationPortalScreen} options={{ tabBarLabel: 'Overview', tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} /> }} />
        <FederationTab.Screen name="Societies" component={() => <FederationModuleScreen mode="societies" />} options={{ tabBarLabel: 'Societies', tabBarIcon: ({ color }) => <TabIcon name="business-outline" color={color} /> }} />
        <FederationTab.Screen name="Demand" component={() => <FederationModuleScreen mode="demand" />} options={{ tabBarLabel: 'Demand', tabBarIcon: ({ color }) => <TabIcon name="trending-up-outline" color={color} /> }} />
        <FederationTab.Screen name="Coverage" component={() => <FederationModuleScreen mode="coverage" />} options={{ tabBarLabel: 'Coverage', tabBarIcon: ({ color }) => <TabIcon name="map-outline" color={color} /> }} />
        <FederationTab.Screen name="More" component={() => <FederationModuleScreen mode="more" />} options={{ tabBarLabel: 'More', tabBarIcon: ({ color }) => <TabIcon name="ellipsis-horizontal" color={color} /> }} />
      </FederationTab.Navigator>
    </View>
  );
}
