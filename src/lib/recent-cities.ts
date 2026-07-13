/**
 * Recently-selected delivery cities (client-side convenience).
 * Persisted to localStorage, newest-first, deduped, capped. Used by the city
 * picker to offer one-tap re-selection.
 */
const KEY = 'pah_recent_cities';
const MAX = 5;

export function getRecentCities(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((c) => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

export function pushRecentCity(city: string): void {
  if (typeof window === 'undefined' || !city || !city.trim()) return;
  try {
    const name = city.trim();
    const next = [
      name,
      ...getRecentCities().filter(
        (c) => c.toLowerCase() !== name.toLowerCase(),
      ),
    ].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode / quota — non-fatal
  }
}
