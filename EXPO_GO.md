# Run Rojgar in Expo Go (phone) — no Android SDK needed

Expo Go contains ALL native pieces this app uses (AsyncStorage, react-native-svg,
safe-area-context, SafeAreaProvider). That's why it loads with zero local tooling.

## One-time phone setup
1. Install **Expo Go** from the Play Store.
2. Phone + laptop on the **same Wi-Fi**.

## Every time
```bash
cd "/Users/prathameshbhujbal/rozgar ai/RojgarRNExpo"
npx expo start
```
- **iOS**: open Camera → scan the QR → auto-opens in Expo Go.
- **Android**: open Expo Go → `Scan QR code` → scan.

Metro hot-reloads on save like the old web dev server did.

## If the QR won't scan / no same-network
Use tunnel mode (works when laptop+phone aren't on one LAN):
```bash
npm run start -- --tunnel   # or: npx expo start --tunnel
```

## Verify the JS bundle without a phone (optional)
```bash
npx expo export --platform android
```
→ writes to `dist/`; if it succeeds, Expo Go will load the app.
