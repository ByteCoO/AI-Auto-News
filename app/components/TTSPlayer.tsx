'use client';

import React, { useState } from 'react';

interface TTSPlayerProps {
  postId: string;
  englishText: string | null;
  chineseText: string | null;
}

type Language = 'en' | 'cn';

export default function TTSPlayer({ postId, englishText, chineseText }: TTSPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>('en');

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    const text = selectedLang === 'en' ? englishText : chineseText;
    const voice = selectedLang === 'en' ? 'en-US-JennyNeural' : 'zh-CN-XiaoxiaoNeural';

    if (!text) {
      setError(`Content for selected language (${selectedLang}) is not available.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tts-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          name: `${postId}_${selectedLang}`,
          voice: voice,
          rate: '-4%',
          volume: '+0%',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate audio.' }));
        throw new Error(errorData.message || 'Failed to generate audio.');
      }

      setAudioUrl(`https://fond-nina-ballpo-dba04486.koyeb.app/files/${postId}_${selectedLang}.mp3`);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 text-center">
      <div className="flex justify-center items-center gap-4">
        {/* Language Selection */}
        <div className="flex rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => setSelectedLang('en')}
            disabled={!englishText}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              selectedLang === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-slate-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang('cn')}
            disabled={!chineseText}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              selectedLang === 'cn' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-slate-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            中文
          </button>
        </div>

        {/* Play Button */}
        <button
          onClick={handleGenerateAudio}
          disabled={isLoading || (selectedLang === 'en' ? !englishText : !chineseText)}
          className="bg-sky-600 text-white px-5 py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Play Audio
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

      {audioUrl && (
        <div className="mt-4">
          <audio controls autoPlay className="w-full max-w-md mx-auto rounded-lg shadow-lg">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}