import { NextResponse } from 'next/server';
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/events - Get all events
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (type) {
      whereClause.type = type;
    }

    let events;
    
    if (Object.keys(whereClause).length > 0) {
      // Filter events based on query parameters
      events = await prisma.event.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              user_id: true,
              full_name: true,
              email: true
            }
          }
        },
        orderBy: [
          { event_date: 'asc' },
          { created_at: 'desc' }
        ]
      });
    } else {
      // Get all events
      events = await getAllEvents();
    }

    return NextResponse.json({
      success: true,
      events: events,
      filters: {
        status: status,
        type: type
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/admin/events - Create new event
export async function POST(req) {
  try {
    const { 
      title, 
      type, 
      event_date, 
      event_time, 
      location, 
      description, 
      status, 
      created_by 
    } = await req.json();

    // Validate required fields
    if (!title || !type || !event_date || !created_by) {
      return NextResponse.json(
        { error: 'Title, type, event date, and created_by are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['training', 'match', 'Trial', 'Showcase', 'GuestSessions'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: training, match, Trial, Showcase, GuestSessions' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['Pending', 'Complete'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "Pending" or "Complete"' },
        { status: 400 }
      );
    }

    const event = await createEvent({
      title,
      type,
      event_date: new Date(event_date),
      event_time,
      location,
      description,
      status: status || 'Pending',
      created_by: parseInt(created_by)
    });

    return NextResponse.json({
      success: true,
      event: {
        event_id: event.event_id,
        title: event.title,
        type: event.type,
        event_date: event.event_date,
        event_time: event.event_time,
        location: event.location,
        description: event.description,
        status: event.status,
        created_by: event.created_by,
        created_at: event.created_at,
        updated_at: event.updated_at
      },
      message: 'Event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
