import { NextResponse } from 'next/server';
import { createTrainingProgram, getAllTrainingPrograms } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/coach/training-plans - Get training plans
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const academyId = searchParams.get('academy_id');

    let trainingPlans;

    if (academyId) {
      // Get training plans for a specific academy
      trainingPlans = await prisma.trainingPlan.findMany({
        where: { academy_id: parseInt(academyId) },
        include: {
          coach: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              profile_pic: true
            }
          },
          academy: {
            select: {
              academy_id: true,
              name: true
            }
          }
        },
        orderBy: [
          { program_date: 'asc' },
          { created_at: 'desc' }
        ]
      });
    } else {
      // Get all training plans
      trainingPlans = await getAllTrainingPrograms();
    }

    return NextResponse.json({ 
      success: true,
      training_plans: trainingPlans 
    });

  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training plans' },
      { status: 500 }
    );
  }
}

// POST /api/coach/training-plans - Create new training plan
export async function POST(req) {
  try {
    const { 
      coach_id,
      title, 
      title_type, 
      venue, 
      program_date, 
      program_time, 
      details, 
      academy_id, 
      status, 
      video_url 
    } = await req.json();

    // Validate required fields
    if (!title || !title_type || !academy_id || !coach_id) {
      return NextResponse.json(
        { error: 'Title, title type, academy ID, and coach ID are required' },
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

    const trainingPlan = await createTrainingProgram({
      coach_id: parseInt(coach_id),
      academy_id: parseInt(academy_id),
      title,
      title_type,
      venue,
      program_date: program_date ? new Date(program_date) : null,
      program_time,
      details,
      status: status || 'upcoming',
      video_url
    });

    return NextResponse.json({
      success: true,
      training_plan: {
        plan_id: trainingPlan.plan_id,
        title: trainingPlan.title,
        title_type: trainingPlan.title_type,
        venue: trainingPlan.venue,
        program_date: trainingPlan.program_date,
        program_time: trainingPlan.program_time,
        details: trainingPlan.details,
        status: trainingPlan.status,
        video_url: trainingPlan.video_url,
        academy_id: trainingPlan.academy_id,
        coach_id: trainingPlan.coach_id,
        created_at: trainingPlan.created_at,
        updated_at: trainingPlan.updated_at
      },
      message: 'Training program created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to create training plan' },
      { status: 500 }
    );
  }
}


