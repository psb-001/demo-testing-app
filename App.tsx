import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppStateProvider } from './src/context/AppState';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    const textDefaults = Text as unknown as { defaultProps?: { style?: unknown; [key: string]: unknown } };
    const currentStyle = textDefaults.defaultProps?.style;
    const inheritedStyle: unknown[] = Array.isArray(currentStyle) ? currentStyle : currentStyle ? [currentStyle] : [];
    textDefaults.defaultProps = {
      ...textDefaults.defaultProps,
      style: [{ fontFamily: 'PlusJakartaSans_400Regular' }, ...inheritedStyle],
    };
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.fontLoading}>
        <ActivityIndicator size="large" color={colors.forest} />
        <Text style={styles.fontLoadingText}>Loading WorkConnect…</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppStateProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </AppStateProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fontLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warm },
  fontLoadingText: { color: colors.sage, fontSize: 13, marginTop: 12 },
});
