import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

interface PlantVoiceState {
  listening: boolean;
  processing: boolean;
  transcript: string;
  error: string | null;
}

function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function usePlantVoice() {
  const router = useRouter();
  const [state, setState] = useState<PlantVoiceState>({
    listening: false,
    processing: false,
    transcript: '',
    error: null,
  });

  const startListening = useCallback(async () => {
    // Support is checked at click time (not render) so the mic is always visible
    // and SSR/client markup match. Show a friendly message where unsupported.
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setState((prev) => ({
        ...prev,
        error: 'Voice search works in Chrome, Edge, or Safari.',
      }));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setState((prev) => ({ ...prev, listening: true, error: null, transcript: '' }));

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      setState((prev) => ({ ...prev, transcript, listening: false, processing: true }));

      try {
        const res = await fetch('/api/plant-suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript }),
        });
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        const query: Record<string, string> = { text: data.text };
        if (data.category) {
          query.category = data.category;
        }
        await router.push({ pathname: '/plants/search', query });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to process voice';
        setState((prev) => ({ ...prev, error: errorMsg, processing: false }));
      }
    };

    recognition.onerror = (event: any) => {
      const errorMsg =
        event.error === 'no-speech'
          ? 'No speech detected — try again.'
          : event.error === 'not-allowed'
          ? 'Microphone permission denied.'
          : `Error: ${event.error}`;
      setState((prev) => ({ ...prev, error: errorMsg, listening: false, processing: false }));
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, listening: false }));
    };

    recognition.start();
  }, [router]);

  return {
    ...state,
    startListening,
  };
}
