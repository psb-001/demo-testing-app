# View Rojgar in Expo Go (one command)

Project: `rozgar ai/RojgarRNExpo` — already converted + typechecked (tsc, eslint) and
the Android bundle is verified to compile with `npx expo export`.

## Run it
```bash
cd "/Users/prathameshbhujbal/rozgar ai/RojgarRNExpo"
npm start          # → starts Metro, prints a QR
```
Then on your phone:
1. Install **Expo Go** from the Play Store.
2. Make sure phone and Mac are on the **same Wi-Fi**.
3. In Expo Go, tap **Scan QR code** and point at the terminal.
4. The app opens in ~10s (first launch bundles from Metro).

## If the QR doesn't connect
- Same Wi-Fi / no VPN (33.3-class everything blocked earlier):
  run `npm start -- --tunnel` and scan again (goes over the internet instead).
- Expo Go must be the same major version Expo downloads on first scan (it auto-prompts).

## Re-verify the bundle compiles (optional, 30s)
```bash
cd "/Users/prathameshbhujbal/rozgar ai/RojgarRNExpo"
npm start -- --export --platform android --output-dir /tmp/rojgar-apk-check
```
If it prints `Exported:` without errors, the app will load in Expo Go.

## What was removed (this session)
- Old Capacitor web project `rozgar ai/SolutionX-SIH2026` (Capacitor completely removed)
- Stray `RojgarRNExpo`… bare `RojgarRN` RN project + Capacitor scaffold + old `.claude/.clipboard/.codebuddy/.pi` tool dirs
- Stray `package-lock.json`, `react-native-community-cli-...tgz`

Things moved to trash are recoverable from the Trash if ever needed.
