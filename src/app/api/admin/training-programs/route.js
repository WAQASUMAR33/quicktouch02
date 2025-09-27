import { NextResponse } from 'next/server';
import { requireRole, createTrainingProgram, getAllTrainingPrograms, updateTrainingProgram, deleteTrainingProgram } from '@/lib/auth';

// GET /api/admin/training-programs - Get all training programs (Admin only)
export const GET = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const academyId = searchParams.get('academy_id');
    const status = searchParams.get('status');
    const title_type = searchParams.get('title_type');

    let whereClause = {};
    
    if (academyId) {
      whereClause.academy_id = parseInt(academyId);
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (title_type) {
      whereClause.title_type = title_type;
    }

    let trainingPrograms;
    
    if (Object.keys(whereClause).length > 0) {
      // Filter training programs based on query parameters
      trainingPrograms = await prisma.trainingPlan.findMany({
        where: whereClause,
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
        },
        orderBy: [
          { program_date: 'asc' },
          { created_at: 'desc' }
        ]
      });
    } else {
      // Get all training programs
      trainingPrograms = await getAllTrainingPrograms();
    }

    return NextResponse.json({
      success: true,
      training_programs: trainingPrograms,
      filters: {
        academy_id: academyId,
        status: status,
        title_type: title_type
      }
    });

  } catch (error) {
    console.error('Error fetching training programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training programs' },
      { status: 500 }
    );
  }
});

// POST /api/admin/training-programs - Create new training program (Admin only)
export const POST = requireRole(['admin'])(async (req) => {
  try {
    const { 
      coach_id,
      academy_id,
      title, 
      title_type, 
      venue, 
      program_date, 
      program_time, 
      details, 
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

    const trainingProgram = await createTrainingProgram({
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
      training_program: {
        plan_id: trainingProgram.plan_id,
        title: trainingProgram.title,
        title_type: trainingProgram.title_type,
        venue: trainingProgram.venue,
        program_date: trainingProgram.program_date,
        program_time: trainingProgram.program_time,
        details: trainingProgram.details,
        status: trainingProgram.status,
        video_url: trainingProgram.video_url,
        academy_id: trainingProgram.academy_id,
        coach_id: trainingProgram.coach_id,
        created_at: trainingProgram.created_at,
        updated_at: trainingProgram.updated_at
      },
      message: 'Training program uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating training program:', error);
    return NextResponse.json(
      { error: 'Failed to create training program' },
      { status: 500 }
    );
  }
});
