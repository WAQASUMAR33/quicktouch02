import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/scouts/[id]/favorites - Get scout's favorite players
export const GET = requireAuth(async (req, { params }) => {
  try {
    const scoutId = parseInt(params.id);
    const userId = req.user.userId;

    // Check if user owns this scout profile or is admin
    const scout = await prisma.scout.findUnique({
      where: { scout_id: scoutId },
      include: { user: true }
    });

    if (!scout) {
      return NextResponse.json(
        { error: 'Scout not found' },
        { status: 404 }
      );
    }

    if (scout.user_id !== userId && req.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to view these favorites' },
        { status: 403 }
      );
    }

    const favorites = await prisma.scoutFavorite.findMany({
      where: { scout_id: scoutId },
      include: {
        player: {
          include: {
            user: {
              select: {
                full_name: true,
                email: true,
                profile_pic: true
              }
            },
            player_stats: {
              select: {
                season: true,
                goals: true,
                assists: true,
                matches_played: true
              }
            },
            highlight_videos: {
              select: {
                video_id: true,
                video_url: true,
                description: true,
                uploaded_at: true
              },
              take: 3,
              orderBy: { uploaded_at: 'desc' }
            }
          }
        }
      },
      orderBy: { added_at: 'desc' }
    });

    return NextResponse.json({ favorites });

  } catch (error) {
    console.error('Error fetching scout favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scout favorites' },
      { status: 500 }
    );
  }
});

// POST /api/scouts/[id]/favorites - Add player to favorites
export const POST = requireAuth(async (req, { params }) => {
  try {
    const scoutId = parseInt(params.id);
    const userId = req.user.userId;
    const { player_id } = await req.json();

    if (!player_id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns this scout profile
    const scout = await prisma.scout.findUnique({
      where: { scout_id: scoutId }
    });

    if (!scout || scout.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to modify favorites' },
        { status: 403 }
      );
    }

    // Check if player exists
    const player = await prisma.playerProfile.findUnique({
      where: { player_id: player_id }
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Check if already in favorites
    const existingFavorite = await prisma.scoutFavorite.findUnique({
      where: {
        scout_id_player_id: {
          scout_id: scoutId,
          player_id: player_id
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Player already in favorites' },
        { status: 409 }
      );
    }

    const favorite = await prisma.scoutFavorite.create({
      data: {
        scout_id: scoutId,
        player_id: player_id
      }
    });

    return NextResponse.json({
      success: true,
      favorite,
      message: 'Player added to favorites'
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add player to favorites' },
      { status: 500 }
    );
  }
});

// DELETE /api/scouts/[id]/favorites - Remove player from favorites
export const DELETE = requireAuth(async (req, { params }) => {
  try {
    const scoutId = parseInt(params.id);
    const userId = req.user.userId;
    const { searchParams } = new URL(req.url);
    const playerId = parseInt(searchParams.get('playerId'));

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns this scout profile
    const scout = await prisma.scout.findUnique({
      where: { scout_id: scoutId }
    });

    if (!scout || scout.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to modify favorites' },
        { status: 403 }
      );
    }

    const favorite = await prisma.scoutFavorite.findUnique({
      where: {
        scout_id_player_id: {
          scout_id: scoutId,
          player_id: playerId
        }
      }
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    await prisma.scoutFavorite.delete({
      where: {
        scout_id_player_id: {
          scout_id: scoutId,
          player_id: playerId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Player removed from favorites'
    });

  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove player from favorites' },
      { status: 500 }
    );
  }
});
