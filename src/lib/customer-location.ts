/**
 * Lightweight customer-location store (localStorage). Captured once via the
 * "Deliver to my location" prompt; used to request location-derived pricing /
 * availability (coarse in P2, precise once the P3 matching engine lands) and,
 * later, vendor + delivery-partner matching at checkout.
 */
export interface CustomerLatLng {
  lat: number;
  lng: number;
  at?: string;
}

const KEY = 'pah_customer_location';

export function getStoredLatLng(): CustomerLatLng | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.lat === 'number' && typeof v?.lng === 'number') return v;
  } catch {
    // ignore
  }
  return null;
}

export function setStoredLatLng(lat: number, lng: number): CustomerLatLng {
  const v: CustomerLatLng = { lat, lng, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
    window.dispatchEvent(new Event('pah-location-changed'));
  } catch {
    // ignore
  }
  return v;
}

/** Prompt the browser for the current position and persist it. */
export function captureLocation(): Promise<CustomerLatLng> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(setStoredLatLng(+pos.coords.latitude.toFixed(7), +pos.coords.longitude.toFixed(7))),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}
