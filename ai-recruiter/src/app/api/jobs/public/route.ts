import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all jobs for candidates/public
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Even unauthenticated users can see job listings
    // But we'll still check the session to track user stats in the future
    
    // Fetch all jobs, ordered by newest first
    const jobs = await prisma.job.findMany({
      orderBy: {
        postedDate: 'desc'
      },
      include: {
        employer: {
          select: {
            name: true,
          }
        }
      }
    });
    
    // Format jobs to include employer name in company field if it's empty
    const formattedJobs = jobs.map(job => ({
      ...job,
      company: job.company || job.employer?.name || 'Unknown Company',
      employer: undefined // Remove employer object to simplify the response
    }));
    
    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 