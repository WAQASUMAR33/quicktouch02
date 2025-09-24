import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/dashboard - Get admin dashboard statistics
export const GET = requireRole(['admin'])(async (req) => {
  try {
    // Get user statistics
    const userStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get player statistics
    const totalPlayers = await prisma.playerProfile.count();
    const playersWithStats = await prisma.playerProfile.count({
      where: {
        player_stats: {
          some: {}
        }
      }
    });

    // Get event statistics
    const totalEvents = await prisma.event.count();
    const upcomingEvents = await prisma.event.count({
      where: {
        event_date: {
          gte: new Date()
        }
      }
    });

    // Get scout statistics
    const totalScouts = await prisma.scout.count();
    const verifiedScouts = await prisma.scout.count({
      where: { verified: true }
    });

    // Get message statistics
    const totalMessages = await prisma.message.count();
    const unreadMessages = await prisma.message.count({
      where: { read_at: null }
    });

    // Get shop statistics
    const totalShopItems = await prisma.shopItem.count();
    const activeShopItems = await prisma.shopItem.count({
      where: { is_active: true }
    });

    // Get recent activity (last 10 activities)
    const recentActivity = await prisma.$queryRaw`
      SELECT 'user_registration' as type, full_name as description, created_at as timestamp
      FROM Users 
      ORDER BY created_at DESC 
      LIMIT 5
      UNION ALL
      SELECT 'event_created' as type, title as description, created_at as timestamp
      FROM Events 
      ORDER BY created_at DESC 
      LIMIT 5
      ORDER BY timestamp DESC
      LIMIT 10
    `;

    const dashboard = {
      users: {
        total: totalUsers,
        recent: recentUsers,
        by_role: userStats.reduce((acc, stat) => {
          acc[stat.role] = stat._count;
          return acc;
        }, {})
      },
      players: {
        total: totalPlayers,
        with_stats: playersWithStats
      },
      scouts: {
        total: totalScouts,
        verified: verifiedScouts,
        pending: totalScouts - verifiedScouts
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages
      },
      shop: {
        total_items: totalShopItems,
        active_items: activeShopItems
      },
      recent_activity: recentActivity
    };

    return NextResponse.json({ dashboard });

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard' },
      { status: 500 }
    );
  }
});
