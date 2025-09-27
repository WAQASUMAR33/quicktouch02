import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/test-training-plan - Test TrainingPlan table without authentication
export async function GET() {
  try {
    // Test if TrainingPlan table exists and has the new structure
    const trainingPlans = await prisma.trainingPlan.findMany({
      take: 1,
      select: {
        plan_id: true,
        title: true,
        title_type: true,
        venue: true,
        program_date: true,
        program_time: true,
        details: true,
        status: true,
        academy_id: true,
        coach_id: true,
        created_at: true,
        updated_at: true
      }
    });

    // Also test the academy relation
    const academies = await prisma.academy.findMany({
      take: 1,
      select: {
        academy_id: true,
        name: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'TrainingPlan table structure is correct',
      training_plans_count: trainingPlans.length,
      sample_training_plan: trainingPlans[0] || null,
      academies_available: academies.length,
      sample_academy: academies[0] || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('TrainingPlan test error:', error);
    return NextResponse.json({
      success: false,
      error: 'TrainingPlan table test failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST /api/test-training-plan - Test creating a training plan without authentication
export async function POST() {
  try {
    // Get the first academy and coach for testing
    const academy = await prisma.academy.findFirst();
    const coach = await prisma.user.findFirst({
      where: { role: 'coach' }
    });

    if (!academy || !coach) {
      return NextResponse.json({
        success: false,
        error: 'Missing academy or coach data',
        details: 'Need at least one academy and one coach to test creation'
      }, { status: 400 });
    }

    // Create a test training plan
    const testTrainingPlan = {
      coach_id: coach.user_id,
      academy_id: academy.academy_id,
      title: "Test Training Program",
      title_type: "TrainingProgram",
      venue: "Test Field",
      program_date: new Date(),
      program_time: "10:00 AM",
      details: "This is a test training program",
      status: "upcoming"
    };

    const createdPlan = await prisma.trainingPlan.create({
      data: testTrainingPlan,
      include: {
        coach: {
          select: {
            user_id: true,
            full_name: true
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

    return NextResponse.json({
      success: true,
      message: 'Training plan created successfully',
      training_plan: {
        plan_id: createdPlan.plan_id,
        title: createdPlan.title,
        title_type: createdPlan.title_type,
        venue: createdPlan.venue,
        program_date: createdPlan.program_date,
        program_time: createdPlan.program_time,
        details: createdPlan.details,
        status: createdPlan.status,
        academy_id: createdPlan.academy_id,
        coach_id: createdPlan.coach_id,
        coach_name: createdPlan.coach.full_name,
        academy_name: createdPlan.academy.name,
        created_at: createdPlan.created_at
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Training plan creation test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Training plan creation failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
