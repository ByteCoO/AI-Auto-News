'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CompactTTSPlayerProps {
  postId: string;
  englishText: string | null;
  chineseText: string | null;
}

type Language = 'en' | 'cn';

// Simple function to strip markdown
const stripMarkdown = (text: string | null): string => {
  if (!text) return '';
  // A more robust set of regexes to strip markdown
  return text
    // Remove images
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    // Remove links
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic
    .replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove horizontal rules
    .replace(/^[\*\-_]{3,}\s*$/gm, '')
    // Remove lists
    .replace(/^\s*([\*\-]|\d+\.)\s+/gm, '')
    // Replace newlines with spaces
    .replace(/\n/g, ' ')
    .trim();
};


export default function CompactTTSPlayer({ postId, englishText, chineseText }: CompactTTSPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayToggle = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      return;
    }

    // If we have an audio source for the currently selected language, play it
    if (audioUrl && audioUrl.includes(`_${selectedLang}.mp3`)) {
      audioRef.current?.play();
      return;
    }

    // Otherwise, generate new audio
    setIsLoading(true);
    setError(null);
    setAudioUrl(null); // Reset audio URL

    const textToSpeak = stripMarkdown(selectedLang === 'en' ? englishText : chineseText);
    const voice = selectedLang === 'en' ? 'en-US-JennyNeural' : 'zh-CN-XiaoxiaoNeural';

    if (!textToSpeak) {
      setError('Content not available.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tts-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          name: `${postId}_${selectedLang}`,
          voice: voice,
          rate: '-4%',
          volume: '+0%',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio.');
      }

      const newAudioUrl = `https://fond-nina-ballpo-dba04486.koyeb.app/files/${postId}_${selectedLang}.mp3`;
      setAudioUrl(newAudioUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [audioUrl]);

  const handleAudioStateChange = () => {
    if(audioRef.current) {
        setIsPlaying(!audioRef.current.paused);
    }
  };

  return (
    <div className="flex items-center gap-2">
        {/* Language Selection */}
        <div className="flex rounded-md bg-slate-200 dark:bg-slate-700 p-0.5 text-xs">
            <button
                onClick={() => setSelectedLang('en')}
                disabled={!englishText || isLoading}
                className={`px-2 py-0.5 rounded ${selectedLang === 'en' ? 'bg-white dark:bg-slate-900 text-sky-500' : 'text-slate-500 dark:text-slate-400'} disabled:opacity-50`}
            >
                EN
            </button>
            <button
                onClick={() => setSelectedLang('cn')}
                disabled={!chineseText || isLoading}
                className={`px-2 py-0.5 rounded ${selectedLang === 'cn' ? 'bg-white dark:bg-slate-900 text-sky-500' : 'text-slate-500 dark:text-slate-400'} disabled:opacity-50`}
            >
                CN
            </button>
        </div>
        
        {/* Play/Pause/Loading Button */}
        <button
            onClick={handlePlayToggle}
            disabled={isLoading}
            className="text-slate-500 dark:text-slate-400 hover:text-sky-500 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-wait"
            title={isPlaying ? "Pause" : "Play"}
        >
            {isLoading ? (
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
        </button>

        {audioUrl && <audio ref={audioRef} src={audioUrl} onPlay={handleAudioStateChange} onPause={handleAudioStateChange} onEnded={handleAudioStateChange} onLoadStart={() => setIsLoading(true)} onCanPlay={() => setIsLoading(false)} />}
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
