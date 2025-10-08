import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

// POST /api/auth/academy/login - Academy login
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find academy by email
    const academy = await prisma.academy.findUnique({
      where: { email }
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if academy is active
    if (!academy.is_active) {
      return NextResponse.json(
        { error: 'This academy account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, academy.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      academy_id: academy.academy_id,
      email: academy.email,
      name: academy.name,
      type: 'academy'
    });

    // Return academy data (excluding password)
    const { password: _, reset_token, reset_token_expiry, email_verification_token, email_verification_expiry, ...academyData } = academy;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      academy: academyData,
      token,
      emailVerified: academy.email_verified,
      ...((!academy.email_verified) && { 
        warning: 'Please verify your email address to access all features' 
      })
    });

  } catch (error) {
    console.error('Academy login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}

