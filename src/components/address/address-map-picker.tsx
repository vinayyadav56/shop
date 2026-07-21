'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { GMAPS_LOADER_OPTIONS } from '@/lib/gmaps-loader';
import { reverseGeocodePin, type ReverseGeo } from '@/lib/shopping-city';

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const FALLBACK_CENTER = { lat: 28.4595, lng: 77.0266 }; // Gurugram

export interface PinResult {
  lat: number;
  lng: number;
  geo: ReverseGeo | null;
}

interface Props {
  /** Initial pin (from Places autocomplete or a saved address). */
  lat?: number | null;
  lng?: number | null;
  /** Fired after every pin settle (drag end / map click) with the reverse-geocoded geo. */
  onPin: (r: PinResult) => void;
  className?: string;
}

/**
 * Draggable delivery-pin map (Shopping-City redesign). The PIN is the source
 * of truth for the address coordinates: search/autocomplete only positions it
 * initially; the shopper fine-tunes by dragging (or tapping the map), and each
 * settle reverse-geocodes SERVER-side (GET geo/reverse) into read-only
 * city/district/state/pincode chips — the typed city is never trusted.
 * Shares the app-wide Maps loader options (never pass different ones).
 */
export default function AddressMapPicker({ lat, lng, onPin, className = '' }: Props) {
  const { isLoaded } = useJsApiLoader(GMAPS_LOADER_OPTIONS);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    Number(lat) && Number(lng) ? { lat: Number(lat), lng: Number(lng) } : null,
  );
  const [geo, setGeo] = useState<ReverseGeo | null>(null);
  const [resolving, setResolving] = useState(false);
  const reqSeq = useRef(0);

  // Adopt a new externally-supplied position (e.g. a Places selection).
  const extLat = Number(lat);
  const extLng = Number(lng);
  useEffect(() => {
    if (extLat && extLng) settle(extLat, extLng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extLat, extLng]);

  const settle = useCallback(
    async (la: number, ln: number) => {
      const p = { lat: +la.toFixed(7), lng: +ln.toFixed(7) };
      setPos(p);
      setResolving(true);
      const seq = ++reqSeq.current;
      const g = await reverseGeocodePin(p.lat, p.lng);
      if (seq !== reqSeq.current) return; // a newer drag superseded this one
      setGeo(g);
      setResolving(false);
      onPin({ ...p, geo: g });
    },
    [onPin],
  );

  if (!KEY) return null;

  return (
    <div className={className}>
      {!isLoaded ? (
        <div className="grid h-[220px] place-items-center rounded-xl bg-gray-50 text-sm text-gray-500">
          Loading map…
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: 220, borderRadius: 12 }}
          center={pos ?? FALLBACK_CENTER}
          zoom={pos ? 16 : 11}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: false,
          }}
          onClick={(e) => {
            const la = e.latLng?.lat();
            const ln = e.latLng?.lng();
            if (la != null && ln != null) settle(la, ln);
          }}
        >
          {pos ? (
            <MarkerF
              position={pos}
              draggable
              onDragEnd={(e) => {
                const la = e.latLng?.lat();
                const ln = e.latLng?.lng();
                if (la != null && ln != null) settle(la, ln);
              }}
            />
          ) : null}
        </GoogleMap>
      )}

      <p className="mt-2 text-xs text-stone-500">
        Drag the pin to your exact door — we use the pin (not the typed text)
        for delivery.
      </p>

      {resolving ? (
        <p className="mt-2 text-xs font-medium text-stone-400">Locating…</p>
      ) : geo ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {[
            geo.city && `City: ${geo.city}`,
            geo.district && `District: ${geo.district}`,
            geo.state && geo.state,
            geo.pincode && `PIN ${geo.pincode}`,
          ]
            .filter(Boolean)
            .map((label) => (
              <span
                key={label as string}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-stone-600"
              >
                {label}
              </span>
            ))}
          {geo.city ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                geo.is_serviceable
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {geo.is_serviceable ? 'Serviceable' : 'Courier only'}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
