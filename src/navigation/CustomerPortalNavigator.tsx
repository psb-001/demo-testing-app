import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalTopBar } from '../components/portal';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';
import CustomerDashboardScreen from '../screens/CustomerDashboardScreen';
import ServicesScreen from '../screens/ServicesScreen';
import CustomerBookingsScreen from '../screens/CustomerBookingsScreen';
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';

const CustomerTab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={21} color={color} />;
}

export function CustomerPortalNavigator() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <PortalTopBar
        roleLabel="Customer portal"
        userName={user?.name || 'Customer'}
        userMeta={user?.area || user?.city || 'Pune'}
        onLogout={logout}
        onOpenAI={() => navigation.navigate('MainTabs', { screen: 'AI' })}
        notificationCount={2}
      />
      <CustomerTab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.forest,
          tabBarInactiveTintColor: colors.sage,
           tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
           tabBarStyle: { height: 64 + insets.bottom, paddingTop: 7, paddingBottom: Math.max(insets.bottom, 7), backgroundColor: '#fff', borderTopColor: colors.border },
           tabBarHideOnKeyboard: true,
        }}
      >
        <CustomerTab.Screen name="Home" component={CustomerDashboardScreen} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} /> }} />
        <CustomerTab.Screen name="Services" component={ServicesScreen} options={{ tabBarLabel: 'Services', tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} /> }} />
        <CustomerTab.Screen name="Bookings" component={CustomerBookingsScreen} options={{ tabBarLabel: 'Bookings', tabBarIcon: ({ color }) => <TabIcon name="calendar-outline" color={color} /> }} />
        <CustomerTab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Map', tabBarIcon: ({ color }) => <TabIcon name="map-outline" color={color} /> }} />
        <CustomerTab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: 'Account', tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} /> }} />
      </CustomerTab.Navigator>
    </View>
  );
}
