import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET a specific job
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // For employers, check if they own the job
    if (session.user.role === 'EMPLOYER' && job.employerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a job
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // First check if the job exists and belongs to this employer
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    if (job.employerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the job
    await prisma.job.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH to update a job
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // First check if the job exists and belongs to this employer
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    });
    
    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    if (existingJob.employerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Parse required skills from a comma-separated string if needed
    let requiredSkills = data.requiredSkills;
    if (typeof requiredSkills === 'string') {
      requiredSkills = requiredSkills.split(',').map((skill: string) => skill.trim());
    }
    
    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: data.title,
        company: data.company,
        description: data.description,
        requiredSkills: requiredSkills || undefined,
        jobType: data.jobType,
        salary: data.salary,
        location: data.location
      }
    });
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 