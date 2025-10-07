import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/auth/reset-password - Reset password with token
export async function POST(request) {
  try {
    const { token, email, newPassword } = await request.json();

    // Validate required fields
    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: 'Token, email, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash the provided token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching email and valid reset token
    const user = await prisma.user.findFirst({
      where: {
        email,
        reset_token: resetTokenHash,
        reset_token_expiry: {
          gte: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset link.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      }
    });

    console.log(`Password successfully reset for user: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/reset-password - Get information about reset password functionality
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/auth/reset-password',
    method: 'POST',
    description: 'Reset password using a valid reset token',
    requiredFields: ['token', 'email', 'newPassword'],
    passwordRequirements: {
      minLength: 6
    },
    note: 'The reset token must be valid and not expired (1 hour expiry from request time)'
  });
}

