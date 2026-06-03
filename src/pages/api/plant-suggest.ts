import type { NextApiRequest, NextApiResponse } from 'next';

const CATEGORIES = [
  'indoor', 'outdoor', 'flowering', 'foliage', 'air-purifying',
  'pet-friendly', 'succulents-cacti', 'medicinal', 'climbers-vines', 'herbs',
];

// Deterministic fallback: map phrasings in the spoken query to a category slug.
// Order matters — more specific themes first, broad indoor/outdoor/foliage last.
const KEYWORD_TO_CATEGORY: Array<[RegExp, string]> = [
  [/pet|cat\b|dog\b|animal/i, 'pet-friendly'],
  [/air.?purif|purify|clean air|air quality/i, 'air-purifying'],
  [/succulent|cact(us|i)/i, 'succulents-cacti'],
  [/medicinal|healing|medicine|ayurved/i, 'medicinal'],
  [/\bherb/i, 'herbs'],
  [/climb|vine|creeper|trail/i, 'climbers-vines'],
  [/flower|bloom|blossom/i, 'flowering'],
  [/low.?light|shade|\bdark\b|bedroom|living room|office|desk|indoor/i, 'indoor'],
  [/outdoor|garden|balcony|patio|terrace|lawn/i, 'outdoor'],
  [/foliage|leafy|green leaves/i, 'foliage'],
];

function keywordCategory(text: string): string {
  for (const [re, slug] of KEYWORD_TO_CATEGORY) {
    if (re.test(text)) return slug;
  }
  return '';
}

interface SuggestResponse {
  text?: string;
  category?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    // Check if the feature is enabled
    const settingsRes = await fetch(`${apiBase}/voice-search/settings`);
    if (!settingsRes.ok) {
      return res.status(503).json({ error: 'Feature unavailable' });
    }
    const settings = await settingsRes.json();
    if (!settings.data?.enabled) {
      return res.status(503).json({ error: 'Feature disabled' });
    }

    let aiCategory = '';
    let aiName = '';
    let usage: any = {};

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: settings.data.openai_model || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You convert a shopper's spoken request into a plant-store filter.
Return ONLY JSON: {"category":"<slug or empty>","name":"<specific plant name or empty>"}.

Rules:
- If the request describes a TYPE or THEME of plant, set "category" to exactly one of:
  ${CATEGORIES.join(', ')}. Leave "name" empty.
- If the request names a SPECIFIC plant (e.g. monstera, snake plant, areca palm),
  set "name" to that plant and leave "category" empty.
- Phrase mapping: bedroom/living room/office/low-light/shade → indoor; garden/balcony/patio → outdoor;
  purify/clean air → air-purifying; pet/cat/dog safe → pet-friendly; cactus/succulent → succulents-cacti;
  healing/medicine → medicinal; climbing/vine → climbers-vines; blossom/flower → flowering; leafy → foliage.

Examples:
"indoor plants" → {"category":"indoor","name":""}
"plants for my bedroom" → {"category":"indoor","name":""}
"pet safe plants" → {"category":"pet-friendly","name":""}
"air purifying plants" → {"category":"air-purifying","name":""}
"show me a monstera" → {"category":"","name":"monstera"}
"snake plant" → {"category":"","name":"snake plant"}`,
          },
          { role: 'user', content: transcript },
        ],
      }),
    });

    if (openaiRes.ok) {
      const openaiData = await openaiRes.json();
      const content = openaiData.choices?.[0]?.message?.content?.trim() || '{}';
      usage = openaiData.usage || {};
      try {
        const parsed = JSON.parse(content);
        if (parsed.category && CATEGORIES.includes(parsed.category)) {
          aiCategory = parsed.category;
        }
        const name = parsed.name ?? parsed.text; // tolerate older shape
        if (name && typeof name === 'string') {
          aiName = name.trim();
        }
      } catch {
        // non-JSON; fall through to keyword fallback
      }
    } else {
      console.error('OpenAI error:', openaiRes.status, await openaiRes.text());
    }

    // Resolve a category (AI first, then deterministic keyword fallback).
    const category = aiCategory || keywordCategory(transcript);

    // Theme → category filter (returns results); specific plant → name search;
    // otherwise fall back to the raw transcript as a name search.
    let result: SuggestResponse;
    if (category) {
      result = { category };
    } else if (aiName) {
      result = { text: aiName };
    } else {
      result = { text: transcript };
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
          search_text: result.text || result.category || null,
          category: result.category || null,
          prompt_tokens: usage.prompt_tokens || 0,
          completion_tokens: usage.completion_tokens || 0,
        }),
      });
    } catch {
      // Logging failed; don't block the response
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Plant suggest error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
