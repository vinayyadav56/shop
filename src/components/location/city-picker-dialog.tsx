'use client';
import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAllCities } from '@/framework/location';
import { getBrowserCoords, reverseGeocode } from '@/lib/geocode';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (cityName: string) => void;
}

/**
 * Searchable serviceable-city picker. Used by the header city switcher and the
 * "Select City" action of the non-serviceable popup. Includes a one-tap
 * "Detect my location" (GPS → reverse-geocode) that fills the city. Fail-safe.
 */
export default function CityPickerDialog({ open, onClose, onPick }: Props) {
  const { data: cities } = useAllCities();
  const [q, setQ] = useState('');
  const [detecting, setDetecting] = useState(false);

  const list = useMemo(() => {
    const all = cities ?? [];
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? all.filter((c) => c.name?.toLowerCase().includes(needle))
      : all;
    return filtered.slice(0, 60);
  }, [cities, q]);

  async function detect() {
    setDetecting(true);
    try {
      const coords = await getBrowserCoords();
      if (coords) {
        const addr = await reverseGeocode(coords.lat, coords.lng);
        if (addr?.city) {
          onPick(addr.city);
          onClose();
          return;
        }
      }
    } finally {
      setDetecting(false);
    }
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[70]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-start justify-center p-4 pt-16 sm:pt-24">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-forest-900">
                Choose your delivery city
              </Dialog.Title>
              <p className="mt-1 text-sm text-stone-500">
                We’ll show delivery times and serviceability for this city.
              </p>

              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search city…"
                className="mt-4 w-full rounded-lg border border-border-base px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />

              <button
                type="button"
                onClick={detect}
                disabled={detecting}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {detecting ? 'Detecting…' : 'Detect my location'}
              </button>

              <ul className="mt-3 max-h-72 divide-y divide-gray-100 overflow-auto rounded-lg border border-gray-100">
                {list.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(c.name);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      <span className="font-medium text-heading">{c.name}</span>
                      {c.state_name ? (
                        <span className="text-xs text-stone-400">{c.state_name}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
                {!list.length ? (
                  <li className="px-3.5 py-4 text-center text-sm text-stone-500">
                    No matching cities.
                  </li>
                ) : null}
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
