#!/usr/bin/env node

/**
 * Create Test Users for Academy Portal
 * Run: node create-test-users.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('Creating test users for Academy Portal...\n');

  try {
    // Hash password (using "password123" for all test users)
    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Create Coach
    const coach = await prisma.user.upsert({
      where: { email: 'coach@academy.com' },
      update: {},
      create: {
        full_name: 'Coach John Smith',
        email: 'coach@academy.com',
        phone: '+1234567890',
        role: 'coach',
        password: hashedPassword
      }
    });
    console.log('✓ Coach created:');
    console.log('  Email: coach@academy.com');
    console.log('  Password: password123');
    console.log('  Role: coach\n');

    // 2. Create Player
    const player = await prisma.user.upsert({
      where: { email: 'player@academy.com' },
      update: {},
      create: {
        full_name: 'Player Mike Johnson',
        email: 'player@academy.com',
        phone: '+1234567891',
        role: 'player',
        password: hashedPassword
      }
    });
    
    // Create player profile
    await prisma.playerProfile.upsert({
      where: { user_id: player.user_id },
      update: {},
      create: {
        user_id: player.user_id,
        age: 18,
        height_cm: 180,
        weight_kg: 75,
        position: 'Midfielder',
        preferred_foot: 'Right'
      }
    });
    
    console.log('✓ Player created:');
    console.log('  Email: player@academy.com');
    console.log('  Password: password123');
    console.log('  Role: player\n');

    // 3. Create Scout
    const scout = await prisma.user.upsert({
      where: { email: 'scout@academy.com' },
      update: {},
      create: {
        full_name: 'Scout Sarah Wilson',
        email: 'scout@academy.com',
        phone: '+1234567892',
        role: 'scout',
        password: hashedPassword
      }
    });
    
    // Create scout profile
    await prisma.scout.upsert({
      where: { user_id: scout.user_id },
      update: {},
      create: {
        user_id: scout.user_id,
        organization: 'Premier League Scouts',
        verified: true
      }
    });
    
    console.log('✓ Scout created:');
    console.log('  Email: scout@academy.com');
    console.log('  Password: password123');
    console.log('  Role: scout\n');

    console.log('========================================');
    console.log('All test users created successfully!');
    console.log('========================================\n');
    console.log('You can now login to the Academy Portal at:');
    console.log('http://localhost:3000/academy/login\n');
    console.log('Use any of the above credentials to login.');

  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();

