import { useEffect, useRef } from 'react';
import { useUser } from '@/framework/user';
import { getStoredCity, setStoredCity } from '@/lib/customer-location';
import { saveShoppingCityToProfile } from '@/lib/shopping-city';

/**
 * Shopping-City ⇄ profile sync on login (Shopping-City redesign):
 *  - local empty + profile has preferred_city → adopt the profile city
 *    (also falls back to the first saved address's city, legacy behavior);
 *  - local set + profile empty → push the local choice to the profile.
 * A city the customer chose THIS session is never overridden.
 */
export default function CitySync() {
  const { me } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!me || syncedRef.current) return;
    syncedRef.current = true;

    const profileCity = String((me as any)?.preferred_city ?? '').trim();
    const local = getStoredCity();

    if (!local) {
      const addr: any = (me as any)?.address?.[0] ?? {};
      const fallback =
        addr?.address?.city ?? addr?.city ?? (me as any)?.profile?.city ?? '';
      const adopt = profileCity || String(fallback).trim();
      if (adopt) setStoredCity(adopt);
      return;
    }

    if (!profileCity) {
      saveShoppingCityToProfile(local);
    }
  }, [me]);

  return null;
}
