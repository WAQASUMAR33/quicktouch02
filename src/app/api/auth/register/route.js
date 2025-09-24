import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, generateToken, getUserById } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { full_name, email, phone, role, academy_id, password } = await request.json();
    
    // Validate required fields
    if (!full_name || !email || !role || !password) {
      return NextResponse.json(
        { error: 'Full name, email, role, and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const user = await createUser({
      full_name,
      email,
      phone,
      role,
      academy_id,
      password: hashedPassword
    });
    
    // User is already created above
    
    // Generate JWT token
    const token = generateToken(user);
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

