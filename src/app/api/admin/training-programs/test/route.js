import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/training-programs/test - Test endpoint to check database connection
export async function GET() {
  try {
    // Test database connection by querying academies
    const academies = await prisma.academy.findMany({
      take: 1,
      select: {
        academy_id: true,
        name: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      academies_count: academies.length,
      sample_academy: academies[0] || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
