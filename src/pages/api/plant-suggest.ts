import type { NextApiRequest, NextApiResponse } from 'next';
import { getVoiceSettings } from '@/lib/server/voice-settings';

const CATEGORIES = [
  'indoor', 'outdoor', 'flowering', 'foliage', 'air-purifying',
  'pet-friendly', 'succulents-cacti', 'medicinal', 'climbers-vines', 'herbs',
];

// Deterministic fallback / fast-path: map phrasings (English + common Hindi /
// transliterated terms) to a category slug. Order matters — specific first.
const KEYWORD_TO_CATEGORY: Array<[RegExp, string]> = [
  [/pet|cat\b|dog\b|animal|janwar|billi|kutta/i, 'pet-friendly'],
  [/air.?purif|purify|clean air|air quality|shudh|hawa saaf/i, 'air-purifying'],
  [/succulent|cact(us|i)|raseele/i, 'succulents-cacti'],
  [/medicinal|healing|medicine|ayurved|aushadhi|tulsi|aloe|neem|giloy/i, 'medicinal'],
  [/\bherb|herbs|jadi.?buti|dhaniya|pudina|mint|basil/i, 'herbs'],
  [/climb|vine|creeper|trail|bel\b|lata/i, 'climbers-vines'],
  [/flower|bloom|blossom|phool|gulab|rose|marigold|genda/i, 'flowering'],
  [/low.?light|shade|\bdark\b|bedroom|living room|office|desk|indoor|ghar ke andar|andar|kamre|money plant/i, 'indoor'],
  [/outdoor|garden|balcony|patio|terrace|lawn|bagicha|bahar|chhat/i, 'outdoor'],
  [/foliage|leafy|green leaves|patte|hare patte/i, 'foliage'],
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

// Fire-and-forget cost logging — never blocks the user's response.
function logQuery(apiBase: string | undefined, payload: Record<string, unknown>) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.VOICE_SEARCH_INGEST_SECRET) {
      headers['X-Ingest-Secret'] = process.env.VOICE_SEARCH_INGEST_SECRET;
    }
    void fetch(`${apiBase}/voice-search/log`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;
  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Missing transcript' });
  }

  const apiBase = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

  try {
    const { enabled, openai_model } = await getVoiceSettings();
    if (!enabled) {
      return res.status(503).json({ error: 'Feature disabled' });
    }

    // FAST PATH — a clear thematic query maps to a category without OpenAI.
    const fast = keywordCategory(transcript);
    if (fast) {
      logQuery(apiBase, {
        transcript,
        search_text: fast,
        category: fast,
        prompt_tokens: 0,
        completion_tokens: 0,
      });
      return res.status(200).json({ category: fast } as SuggestResponse);
    }

    // Otherwise ask the model (handles plant names + any language).
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
        model: openai_model || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 30,
        messages: [
          {
            role: 'system',
            content: `You convert a shopper's spoken request (in ANY language — English, Hindi, Hinglish, or other Indian languages) into a plant-store filter.
Return ONLY JSON: {"category":"<slug or empty>","name":"<specific plant name in English or empty>"}.

- If the request describes a TYPE/THEME of plant, set "category" to exactly one of:
  ${CATEGORIES.join(', ')}. Leave "name" empty.
- If the request names a SPECIFIC plant (e.g. monstera, snake plant, tulsi, money plant),
  set "name" to that plant's common English name and leave "category" empty.
- Understand Hindi/Indian terms: ghar ke andar/kamra→indoor, bahar/bagicha→outdoor,
  phool/gulab→flowering, tulsi/aloe/neem→medicinal, jadi-buti→herbs, bel/lata→climbers-vines,
  hawa saaf→air-purifying, paaltu/pet safe→pet-friendly.

Examples:
"indoor plants" → {"category":"indoor","name":""}
"ghar ke andar wale paudhe" → {"category":"indoor","name":""}
"pet safe plants" → {"category":"pet-friendly","name":""}
"mujhe gulab chahiye" → {"category":"","name":"rose"}
"monstera" → {"category":"","name":"monstera"}`,
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
        if (parsed.category && CATEGORIES.includes(parsed.category)) aiCategory = parsed.category;
        const name = parsed.name ?? parsed.text;
        if (name && typeof name === 'string') aiName = name.trim();
      } catch {
        /* non-JSON — fall through */
      }
    } else {
      console.error('OpenAI error:', openaiRes.status, await openaiRes.text());
    }

    let result: SuggestResponse;
    if (aiCategory) result = { category: aiCategory };
    else if (aiName) result = { text: aiName };
    else result = { text: transcript };

    logQuery(apiBase, {
      transcript,
      search_text: result.text || result.category || null,
      category: result.category || null,
      prompt_tokens: usage.prompt_tokens || 0,
      completion_tokens: usage.completion_tokens || 0,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Plant suggest error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
