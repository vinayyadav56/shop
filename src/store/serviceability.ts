import { atom } from 'jotai';

/**
 * Delivery serviceability state for the current shopper. Set by the location
 * gate / city switcher; read by the checkout (courier warning + order flags).
 *
 * - deliveryMode: 'standard' inside our service area, 'courier' when the shopper
 *   chose "Continue Anyway" from a non-serviceable area.
 * - isNonServiceable: true once a detected/selected location failed the
 *   city+pincode serviceability check and the shopper continued anyway.
 * - detectedCity: the city we detected for them (audit / analytics).
 * - serviceableCity: the serviceable city they're shipping to (when applicable).
 */
export type DeliveryMode = 'standard' | 'courier';

export const deliveryModeAtom = atom<DeliveryMode>('standard');
export const isNonServiceableAtom = atom<boolean>(false);
export const detectedCityAtom = atom<string | null>(null);
export const serviceableCityAtom = atom<string | null>(null);
