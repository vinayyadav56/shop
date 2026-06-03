import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface PlantVoiceState {
  listening: boolean;
  processing: boolean;
  transcript: string;
  error: string | null;
}

// Confidence below this from the browser recognizer → fall back to Whisper.
const CONFIDENCE_THRESHOLD = 0.6;
const MAX_RECORD_MS = 7000;

function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

function canRecord(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).MediaRecorder !== 'undefined' &&
    !!navigator?.mediaDevices?.getUserMedia
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function usePlantVoice() {
  const router = useRouter();
  const [state, setState] = useState<PlantVoiceState>({
    listening: false,
    processing: false,
    transcript: '',
    error: null,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const patch = (p: Partial<PlantVoiceState>) => setState((prev) => ({ ...prev, ...p }));

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // transcript (any source) → classify → navigate. Always clears `processing`.
  const resolveAndGo = useCallback(
    async (transcript: string) => {
      const text = transcript.trim();
      if (!text) {
        patch({ processing: false, error: 'No speech detected — try again.' });
        return;
      }
      patch({ transcript: text, processing: true, listening: false });
      try {
        const res = await fetch('/api/plant-suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: text }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const query: Record<string, string> = data.category
          ? { category: data.category }
          : { text: data.text || text };
        await router.push({ pathname: '/plants/search', query });
      } catch (err) {
        patch({ error: err instanceof Error ? err.message : 'Failed to process voice' });
      } finally {
        // Always return the icon to the mic (the mic persists in the header
        // across navigation, so this must run on the success path too).
        patch({ processing: false });
      }
    },
    [router]
  );

  // Fallback: send the recorded audio to Whisper, then classify.
  const transcribeViaWhisper = useCallback(async () => {
    const chunks = chunksRef.current;
    if (!chunks.length) {
      patch({ processing: false, error: 'No speech detected — try again.' });
      stopStream();
      return;
    }
    patch({ processing: true, listening: false });
    try {
      const blob = new Blob(chunks, { type: recorderRef.current?.mimeType || 'audio/webm' });
      const audio = await blobToBase64(blob);
      const res = await fetch('/api/voice-transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio, mimeType: blob.type }),
      });
      stopStream();
      if (!res.ok) throw new Error(`Transcribe error: ${res.status}`);
      const { transcript } = await res.json();
      await resolveAndGo(transcript || '');
    } catch (err) {
      stopStream();
      patch({ processing: false, error: err instanceof Error ? err.message : 'Could not transcribe audio' });
    }
  }, [resolveAndGo, stopStream]);

  const startListening = useCallback(async () => {
    const SpeechRecognition = getSpeechRecognition();
    const recordable = canRecord();

    if (!SpeechRecognition && !recordable) {
      patch({ error: 'Voice search needs Chrome, Edge, or Safari.' });
      return;
    }

    patch({ listening: true, error: null, transcript: '' });

    // Record the utterance in parallel (graceful if it fails) so we can fall
    // back to Whisper for non-English / low-confidence / unsupported cases.
    if (recordable) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
        recorderRef.current = mr;
        mr.start();
      } catch {
        // mic permission/record unavailable — browser recognizer alone
        recorderRef.current = null;
      }
    }

    // No browser recognizer → record then Whisper.
    if (!SpeechRecognition) {
      window.setTimeout(() => {
        const mr = recorderRef.current;
        if (mr && mr.state !== 'inactive') {
          mr.onstop = () => transcribeViaWhisper();
          mr.stop();
        } else {
          transcribeViaWhisper();
        }
      }, MAX_RECORD_MS);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 3;

    let best = '';
    let confidence = 0;
    let recognizerErr = false;

    recognition.onresult = (event: any) => {
      const r = event.results?.[0];
      if (r && r[0]) {
        best = r[0].transcript || '';
        confidence = typeof r[0].confidence === 'number' ? r[0].confidence : 1;
      }
    };
    recognition.onerror = () => {
      recognizerErr = true;
    };
    recognition.onend = () => {
      const mr = recorderRef.current;
      const useBrowser = best && !recognizerErr && confidence >= CONFIDENCE_THRESHOLD;
      if (useBrowser) {
        stopStream(); // discard audio, use the instant result
        resolveAndGo(best);
      } else if (mr && mr.state !== 'inactive') {
        mr.onstop = () => transcribeViaWhisper();
        mr.stop();
      } else if (chunksRef.current.length) {
        transcribeViaWhisper();
      } else if (best) {
        resolveAndGo(best); // low confidence but it's all we have
      } else {
        patch({ listening: false, error: 'No speech detected — try again.' });
      }
    };

    recognition.start();
  }, [resolveAndGo, transcribeViaWhisper, stopStream]);

  return { ...state, startListening };
}
