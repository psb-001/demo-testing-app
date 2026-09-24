import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from './types';
import { portalRouteForRole } from './types';
import { useAuth } from '../context/AuthContext';
import ServicesScreen from '../screens/ServicesScreen';
import MapScreen from '../screens/MapScreen';
import AIScreen from '../screens/AIScreen';
import AccountScreen from '../screens/AccountScreen';
import WorkersScreen from '../screens/WorkersScreen';
import WorkerDetailScreen from '../screens/WorkerDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import WelfareScreen from '../screens/WelfareScreen';
import CustomerPaymentsScreen from '../screens/CustomerPaymentsScreen';
import SavedWorkersScreen from '../screens/SavedWorkersScreen';
import AdminScreen from '../screens/AdminScreen';
import AuthScreen from '../screens/AuthScreen';
import { CustomerPortalNavigator } from './CustomerPortalNavigator';
import { WorkerPortalNavigator } from './WorkerPortalNavigator';
import { CooperativePortalNavigator } from './CooperativePortalNavigator';
import { FederationPortalNavigator } from './FederationPortalNavigator';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label }: { label: string }) {
  const icons: Record<string, string> = { Services: '🧰', Map: '🗺️', AI: '✨', Account: '👤' };
  return <Text style={styles.tabIcon}>{icons[label] || '•'}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Services"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => <TabIcon label={route.name} />,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.sage,
      })}
    >
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: 'Find a service' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Nearby map' }} />
      <Tab.Screen name="AI" component={AIScreen} options={{ title: 'Rozgar AI' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <View style={styles.loadingMark}><Text style={styles.loadingMarkText}>W</Text></View>
      <ActivityIndicator size="large" color={colors.forest} />
      <Text style={styles.loadingText}>Loading WorkConnect…</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const initialRoute = portalRouteForRole(user.role);

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={user.id}
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '800' },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="CustomerPortal" component={CustomerPortalNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerPortal" component={WorkerPortalNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CooperativePortal" component={CooperativePortalNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="FederationPortal" component={FederationPortalNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Workers" component={WorkersScreen} options={{ title: 'Workers' }} />
        <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen} options={{ title: 'Skill Passport' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Confirm Booking' }} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency' }} />
        <Stack.Screen name="Welfare" component={WelfareScreen} options={{ title: 'Welfare' }} />
        <Stack.Screen name="CustomerPayments" component={CustomerPaymentsScreen} options={{ title: 'Payments & invoices' }} />
        <Stack.Screen name="SavedWorkers" component={SavedWorkersScreen} options={{ title: 'Saved workers' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Analytics' }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Account' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: { fontSize: 18 },
  loading: { flex: 1, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center' },
  loadingMark: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  loadingMarkText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  loadingText: { color: colors.sage, fontSize: 14, marginTop: 12 },
});
