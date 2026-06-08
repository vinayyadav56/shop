import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Same-origin proxy for the per-plant "Ask AI" chat.
 *
 * The browser talks to this Node serverless route (NOT PHP-FPM, NOT a raw
 * rewrite) so the microservice's X-Api-Key never reaches the client. It forwards
 * /ask and /end to the async FastAPI chatbot service, which owns all the live
 * conversation state, the 10-prompt cap and the one-shot DB persist.
 *
 * Env (server-only):
 *   CHATBOT_SERVICE_URL      e.g. https://plantathome-chatbot-production.up.railway.app
 *   CHATBOT_SERVICE_API_KEY  shared secret -> sent as X-Api-Key
 */
export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
};

const ALLOWED = new Set(['ask', 'end']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const action = String(req.query.action || '');
  if (!ALLOWED.has(action)) {
    return res.status(404).json({ message: 'Not found' });
  }

  const base = process.env.CHATBOT_SERVICE_URL;
  if (!base) {
    return res.status(503).json({ message: 'Ask AI is not configured.' });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    const upstream = await fetch(`${base.replace(/\/$/, '')}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CHATBOT_SERVICE_API_KEY
          ? { 'X-Api-Key': process.env.CHATBOT_SERVICE_API_KEY }
          : {}),
      },
      body: JSON.stringify(req.body ?? {}),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json');
    return res.send(text || '{}');
  } catch (err) {
    return res.status(502).json({ message: 'Ask AI service is unavailable.' });
  }
}
