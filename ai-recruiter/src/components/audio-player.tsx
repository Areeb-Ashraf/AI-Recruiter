import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioData: ArrayBuffer | null;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export function AudioPlayer({ audioData, onComplete, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!audioData) return;
    
    // Convert ArrayBuffer to Blob
    const blob = new Blob([audioData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      
      // Auto play if enabled
      if (autoPlay) {
        audioRef.current.play().catch(error => {
          console.error('Auto-play failed:', error);
        });
      }
    }
    
    // Cleanup URL when component unmounts or audio changes
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioData, autoPlay]);
  
  useEffect(() => {
    // Set up event listeners for the audio element
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Play failed:', error);
      });
    }
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };
  
  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} />
      
      <Button
        variant="outline"
        size="icon"
        onClick={togglePlayPause}
        disabled={!audioData}
        className="h-8 w-8"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        disabled={!audioData}
        className="h-8 w-8"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
} 