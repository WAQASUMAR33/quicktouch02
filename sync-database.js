const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function syncDatabase() {
  console.log('🔄 Syncing database with Prisma schema...\n');

  try {
    // Check if reset_token column exists
    console.log('1️⃣  Checking reset_token fields...');
    const userColumns = await prisma.$queryRaw`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Users' 
      AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry')
    `;
    
    if (userColumns.length < 2) {
      console.log('   Adding reset_token fields to Users table...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE Users 
        ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS reset_token_expiry DATETIME NULL
      `);
      
      // Try to add index
      try {
        await prisma.$executeRawUnsafe(`
          CREATE INDEX idx_reset_token ON Users(reset_token)
        `);
      } catch (e) {
        if (!e.message.includes('Duplicate key name')) {
          console.warn('   Warning: Could not create index:', e.message);
        }
      }
      console.log('   ✅ Reset token fields added\n');
    } else {
      console.log('   ✅ Reset token fields already exist\n');
    }

    // Check if PlayerReels table exists
    console.log('2️⃣  Checking PlayerReels table...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'PlayerReels'
    `;
    
    if (tables.length === 0) {
      console.log('   Creating PlayerReels table...');
      await prisma.$executeRawUnsafe(`
        CREATE TABLE PlayerReels (
          reel_id INT PRIMARY KEY AUTO_INCREMENT,
          player_id INT NOT NULL,
          academy_id INT NOT NULL,
          video_url VARCHAR(255) NOT NULL,
          title VARCHAR(150) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_player_reels_player
            FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
          CONSTRAINT fk_player_reels_academy
            FOREIGN KEY (academy_id) REFERENCES Academies(academy_id) ON DELETE CASCADE,
          INDEX idx_player_reels_player_id (player_id),
          INDEX idx_player_reels_academy_id (academy_id),
          INDEX idx_player_reels_created_at (created_at)
        )
      `);
      console.log('   ✅ PlayerReels table created\n');
    } else {
      console.log('   ✅ PlayerReels table already exists\n');
    }

    console.log('✨ Database sync completed successfully!\n');

  } catch (error) {
    console.error('❌ Error syncing database:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

