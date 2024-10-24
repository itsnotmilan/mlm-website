import { useState, useEffect, useCallback, useRef } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle audio play/pause
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Create a new promise that resolves when the audio starts playing
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setError(null);
            })
            .catch((err) => {
              console.warn('Audio playback failed:', err);
              setError('Audio playback failed. Please try again.');
              setIsPlaying(false);
            });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.warn('Audio toggle failed:', err);
      setError('Audio system error. Please try again.');
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Handle errors
  useEffect(() => {
    if (!audioRef.current) return;

    const handleError = (e: Event) => {
      console.warn('Audio error:', e);
      setError('Audio system error. Please try again.');
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('error', handleError);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  return {
    isPlaying,
    toggleAudio,
    error,
  };
}