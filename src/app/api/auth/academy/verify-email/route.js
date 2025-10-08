import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/auth/academy/verify-email - Verify academy email
export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find academy with this verification token
    const academy = await prisma.academy.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (academy.email_verified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified',
        academy: {
          academy_id: academy.academy_id,
          name: academy.name,
          email: academy.email,
          email_verified: true
        }
      });
    }

    // Update academy - mark as verified and clear verification token
    const updatedAcademy = await prisma.academy.update({
      where: { academy_id: academy.academy_id },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_expiry: null
      },
      select: {
        academy_id: true,
        name: true,
        email: true,
        email_verified: true,
        created_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now access all features.',
      academy: updatedAcademy
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Email verification failed', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/academy/verify-email?token=xxx - Verify via URL (for email links)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find academy with this verification token
    const academy = await prisma.academy.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expiry: {
          gt: new Date()
        }
      }
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    if (academy.email_verified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified'
      });
    }

    // Update academy
    await prisma.academy.update({
      where: { academy_id: academy.academy_id },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_expiry: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Email verification failed', details: error.message },
      { status: 500 }
    );
  }
}

