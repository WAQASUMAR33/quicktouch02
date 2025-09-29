import { NextResponse } from 'next/server';
import { getUserByEmail, generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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
    
    // Get user from database with academy information
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        academy: {
          select: {
            academy_id: true,
            name: true,
            description: true
          }
        },
        player_profile: {
          select: {
            player_id: true,
            age: true,
            position: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user account is active (you can add an is_active field later)
    // if (!user.is_active) {
    //   return NextResponse.json(
    //     { error: 'Account is deactivated. Please contact support.' },
    //     { status: 403 }
    //   );
    // }
    
    // Generate JWT token with appropriate expiration
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = generateToken(user, tokenExpiry);
    
    // Prepare user data for response
    const userData = {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      phone: user.phone,
      profilePic: user.profile_pic,
      academyId: user.academy_id,
      academy: user.academy,
      playerProfile: user.player_profile,
      createdAt: user.created_at
    };

    // Log successful login (optional - for security monitoring)
    console.log(`User ${user.email} logged in successfully at ${new Date().toISOString()}`);
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
      expiresIn: tokenExpiry
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/login - Get login form data and validation rules
export async function GET() {
  try {
    return NextResponse.json({
      validationRules: {
        email: {
          required: true,
          format: 'email',
          message: 'Please enter a valid email address'
        },
        password: {
          required: true,
          minLength: 6,
          message: 'Password must be at least 6 characters long'
        }
      },
      features: {
        rememberMe: true,
        forgotPassword: false, // Can be enabled later
        socialLogin: false,    // Can be enabled later
        twoFactor: false       // Can be enabled later
      },
      supportedRoles: ['admin', 'coach', 'player', 'scout', 'parent']
    });
  } catch (error) {
    console.error('Error fetching login data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch login data' },
      { status: 500 }
    );
  }
}

