import type { NextApiRequest, NextApiResponse } from 'next';

const CATEGORIES = [
  'indoor', 'outdoor', 'flowering', 'foliage', 'air-purifying',
  'pet-friendly', 'succulents-cacti', 'medicinal', 'climbers-vines', 'herbs'
];

interface SuggestResponse {
  text: string;
  category?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;
  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Missing transcript' });
  }

  // Railway REST endpoint already includes the /api prefix; reachable SSR-side.
  const apiBase = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

  try {
    // Check if feature is enabled
    const settingsRes = await fetch(`${apiBase}/voice-search/settings`);
    if (!settingsRes.ok) {
      return res.status(503).json({ error: 'Feature unavailable' });
    }
    const settings = await settingsRes.json();
    if (!settings.data?.enabled) {
      return res.status(503).json({ error: 'Feature disabled' });
    }

    // Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: settings.data.openai_model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a plant expert. Given a voice query, return JSON {text, category}.
- text: 2-5 keyword search terms (string)
- category: one of: ${CATEGORIES.join(', ')} or empty string

Example: "plants good for dark rooms" → {"text":"low light foliage plants","category":"foliage"}
IMPORTANT: Return ONLY valid JSON, nothing else.`,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      console.error('OpenAI error:', openaiRes.status, await openaiRes.text());
      // Fallback to raw transcript
      return res.status(200).json({ text: transcript } as SuggestResponse);
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content?.trim() || '{}';
    const usage = openaiData.usage || {};

    let result: SuggestResponse = { text: transcript };
    try {
      const parsed = JSON.parse(content);
      if (parsed.text && typeof parsed.text === 'string') {
        result.text = parsed.text;
        if (parsed.category && CATEGORIES.includes(parsed.category)) {
          result.category = parsed.category;
        }
      }
    } catch {
      // JSON parse failed; use transcript
    }

    // Log the query to the API (server-to-server ingest; cost computed there)
    try {
      const ingestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (process.env.VOICE_SEARCH_INGEST_SECRET) {
        ingestHeaders['X-Ingest-Secret'] = process.env.VOICE_SEARCH_INGEST_SECRET;
      }
      await fetch(`${apiBase}/voice-search/log`, {
        method: 'POST',
        headers: ingestHeaders,
        body: JSON.stringify({
          transcript,
          search_text: result.text,
          category: result.category || null,
          prompt_tokens: usage.prompt_tokens || 0,
          completion_tokens: usage.completion_tokens || 0,
        }),
      });
    } catch {
      // Logging failed; but don't block the response
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Plant suggest error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
