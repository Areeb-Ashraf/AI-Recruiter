import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { AzureOpenAI } from "openai";
import "@azure/openai/types";

// Speech configuration
export const getSpeechConfig = () => {
  // Client-side environment variables must be accessed with NEXT_PUBLIC_ prefix
  const speechKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY
    : process.env.AZURE_SPEECH_KEY;
    
  const speechRegion = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
    : process.env.AZURE_SPEECH_REGION;
  
  if (!speechKey || !speechRegion) {
    throw new Error('Azure Speech credentials not configured');
  }
  
  return speechsdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
};

// OpenAI client configuration
export const getOpenAIClient = () => {
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
  
  if (!endpoint || !apiKey || !deployment) {
    throw new Error('Azure OpenAI credentials not configured');
  }
  
  const options = {
    apiKey,
    endpoint,
    deployment,
    apiVersion
  };
  
  console.log("Creating Azure OpenAI client with:", {
    endpoint,
    deployment,
    apiVersion
  });
  
  return new AzureOpenAI(options);
};

export const modelName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
export const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

// Function to synthesize speech
export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate input
      if (!text || text.trim() === '') {
        reject(new Error('Empty text provided for speech synthesis'));
        return;
      }

      // Get speech config
      let speechConfig;
      try {
        speechConfig = getSpeechConfig();
      } catch (configError) {
        reject(new Error(`Speech configuration error: ${(configError as Error).message}`));
        return;
      }
      
      // Configure speech synthesis
      speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // Natural female voice
      
      const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);
      
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            reject(new Error(`Speech synthesis failed: ${result.reason} - ${result.errorDetails || 'No additional details'}`));
          }
          synthesizer.close();
        },
        (error) => {
          reject(new Error(`Speech synthesis error: ${error}`));
          synthesizer.close();
        }
      );
    } catch (error) {
      console.error("Error in textToSpeech:", error);
      reject(new Error(`Text-to-speech failed: ${(error as Error).message}`));
    }
  });
};

// Function to convert speech to text
export const speechToText = async (audioStream: ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate input
      if (!audioStream || audioStream.byteLength === 0) {
        reject(new Error('Invalid or empty audio data provided'));
        return;
      }

      // Get speech config
      let speechConfig;
      try {
        speechConfig = getSpeechConfig();
      } catch (configError) {
        reject(new Error(`Speech configuration error: ${(configError as Error).message}`));
        return;
      }
      
      // Create an audio context to process the audio data
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Decode the audio data (works with WebM, MP4, etc.)
      audioContext.decodeAudioData(
        audioStream, 
        (audioBuffer) => {
          try {
            // Try to use Azure Speech SDK
            // Since Azure SDK expects WAV format and we have WebM, we'll use the 
            // PushAudioInputStream instead which is more flexible
            const pushStream = speechsdk.AudioInputStream.createPushStream();
            
            // Process the audio buffer and push it to the stream
            const rawAudio = audioBuffer.getChannelData(0);
            const audio16kHz = downsampleAudio(rawAudio, audioBuffer.sampleRate, 16000);
            const audioData = convertFloat32ToInt16(audio16kHz);
            
            // Push the audio data to the stream
            pushStream.write(audioData.buffer as ArrayBuffer);
            pushStream.close();
            
            // Create audio config from push stream
            const audioConfig = speechsdk.AudioConfig.fromStreamInput(pushStream);
            
            // Create recognizer with the custom audio config
            const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
            
            recognizer.recognizeOnceAsync(
              (result) => {
                if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                  if (result.text && result.text.trim() !== '') {
                    resolve(result.text);
                  } else {
                    reject(new Error('No speech detected in the audio'));
                  }
                } else if (result.reason === speechsdk.ResultReason.NoMatch) {
                  reject(new Error('Speech could not be recognized. Please speak more clearly or try again.'));
                } else {
                  reject(new Error(`Speech recognition failed: ${result.reason}`));
                }
                recognizer.close();
                audioContext.close();
              },
              (error) => {
                console.error("Recognition error:", error);
                reject(new Error(`Speech recognition error: ${error}`));
                recognizer.close();
                audioContext.close();
              }
            );
          } catch (processingError) {
            console.error("Audio processing error:", processingError);
            audioContext.close();
            reject(new Error(`Audio processing failed: ${(processingError as Error).message}`));
          }
        },
        (decodeError) => {
          audioContext.close();
          console.error("Audio decoding error:", decodeError);
          reject(new Error(`Failed to decode audio: ${decodeError.message}`));
        }
      );
    } catch (error) {
      console.error("Error in speechToText:", error);
      reject(new Error(`Speech-to-text failed: ${(error as Error).message}`));
    }
  });
};

