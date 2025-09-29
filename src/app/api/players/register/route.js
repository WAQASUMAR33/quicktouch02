import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const {
      // User fields
      full_name,
      email,
      phone,
      password,
      academy_id,
      
      // Player profile fields
      age,
      height_cm,
      weight_kg,
      position,
      preferred_foot
    } = await request.json();
    
    // Validate required fields
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
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

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate age if provided
    if (age && (age < 5 || age > 50)) {
      return NextResponse.json(
        { error: 'Age must be between 5 and 50' },
        { status: 400 }
      );
    }

    // Validate height if provided
    if (height_cm && (height_cm < 100 || height_cm > 250)) {
      return NextResponse.json(
        { error: 'Height must be between 100cm and 250cm' },
        { status: 400 }
      );
    }

    // Validate weight if provided
    if (weight_kg && (weight_kg < 20 || weight_kg > 150)) {
      return NextResponse.json(
        { error: 'Weight must be between 20kg and 150kg' },
        { status: 400 }
      );
    }

    // Validate position if provided
    const validPositions = [
      'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger',
      'Center Back', 'Full Back', 'Defensive Midfielder', 'Attacking Midfielder',
      'Striker', 'Left Wing', 'Right Wing'
    ];
    if (position && !validPositions.includes(position)) {
      return NextResponse.json(
        { error: `Invalid position. Valid positions: ${validPositions.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate preferred foot if provided
    const validFeet = ['Left', 'Right'];
    if (preferred_foot && !validFeet.includes(preferred_foot)) {
      return NextResponse.json(
        { error: 'Preferred foot must be either "Left" or "Right"' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user and player profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          full_name,
          email,
          phone,
          role: 'player',
          academy_id: academy_id || null,
          password: hashedPassword
        }
      });

      // Create player profile
      const playerProfile = await tx.playerProfile.create({
        data: {
          user_id: user.user_id,
          age: age || null,
          height_cm: height_cm || null,
          weight_kg: weight_kg || null,
          position: position || null,
          preferred_foot: preferred_foot || null
        }
      });

      return { user, playerProfile };
    });

    // Generate JWT token
    const token = generateToken(result.user);
    
    return NextResponse.json({
      success: true,
      message: 'Player registered successfully',
      token,
      user: {
        userId: result.user.user_id,
        email: result.user.email,
        role: result.user.role,
        fullName: result.user.full_name,
        academyId: result.user.academy_id
      },
      playerProfile: {
        playerId: result.playerProfile.player_id,
        age: result.playerProfile.age,
        heightCm: result.playerProfile.height_cm,
        weightKg: result.playerProfile.weight_kg,
        position: result.playerProfile.position,
        preferredFoot: result.playerProfile.preferred_foot
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Player registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/players/register - Get registration form data (academies list, positions, etc.)
export async function GET() {
  try {
    // Get available academies
    const academies = await prisma.academy.findMany({
      where: {
        is_active: true
      },
      select: {
        academy_id: true,
        name: true,
        description: true,
        address: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Define valid positions
    const positions = [
      'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger',
      'Center Back', 'Full Back', 'Defensive Midfielder', 'Attacking Midfielder',
      'Striker', 'Left Wing', 'Right Wing'
    ];

    // Define preferred foot options
    const preferredFootOptions = ['Left', 'Right'];

    return NextResponse.json({
      academies,
      positions,
      preferredFootOptions,
      validationRules: {
        age: { min: 5, max: 50 },
        height: { min: 100, max: 250, unit: 'cm' },
        weight: { min: 20, max: 150, unit: 'kg' },
        password: { minLength: 6 }
      }
    });

  } catch (error) {
    console.error('Error fetching registration data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration data' },
      { status: 500 }
    );
  }
}
