# WorkConnect Mobile (Expo Go)

Exact mobile port of `../workconnect` website — same features, React Native UI.

## Maps
- The app uses open-source Leaflet with OpenStreetMap tiles inside an Expo-compatible WebView.
- No Google Maps key or Google map provider is required; map tiles need an internet connection and remain subject to the OpenStreetMap tile usage policy.

## App flow
- First launch: branded Login / Signup screen. No public homepage is shown before authentication.
- Login: demo OTP `1234`, optional password login, or one-tap demo role access.
- Signup: choose Customer, Worker, Cooperative, or Federation before creating the account.
- After authentication: the matching role portal opens automatically and is the initial route.
- Logout returns to the Login / Signup screen.

## Native portal design
- Customer tabs: Home, Services, Bookings, Map, Account
- Worker tabs: Home, Jobs, Passport, Earnings, Account
- Cooperative tabs: Dashboard, Requests, Workforce, Payments, More
- Federation tabs: Overview, Societies, Demand, Coverage, More
- Persistent role header with notifications, AI shortcut, identity, and logout
- Customer dashboard includes active-service timeline, recommendations, popular services, quick actions, and transparent booking actions
- Worker job cards implement accept → route → arrived → in progress → completed lifecycle
- Cooperative request, verification, and settlement actions update local demo state
- Bookings, favourites, and worker job state persist with AsyncStorage
- Native map includes trade/emergency filters, GPS location, worker previews, booking, and passport actions
- Booking keeps the website’s date/time, emergency fee, location, payment method, booking type, and 92/8 fare split

## AI guide
- `src/services/rozgarAIService.ts` uses the WorkConnect-only anonymous LLM endpoint when available.
- It is not a model trained specifically on WorkConnect: each request sends the user message plus current role, language, service catalog, worker counts, booking count, and page context.
- A strict system prompt limits answers to WorkConnect usage and asks for JSON containing text plus allowlisted navigation actions.
- The mobile app validates those actions before rendering buttons; it never executes arbitrary URLs or code.
- Requests time out after 8 seconds, are limited to one request every 6.5 seconds, and automatically fall back to the deterministic guided assistant.
- No API key is stored in the app or repository. The current anonymous provider is best-effort and rate-limited by its provider.

## Web → Native mapping
| Web | Mobile |
|---|---|
| `src/types.ts`, `data/mockData.ts`, `services/matchingService.ts`, `mapService.ts`, `rozgarAIService.ts` | copied verbatim (`src/...`) |
| `portals/coop/coopData.ts`, `workerData.ts`, `customerDemo.ts` | copied, DOM `downloadCsv` → RN string return, `PortalLang` local |
| `services/authService.ts` (localStorage) | rewritten on AsyncStorage, same API shape (async) |
| `context/AuthContext` | async version |
| `App.tsx` state modals + role switch | Auth gate + role-specific initial route + persistent native bottom tabs |
| Leaflet OSM | `react-native-webview` + Leaflet + OpenStreetMap tiles |
| Tailwind `#14532D/#2E8B57/...` | `src/theme/theme.ts` StyleSheet |
| `BookingModal` fare 92/8 | `BookingScreen` same math |

Expo Go compatible: only bundled natives (`react-native-webview`, `async-storage`, `expo-location`, `expo-font`, `@expo/vector-icons`, `safe-area`, `screens`). No custom dev client needed.
