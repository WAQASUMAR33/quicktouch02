import { NextResponse } from 'next/server';
import { createPlayerReel, getAllPlayerReels, getPlayerReelsByPlayer, getPlayerReelsByAcademy } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/players/reels - Get player reels
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get('player_id');
    const academyId = searchParams.get('academy_id');

    let reels;

    if (playerId) {
      // Get reels for specific player
      reels = await getPlayerReelsByPlayer(parseInt(playerId));
    } else if (academyId) {
      // Get reels for specific academy
      reels = await getPlayerReelsByAcademy(parseInt(academyId));
    } else {
      // Get all reels
      reels = await getAllPlayerReels();
    }

    return NextResponse.json({
      success: true,
      reels: reels,
      filters: {
        player_id: playerId,
        academy_id: academyId
      }
    });

  } catch (error) {
    console.error('Error fetching player reels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player reels' },
      { status: 500 }
    );
  }
}

// POST /api/players/reels - Create new player reel
export async function POST(req) {
  try {
    const { 
      player_id,
      academy_id,
      video_url,
      title
    } = await req.json();

    // Validate required fields
    if (!player_id || !academy_id || !video_url || !title) {
      return NextResponse.json(
        { error: 'Player ID, academy ID, video URL, and title are required' },
        { status: 400 }
      );
    }

    // Validate video URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(video_url)) {
      return NextResponse.json(
        { error: 'Invalid video URL format' },
        { status: 400 }
      );
    }

    // Check if player exists
    const player = await prisma.playerProfile.findUnique({
      where: { player_id: parseInt(player_id) }
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Check if academy exists
    const academy = await prisma.academy.findUnique({
      where: { academy_id: parseInt(academy_id) }
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    const reel = await createPlayerReel({
      player_id: parseInt(player_id),
      academy_id: parseInt(academy_id),
      video_url,
      title
    });

    return NextResponse.json({
      success: true,
      reel: {
        reel_id: reel.reel_id,
        player_id: reel.player_id,
        academy_id: reel.academy_id,
        video_url: reel.video_url,
        title: reel.title,
        created_at: reel.created_at,
        updated_at: reel.updated_at
      },
      message: 'Player reel uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating player reel:', error);
    return NextResponse.json(
      { error: 'Failed to create player reel' },
      { status: 500 }
    );
  }
}
