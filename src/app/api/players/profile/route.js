import { NextResponse } from 'next/server';
import { getPlayerProfileByUserId, updatePlayerProfile } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/players/profile - Get player profile by user ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await getPlayerProfileByUserId(parseInt(userId));

    if (!profile) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        player_id: profile.player_id,
        user_id: profile.user_id,
        age: profile.age,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        position: profile.position,
        preferred_foot: profile.preferred_foot,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        user: profile.user
      }
    });

  } catch (error) {
    console.error('Error fetching player profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player profile' },
      { status: 500 }
    );
  }
}

// PUT /api/players/profile - Update player profile
export async function PUT(req) {
  try {
    const { 
      player_id,
      age, 
      height_cm, 
      position, 
      weight_kg, 
      preferred_foot 
    } = await req.json();

    if (!player_id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Validate age if provided
    if (age !== undefined && (age < 5 || age > 50)) {
      return NextResponse.json(
        { error: 'Age must be between 5 and 50' },
        { status: 400 }
      );
    }

    // Validate height if provided
    if (height_cm !== undefined && (height_cm < 100 || height_cm > 250)) {
      return NextResponse.json(
        { error: 'Height must be between 100cm and 250cm' },
        { status: 400 }
      );
    }

    // Validate position if provided
    const validPositions = [
      'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker',
      'Left Back', 'Right Back', 'Center Back', 'Left Midfielder',
      'Right Midfielder', 'Center Midfielder', 'Left Winger',
      'Right Winger', 'Attacking Midfielder', 'Defensive Midfielder'
    ];
    
    if (position && !validPositions.includes(position)) {
      return NextResponse.json(
        { error: 'Invalid position. Must be one of: ' + validPositions.join(', ') },
        { status: 400 }
      );
    }

    // Validate preferred foot if provided
    const validFeet = ['Left', 'Right', 'Both'];
    if (preferred_foot && !validFeet.includes(preferred_foot)) {
      return NextResponse.json(
        { error: 'Preferred foot must be Left, Right, or Both' },
        { status: 400 }
      );
    }

    const updatedProfile = await updatePlayerProfile(parseInt(player_id), {
      age,
      height_cm,
      position,
      weight_kg,
      preferred_foot
    });

    return NextResponse.json({
      success: true,
      profile: {
        player_id: updatedProfile.player_id,
        user_id: updatedProfile.user_id,
        age: updatedProfile.age,
        height_cm: updatedProfile.height_cm,
        weight_kg: updatedProfile.weight_kg,
        position: updatedProfile.position,
        preferred_foot: updatedProfile.preferred_foot,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at
      },
      message: 'Player profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating player profile:', error);
    return NextResponse.json(
      { error: 'Failed to update player profile' },
      { status: 500 }
    );
  }
}
