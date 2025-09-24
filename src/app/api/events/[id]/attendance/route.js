import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/events/[id]/attendance - Get event attendance
export const GET = requireAuth(async (req, { params }) => {
  try {
    const eventId = parseInt(params.id);

    const attendance = await prisma.attendance.findMany({
      where: { event_id: eventId },
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
        }
      },
      orderBy: {
        player: {
          user: {
            full_name: 'asc'
          }
        }
      }
    });

    // Get event details
    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
      select: {
        title: true,
        type: true,
        event_date: true,
        location: true
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      event,
      attendance,
      summary: {
        total_players: attendance.length,
        present_count: attendance.filter(a => a.present).length,
        absent_count: attendance.filter(a => !a.present).length
      }
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
});

// POST /api/events/[id]/attendance - Mark attendance
export const POST = requireRole(['coach', 'admin'])(async (req, { params }) => {
  try {
    const eventId = parseInt(params.id);
    const { 
      player_id, 
      present, 
      performance_rating, 
      notes 
    } = await req.json();

    if (!player_id || present === undefined) {
      return NextResponse.json(
        { error: 'Player ID and present status are required' },
        { status: 400 }
      );
    }

    // Validate performance rating if provided
    if (performance_rating !== undefined && 
        (performance_rating < 0 || performance_rating > 10)) {
      return NextResponse.json(
        { error: 'Performance rating must be between 0 and 10' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { event_id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
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

    // Check if attendance record already exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        event_id_player_id: {
          event_id: eventId,
          player_id: parseInt(player_id)
        }
      }
    });

    let attendance;
    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.attendance.update({
        where: {
          event_id_player_id: {
            event_id: eventId,
            player_id: parseInt(player_id)
          }
        },
        data: {
          present,
          performance_rating: performance_rating ? parseFloat(performance_rating) : null,
          notes
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
    } else {
      // Create new attendance record
      attendance = await prisma.attendance.create({
        data: {
          event_id: eventId,
          player_id: parseInt(player_id),
          present,
          performance_rating: performance_rating ? parseFloat(performance_rating) : null,
          notes
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
    }

    return NextResponse.json({
      success: true,
      attendance,
      message: existingAttendance ? 'Attendance updated successfully' : 'Attendance recorded successfully'
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    );
  }
});

// PUT /api/events/[id]/attendance/bulk - Bulk update attendance
export const PUT = requireRole(['coach', 'admin'])(async (req, { params }) => {
  try {
    const eventId = parseInt(params.id);
    const { attendance_records } = await req.json();

    if (!attendance_records || !Array.isArray(attendance_records)) {
      return NextResponse.json(
        { error: 'Attendance records array is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { event_id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Process each attendance record
    const results = await Promise.all(
      attendance_records.map(async (record) => {
        const { player_id, present, performance_rating, notes } = record;

        return await prisma.attendance.upsert({
          where: {
            event_id_player_id: {
              event_id: eventId,
              player_id: parseInt(player_id)
            }
          },
          update: {
            present,
            performance_rating: performance_rating ? parseFloat(performance_rating) : null,
            notes
          },
          create: {
            event_id: eventId,
            player_id: parseInt(player_id),
            present,
            performance_rating: performance_rating ? parseFloat(performance_rating) : null,
            notes
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      updated_count: results.length,
      message: 'Bulk attendance update completed successfully'
    });

  } catch (error) {
    console.error('Error bulk updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update attendance' },
      { status: 500 }
    );
  }
});
