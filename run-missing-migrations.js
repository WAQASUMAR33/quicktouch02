const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  // Parse DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  // Format: mysql://user:password@host:port/database
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
  const match = dbUrl.match(regex);
  
  if (!match) {
    console.error('Invalid DATABASE_URL format');
    console.error('DATABASE_URL:', dbUrl);
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;
  
  console.log('Connection details:');
  console.log('- Host:', host);
  console.log('- Port:', port);
  console.log('- User:', user);
  console.log('- Database:', database);
  console.log('');

  console.log('📦 Connecting to database...');
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password: decodeURIComponent(password),
    database,
    multipleStatements: true
  });

  console.log('✅ Connected to database\n');

  try {
    // Migrations to run
    const migrations = [
      '017_add_reset_token_to_users.sql',
      '018_create_player_reels_table.sql'
    ];

    for (const migrationFile of migrations) {
      console.log(`🔄 Running migration: ${migrationFile}`);
      const migrationPath = path.join(__dirname, 'database', 'migrations', migrationFile);
      
      try {
        const sql = await fs.readFile(migrationPath, 'utf8');
        await connection.query(sql);
        console.log(`✅ Migration ${migrationFile} completed successfully\n`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_NO_REPLACE' || 
            error.code === 'ER_DUP_FIELDNAME' || 
            error.message.includes('Duplicate column name') ||
            error.message.includes('already exists')) {
          console.log(`⚠️  Migration ${migrationFile} already applied (table/column exists)\n`);
        } else {
          console.error(`❌ Error in migration ${migrationFile}:`);
          console.error(error.message);
          console.error('');
        }
      }
    }

    console.log('\n✨ All migrations processed!');

  } catch (error) {
    console.error('❌ Error running migrations:', error);
  } finally {
    await connection.end();
    console.log('👋 Database connection closed');
  }
}

runMigrations();

