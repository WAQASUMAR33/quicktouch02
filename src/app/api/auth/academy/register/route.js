import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '@/lib/auth';

// POST /api/auth/academy/register - Register a new academy
export async function POST(req) {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      description,
      website 
    } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if academy with this email already exists
    const existingAcademy = await prisma.academy.findUnique({
      where: { email }
    });

    if (existingAcademy) {
      return NextResponse.json(
        { error: 'An academy with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create academy
    const academy = await prisma.academy.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        description,
        website,
        email_verification_token: verificationToken,
        email_verification_expiry: verificationExpiry,
        email_verified: false,
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

    // Generate JWT token for the academy
    const token = generateToken({
      academy_id: academy.academy_id,
      email: academy.email,
      name: academy.name,
      type: 'academy'
    });

    // TODO: Send verification email
    // You can implement email sending here using services like:
    // - Nodemailer
    // - SendGrid
    // - AWS SES
    // const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/verify-email?token=${verificationToken}`;

    return NextResponse.json({
      success: true,
      message: 'Academy registered successfully. Please check your email to verify your account.',
      academy,
      token,
      verificationToken // For testing purposes - remove in production
    }, { status: 201 });

  } catch (error) {
    console.error('Academy registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register academy', details: error.message },
      { status: 500 }
    );
  }
}

