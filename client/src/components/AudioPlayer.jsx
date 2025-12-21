import { useEffect, useRef } from 'react';

export default function AudioPlayer({ audioBlob, onPlayComplete }) {
  const audioRef = useRef(null);
  const currentUrlRef = useRef(null);
  const playbackRef = useRef(null);

  useEffect(() => {
    if (!audioBlob || !audioRef.current) return;

    const audio = audioRef.current;
    let isCancelled = false;

    // Cancel previous playback if exists
    if (playbackRef.current) {
      playbackRef.current.cancelled = true;
    }

    // Create playback context
    const playback = { cancelled: false };
    playbackRef.current = playback;

    // Cleanup previous URL if exists
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    // Create new URL and store it
    const audioUrl = URL.createObjectURL(audioBlob);
    currentUrlRef.current = audioUrl;

    // Set source and load
    audio.src = audioUrl;
    audio.load();

    // Play when loaded
    const playAudio = async () => {
      try {
        if (!playback.cancelled) {
          await audio.play();
        }
      } catch (error) {
        if (!playback.cancelled && error.name !== 'AbortError') {
          console.error('Failed to play audio:', error);
          if (onPlayComplete) {
            onPlayComplete();
          }
        }
      }
    };

    playAudio();

    // Cleanup on unmount or before next effect
    return () => {
      playback.cancelled = true;
      if (audio.src) {
        audio.pause();
        audio.src = '';
      }
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, [audioBlob]);

  const handleEnded = () => {
    if (onPlayComplete) {
      onPlayComplete();
    }
  };

  return (
    <audio
      ref={audioRef}
      onEnded={handleEnded}
      onError={(e) => {
        console.error('Audio playback error:', e);
        onPlayComplete();
      }}
      style={{ display: 'none' }}
    />
  );
}
