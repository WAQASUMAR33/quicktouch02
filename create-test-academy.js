const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createTestAcademy() {
  console.log('🏫 Creating test academy account...\n');

  try {
    const email = 'dilwaq22@gmail.com';
    const password = '786ninja';
    const name = 'Test Academy';

    // Check if academy already exists
    const existing = await prisma.academy.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('⚠️  Academy with this email already exists!');
      console.log('Academy ID:', existing.academy_id);
      console.log('Name:', existing.name);
      console.log('Email:', existing.email);
      console.log('Email Verified:', existing.email_verified);
      console.log('Is Active:', existing.is_active);
      console.log('\n✅ You can login with these credentials at /academy/login\n');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create academy
    const academy = await prisma.academy.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        phone: '+1234567890',
        address: '123 Test Street',
        description: 'Test Academy for development',
        website: 'https://testacademy.com',
        email_verified: true, // Set to true for testing
        is_active: true
      }
    });

    console.log('✅ Test academy created successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    ', email);
    console.log('Password: ', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login URL:');
    console.log('Local:      http://localhost:3000/academy/login');
    console.log('Production: https://quicktouch02.vercel.app/academy/login');
    console.log('\n📊 Academy Details:');
    console.log('ID:          ', academy.academy_id);
    console.log('Name:        ', academy.name);
    console.log('Email Verified:', academy.email_verified ? 'Yes ✅' : 'No ❌');
    console.log('Active:      ', academy.is_active ? 'Yes ✅' : 'No ❌');
    console.log('Created:     ', academy.created_at);
    console.log('\n🎉 You can now login to the academy portal!\n');

  } catch (error) {
    console.error('❌ Error creating test academy:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAcademy();

