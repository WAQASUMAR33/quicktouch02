import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/coach/feedback - Get coach's feedback records
export const GET = requireRole(['coach', 'admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get('playerId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    if (req.user.role === 'coach') {
      whereClause.coach_id = req.user.userId;
    }
    if (playerId) {
      whereClause.player_id = parseInt(playerId);
    }

    const feedback = await prisma.coachFeedback.findMany({
      where: whereClause,
      include: {
        player: {
          include: {
            user: {
              select: {
                full_name: true,
                email: true,
                profile_pic: true
              }
            }
          }
        },
        coach: {
          select: {
            full_name: true,
            email: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { feedback_date: 'desc' }
    });

    return NextResponse.json({ feedback });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
});

// POST /api/coach/feedback - Create new feedback
export const POST = requireRole(['coach'])(async (req) => {
  try {
    const coachId = req.user.userId;
    const { 
      player_id, 
      rating, 
      notes, 
      feedback_date 
    } = await req.json();

    if (!player_id || !rating || !feedback_date) {
      return NextResponse.json(
        { error: 'Player ID, rating, and feedback date are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 0 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 10' },
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

    const feedback = await prisma.coachFeedback.create({
      data: {
        player_id: parseInt(player_id),
        coach_id: coachId,
        rating: parseFloat(rating),
        notes,
        feedback_date: new Date(feedback_date)
      },
      include: {
        player: {
          include: {
            user: {
              select: {
                full_name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      feedback,
      message: 'Feedback created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
});
