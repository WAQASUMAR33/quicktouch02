import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/players/[id]/stats - Get player statistics
export async function GET(request, { params }) {
  try {
    const playerId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');

    const whereClause = { player_id: playerId };
    if (season) {
      whereClause.season = season;
    }

    const stats = await prisma.playerStat.findMany({
      where: whereClause,
      orderBy: { season: 'desc' }
    });

    // Calculate totals
    const totals = stats.reduce((acc, stat) => ({
      matches_played: acc.matches_played + stat.matches_played,
      goals: acc.goals + stat.goals,
      assists: acc.assists + stat.assists,
      minutes_played: acc.minutes_played + stat.minutes_played
    }), { matches_played: 0, goals: 0, assists: 0, minutes_played: 0 });

    return NextResponse.json({ 
      stats, 
      totals,
      seasons: [...new Set(stats.map(s => s.season))]
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player stats' },
      { status: 500 }
    );
  }
}

// POST /api/players/[id]/stats - Add/Update player statistics
export const POST = requireRole(['coach', 'admin'])(async (req, { params }) => {
  try {
    const playerId = parseInt(params.id);
    const { 
      season, 
      matches_played, 
      goals, 
      assists, 
      minutes_played 
    } = await req.json();

    if (!season) {
      return NextResponse.json(
        { error: 'Season is required' },
        { status: 400 }
      );
    }

    // Check if stats for this season already exist
    const existingStat = await prisma.playerStat.findUnique({
      where: {
        player_id_season: {
          player_id: playerId,
          season: season
        }
      }
    });

    let playerStat;
    if (existingStat) {
      // Update existing stats
      playerStat = await prisma.playerStat.update({
        where: {
          player_id_season: {
            player_id: playerId,
            season: season
          }
        },
        data: {
          matches_played: matches_played || existingStat.matches_played,
          goals: goals || existingStat.goals,
          assists: assists || existingStat.assists,
          minutes_played: minutes_played || existingStat.minutes_played
        }
      });
    } else {
      // Create new stats
      playerStat = await prisma.playerStat.create({
        data: {
          player_id: playerId,
          season,
          matches_played: matches_played || 0,
          goals: goals || 0,
          assists: assists || 0,
          minutes_played: minutes_played || 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      stat: playerStat,
      message: existingStat ? 'Stats updated successfully' : 'Stats created successfully'
    });

  } catch (error) {
    console.error('Error creating/updating player stats:', error);
    return NextResponse.json(
      { error: 'Failed to create/update player stats' },
      { status: 500 }
    );
  }
});
