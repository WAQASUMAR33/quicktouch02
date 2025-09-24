import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/events - Get events
export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    if (type) {
      whereClause.type = type;
    }
    if (startDate && endDate) {
      whereClause.event_date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            full_name: true,
            email: true
          }
        },
        attendance: {
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
        }
      },
      skip: offset,
      take: limit,
      orderBy: { event_date: 'asc' }
    });

    return NextResponse.json({ events });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
});

// POST /api/events - Create new event
export const POST = requireRole(['coach', 'admin'])(async (req) => {
  try {
    const createdBy = req.user.userId;
    const { 
      title, 
      type, 
      event_date, 
      location, 
      description 
    } = await req.json();

    if (!title || !type || !event_date) {
      return NextResponse.json(
        { error: 'Title, type, and event date are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes = ['training', 'match', 'trial', 'showcase'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        type,
        event_date: new Date(event_date),
        location,
        description,
        created_by: createdBy
      },
      include: {
        creator: {
          select: {
            full_name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      event,
      message: 'Event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
});

// PUT /api/events/[id] - Update event
export const PUT = requireRole(['coach', 'admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = parseInt(searchParams.get('id'));
    const userId = req.user.userId;
    const updateData = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { event_id: eventId }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user can update this event
    if (existingEvent.created_by !== userId && req.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this event' },
        { status: 403 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { event_id: eventId },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.event_date && { event_date: new Date(updateData.event_date) }),
        ...(updateData.location && { location: updateData.location }),
        ...(updateData.description && { description: updateData.description })
      },
      include: {
        creator: {
          select: {
            full_name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully'
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
});

// DELETE /api/events/[id] - Delete event
export const DELETE = requireRole(['coach', 'admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = parseInt(searchParams.get('id'));
    const userId = req.user.userId;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { event_id: eventId }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this event
    if (existingEvent.created_by !== userId && req.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this event' },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { event_id: eventId }
    });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
});
