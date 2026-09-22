# Rojgar — Kaam bhi, Samman bhi.

Rojgar is a mobile demo of a worker-cooperative marketplace. It shows three
portals in one app: customers book verified workers, worker-owners run their
own dispatch, and the cooperative federation keeps the books. All data is mock
and local; nothing leaves the phone.

## What's inside

- **Customer portal** — book a worker by ward hub, track a 5-stage service
  lifecycle, get a co-op invoice with an 88%/12% payout split, raise disputes.
- **Worker-owner portal** — take incoming requests on a 5-minute window, see
  direct payouts vs. welfare pool, manage jobs, reviews, and dispute responses.
- **Cooperative portal** — ward dispatch log, member roster, peer arbitration,
  and a demand-forecasting dashboard with workforce rebalancing.

Copy is translated to English, Hindi, and Marathi. The tagline, *Kaam bhi,
Samman bhi.* (Work and dignity), is the whole premise: pay workers directly,
price transparently, and run disputes through a peer council instead of fines.

## Run it

Requires Node and the Expo CLI. Target SDK 57.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` / `w` for iOS, Android, or
web. No sign-up: pick a role in the demo login and tap **Use Demo Profile
(1-Tap)**.

## Stack

- Expo SDK 57, React Native 0.86, React 19.2
- TypeScript 6
- lucide-react-native for icons
- @react-native-async-storage/async-storage for local state

## Layout

```
App.tsx                 — role switch, tab shell, shared state
src/components/         — one folder per portal plus shared UI
  auth/ common/         — login, headers, tabs, notifications
  customer/ worker/     — customer and worker-owner screens
  cooperative/          — dispatch, roster, arbitration, forecasting
src/data/               — mock profiles, bookings, reviews, disputes
src/services/           — booking, dispute, review, notification logic
src/types/              — shared models
src/ui/                 — reusable UI primitives
```

## Reset demo state

From the header, use **Reset App Data** to restore the original mock dataset.