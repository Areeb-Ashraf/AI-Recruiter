import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch all interviews for jobs posted by this employer
    const interviews = await prisma.interview.findMany({
      where: {
        job: {
          employerId: session.user.id
        }
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            jobType: true
          }
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching employer interviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 