import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
const { sendVerificationEmail } = require('@/lib/email');

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

    // Send verification email
    try {
      await sendVerificationEmail(academy.email, academy.name, verificationToken);
      console.log('Verification email resent successfully to:', academy.email);
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email', details: emailError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email', details: error.message },
      { status: 500 }
    );
  }
}

