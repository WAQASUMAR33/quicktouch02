import { NextResponse } from 'next/server';
import { requireRole, getTrainingProgramById, updateTrainingProgram, deleteTrainingProgram } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/training-programs/[id] - Get specific training program (Admin only)
export async function GET(request, { params }) {
  try {
    const planId = parseInt(params.id);
    
    if (isNaN(planId)) {
      return NextResponse.json(
        { error: 'Invalid training program ID' },
        { status: 400 }
      );
    }
    
    const trainingProgram = await getTrainingProgramById(planId);
    
    if (!trainingProgram) {
      return NextResponse.json(
        { error: 'Training program not found' },
        { status: 404 }
      );
    }
    
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
        updated_at: trainingProgram.updated_at,
        coach: trainingProgram.coach,
        academy: trainingProgram.academy
      }
    });
    
  } catch (error) {
    console.error('Error fetching training program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/training-programs/[id] - Update training program
export async function PUT(request, { params }) {
  try {
    const planId = parseInt(params.id);
    
    if (isNaN(planId)) {
      return NextResponse.json(
        { error: 'Invalid training program ID' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Validate title_type if provided
    if (updateData.title_type) {
      const validTitleTypes = ['Match', 'TrainingProgram', 'Drill'];
      if (!validTitleTypes.includes(updateData.title_type)) {
        return NextResponse.json(
          { error: 'Title type must be one of: Match, TrainingProgram, Drill' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (updateData.status && !['upcoming', 'Complete'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Status must be either "upcoming" or "Complete"' },
        { status: 400 }
      );
    }
    
    // Check if training program exists
    const existingProgram = await getTrainingProgramById(planId);
    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Training program not found' },
        { status: 404 }
      );
    }
    
    // Convert program_date to Date object if provided
    if (updateData.program_date) {
      updateData.program_date = new Date(updateData.program_date);
    }
    
    const updatedProgram = await updateTrainingProgram(planId, updateData);
    
    return NextResponse.json({
      success: true,
      training_program: {
        plan_id: updatedProgram.plan_id,
        title: updatedProgram.title,
        title_type: updatedProgram.title_type,
        venue: updatedProgram.venue,
        program_date: updatedProgram.program_date,
        program_time: updatedProgram.program_time,
        details: updatedProgram.details,
        status: updatedProgram.status,
        video_url: updatedProgram.video_url,
        academy_id: updatedProgram.academy_id,
        coach_id: updatedProgram.coach_id,
        created_at: updatedProgram.created_at,
        updated_at: updatedProgram.updated_at
      },
      message: 'Training program updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating training program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/training-programs/[id] - Delete training program
export async function DELETE(request, { params }) {
  try {
    const planId = parseInt(params.id);
    
    if (isNaN(planId)) {
      return NextResponse.json(
        { error: 'Invalid training program ID' },
        { status: 400 }
      );
    }
    
    // Check if training program exists
    const existingProgram = await getTrainingProgramById(planId);
    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Training program not found' },
        { status: 404 }
      );
    }
    
    await deleteTrainingProgram(planId);
    
    return NextResponse.json({
      success: true,
      message: 'Training program deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting training program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
