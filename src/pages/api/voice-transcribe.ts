import type { NextApiRequest, NextApiResponse } from 'next';
import { isVoiceSearchEnabled } from '@/lib/server/voice-settings';

// Allow a slightly larger JSON body for the base64 audio clip (a few seconds).
export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

const EXT_BY_MIME: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'mp4',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/x-m4a': 'm4a',
};

/**
 * Multilingual fallback transcription. The storefront records the utterance and
 * posts it here when the browser recognizer is unavailable / low-confidence /
 * non-English. OpenAI Whisper auto-detects the language (Hindi/regional) and
 * returns the transcript; intent classification still happens in /plant-suggest.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { audio, mimeType } = req.body || {};
  if (!audio || typeof audio !== 'string') {
    return res.status(400).json({ error: 'Missing audio' });
  }

  if (!(await isVoiceSearchEnabled())) {
    return res.status(503).json({ error: 'Feature disabled' });
  }

  try {
    const buffer = Buffer.from(audio, 'base64');
    const mime = (typeof mimeType === 'string' && mimeType.split(';')[0]) || 'audio/webm';
    const ext = EXT_BY_MIME[mime] || 'webm';

    const form = new FormData();
    form.append('file', new Blob([buffer], { type: mime }), `clip.${ext}`);
    form.append('model', 'whisper-1');
    // Auto-detect language; bias the transcriber toward our domain.
    form.append('prompt', 'Plant nursery voice search. Indoor, outdoor, succulent, herb, flowering plants.');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });

    if (!r.ok) {
      console.error('Whisper error:', r.status, await r.text());
      return res.status(502).json({ error: 'Transcription failed' });
    }

    const data = await r.json();
    return res.status(200).json({ transcript: (data.text || '').trim() });
  } catch (error) {
    console.error('voice-transcribe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
