import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppStateProvider } from './src/context/AppState';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppStateProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <RootNavigator />
          </SafeAreaView>
          <StatusBar style="dark" />
        </AppStateProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
