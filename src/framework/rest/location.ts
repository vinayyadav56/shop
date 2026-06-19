import { useQuery } from 'react-query';
import { HttpClient } from './client/http-client';
import { API_ENDPOINTS } from './client/api-endpoints';

export interface LookupState {
  id: number;
  name: string;
  code?: string | null;
}

export interface LookupCity {
  id: number;
  name: string;
  state_id?: number | null;
  state_name?: string | null;
}

/** Master states for the address State dropdown (public, cached). Fail-safe: errors → []. */
export function useLookupStates() {
  return useQuery<LookupState[], Error>(
    ['lookup-states'],
    () => HttpClient.get<LookupState[]>(API_ENDPOINTS.LOCATIONS_STATES),
    { staleTime: 1000 * 60 * 30, retry: 0 },
  );
}

/** Master cities (optionally filtered by state) for the City autocomplete. Fail-safe. */
export function useLookupCities(stateId?: number | string | null) {
  return useQuery<LookupCity[], Error>(
    ['lookup-cities', stateId ?? 'all'],
    () =>
      HttpClient.get<LookupCity[]>(
        API_ENDPOINTS.LOCATIONS_CITIES,
        stateId ? { state_id: stateId } : {},
      ),
    { staleTime: 1000 * 60 * 10, retry: 0, enabled: Boolean(stateId) },
  );
}
