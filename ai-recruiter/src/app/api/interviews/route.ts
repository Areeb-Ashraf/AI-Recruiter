import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all interviews for the current candidate
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For candidates, fetch their interviews with job details
    if (session.user.role === 'CANDIDATE') {
      const interviews = await prisma.interview.findMany({
        where: {
          candidateId: session.user.id
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              jobType: true,
              location: true,
              salary: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      return NextResponse.json(interviews);
    } 
    
    // For employers, we'll implement this later when needed
    if (session.user.role === 'EMPLOYER') {
      return NextResponse.json({ error: 'Not implemented yet' }, { status: 501 });
    }
    
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST to create a new interview
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: { id: data.jobId }
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Check if candidate has already interviewed for this job
    const existingInterview = await prisma.interview.findUnique({
      where: {
        jobId_candidateId: {
          jobId: data.jobId,
          candidateId: session.user.id
        }
      }
    });
    
    if (existingInterview) {
      return NextResponse.json({ error: 'You have already interviewed for this job' }, { status: 400 });
    }
    
    // Create the interview record
    const interview = await prisma.interview.create({
      data: {
        jobId: data.jobId,
        candidateId: session.user.id,
        // Use default values for other fields
      }
    });
    
    // Update the applicantsCount for the job
    await prisma.job.update({
      where: { id: data.jobId },
      data: {
        applicantsCount: {
          increment: 1
        }
      }
    });
    
    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 