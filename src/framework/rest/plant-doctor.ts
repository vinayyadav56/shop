import { useMutation, useQuery } from 'react-query';
import { HttpClient } from '@/framework/client/http-client';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface DiagnosisResult {
  condition: string;
  severity: Severity;
  confidence: number;
  description: string;
  causes: string[];
  solutions: string[];
  preventive_measures: string[];
  products_recommended?: string[];
  vet_consultation_needed?: boolean;
}

export interface DiagnosisResponse {
  plant_name: string;
  diagnosis: DiagnosisResult[];
  overall_health_score: number;
  immediate_action: string;
  long_term_care: string;
}

export interface DiagnoseInput {
  image_base64?: string;
  image_url?: string;
  symptoms?: string;
  plant_name?: string;
  session_id?: string;
}

/** Storefront feature flag — is Plant Doctor switched on in admin? */
export function usePlantDoctorEnabled() {
  return useQuery(
    ['plant-doctor-enabled'],
    () => HttpClient.get<{ data: { enabled: boolean } }>('plant-doctor/settings'),
    { staleTime: 60_000 },
  );
}

/** Submit a photo and/or symptoms; returns a structured diagnosis. */
export function useDiagnose() {
  return useMutation((input: DiagnoseInput) =>
    HttpClient.post<{ data: DiagnosisResponse }>('plant-doctor/diagnose', input),
  );
}
