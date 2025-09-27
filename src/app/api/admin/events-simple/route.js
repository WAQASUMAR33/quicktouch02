import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/events-simple - Get all events (simplified version)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let whereClause = {};
    
    // Only filter by type if provided (using existing enum values)
    if (type) {
      whereClause.type = type;
    }

    // Get events using only existing database columns
    const events = await prisma.event.findMany({
      where: whereClause,
      select: {
        event_id: true,
        title: true,
        type: true,
        event_date: true,
        location: true,
        description: true,
        created_by: true,
        created_at: true,
        updated_at: true
      },
      orderBy: [
        { event_date: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      events: events,
      message: "Events retrieved successfully (simplified version)",
      note: "This is a simplified version that works with the current database schema - only includes existing columns"
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/events-simple - Create new event (simplified version)
export async function POST(req) {
  try {
    const { 
      title, 
      type, 
      event_date, 
      location, 
      description, 
      created_by 
    } = await req.json();

    // Validate required fields
    if (!title || !type || !event_date || !created_by) {
      return NextResponse.json(
        { error: 'Title, type, event date, and created_by are required' },
        { status: 400 }
      );
    }

    // Validate type (using existing enum values)
    const validTypes = ['training', 'match', 'trial', 'showcase'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: training, match, trial, showcase' },
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
        created_by: parseInt(created_by)
      }
    });

    return NextResponse.json({
      success: true,
      event: {
        event_id: event.event_id,
        title: event.title,
        type: event.type,
        event_date: event.event_date,
        location: event.location,
        description: event.description,
        created_by: event.created_by,
        created_at: event.created_at,
        updated_at: event.updated_at
      },
      message: 'Event created successfully (simplified version)',
      note: "This is a simplified version that works with the current database schema"
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: error.message },
      { status: 500 }
    );
  }
}
