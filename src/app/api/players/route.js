import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/players - Get all players with optional filtering
export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const age = searchParams.get('age');
    const position = searchParams.get('position');
    const minGoals = searchParams.get('minGoals');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    // Build where clause
    const where = {
      role: 'player',
      player_profile: {
        ...(age && { age: parseInt(age) }),
        ...(position && { position })
      }
    };
    
    const players = await prisma.user.findMany({
      where,
      include: {
        player_profile: {
          include: {
            player_stats: {
              select: {
                goals: true,
                assists: true,
                matches_played: true
              }
            }
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    });
    
    // Transform data and calculate totals
    const transformedPlayers = players.map(player => {
      const totalStats = player.player_profile?.player_stats.reduce((totals, stat) => ({
        goals: totals.goals + stat.goals,
        assists: totals.assists + stat.assists,
        matches: totals.matches + stat.matches_played
      }), { goals: 0, assists: 0, matches: 0 }) || { goals: 0, assists: 0, matches: 0 };
      
      return {
        user_id: player.user_id,
        full_name: player.full_name,
        email: player.email,
        phone: player.phone,
        profile_pic: player.profile_pic,
        created_at: player.created_at,
        player_id: player.player_profile?.player_id,
        age: player.player_profile?.age,
        height_cm: player.player_profile?.height_cm,
        weight_kg: player.player_profile?.weight_kg,
        position: player.player_profile?.position,
        preferred_foot: player.player_profile?.preferred_foot,
        total_goals: totalStats.goals,
        total_assists: totalStats.assists,
        total_matches: totalStats.matches
      };
    });
    
    // Filter by minGoals if specified
    const filteredPlayers = minGoals 
      ? transformedPlayers.filter(player => player.total_goals >= parseInt(minGoals))
      : transformedPlayers;
    
    return NextResponse.json({ players: filteredPlayers });
    
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
});

// POST /api/players - Create new player profile
export const POST = requireAuth(async (req) => {
  try {
    const user = req.user;
    const playerData = await req.json();
    
    const {
      age,
      height_cm,
      weight_kg,
      position,
      preferred_foot
    } = playerData;
    
    // Check if user already has a player profile
    const existingProfile = await prisma.playerProfile.findUnique({
      where: { user_id: user.userId }
    });
    
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Player profile already exists' },
        { status: 409 }
      );
    }
    
    // Create player profile
    const playerProfile = await prisma.playerProfile.create({
      data: {
        user_id: user.userId,
        age,
        height_cm,
        weight_kg,
        position,
        preferred_foot
      }
    });
    
    return NextResponse.json({
      success: true,
      playerId: playerProfile.player_id,
      message: 'Player profile created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating player profile:', error);
    return NextResponse.json(
      { error: 'Failed to create player profile' },
      { status: 500 }
    );
  }
});
