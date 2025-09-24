import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/users - Get all users (admin only)
export const GET = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause.OR = [
        { full_name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        player_profile: {
          select: {
            player_id: true,
            age: true,
            position: true
          }
        },
        scout_profile: {
          select: {
            scout_id: true,
            organization: true,
            verified: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    const totalUsers = await prisma.user.count({ where: whereClause });

    return NextResponse.json({ 
      users,
      total: totalUsers,
      page: Math.floor(offset / limit) + 1,
      total_pages: Math.ceil(totalUsers / limit)
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});

// PUT /api/admin/users/[id] - Update user (admin only)
export const PUT = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get('id'));
    const updateData = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        ...(updateData.full_name && { full_name: updateData.full_name }),
        ...(updateData.email && { email: updateData.email }),
        ...(updateData.phone && { phone: updateData.phone }),
        ...(updateData.role && { role: updateData.role }),
        ...(updateData.academy_id !== undefined && { academy_id: updateData.academy_id }),
        ...(updateData.profile_pic && { profile_pic: updateData.profile_pic })
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        academy_id: true,
        profile_pic: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/users/[id] - Delete user (admin only)
export const DELETE = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get('id'));

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { user_id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
});
