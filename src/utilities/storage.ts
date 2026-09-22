import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

// Safe access to browser storage (no DOM lib in RN tsconfig)
const getWebStorage = (): any => {
  try {
    const g = globalThis as any;
    return typeof g.localStorage !== 'undefined' ? g.localStorage : null;
  } catch {
    return null;
  }
};

const memoryCache: Record<string, string> = {};

export function getItemSync(key: string): string | null {
  if (memoryCache[key]) return memoryCache[key];
  if (!isNative) {
    const web = getWebStorage();
    if (web) {
      try {
        const value = web.getItem(key);
        if (value) memoryCache[key] = value;
        return value;
      } catch (err) {
        console.error('Failed to read localStorage:', err);
      }
    }
  }
  return memoryCache[key] ?? null;
}

export function setItemSync(key: string, value: string): void {
  memoryCache[key] = value;
  if (!isNative) {
    const web = getWebStorage();
    if (web) {
      try {
        web.setItem(key, value);
        return;
      } catch (err) {
        console.error('Failed to write localStorage:', err);
      }
    }
  }
  if (isNative) {
    AsyncStorage.setItem(key, value).catch((err) =>
      console.error('Failed to write AsyncStorage:', err)
    );
  }
}

export function removeItemSync(key: string): void {
  delete memoryCache[key];
  if (!isNative) {
    const web = getWebStorage();
    if (web) {
      try {
        web.removeItem(key);
        return;
      } catch (err) {
        console.error('Failed to remove localStorage:', err);
      }
    }
  }
  if (isNative) {
    AsyncStorage.removeItem(key).catch((err) =>
      console.error('Failed to remove AsyncStorage:', err)
    );
  }
}

export async function hydrateStorage(): Promise<void> {
  if (!isNative) return;
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    for (const [key, value] of pairs) {
      if (value !== null && value !== undefined) memoryCache[key] = value;
    }
  } catch (err) {
    console.error('Failed to hydrate AsyncStorage cache:', err);
  }
}