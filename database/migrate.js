#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load database configuration
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create migrations table if it doesn't exist
async function createMigrationsTable(connection) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.execute(createTableSQL);
}

// Get list of executed migrations
async function getExecutedMigrations(connection) {
  const [rows] = await connection.execute('SELECT filename FROM migrations ORDER BY id');
  return rows.map(row => row.filename);
}

// Get list of migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'migrations');
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

// Execute a single migration
async function executeMigration(connection, filename) {
  const filePath = path.join(__dirname, 'migrations', filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Executing migration: ${filename}`);
  
  // Split SQL by semicolon and execute each statement
  const statements = sql.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.execute(statement);
    }
  }
  
  // Record migration as executed
  await connection.execute(
    'INSERT INTO migrations (filename) VALUES (?)',
    [filename]
  );
  
  console.log(`✓ Migration ${filename} executed successfully`);
}

// Main migration function
async function migrate() {
  let connection;
  
  try {
    console.log(`Connecting to database: ${dbConfig.database}`);
    connection = await mysql.createConnection(dbConfig);
    
    // Create migrations table
    await createMigrationsTable(connection);
    
    // Get executed and pending migrations
    const executedMigrations = await getExecutedMigrations(connection);
    const migrationFiles = getMigrationFiles();
    const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations found.');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach(file => console.log(`  - ${file}`));
    
    // Execute pending migrations
    for (const filename of pendingMigrations) {
      await executeMigration(connection, filename);
    }
    
    console.log(`\n✓ All migrations completed successfully!`);
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Rollback function
async function rollback() {
  let connection;
  
  try {
    console.log(`Connecting to database: ${dbConfig.database}`);
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      console.log('No migrations to rollback.');
      return;
    }
    
    const lastMigration = rows[0].filename;
    console.log(`Rolling back migration: ${lastMigration}`);
    
    // Note: This is a simple rollback that just removes the migration record
    // In a production environment, you'd want to implement proper rollback SQL
    await connection.execute(
      'DELETE FROM migrations WHERE filename = ?',
      [lastMigration]
    );
    
    console.log(`✓ Migration ${lastMigration} rolled back successfully`);
    
  } catch (error) {
    console.error('Rollback failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// CLI handling
const command = process.argv[2];

if (command === 'migrate') {
  migrate();
} else if (command === 'rollback') {
  rollback();
} else {
  console.log('Usage:');
  console.log('  node database/migrate.js migrate   - Run pending migrations');
  console.log('  node database/migrate.js rollback  - Rollback last migration');
  process.exit(1);
}




