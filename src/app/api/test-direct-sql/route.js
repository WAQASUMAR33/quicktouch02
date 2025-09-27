import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Testing direct SQL event creation...');
    
    // Try direct SQL insert to bypass Prisma schema issues
    const result = await prisma.$executeRaw`
      INSERT INTO Events (title, type, event_date, location, description, created_by, created_at, updated_at)
      VALUES ('Test Event SQL', 'training', '2024-03-01 17:00:00', 'Test Location', 'Test Description', 1, NOW(), NOW())
    `;
    
    console.log('Direct SQL insert result:', result);
    
    // Get the inserted event
    const events = await prisma.$queryRaw`
      SELECT * FROM Events WHERE title = 'Test Event SQL' ORDER BY event_id DESC LIMIT 1
    `;
    
    console.log('Retrieved events:', events);
    
    return NextResponse.json({
      success: true,
      insertResult: result,
      events: events,
      message: 'Direct SQL event creation successful'
    });
    
  } catch (error) {
    console.error('Error with direct SQL:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed direct SQL event creation', 
        details: error.message,
        errorName: error.name,
        errorCode: error.code,
        errorMeta: error.meta
      },
      { status: 500 }
    );
  }
}
