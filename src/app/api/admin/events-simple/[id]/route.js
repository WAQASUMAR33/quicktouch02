import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/events-simple/[id] - Get single event
export async function GET(req, { params }) {
  try {
    const eventId = parseInt(params.id);

    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
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
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events-simple/[id] - Update event
export async function PUT(req, { params }) {
  try {
    const eventId = parseInt(params.id);
    const { title, type, event_date, location, description } = await req.json();

    // Validate required fields
    if (!title || !type || !event_date) {
      return NextResponse.json(
        { error: 'Title, type, and event date are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['training', 'match', 'trial', 'showcase'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: training, match, trial, showcase' },
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

    // Update event
    const event = await prisma.event.update({
      where: { event_id: eventId },
      data: {
        title,
        type,
        event_date: new Date(event_date),
        location,
        description
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
      message: 'Event updated successfully'
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events-simple/[id] - Delete event
export async function DELETE(req, { params }) {
  try {
    const eventId = parseInt(params.id);

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

    // Delete event
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
      { error: 'Failed to delete event', details: error.message },
      { status: 500 }
    );
  }
}

