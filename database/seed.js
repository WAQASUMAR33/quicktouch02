#!/usr/bin/env node

const mysql = require('mysql2/promise');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Sample seed data
const seedData = {
  users: [
    {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'admin'
    },
    {
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      role: 'coach'
    },
    {
      full_name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1234567892',
      role: 'player'
    },
    {
      full_name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1234567893',
      role: 'scout',
      organization: 'Premier League Scouts'
    }
  ],
  
  playerProfiles: [
    {
      user_id: 3, // Mike Johnson
      age: 18,
      height_cm: 180,
      weight_kg: 75,
      position: 'Midfielder',
      preferred_foot: 'Right'
    }
  ],
  
  scouts: [
    {
      user_id: 4, // Sarah Wilson
      organization: 'Premier League Scouts',
      verified: true
    }
  ],
  
  events: [
    {
      title: 'Training Session',
      type: 'training',
      event_date: new Date('2024-01-15 18:00:00'),
      location: 'Main Field',
      created_by: 2 // Jane Smith (coach)
    },
    {
      title: 'Friendly Match',
      type: 'match',
      event_date: new Date('2024-01-20 15:00:00'),
      location: 'Stadium',
      created_by: 2 // Jane Smith (coach)
    }
  ]
};

async function seed() {
  let connection;
  
  try {
    console.log(`Connecting to database: ${dbConfig.database}`);
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Seeding database with sample data...');
    
    // Insert users
    console.log('Inserting users...');
    for (const user of seedData.users) {
      await connection.execute(
        'INSERT INTO Users (full_name, email, phone, role) VALUES (?, ?, ?, ?)',
        [user.full_name, user.email, user.phone, user.role]
      );
    }
    
    // Insert player profiles
    console.log('Inserting player profiles...');
    for (const profile of seedData.playerProfiles) {
      await connection.execute(
        'INSERT INTO PlayerProfiles (user_id, age, height_cm, weight_kg, position, preferred_foot) VALUES (?, ?, ?, ?, ?, ?)',
        [profile.user_id, profile.age, profile.height_cm, profile.weight_kg, profile.position, profile.preferred_foot]
      );
    }
    
    // Insert scouts
    console.log('Inserting scouts...');
    for (const scout of seedData.scouts) {
      await connection.execute(
        'INSERT INTO Scouts (user_id, organization, verified) VALUES (?, ?, ?)',
        [scout.user_id, scout.organization, scout.verified]
      );
    }
    
    // Insert events
    console.log('Inserting events...');
    for (const event of seedData.events) {
      await connection.execute(
        'INSERT INTO Events (title, type, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)',
        [event.title, event.type, event.event_date, event.location, event.created_by]
      );
    }
    
    console.log('✓ Database seeded successfully!');
    
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();

