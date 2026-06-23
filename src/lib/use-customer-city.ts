import { useEffect, useState } from 'react';
import { getStoredCity, setStoredCity } from '@/lib/customer-location';

/**
 * Reactive access to the shopper's selected/detected delivery city. Reads the
 * localStorage value and re-renders whenever `pah-location-changed` fires (the
 * same event the city switcher / login sync / location gate dispatch), so every
 * consumer (header chip, nav, products) stays in sync.
 */
export function useCustomerCity(): {
  city: string | null;
  setCity: (city: string) => void;
} {
  const [city, setCityState] = useState<string | null>(null);

  useEffect(() => {
    setCityState(getStoredCity());
    const onChange = () => setCityState(getStoredCity());
    window.addEventListener('pah-location-changed', onChange);
    return () => window.removeEventListener('pah-location-changed', onChange);
  }, []);

  return { city, setCity: setStoredCity };
}
