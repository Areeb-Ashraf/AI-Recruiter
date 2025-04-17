import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isDisabled?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, isDisabled = false }: VoiceRecorderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl);
      }
    };
  }, [mediaBlobUrl]);

  const startRecording = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create media recorder
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setHasError(true);
        toast.error('Recording failed. Please try again or use text input instead.');
        stopRecording();
      };
      
      mediaRecorder.onstop = () => {
        if (mediaChunksRef.current.length === 0 || hasError) {
          // No data recorded or error occurred
          toast.error('No audio was recorded. Please try again or use text input.');
          setIsRecording(false);
          return;
        }
        
        try {
          const audioBlob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setMediaBlobUrl(audioUrl);
          onRecordingComplete(audioBlob);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Error creating audio blob:', error);
          toast.error('Failed to process recording. Please use text input instead.');
        } finally {
          setIsRecording(false);
        }
      };
      
      // Request data every 1 second to ensure we get chunks
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setHasError(true);
      
      // Check for specific error types
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error('Microphone permission denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          toast.error('No microphone found. Please check your device and try again.');
        } else {
          toast.error('Failed to access microphone. Please use text input instead.');
        }
      } else {
        toast.error('Unable to record audio. Please use text input instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    setIsLoading(true);
    
    // Short delay to allow UI to update
    setTimeout(() => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (error) {
        console.error('Error stopping recorder:', error);
        setIsRecording(false);
        toast.error('Failed to stop recording properly.');
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleStartRecording = () => {
    setIsLoading(true);
    // Short delay to allow UI to update
    setTimeout(() => {
      startRecording();
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {isRecording ? (
          <Button
            onClick={stopRecording}
            disabled={isLoading || isDisabled}
            variant="destructive"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            Stop Speaking
          </Button>
        ) : (
          <Button
            onClick={handleStartRecording}
            disabled={isLoading || isDisabled}
            variant="default"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            Start Speaking
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="text-sm text-red-500 animate-pulse">
          Recording in progress...
        </div>
      )}
      
      {mediaBlobUrl && !isRecording && (
        <audio src={mediaBlobUrl} controls className="mt-2 w-full max-w-md" />
      )}
      
      {hasError && (
        <div className="text-sm text-amber-500 mt-1">
          Having trouble? Try typing your response instead.
        </div>
      )}
    </div>
  );
} 