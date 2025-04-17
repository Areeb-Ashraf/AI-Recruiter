import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AudioPlayer } from './audio-player';
import { User, Bot } from 'lucide-react';

interface ChatBubbleProps {
  message: {
    role: 'assistant' | 'user';
    content: string;
  };
  audioData?: ArrayBuffer | null;
  isProcessing?: boolean;
}

export function ChatBubble({ message, audioData, isProcessing = false }: ChatBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isAssistant = message.role === 'assistant';
  
  return (
    <div
      className={cn(
        "flex w-full gap-2 mb-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex items-start justify-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-600">
          <Bot className="h-5 w-5 mt-2" />
        </div>
      )}
      
      <div className="flex flex-col">
        <div
          className={cn(
            "px-4 py-2 rounded-2xl max-w-[80%]",
            isAssistant
              ? "bg-gray-100 text-gray-800 rounded-tl-none"
              : "bg-indigo-600 text-white rounded-tr-none ml-auto"
          )}
        >
          <div className={cn(isProcessing && "animate-pulse")}>
            {message.content}
          </div>
        </div>
        
        {isAssistant && audioData && (
          <div className="mt-1">
            <AudioPlayer 
              audioData={audioData}
              onComplete={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>
      
      {!isAssistant && (
        <div className="flex items-start justify-center h-9 w-9 rounded-full bg-indigo-600 text-white">
          <User className="h-5 w-5 mt-2" />
        </div>
      )}
    </div>
  );
} 