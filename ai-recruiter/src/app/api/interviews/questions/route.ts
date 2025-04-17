import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateInterviewQuestions } from '@/lib/azure';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    // Fetch job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true
      }
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Generate questions via Azure OpenAI
    const additionalContext = job.requirements 
      ? `Requirements: ${job.requirements}` 
      : undefined;
      
    const questions = await generateInterviewQuestions(
      job.title,
      job.description,
      additionalContext
    );
    
    return NextResponse.json({ 
      success: true,
      jobTitle: job.title, 
      questions 
    });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return NextResponse.json({ 
      error: 'Failed to generate interview questions. Please verify your Azure OpenAI configuration is correctly set up with a valid deployment name and API key.'
    }, { status: 500 });
  }
} 