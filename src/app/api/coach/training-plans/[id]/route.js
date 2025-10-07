import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/coach/training-plans/[id] - Get single training plan
export async function GET(req, { params }) {
  try {
    const planId = parseInt(params.id);

    const plan = await prisma.trainingPlan.findUnique({
      where: { plan_id: planId },
      include: {
        coach: {
          select: {
            user_id: true,
            full_name: true,
            email: true
          }
        },
        academy: {
          select: {
            academy_id: true,
            name: true
          }
        }
      }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      training_plan: plan
    });

  } catch (error) {
    console.error('Error fetching training plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plan', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/coach/training-plans/[id] - Update training plan
export async function PUT(req, { params }) {
  try {
    const planId = parseInt(params.id);
    const { title, title_type, venue, program_date, program_time, details, status } = await req.json();

    // Validate required fields
    if (!title || !title_type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Validate title_type
    const validTitleTypes = ['Match', 'TrainingProgram', 'Drill'];
    if (!validTitleTypes.includes(title_type)) {
      return NextResponse.json(
        { error: 'Title type must be one of: Match, TrainingProgram, Drill' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['upcoming', 'Complete'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "upcoming" or "Complete"' },
        { status: 400 }
      );
    }

    // Check if plan exists
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { plan_id: planId }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Update training plan
    const plan = await prisma.trainingPlan.update({
      where: { plan_id: planId },
      data: {
        title,
        title_type,
        venue,
        program_date: program_date ? new Date(program_date) : null,
        program_time,
        details,
        status: status || 'upcoming'
      }
    });

    return NextResponse.json({
      success: true,
      training_plan: plan,
      message: 'Training plan updated successfully'
    });

  } catch (error) {
    console.error('Error updating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to update training plan', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/coach/training-plans/[id] - Delete training plan
export async function DELETE(req, { params }) {
  try {
    const planId = parseInt(params.id);

    // Check if plan exists
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { plan_id: planId }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Delete training plan
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
      { error: 'Failed to delete training plan', details: error.message },
      { status: 500 }
    );
  }
}

