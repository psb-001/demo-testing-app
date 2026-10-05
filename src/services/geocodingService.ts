/**
 * Geocoding abstraction over OpenStreetMap-compatible providers.
 *
 * IMPORTANT: never hammer the public Nominatim server with per-keystroke
 * requests. All UI call sites must debounce (>= 400ms), results are cached
 * in-memory, and requests are rate-limited (>= 1s apart) with cancellation
 * of in-flight queries.
 *
 * To switch to a self-hosted Nominatim / Photon / Pelias instance later,
 * implement `GeocodingProvider` and swap `geocodingService` — no UI changes.
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  type?: string;
  /** Structured address parts when the provider returns addressdetails. */
  details?: ReverseGeocodeDetails;
}

/**
 * Structured reverse-geocoded address. Keys map onto the shared
 * ServiceLocation model so a GPS fix can prefill the manual form
 * (and stay editable afterwards).
 */
export interface ReverseGeocodeDetails {
  formattedAddress: string;
  houseNumber?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface GeocodingProvider {
  search(query: string, bias?: { lat: number; lng: number }): Promise<GeocodeResult[]>;
  reverse(lat: number, lng: number): Promise<string | null>;
  reverseDetails(lat: number, lng: number): Promise<ReverseGeocodeDetails | null>;
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const MIN_INTERVAL_MS = 1100;
const SEARCH_LIMIT = 5;

/**
 * Nominatim's usage policy requires a real, non-stock User-Agent and blocks or
 * throttles requests that do not identify the application.
 *
 * The web build gets this for free: a browser always sends its own genuine
 * User-Agent and JavaScript cannot override it. React Native does not — `fetch`
 * sends a stock engine agent (`okhttp/4.x` on Android, the app bundle on iOS),
 * which the public Nominatim instance is entitled to reject with 403.
 *
 * Setting the header explicitly is therefore required here, not optional.
 * Expo/React Native's fetch honours a `User-Agent` override on both platforms.
 *
 * If this ever needs to scale beyond a demo, the right fix is a small proxy or a
 * self-hosted Nominatim/Photon instance — `geocodingService` is a swappable
 * singleton precisely so that swap touches no UI code.
 */
const NOMINATIM_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'RozgarApp/1.0 (SIH prototype; +https://github.com/shaileshXcode/new_website-)',
} as const;

/** Raw Nominatim `address` payload — only the keys we map are declared. */
interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

/** Normalise a Nominatim address object into our structured shape. */
function buildDetails(displayName: string, a: NominatimAddress): ReverseGeocodeDetails {
  return {
    formattedAddress: displayName,
    houseNumber: a.house_number,
    road: a.road,
    suburb: a.suburb,
    neighbourhood: a.neighbourhood,
    city: a.city,
    town: a.town,
    village: a.village,
    state: a.state,
    postcode: a.postcode,
    country: a.country,
  };
}

class NominatimProvider implements GeocodingProvider {
  private searchCache = new Map<string, GeocodeResult[]>();
  private detailsCache = new Map<string, ReverseGeocodeDetails | null>();
  private lastRequestAt = 0;
  private inFlight: AbortController | null = null;

  private async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < MIN_INTERVAL_MS) {
      await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - elapsed));
    }
    this.lastRequestAt = Date.now();
  }

  async search(query: string, bias?: { lat: number; lng: number }): Promise<GeocodeResult[]> {
    const q = query.trim();
    if (q.length < 3) return [];
    const cacheKey = `${q.toLowerCase()}|${bias ? `${bias.lat.toFixed(2)},${bias.lng.toFixed(2)}` : 'nobias'}`;
    const cached = this.searchCache.get(cacheKey);
    if (cached) return cached;

    // Cancel previous in-flight autocomplete-style request.
    this.inFlight?.abort();
    const controller = new AbortController();
    this.inFlight = controller;

    await this.throttle();

    const params = new URLSearchParams({
      format: 'jsonv2',
      q,
      countrycodes: 'in',
      limit: String(SEARCH_LIMIT),
      addressdetails: '1',
    });
    if (bias) {
      // Soft bias toward the user's map area (Pune/Maharashtra) — still national search.
      params.set('viewbox', `${bias.lng - 1},${bias.lat + 1},${bias.lng + 1},${bias.lat - 1}`);
      params.set('bounded', '0');
    }
    const res = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
      signal: controller.signal,
      headers: NOMINATIM_HEADERS,
    });
    if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
    const data = (await res.json()) as {
      lat: string;
      lon: string;
      display_name: string;
      type?: string;
      address?: NominatimAddress;
    }[];
    const results: GeocodeResult[] = data.map((d) => ({
      lat: Number(d.lat),
      lng: Number(d.lon),
      displayName: d.display_name,
      type: d.type,
      details: d.address ? buildDetails(d.display_name, d.address) : undefined,
    }));
    // Simple LRU-ish cap.
    if (this.searchCache.size > 100) this.searchCache.clear();
    this.searchCache.set(cacheKey, results);
    return results;
  }

  async reverse(lat: number, lng: number): Promise<string | null> {
    return (await this.reverseDetails(lat, lng))?.formattedAddress ?? null;
  }

  /**
   * Reverse-geocode into STRUCTURED parts so a GPS fix can prefill the manual
   * address form and still be edited by the customer afterwards.
   */
  async reverseDetails(lat: number, lng: number): Promise<ReverseGeocodeDetails | null> {
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (this.detailsCache.has(key)) return this.detailsCache.get(key) ?? null;
    await this.throttle();
    try {
      const params = new URLSearchParams({
        format: 'jsonv2',
        lat: String(lat),
        lon: String(lng),
        zoom: '16',
        addressdetails: '1',
      });
      const res = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`, {
        headers: NOMINATIM_HEADERS,
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { display_name?: string; address?: NominatimAddress };
      const details = data.display_name
        ? buildDetails(data.display_name, data.address ?? {})
        : null;
      if (this.detailsCache.size > 200) this.detailsCache.clear();
      this.detailsCache.set(key, details);
      return details;
    } catch {
      return null;
    }
  }
}

/** Swap this singleton to change provider without touching UI. */
export const geocodingService: GeocodingProvider = new NominatimProvider();
