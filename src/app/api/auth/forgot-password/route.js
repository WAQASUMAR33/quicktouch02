import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/auth/forgot-password - Request password reset
export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Security: Always return success message even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, you will receive password reset instructions shortly.'
      });
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Store reset token in database
    await prisma.user.update({
      where: { email },
      data: {
        reset_token: resetTokenHash,
        reset_token_expiry: resetTokenExpiry
      }
    });

    // In a production environment, you would send an email here
    // For now, we'll log the reset link to the console
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academy/reset-password?token=${resetToken}&email=${email}`;
    
    console.log('='.repeat(80));
    console.log('PASSWORD RESET REQUEST');
    console.log('='.repeat(80));
    console.log(`Email: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log(`Token expires: ${resetTokenExpiry.toLocaleString()}`);
    console.log('='.repeat(80));
    console.log('\n⚠️  In production, this link would be sent via email.\n');

    // TODO: Send email with reset link
    // Example: await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, you will receive password reset instructions shortly.',
      // In development, include the reset link in the response
      ...(process.env.NODE_ENV === 'development' && { 
        resetLink,
        note: 'This reset link is only shown in development mode. In production, it will be sent via email.'
      })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/forgot-password - Get information about forgot password functionality
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/auth/forgot-password',
    method: 'POST',
    description: 'Request a password reset link',
    requiredFields: ['email'],
    tokenExpiry: '1 hour',
    note: 'In development mode, the reset link will be returned in the response and logged to console. In production, it will be sent via email.'
  });
}

