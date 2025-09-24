import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/players/[id]/videos - Get player highlight videos
export async function GET(request, { params }) {
  try {
    const playerId = parseInt(params.id);

    const videos = await prisma.highlightVideo.findMany({
      where: { player_id: playerId },
      orderBy: { uploaded_at: 'desc' }
    });

    return NextResponse.json({ videos });

  } catch (error) {
    console.error('Error fetching player videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player videos' },
      { status: 500 }
    );
  }
}

// POST /api/players/[id]/videos - Upload new highlight video
export const POST = requireAuth(async (req, { params }) => {
  try {
    const playerId = parseInt(params.id);
    const { video_url, description } = await req.json();
    const userId = req.user.userId;

    if (!video_url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Check if user owns this player profile or is coach/admin
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { player_id: playerId },
      include: { user: true }
    });

    if (!playerProfile) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Only allow player themselves, coaches, or admins to upload videos
    if (playerProfile.user_id !== userId && 
        !['coach', 'admin'].includes(req.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to upload videos for this player' },
        { status: 403 }
      );
    }

    const video = await prisma.highlightVideo.create({
      data: {
        player_id: playerId,
        video_url,
        description
      }
    });

    return NextResponse.json({
      success: true,
      video,
      message: 'Video uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
});

// DELETE /api/players/[id]/videos/[videoId] - Delete highlight video
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = parseInt(searchParams.get('videoId'));

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const video = await prisma.highlightVideo.findUnique({
      where: { video_id: videoId },
      include: { 
        player: { 
          include: { user: true } 
        } 
      }
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    await prisma.highlightVideo.delete({
      where: { video_id: videoId }
    });

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
