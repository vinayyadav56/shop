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

export type ImageQuality = 'ok' | 'blurry' | 'dark' | 'partial' | 'no_plant';

export interface PlantIdentification {
  common_name: string;
  scientific_name: string;
  confidence: number;
}

export interface DiagnosisResponse {
  // Trust gate: when is_plant is false the UI must show `rejection_reason`, NOT a diagnosis.
  is_plant?: boolean;
  image_quality?: ImageQuality;
  rejection_reason?: string;
  identification?: PlantIdentification;
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
  /** ISO 639 code so the diagnosis text comes back in the shopper's language. */
  language?: string;
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
