import { useEffect, useMemo, useState } from 'react';
import { useLookupCities, useLookupStates } from '@/framework/location';

/**
 * Address standardization — cascading State (strict dropdown, complete list) +
 * City (autocomplete via datalist of master cities, but ACCEPTS any value so an
 * un-seeded city never blocks checkout). Fail-safe: if the lookups error/empty,
 * the state list is just empty and the city stays a free input — never throws,
 * never blocks the order. Emits the chosen state + city NAMES.
 */
export default function StateCitySelect({
  state: stateName,
  city: cityName,
  onChange,
  required,
}: {
  state?: string | null;
  city?: string | null;
  onChange: (next: { state: string; city: string }) => void;
  required?: boolean;
}) {
  const { data: states = [] } = useLookupStates();
  const [stateId, setStateId] = useState<string>('');

  useEffect(() => {
    if (stateName && states.length && !stateId) {
      const match = states.find(
        (s) => s.name.toLowerCase() === String(stateName).toLowerCase(),
      );
      if (match) setStateId(String(match.id));
    }
  }, [stateName, states, stateId]);

  const { data: cities = [] } = useLookupCities(stateId || undefined);
  const cityNames = useMemo(() => cities.map((c) => c.name), [cities]);

  const cls =
    'h-12 w-full rounded border border-border-200 bg-light px-4 text-sm focus:border-accent focus:outline-none';

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-semibold text-body-dark">
          State{required ? ' *' : ''}
        </label>
        <select
          value={stateId}
          onChange={(e) => {
            const id = e.target.value;
            setStateId(id);
            const name = states.find((s) => String(s.id) === id)?.name ?? '';
            onChange({ state: name, city: '' });
          }}
          className={cls}
        >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-body-dark">
          City{required ? ' *' : ''}
        </label>
        <input
          list="pah-shop-city-options"
          value={cityName ?? ''}
          placeholder="Type or pick a city"
          onChange={(e) =>
            onChange({
              state: states.find((s) => String(s.id) === stateId)?.name ?? stateName ?? '',
              city: e.target.value,
            })
          }
          className={cls}
        />
        <datalist id="pah-shop-city-options">
          {cityNames.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
    </>
  );
}
