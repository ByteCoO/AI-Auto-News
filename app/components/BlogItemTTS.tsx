'use client';

import React, { useState, useRef } from 'react';

interface BlogItemTTSProps {
  postId: string;
  text: string | null;
}

export default function BlogItemTTS({ postId, text }: BlogItemTTSProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
  
    if (audioUrl) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!text) {
      setError('Content is not available.');
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
          name: `${postId}_en`,
          voice: 'en-US-JennyNeural',
          rate: '-4%',
          volume: '+0%',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio.');
      }

      const newAudioUrl = `https://fond-nina-ballpo-dba04486.koyeb.app/files/${postId}_en.mp3`;
      setAudioUrl(newAudioUrl);
      
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

  const handleAudioLoaded = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  }

  const handleAudioEnded = () => {
    setIsPlaying(false);
  }

  return (
    <div>
      <button
        onClick={handlePlayAudio}
        disabled={isLoading}
        className="text-sky-500 hover:text-sky-600 disabled:text-slate-400"
        title={isPlaying ? "Pause Audio" : "Play Audio"}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {audioUrl && <audio ref={audioRef} src={audioUrl} onCanPlayThrough={handleAudioLoaded} onEnded={handleAudioEnded} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />}
    </div>
  );
}
