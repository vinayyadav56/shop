// Server-side helpers shared by the voice API routes.
// Caches the "enabled" flag in module memory (per warm serverless instance) so
// we don't round-trip to the API on every request.

interface CachedSettings {
  enabled: boolean;
  openai_model: string;
  fetchedAt: number;
}

const TTL_MS = 60_000;
let cache: CachedSettings | null = null;

export async function getVoiceSettings(): Promise<{ enabled: boolean; openai_model: string }> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return { enabled: cache.enabled, openai_model: cache.openai_model };
  }
  const apiBase = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  try {
    const res = await fetch(`${apiBase}/voice-search/settings`);
    if (!res.ok) {
      // On error, don't hard-block; assume enabled so the feature degrades open.
      return { enabled: true, openai_model: 'gpt-4o-mini' };
    }
    const json = await res.json();
    const enabled = Boolean(json?.data?.enabled);
    const openai_model = json?.data?.openai_model || 'gpt-4o-mini';
    cache = { enabled, openai_model, fetchedAt: Date.now() };
    return { enabled, openai_model };
  } catch {
    return { enabled: true, openai_model: 'gpt-4o-mini' };
  }
}

export async function isVoiceSearchEnabled(): Promise<boolean> {
  return (await getVoiceSettings()).enabled;
}
