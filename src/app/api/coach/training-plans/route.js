import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/coach/training-plans - Get training plans
export const GET = requireRole(['coach', 'admin', 'player'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    if (req.user.role === 'coach') {
      whereClause.coach_id = req.user.userId;
    }

    const trainingPlans = await prisma.trainingPlan.findMany({
      where: whereClause,
      include: {
        coach: {
          select: {
            full_name: true,
            email: true,
            profile_pic: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ training_plans: trainingPlans });

  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plans' },
      { status: 500 }
    );
  }
});

// POST /api/coach/training-plans - Create new training plan
export const POST = requireRole(['coach'])(async (req) => {
  try {
    const coachId = req.user.userId;
    const { title, description, video_url } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const trainingPlan = await prisma.trainingPlan.create({
      data: {
        coach_id: coachId,
        title,
        description,
        video_url
      },
      include: {
        coach: {
          select: {
            full_name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      training_plan: trainingPlan,
      message: 'Training plan created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to create training plan' },
      { status: 500 }
    );
  }
});

// PUT /api/coach/training-plans/[id] - Update training plan
export const PUT = requireRole(['coach'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const planId = parseInt(searchParams.get('id'));
    const coachId = req.user.userId;
    const { title, description, video_url } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Check if plan exists and belongs to coach
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { plan_id: planId }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    if (existingPlan.coach_id !== coachId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this training plan' },
        { status: 403 }
      );
    }

    const updatedPlan = await prisma.trainingPlan.update({
      where: { plan_id: planId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(video_url && { video_url })
      },
      include: {
        coach: {
          select: {
            full_name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      training_plan: updatedPlan,
      message: 'Training plan updated successfully'
    });

  } catch (error) {
    console.error('Error updating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to update training plan' },
      { status: 500 }
    );
  }
});

// DELETE /api/coach/training-plans/[id] - Delete training plan
export const DELETE = requireRole(['coach'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const planId = parseInt(searchParams.get('id'));
    const coachId = req.user.userId;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Check if plan exists and belongs to coach
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { plan_id: planId }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    if (existingPlan.coach_id !== coachId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this training plan' },
        { status: 403 }
      );
    }

    await prisma.trainingPlan.delete({
      where: { plan_id: planId }
    });

    return NextResponse.json({
      success: true,
      message: 'Training plan deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting training plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete training plan' },
      { status: 500 }
    );
  }
});
