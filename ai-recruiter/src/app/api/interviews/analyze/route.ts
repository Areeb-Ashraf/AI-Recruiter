import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateInterviewFeedback } from '@/lib/azure';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { interviewId, transcript } = data;
    
    if (!interviewId || !transcript) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Fetch the interview record
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        job: {
          select: {
            title: true,
            description: true,
            requirements: true
          }
        }
      }
    });
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }
    
    // Generate feedback using Azure AI
    const contextualInfo = `
      Job Description: ${interview.job.description}
      Requirements: ${interview.job.requirements || 'Not specified'}
    `;
    
    const feedback = await generateInterviewFeedback(
      interview.job.title,
      contextualInfo,
      transcript
    );
    
    // Update the interview record with feedback
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        feedback: feedback.overallFeedback,
        strengths: feedback.strengths,
        improvements: feedback.areasForImprovement,
        score: feedback.fitScore,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      feedback,
      interview: updatedInterview
    });
  } catch (error) {
    console.error('Error analyzing interview:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze interview. Please verify your Azure OpenAI configuration is correctly set up with a valid deployment name and API key.'
    }, { status: 500 });
  }
} 