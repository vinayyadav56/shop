/**
 * Single shared Google Maps JS loader config.
 *
 * @react-google-maps/api keeps ONE global loader for the whole app. Calling
 * `useJsApiLoader` with a different `id` / `libraries` on the same page — e.g.
 * the order page mounts both the courier-tracking map AND the address Places
 * autocomplete — throws:
 *   "Loader must not be called again with different options"
 * which crashed the order-confirmation page with a client-side exception.
 *
 * Every `useJsApiLoader` call MUST pass these exact, shared options.
 */
const libraries: any = ['places']; // module-level constant → stable reference

export const GMAPS_LOADER_OPTIONS = {
  id: 'pah-gmaps',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
  libraries,
};
