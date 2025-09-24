import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/messages - Get user's messages/conversations
export const GET = requireAuth(async (req) => {
  try {
    const userId = req.user.userId;
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    if (chatId) {
      // Get messages for specific chat
      const messages = await prisma.message.findMany({
        where: { chat_id: parseInt(chatId) },
        include: {
          sender: {
            select: {
              full_name: true,
              profile_pic: true
            }
          },
          receiver: {
            select: {
              full_name: true,
              profile_pic: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: { sent_at: 'asc' }
      });

      // Mark messages as read if user is receiver
      await prisma.message.updateMany({
        where: {
          chat_id: parseInt(chatId),
          receiver_id: userId,
          read_at: null
        },
        data: {
          read_at: new Date()
        }
      });

      return NextResponse.json({ messages });
    } else {
      // Get conversation list (unique chat partners)
      const conversations = await prisma.$queryRaw`
        SELECT DISTINCT 
          CASE 
            WHEN sender_id = ${userId} THEN receiver_id 
            ELSE sender_id 
          END as partner_id,
          chat_id,
          MAX(sent_at) as last_message_at,
          (SELECT message_text FROM Messages m2 WHERE m2.chat_id = Messages.chat_id ORDER BY sent_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM Messages m3 WHERE m3.chat_id = Messages.chat_id AND m3.receiver_id = ${userId} AND m3.read_at IS NULL) as unread_count
        FROM Messages 
        WHERE sender_id = ${userId} OR receiver_id = ${userId}
        GROUP BY chat_id, partner_id
        ORDER BY last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Get partner details
      const conversationsWithPartners = await Promise.all(
        conversations.map(async (conv) => {
          const partner = await prisma.user.findUnique({
            where: { user_id: conv.partner_id },
            select: {
              user_id: true,
              full_name: true,
              email: true,
              profile_pic: true,
              role: true
            }
          });

          return {
            chat_id: conv.chat_id,
            partner,
            last_message: conv.last_message,
            last_message_at: conv.last_message_at,
            unread_count: Number(conv.unread_count)
          };
        })
      );

      return NextResponse.json({ conversations: conversationsWithPartners });
    }

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
});

// POST /api/messages - Send new message
export const POST = requireAuth(async (req) => {
  try {
    const senderId = req.user.userId;
    const { receiver_id, message_text, chat_id } = await req.json();

    if (!receiver_id || !message_text) {
      return NextResponse.json(
        { error: 'Receiver ID and message text are required' },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { user_id: parseInt(receiver_id) }
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Generate chat_id if not provided (simple approach: smaller_id + larger_id)
    let finalChatId = chat_id;
    if (!finalChatId) {
      const ids = [senderId, parseInt(receiver_id)].sort((a, b) => a - b);
      finalChatId = parseInt(`${ids[0]}${ids[1]}`);
    }

    const message = await prisma.message.create({
      data: {
        chat_id: finalChatId,
        sender_id: senderId,
        receiver_id: parseInt(receiver_id),
        message_text
      },
      include: {
        sender: {
          select: {
            full_name: true,
            profile_pic: true
          }
        },
        receiver: {
          select: {
            full_name: true,
            profile_pic: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message,
      chat_id: finalChatId
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
});

// PUT /api/messages/mark-read - Mark messages as read
export const PUT = requireAuth(async (req) => {
  try {
    const userId = req.user.userId;
    const { chat_id, message_ids } = await req.json();

    let whereClause = {
      receiver_id: userId,
      read_at: null
    };

    if (chat_id) {
      whereClause.chat_id = parseInt(chat_id);
    } else if (message_ids && Array.isArray(message_ids)) {
      whereClause.message_id = {
        in: message_ids.map(id => parseInt(id))
      };
    } else {
      return NextResponse.json(
        { error: 'Either chat_id or message_ids must be provided' },
        { status: 400 }
      );
    }

    const result = await prisma.message.updateMany({
      where: whereClause,
      data: {
        read_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      updated_count: result.count,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
});
