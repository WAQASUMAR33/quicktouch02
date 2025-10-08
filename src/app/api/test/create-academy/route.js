import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/test/create-academy - Create test academy (DEVELOPMENT ONLY)
export async function POST(req) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const email = 'dilwaq22@gmail.com';
    const password = '786ninja';

    // Check if academy already exists
    const existing = await prisma.academy.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Academy already exists',
        academy: {
          academy_id: existing.academy_id,
          name: existing.name,
          email: existing.email,
          email_verified: existing.email_verified,
          is_active: existing.is_active
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create academy
    const academy = await prisma.academy.create({
      data: {
        name: 'Test Academy',
        email: email,
        password: hashedPassword,
        phone: '+1234567890',
        address: '123 Test Street',
        description: 'Test Academy for development',
        website: 'https://testacademy.com',
        email_verified: true, // Skip verification for testing
        is_active: true
      },
      select: {
        academy_id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        website: true,
        email_verified: true,
        is_active: true,
        created_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test academy created successfully',
      credentials: {
        email: email,
        password: password
      },
      academy: academy,
      loginUrl: '/academy/login'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating test academy:', error);
    return NextResponse.json(
      { error: 'Failed to create test academy', details: error.message },
      { status: 500 }
    );
  }
}

