import { HttpClient } from '@/framework/client/http-client';

/**
 * Shopping-City redesign API surface (all additive endpoints):
 *  - GET  geo/reverse          — map-pin → server-authoritative {city, district, state, pincode}
 *  - POST cart/validate-city   — change-city cart migration (available / unavailable split)
 *  - PUT  me/shopping-city     — persist the choice on the profile (logged-in only)
 * Every call fails soft — the UI treats errors as "no data", never as a crash.
 */

export interface ReverseGeo {
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  normalized_city: string | null;
  city_id: number | null;
  is_serviceable: boolean;
}

export async function reverseGeocodePin(
  lat: number,
  lng: number,
): Promise<ReverseGeo | null> {
  try {
    return await HttpClient.get<ReverseGeo>('geo/reverse', { lat, lng });
  } catch {
    return null;
  }
}

export interface CityCartLine {
  product_id: number;
  variation_option_id: number | null;
  quantity: number;
  unit_price?: number | null;
}

export interface ValidateCityResult {
  city: string;
  available: CityCartLine[];
  unavailable: CityCartLine[];
}

export async function validateCartCity(
  city: string,
  items: Array<{ product_id: number; variation_option_id: number | null; quantity: number }>,
): Promise<ValidateCityResult | null> {
  try {
    const res = await HttpClient.post<{ data: ValidateCityResult }>(
      'cart/validate-city',
      { city, items },
    );
    return (res as any)?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Client-side mirror of the server's city alias normalizer (AvailabilityService::
 * normalizeCityKey) — ONLY for grouping/labels in the UI; the server remains the
 * authority at checkout.
 */
const CITY_ALIASES: Record<string, string> = {
  gurgaon: 'gurugram',
  bangalore: 'bengaluru',
  bombay: 'mumbai',
  calcutta: 'kolkata',
  madras: 'chennai',
  'new delhi': 'delhi',
};

export function normalizeCityClient(city?: string | null): string {
  const key = String(city ?? '').trim().toLowerCase();
  return CITY_ALIASES[key] ?? key;
}

/** The city an address belongs to, preferring the server-reverse-geocoded one. */
export function addressCityOf(address: any): string | null {
  const a = address ?? {};
  const c = a.rg_city ?? a.address?.rg_city ?? a.address?.city ?? a.city ?? null;
  const s = String(c ?? '').trim();
  return s || null;
}

/** Persist the shopping city on the signed-in profile (users.preferred_city). Silent. */
export async function saveShoppingCityToProfile(city: string): Promise<void> {
  try {
    await HttpClient.put('me/shopping-city', { city });
  } catch {
    /* guest / non-serviceable / offline — localStorage remains the source */
  }
}
