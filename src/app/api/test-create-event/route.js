import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Testing event creation...');
    
    // Try to create a simple event with only confirmed existing fields
    const testEvent = {
      title: "Test Event",
      type: "training",
      event_date: new Date("2024-03-01T17:00:00.000Z"),
      location: "Test Location",
      description: "Test Description",
      created_by: 1
    };
    
    console.log('Event data:', testEvent);
    
    const event = await prisma.event.create({
      data: testEvent
    });
    
    console.log('Event created successfully:', event);
    
    return NextResponse.json({
      success: true,
      event: event,
      message: 'Test event created successfully'
    });
    
  } catch (error) {
    console.error('Error creating test event:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test event', 
        details: error.message,
        errorName: error.name,
        errorCode: error.code,
        errorMeta: error.meta
      },
      { status: 500 }
    );
  }
}
