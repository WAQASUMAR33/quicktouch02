import { NextResponse } from 'next/server';
import { requireAuth, updateUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/auth/profile - Get current user profile
export const GET = requireAuth(async (req) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.userId },
      include: {
        player_profile: {
          include: {
            player_stats: true,
            highlight_videos: true
          }
        },
        scout_profile: true
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        academy_id: true,
        profile_pic: true,
        created_at: true,
        updated_at: true,
        player_profile: true,
        scout_profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
});

// PUT /api/auth/profile - Update current user profile
export const PUT = requireAuth(async (req) => {
  try {
    const userId = req.user.userId;
    const updateData = await req.json();
    
    const { 
      full_name, 
      phone, 
      profile_pic, 
      current_password, 
      new_password 
    } = updateData;

    // If changing password, verify current password
    if (new_password) {
      if (!current_password) {
        return NextResponse.json(
          { error: 'Current password is required to set new password' },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { user_id: userId }
      });

      const isValidPassword = await bcrypt.compare(current_password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 12);
      
      await prisma.user.update({
        where: { user_id: userId },
        data: { password: hashedPassword }
      });
    }

    // Update other profile fields
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        ...(full_name && { full_name }),
        ...(phone && { phone }),
        ...(profile_pic && { profile_pic })
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        profile_pic: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
});
