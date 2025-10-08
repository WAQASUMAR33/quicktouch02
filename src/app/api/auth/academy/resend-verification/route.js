import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// POST /api/auth/academy/resend-verification - Resend verification email
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find academy by email
    const academy = await prisma.academy.findUnique({
      where: { email }
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (academy.email_verified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update academy with new token
    await prisma.academy.update({
      where: { academy_id: academy.academy_id },
      data: {
        email_verification_token: verificationToken,
        email_verification_expiry: verificationExpiry
      }
    });

    // TODO: Send verification email
    // const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/verify-email?token=${verificationToken}`;
    // Send email with verificationUrl

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.',
      verificationToken // For testing purposes - remove in production
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email', details: error.message },
      { status: 500 }
    );
  }
}

