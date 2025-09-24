import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/messages/unread-count - Get unread message count
export const GET = requireAuth(async (req) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await prisma.message.count({
      where: {
        receiver_id: userId,
        read_at: null
      }
    });

    return NextResponse.json({ unread_count: unreadCount });

  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
});
