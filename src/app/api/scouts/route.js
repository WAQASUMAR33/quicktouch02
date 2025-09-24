import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/scouts - Get all scouts (admin only)
export const GET = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const verified = searchParams.get('verified');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    if (verified !== null) {
      whereClause.verified = verified === 'true';
    }

    const scouts = await prisma.scout.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            full_name: true,
            email: true,
            phone: true,
            profile_pic: true,
            created_at: true
          }
        },
        favorites: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    full_name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ scouts });

  } catch (error) {
    console.error('Error fetching scouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scouts' },
      { status: 500 }
    );
  }
});

// POST /api/scouts - Create scout profile
export const POST = requireAuth(async (req) => {
  try {
    const userId = req.user.userId;
    const { organization } = await req.json();

    // Check if user is not already a scout
    const existingScout = await prisma.scout.findUnique({
      where: { user_id: userId }
    });

    if (existingScout) {
      return NextResponse.json(
        { error: 'Scout profile already exists' },
        { status: 409 }
      );
    }

    // Check if user role is scout
    const user = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (user.role !== 'scout') {
      return NextResponse.json(
        { error: 'User must have scout role' },
        { status: 403 }
      );
    }

    const scout = await prisma.scout.create({
      data: {
        user_id: userId,
        organization,
        verified: false // Admin needs to verify
      }
    });

    return NextResponse.json({
      success: true,
      scout,
      message: 'Scout profile created successfully. Awaiting verification.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating scout profile:', error);
    return NextResponse.json(
      { error: 'Failed to create scout profile' },
      { status: 500 }
    );
  }
});
