import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/test/create-super-admin - Create super admin (DEVELOPMENT ONLY)
export async function POST(req) {
  try {
    const email = 'admin@quicktouch.com';
    const password = 'admin123';

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Super admin already exists',
        user: {
          user_id: existing.user_id,
          full_name: existing.full_name,
          email: existing.email,
          role: existing.role
        },
        credentials: {
          email: email,
          password: password
        },
        loginUrl: '/admin/login'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin user
    const admin = await prisma.user.create({
      data: {
        full_name: 'Super Admin',
        email: email,
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        academy_id: null
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully',
      credentials: {
        email: email,
        password: password
      },
      user: admin,
      loginUrl: '/admin/login',
      note: 'You can now login at /admin/login with these credentials'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating super admin:', error);
    return NextResponse.json(
      { error: 'Failed to create super admin', details: error.message },
      { status: 500 }
    );
  }
}

