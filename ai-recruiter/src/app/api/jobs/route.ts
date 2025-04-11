import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all jobs for the current employer
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const jobs = await prisma.job.findMany({
      where: {
        employerId: session.user.id
      },
      orderBy: {
        postedDate: 'desc'
      }
    });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Parse required skills from a comma-separated string
    let requiredSkills = data.requiredSkills;
    if (typeof requiredSkills === 'string') {
      requiredSkills = requiredSkills.split(',').map((skill: string) => skill.trim());
    }
    
    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        description: data.description,
        requiredSkills,
        jobType: data.jobType,
        salary: data.salary,
        location: data.location,
        employerId: session.user.id
      }
    });
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 