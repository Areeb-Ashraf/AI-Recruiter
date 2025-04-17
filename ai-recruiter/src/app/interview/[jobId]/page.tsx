"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, MapPin, ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { VoiceRecorder } from "@/components/voice-recorder";
import { ChatBubble } from "@/components/chat-bubble";
import { textToSpeech, speechToText } from "@/lib/azure";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function InterviewPage() {
  const router = useRouter();
  const { jobId } = useParams();
  const { data: session, status } = useSession();
  
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Interview state
  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<ArrayBuffer | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auth check and fetch job data
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    
    if (session?.user?.role !== "CANDIDATE") {
      router.push("/dashboard/employer");
      return;
    }
    
    fetchJob();
  }, [session, status, router, jobId]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const fetchJob = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      router.push('/dashboard/candidate');
    } finally {
      setIsLoading(false);
    }
  };
  
  const startInterview = async () => {
    setIsLoading(true);
    try {
      // Fetch AI-generated questions based on the job
      const response = await fetch(`/api/interviews/questions?jobId=${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }
      
      // Set initial welcome message
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Hello! I'm your AI interviewer for the ${job.title} position at ${job.company}. I'll be asking you a few questions to get to know you better and evaluate your fit for this role. Let's begin the interview. Are you ready?`
      };
      
      setMessages([welcomeMessage]);
      setInterviewStarted(true);
      
      // Generate speech for the welcome message
      try {
        const audioData = await textToSpeech(welcomeMessage.content);
        setCurrentAudio(audioData);
      } catch (error) {
        console.error('Error generating speech:', error);
        const errorMessage = (error as Error).message;
        
        if (errorMessage.includes('configuration error')) {
          toast.error('Speech service unavailable. The interview will continue in text-only mode.');
          console.warn('Speech configuration error:', errorMessage);
        } else {
          // Just log the error but don't show a toast for other speech errors
          console.warn(`Speech synthesis unavailable: ${errorMessage}`);
        }
        // Continue with the interview even if speech fails
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() && !isListening) return;
    
    try {
      // Add user message to the chat
      const userMessage: Message = {
        role: 'user',
        content: userInput
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setUserInput("");
      setIsProcessing(true);
      
      // Get response from AI
      const response = await fetch('/api/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          messages: [...messages, userMessage]
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from interviewer');
      }
      
      const data = await response.json();
      const aiMessage = data.message;
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Generate speech for AI response
      try {
        const audioData = await textToSpeech(aiMessage.content);
        setCurrentAudio(audioData);
      } catch (error) {
        console.error('Error generating speech:', error);
        const errorMessage = (error as Error).message;
        
        // Only show toast for critical errors, not format/config issues
        if (errorMessage.includes('empty text')) {
          console.warn('Empty text provided for speech synthesis');
        } else if (errorMessage.includes('configuration error')) {
          toast.error('Voice response unavailable. Continuing with text only.');
          console.error('Speech configuration error:', errorMessage);
        } else if (errorMessage.includes('synthesis failed')) {
          toast.error('Voice response failed. Continuing with text only.');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to communicate with AI interviewer');
      setIsProcessing(false);
    }
  };
  
  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsListening(true);
      
      // Convert audio blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      try {
        // Convert speech to text
        const transcribedText = await speechToText(arrayBuffer);
        setUserInput(transcribedText);
        
        // Auto-send the message if a meaningful response was transcribed
        if (transcribedText && transcribedText.length > 5) {
          setTimeout(() => {
            handleSendMessage();
          }, 500);
        }
      } catch (error) {
        console.error('Error converting speech to text:', error);
        
        // Parse the detailed error message from the speech function
        const errorMessage = (error as Error).message;
        
        if (errorMessage.includes('empty audio data')) {
          toast.error('No audio data detected. Please try recording again.');
        } else if (errorMessage.includes('No speech detected')) {
          toast.error('No speech was detected. Please try again or speak more clearly.');
        } else if (errorMessage.includes('could not be recognized')) {
          toast.error('Speech could not be recognized. Please speak more clearly or try typing your response.');
        } else if (errorMessage.includes('configuration error')) {
          toast.error('Speech service unavailable. Please type your response instead.');
          console.error('Speech configuration error:', errorMessage);
        } else if (errorMessage.includes('recognize audio')) {
          toast.error('Unable to recognize audio. Please try again or use text input.');
        } else if (errorMessage.includes('decode audio') || errorMessage.includes('audio format')) {
          // This is an expected error for some audio formats, show more specific message
          toast.error('Audio format not supported. Please try again or use text input.');
          console.warn('Audio format issue:', errorMessage);
        } else {
          // Fall back to generic error if none of the specific cases match
          toast.error('Speech recognition failed. Please type your response instead.');
        }
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process voice input. Please type your response.');
    } finally {
      setIsListening(false);
    }
  };
  
  const completeInterview = async () => {
    if (messages.length < 3) {
      toast.error('Please complete the interview before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit the complete interview transcript
      const response = await fetch('/api/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          messages,
          isComplete: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }
      
      const data = await response.json();
      
      // Send transcript for analysis
      const analysisResponse = await fetch('/api/interviews/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interviewId: data.interviewId,
          transcript: JSON.stringify(messages)
        })
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Interview submitted but analysis failed');
      }
      
      toast.success('Interview submitted successfully!');
      router.push('/dashboard/candidate?tab=interviews');
    } catch (error: any) {
      console.error('Error completing interview:', error);
      toast.error(error.message || 'Failed to submit interview');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push('/dashboard/candidate')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Briefcase className="h-4 w-4" />
              <span>{job.jobType}</span>
              {job.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </>
              )}
            </div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Voice Interview</CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              {!interviewStarted 
                ? "Start your interview to begin the conversation with our AI interviewer" 
                : "Speak clearly and answer the questions to the best of your ability"}
            </p>
          </CardHeader>
          
          {!interviewStarted ? (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center mb-6 max-w-md">
                This interview will be conducted by an AI assistant. You'll be asked questions related to the job,
                and you can respond using voice or text. Your responses will be analyzed to provide feedback.
              </p>
              <Button 
                onClick={startInterview}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </CardContent>
          ) : (
            <>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {messages.map((message, index) => (
                    <ChatBubble 
                      key={index} 
                      message={message} 
                      audioData={message.role === 'assistant' && index === messages.length - 1 ? currentAudio : null}
                      isProcessing={isProcessing && index === messages.length - 1}
                    />
                  ))}
                  {isProcessing && (
                    <ChatBubble 
                      message={{ role: 'assistant', content: 'Thinking...' }}
                      isProcessing={true}
                    />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4 border-t p-4">
                <div className="w-full">
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Type your response..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={isProcessing || (!userInput.trim() && !isListening)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                  <VoiceRecorder 
                    onRecordingComplete={handleVoiceInput}
                    isDisabled={isProcessing} 
                  />
                  
                  <Button
                    onClick={completeInterview}
                    variant="outline"
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    disabled={isSubmitting || messages.length < 3}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Interview...
                      </>
                    ) : (
                      'Complete Interview'
                    )}
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
} 