import { NextResponse } from 'next/server';
import { getPlayerReelById, updatePlayerReel, deletePlayerReel } from '@/lib/auth';

// GET /api/players/reels/[id] - Get specific player reel
export async function GET(request, { params }) {
  try {
    const reelId = parseInt(params.id);
    
    if (isNaN(reelId)) {
      return NextResponse.json(
        { error: 'Invalid reel ID' },
        { status: 400 }
      );
    }
    
    const reel = await getPlayerReelById(reelId);
    
    if (!reel) {
      return NextResponse.json(
        { error: 'Player reel not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      reel: {
        reel_id: reel.reel_id,
        player_id: reel.player_id,
        academy_id: reel.academy_id,
        video_url: reel.video_url,
        title: reel.title,
        created_at: reel.created_at,
        updated_at: reel.updated_at,
        player: reel.player,
        academy: reel.academy
      }
    });
    
  } catch (error) {
    console.error('Error fetching player reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/players/reels/[id] - Update player reel
export async function PUT(request, { params }) {
  try {
    const reelId = parseInt(params.id);
    
    if (isNaN(reelId)) {
      return NextResponse.json(
        { error: 'Invalid reel ID' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Check if reel exists
    const existingReel = await getPlayerReelById(reelId);
    if (!existingReel) {
      return NextResponse.json(
        { error: 'Player reel not found' },
        { status: 404 }
      );
    }

    // Validate video URL format if provided
    if (updateData.video_url) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(updateData.video_url)) {
        return NextResponse.json(
          { error: 'Invalid video URL format' },
          { status: 400 }
        );
      }
    }
    
    const updatedReel = await updatePlayerReel(reelId, updateData);
    
    return NextResponse.json({
      success: true,
      reel: {
        reel_id: updatedReel.reel_id,
        player_id: updatedReel.player_id,
        academy_id: updatedReel.academy_id,
        video_url: updatedReel.video_url,
        title: updatedReel.title,
        created_at: updatedReel.created_at,
        updated_at: updatedReel.updated_at
      },
      message: 'Player reel updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating player reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/players/reels/[id] - Delete player reel
export async function DELETE(request, { params }) {
  try {
    const reelId = parseInt(params.id);
    
    if (isNaN(reelId)) {
      return NextResponse.json(
        { error: 'Invalid reel ID' },
        { status: 400 }
      );
    }
    
    // Check if reel exists
    const existingReel = await getPlayerReelById(reelId);
    if (!existingReel) {
      return NextResponse.json(
        { error: 'Player reel not found' },
        { status: 404 }
      );
    }
    
    await deletePlayerReel(reelId);
    
    return NextResponse.json({
      success: true,
      message: 'Player reel deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting player reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
