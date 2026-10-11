import * as Location from 'expo-location';
import { Platform } from 'react-native';

/**
 * Geolocation, ported from
 * workconnect/src/services/geolocationService.ts.
 *
 * The web version wrapped `navigator.geolocation.getCurrentPosition` in a small
 * state machine (`idle → detecting → granted | denied | unavailable |
 * unsupported | error`) and an explicit `reason`. That state machine is kept
 * verbatim, because `LocationSelector`'s UI branches on it — every failure state
 * offers "Enter location manually", which is the product requirement that a user
 * is never blocked out of booking by a permission denial.
 *
 * `navigator.geolocation` is replaced by `expo-location`, which is already a
 * dependency and already configured in app.json.
 */

export type GeolocationState =
  | 'idle'
  | 'detecting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'unsupported'
  | 'error';

export interface DetectedFix {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationResult {
  state: GeolocationState;
  fix?: DetectedFix;
  reason?: 'insecure-context' | 'permission-denied' | 'position-unavailable' | 'timeout';
}

/**
 * Always true on the platforms this app targets. Kept so the state machine and
 * its UI branches stay identical to the web build — if this ever runs somewhere
 * without location services, the caller still handles it rather than crashing.
 */
export function isGeolocationSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Request a single position fix. Never rejects.
 *
 * Order of attempts, chosen so a user is never left without a location:
 *  1. foreground permission -> denied is reported, not thrown
 *  2. a fresh high-accuracy fix
 *  3. the device's last known fix (frequently good enough to prefill a form)
 *  4. `unavailable`
 */
export async function requestCurrentPosition(
  options: { timeout?: number } = {},
): Promise<GeolocationResult> {
  const timeout = options.timeout ?? 10000;

  if (!isGeolocationSupported()) {
    return { state: 'unsupported', reason: 'insecure-context' };
  }

  let granted = false;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    granted = status === Location.PermissionStatus.GRANTED;
  } catch {
    granted = false;
  }
  if (!granted) {
    return { state: 'denied', reason: 'permission-denied' };
  }

  // A fresh fix, bounded by the caller's timeout.
  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      timeout,
    );
    return {
      state: 'granted',
      fix: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
      },
    };
  } catch (error) {
    const timedOut = isTimeoutError(error);
    // Fall back to the last known fix before giving up: it is usually recent
    // enough to prefill an address form, which the user can then correct.
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last) {
        return {
          state: 'granted',
          fix: {
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
            accuracy: last.coords.accuracy ?? undefined,
          },
        };
      }
    } catch {
      /* fall through to the failure result below */
    }
    return timedOut
      ? { state: 'error', reason: 'timeout' }
      : { state: 'unavailable', reason: 'position-unavailable' };
  }
}

/** Reject with a recognisable message if `promise` outlives `ms`. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('LOCATION_TIMEOUT')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function isTimeoutError(error: unknown): boolean {
  return (
    (error instanceof Error && error.message.includes('LOCATION_TIMEOUT')) ||
    (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 1)
  );
}