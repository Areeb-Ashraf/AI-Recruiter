import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getOpenAIClient } from '@/lib/azure';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { jobId, messages, isComplete } = data;
    
    if (!jobId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    
    // Fetch the job details for context
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        requirements: true
      }
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // If this is a completion request, save the interview data
    if (isComplete) {
      // Find existing interview or create new one
      const interview = await prisma.interview.upsert({
        where: {
          jobId_candidateId: {
            jobId,
            candidateId: session.user.id
          }
        },
        update: {
          transcript: JSON.stringify(messages),
          status: 'PENDING_REVIEW'
        },
        create: {
          jobId,
          candidateId: session.user.id,
          transcript: JSON.stringify(messages),
          status: 'PENDING_REVIEW'
        }
      });
      
      return NextResponse.json({ success: true, interviewId: interview.id });
    }
    
    // Get OpenAI client
    const client = getOpenAIClient();
    
    // Format the conversation context
    const jobContext = `
      You are an AI interviewer conducting an interview for the position of ${job.title} at ${job.company}.
      Job description: ${job.description}
      Requirements: ${job.requirements || 'Not specified'}
      
      You are speaking with a candidate. Be professional, friendly, and conversational.
      Ask relevant questions based on the job description and requirements.
      If the candidate asks about the company or role, provide information based on the job details.
      Keep your responses concise (1-3 sentences) and focused on evaluating the candidate's fit for this specific role.
    `;
    
    // Format messages for the API
    const formattedMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: jobContext }
    ];
    
    // Add user messages with proper type casting
    messages.forEach((msg: { role: string; content: string }) => {
      if (msg.role === 'user') {
        formattedMessages.push({ role: 'user', content: msg.content });
      } else if (msg.role === 'assistant') {
        formattedMessages.push({ role: 'assistant', content: msg.content });
      }
    });
    
    // Log the request configuration
    console.log("Sending chat request to Azure OpenAI with messages:", 
      formattedMessages.map(m => ({ role: m.role, contentLength: m.content?.length || 0 })));
    
    // Try chat completions API
    const chatResponse = await client.chat.completions.create({
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 800,
      model: 'gpt-35-turbo'  // Required by API types but ignored by Azure
    });
    
    // Extract and return the assistant's message
    const assistantMessage = chatResponse.choices[0].message?.content || "I'm sorry, I couldn't process that.";
    console.log("Successfully received response from Azure OpenAI");
    
    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: assistantMessage
      }
    });
  } catch (error) {
    console.error("Error communicating with Azure OpenAI:", error);
    
    // Provide a detailed error message
    return NextResponse.json({ 
      error: 'Failed to generate interviewer response. Please verify your Azure OpenAI configuration is correctly set up with a valid deployment name and API key.'
    }, { status: 500 });
  }
} 