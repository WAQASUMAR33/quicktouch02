import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Checking player profiles in database...');
    
    // Get all player profiles
    const profiles = await prisma.playerProfile.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        player_id: 'asc'
      }
    });

    console.log('Found profiles:', profiles.length);
    
    // Get all users to see who could have profiles
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true
      },
      orderBy: {
        user_id: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      player_profiles: profiles,
      profiles_count: profiles.length,
      all_users: users,
      users_count: users.length,
      message: 'Player profiles and users retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error checking player profiles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check player profiles', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log('Creating a test player profile...');
    
    // Create a player profile for user_id=1
    const newProfile = await prisma.playerProfile.create({
      data: {
        user_id: 1,
        age: 16,
        height_cm: 175,
        weight_kg: 65,
        position: "Midfielder",
        preferred_foot: "Right"
      },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log('Created profile:', newProfile);
    
    return NextResponse.json({
      success: true,
      profile: newProfile,
      message: 'Test player profile created successfully'
    });
    
  } catch (error) {
    console.error('Error creating player profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create player profile', 
        details: error.message,
        errorName: error.name,
        errorCode: error.code
      },
      { status: 500 }
    );
  }
}
