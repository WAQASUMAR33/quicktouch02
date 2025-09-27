import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users to see available user IDs
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true
      },
      orderBy: {
        user_id: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
      message: 'Users retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
