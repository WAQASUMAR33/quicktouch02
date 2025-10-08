const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('👑 Creating Super Admin account...\n');

  try {
    const email = 'admin@quicktouch.com';
    const password = 'admin123';
    const fullName = 'Super Admin';

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('⚠️  Admin user with this email already exists!');
      console.log('User ID:', existing.user_id);
      console.log('Name:', existing.full_name);
      console.log('Email:', existing.email);
      console.log('Role:', existing.role);
      console.log('\n✅ You can login with these credentials at /admin/login\n');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin user
    const admin = await prisma.user.create({
      data: {
        full_name: fullName,
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
        role: true,
        created_at: true
      }
    });

    console.log('✅ Super Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 SUPER ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    ', email);
    console.log('Password: ', password);
    console.log('Role:     ', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login URLs:');
    console.log('Local:      http://localhost:3000/admin/login');
    console.log('Production: https://quicktouch02.vercel.app/admin/login');
    console.log('\n📊 Admin Details:');
    console.log('User ID:  ', admin.user_id);
    console.log('Name:     ', admin.full_name);
    console.log('Created:  ', admin.created_at);
    console.log('\n👑 Super Admin Powers:');
    console.log('  ✅ Manage all academies');
    console.log('  ✅ Manage all users');
    console.log('  ✅ View all events');
    console.log('  ✅ View all training plans');
    console.log('  ✅ Access admin dashboard');
    console.log('  ✅ Full system control');
    console.log('\n🎉 You can now login to the admin portal!\n');

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();

