import React, { useState, useEffect } from 'react';
import { usePlantVoice } from '@/lib/use-plant-voice';

export function VoiceSearchButton() {
  const { supported, listening, processing, transcript, error, startListening } = usePlantVoice();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (transcript) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  if (!supported) {
    return null;
  }

  const isActive = listening || processing;

  return (
    <div className="relative inline-block">
      <button
        onClick={startListening}
        disabled={isActive}
        aria-label="Voice search"
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-all ${
          isActive
            ? 'bg-red-500 animate-pulse text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } disabled:opacity-50`}
        title={listening ? 'Listening...' : processing ? 'Processing...' : 'Click to search by voice'}
      >
        {processing ? (
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : listening ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 3.215 1.308 4.277 4.953 6.368v-2.368c2.648.921 4.587 1.368 7 1.368 6.338 0 12-4.226 12-10.007S18.338 1 12 1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12a10 10 0 1120 0 10 10 0 01-20 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {showToast && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-50 animate-fade-in">
          {transcript || 'Processing...'}
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-50">
          {error}
        </div>
      )}
    </div>
  );
}
