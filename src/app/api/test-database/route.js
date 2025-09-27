import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection and tables...');
    
    // Test basic connection
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection working');
    
    // Check if Events table exists
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    console.log('📋 Available tables:', tables);
    
    // Check Events table structure if it exists
    let eventsTableStructure = null;
    try {
      eventsTableStructure = await prisma.$queryRaw`
        DESCRIBE Events
      `;
      console.log('📊 Events table structure:', eventsTableStructure);
    } catch (error) {
      console.log('❌ Events table does not exist:', error.message);
    }
    
    // Check if Users table exists and has data
    let usersCount = 0;
    try {
      const users = await prisma.user.findMany({ select: { user_id: true, full_name: true } });
      usersCount = users.length;
      console.log('👥 Users in database:', usersCount);
      if (users.length > 0) {
        console.log('📝 Sample users:', users.slice(0, 3));
      }
    } catch (error) {
      console.log('❌ Error accessing Users table:', error.message);
    }
    
    // Try to count events if table exists
    let eventsCount = 0;
    try {
      eventsCount = await prisma.event.count();
      console.log('📅 Events in database:', eventsCount);
    } catch (error) {
      console.log('❌ Error accessing Events table:', error.message);
    }
    
    return NextResponse.json({
      success: true,
      database_connection: 'working',
      available_tables: tables,
      events_table_structure: eventsTableStructure,
      users_count: usersCount,
      events_count: eventsCount,
      message: 'Database test completed'
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
