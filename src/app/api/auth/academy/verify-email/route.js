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

    console.log('📧 Verifying email with token:', token);
    console.log('🔍 Looking for academy with this token...');

    // Find academy with this verification token (stored as plain text)
    const academy = await prisma.academy.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!academy) {
      console.log('❌ No academy found or token expired');
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    console.log('✅ Academy found:', academy.email);

    // Update academy - mark as verified and clear token
    await prisma.academy.update({
      where: { academy_id: academy.academy_id },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_expiry: null
      }
    });

    console.log('✅ Email verified successfully for:', academy.email);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      academy: {
        academy_id: academy.academy_id,
        name: academy.name,
        email: academy.email
      }
    });

  } catch (error) {
    console.error('❌ Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email', details: error.message },
      { status: 500 }
    );
  }
}
