import { NextResponse } from 'next/server';
import { getEventById, updateEvent, deleteEvent } from '@/lib/auth';

// GET /api/admin/events/[id] - Get specific event
export async function GET(request, { params }) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    const event = await getEventById(eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
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
        updated_at: event.updated_at,
        creator: event.creator
      }
    });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(request, { params }) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Validate type if provided
    if (updateData.type) {
      const validTypes = ['training', 'match', 'Trial', 'Showcase', 'GuestSessions'];
      if (!validTypes.includes(updateData.type)) {
        return NextResponse.json(
          { error: 'Type must be one of: training, match, Trial, Showcase, GuestSessions' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (updateData.status && !['Pending', 'Complete'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Status must be either "Pending" or "Complete"' },
        { status: 400 }
      );
    }
    
    // Check if event exists
    const existingEvent = await getEventById(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Convert event_date to Date object if provided
    if (updateData.event_date) {
      updateData.event_date = new Date(updateData.event_date);
    }
    
    const updatedEvent = await updateEvent(eventId, updateData);
    
    return NextResponse.json({
      success: true,
      event: {
        event_id: updatedEvent.event_id,
        title: updatedEvent.title,
        type: updatedEvent.type,
        event_date: updatedEvent.event_date,
        event_time: updatedEvent.event_time,
        location: updatedEvent.location,
        description: updatedEvent.description,
        status: updatedEvent.status,
        created_by: updatedEvent.created_by,
        created_at: updatedEvent.created_at,
        updated_at: updatedEvent.updated_at
      },
      message: 'Event updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(request, { params }) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Check if event exists
    const existingEvent = await getEventById(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    await deleteEvent(eventId);
    
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
