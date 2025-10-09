import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

// POST /api/auth/academy/forgot-password - Request password reset
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

    // Always return success to prevent email enumeration
    if (!academy) {
      return NextResponse.json({
        success: true,
        message: 'If an academy with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save hashed token to database
    await prisma.academy.update({
      where: { academy_id: academy.academy_id },
      data: {
        reset_token: hashedToken,
        reset_token_expiry: resetExpiry
      }
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(academy.email, academy.name, resetToken);
      console.log('Password reset email sent successfully to:', academy.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't reveal if email failed for security reasons
    }

    return NextResponse.json({
      success: true,
      message: 'If an academy with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request', details: error.message },
      { status: 500 }
    );
  }
}

