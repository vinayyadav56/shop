import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

interface PlantVoiceState {
  supported: boolean;
  listening: boolean;
  processing: boolean;
  transcript: string;
  error: string | null;
}

export function usePlantVoice() {
  const router = useRouter();
  const [state, setState] = useState<PlantVoiceState>({
    supported: typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition),
    listening: false,
    processing: false,
    transcript: '',
    error: null,
  });

  const startListening = useCallback(async () => {
    if (!state.supported) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setState((prev) => ({ ...prev, listening: true, error: null, transcript: '' }));

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, listening: true }));
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
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

        // Navigate to the search results
        await router.push({
          pathname: '/plants/search',
          query,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to process voice';
        setState((prev) => ({ ...prev, error: errorMsg, processing: false }));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMsg = event.error === 'no-speech' ? 'No speech detected' : `Error: ${event.error}`;
      setState((prev) => ({ ...prev, error: errorMsg, listening: false, processing: false }));
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, listening: false }));
    };

    recognition.start();
  }, [state.supported, router]);

  return {
    ...state,
    startListening,
  };
}
