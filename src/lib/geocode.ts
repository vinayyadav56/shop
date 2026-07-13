import { extractAddress, type ExtractedAddress } from '@/lib/extract-address';

/**
 * Lightweight location helpers for the storefront location gate. Everything is
 * best-effort + fail-safe: a failure resolves to null and NEVER blocks shopping.
 */

/**
 * Coarse city/pincode from the visitor's IP — the gentle first-visit detection
 * that needs no permission prompt. Goes through the SAME-ORIGIN /api/geo route
 * (which resolves server-side) — a direct ipapi.co fetch is CORS-blocked from the
 * browser and threw a console error on every visit. Fail-safe → null.
 */
export async function getCityFromIP(): Promise<ExtractedAddress | null> {
  try {
    const res = await fetch('/api/geo', {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const j: any = await res.json();
    const city = j?.city ? String(j.city) : undefined;
    if (!city) return null;
    return {
      city,
      district: j?.region ? String(j.region) : undefined,
      state: j?.region ? String(j.region) : undefined,
      state_code: j?.region_code ? String(j.region_code) : undefined,
      pincode: j?.postal ? String(j.postal) : undefined,
      country: j?.country_name ? String(j.country_name) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Reverse-geocode precise GPS coords via the Google Geocoding REST API (uses the
 * same public Maps key, no SDK load). Returns the strict-priority address parts.
 * Fail-safe → null.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ExtractedAddress | null> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  if (!key || lat == null || lng == null) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const j: any = await res.json();
    const components = j?.results?.[0]?.address_components;
    if (!components) return null;
    return extractAddress(components);
  } catch {
    return null;
  }
}

/** Prompt the browser for GPS coords (one-shot, fail-safe → null). */
export function getBrowserCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: +pos.coords.latitude.toFixed(7),
          lng: +pos.coords.longitude.toFixed(7),
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}