// Helper function to downsample audio to target sample rate
function downsampleAudio(audioData: Float32Array, sampleRate: number, targetRate: number): Float32Array {
  if (sampleRate === targetRate) {
    return audioData;
  }
  
  const ratio = sampleRate / targetRate;
  const newLength = Math.round(audioData.length / ratio);
  const result = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    const pos = Math.floor(i * ratio);
    result[i] = audioData[pos];
  }
  
  return result;
}

// Helper function to convert Float32Array to Int16Array for the speech SDK
function convertFloat32ToInt16(float32Audio: Float32Array): Int16Array {
  const int16Audio = new Int16Array(float32Audio.length);
  for (let i = 0; i < float32Audio.length; i++) {
    // Convert float to int (clamp between -1 and 1)
    const s = Math.max(-1, Math.min(1, float32Audio[i]));
    // Convert to 16-bit signed int (range: -32768 to 32767)
    int16Audio[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Audio;
}

// Generate interview questions based on job context
export const generateInterviewQuestions = async (
  jobTitle: string, 
  jobDescription: string, 
  additionalContext?: string
): Promise<string[]> => {
  const client = getOpenAIClient();
  
  const prompt = `
    As an AI interviewer, generate 5 relevant interview questions for a ${jobTitle} position.
    
    Job description: ${jobDescription}
    
    ${additionalContext ? `Additional context: ${additionalContext}` : ''}
    
    Generate 5 professional and insightful interview questions that will help assess the candidate's fit for this role.
    Format your response as a JSON array of strings containing only the questions.
  `;
  
  console.log("Sending interview questions request to Azure OpenAI");
  
  const chatResponse = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a professional interviewer who creates relevant job interview questions." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 800,
    model: 'gpt-35-turbo'  // Required by API types but ignored by Azure
  });
  
  const questionsText = chatResponse.choices[0].message.content?.trim() || '[]';
  console.log("Received response from Azure OpenAI");
  
  // Parse the JSON response
  // Check if the response is wrapped in a markdown code block and extract the JSON
  let cleanedResponse = questionsText;
  
  // Handle case where response is wrapped in markdown code blocks (```json ... ```)
  if (questionsText.startsWith('```')) {
    // Find the content between code block markers
    const matches = questionsText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (matches && matches[1]) {
      cleanedResponse = matches[1].trim();
    }
  }

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error parsing interview questions response:", error);
    console.error("Raw response:", questionsText);
    console.error("Cleaned response:", cleanedResponse);
    throw new Error("Failed to parse interview questions response. The AI returned an invalid format.");
  }
};

// Generate feedback based on interview responses
export const generateInterviewFeedback = async (
  jobTitle: string,
  jobDescription: string,
  interviewTranscript: string
): Promise<{
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  fitScore: number;
}> => {
  const client = getOpenAIClient();
  
  const prompt = `
    As an AI interview analyzer, evaluate the following interview transcript for a ${jobTitle} position.
    
    Job description: ${jobDescription}
    
    Interview transcript:
    ${interviewTranscript}
    
    Provide a comprehensive analysis in JSON format with the following structure:
    {
      "overallFeedback": "Overall assessment of the candidate based on their responses",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "areasForImprovement": ["Area 1", "Area 2"],
      "fitScore": 85 // A score from 0-100 representing how well the candidate fits the position
    }
  `;
  
  console.log("Sending interview feedback request to Azure OpenAI");
  
  const chatResponse = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI interview analyzer who provides detailed candidate feedback." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1000,
    model: 'gpt-35-turbo'  // Required by API types but ignored by Azure
  });
  
  const feedbackText = chatResponse.choices[0].message.content?.trim() || '{}';
  console.log("Received response from Azure OpenAI");
  
  // Parse the JSON response
  // Check if the response is wrapped in a markdown code block and extract the JSON
  let cleanedResponse = feedbackText;
  
  // Handle case where response is wrapped in markdown code blocks (```json ... ```)
  if (feedbackText.startsWith('```')) {
    // Find the content between code block markers
    const matches = feedbackText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (matches && matches[1]) {
      cleanedResponse = matches[1].trim();
    }
  }

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error parsing interview feedback response:", error);
    console.error("Raw response:", feedbackText);
    console.error("Cleaned response:", cleanedResponse);
    throw new Error("Failed to parse interview feedback response. The AI returned an invalid format.");
  }
}; 