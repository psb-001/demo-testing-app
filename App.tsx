import React, { useEffect, useState } from 'react';
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
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
  NotoSansDevanagari_700Bold,
} from '@expo-google-fonts/noto-sans-devanagari';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppStateProvider } from './src/context/AppState';
import { LocationProvider } from './src/context/LocationContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';
import { applyDefaultFont } from './src/theme/fonts';
import { detectDeviceLang, I18nProvider, loadStoredLang, type Lang } from './src/i18n';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    // Devanagari coverage for the Hindi and Marathi dictionaries.
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_500Medium,
    NotoSansDevanagari_600SemiBold,
    NotoSansDevanagari_700Bold,
  });

  /**
   * Resolve the persisted language before mounting the tree. AsyncStorage is
   * async, so doing this here (alongside the font gate we already had) means the
   * first frame is already localized instead of flashing English and flipping.
   */
  const [initialLang, setInitialLang] = useState<Lang | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStoredLang().then((lang) => {
      if (!cancelled) setInitialLang(lang);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    applyDefaultFont(initialLang ?? detectDeviceLang());
  }, [fontsLoaded, initialLang]);

  if ((!fontsLoaded && !fontError) || initialLang === null) {
    return (
      <View style={styles.fontLoading}>
        <ActivityIndicator size="large" color={colors.forest} />
        <Text style={styles.fontLoadingText}>Loading Rozgar…</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <I18nProvider initialLang={initialLang}>
        <AuthProvider>
          <AppStateProvider>
            {/* Inside AppStateProvider so screens can read the service location
                alongside booking and search state. */}
            <LocationProvider>
              <RootNavigator />
              <StatusBar style="dark" />
            </LocationProvider>
          </AppStateProvider>
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fontLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warm },
  fontLoadingText: { color: colors.sage, fontSize: 13, marginTop: 12 },
});