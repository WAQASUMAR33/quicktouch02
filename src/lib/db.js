import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quicktouch_dev',
  charset: 'utf8mb4',
  timezone: '+00:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database utility functions
export const db = {
  // Execute a single query
  async query(sql, params = []) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute a transaction
  async transaction(callback) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get a single row
  async queryOne(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0] || null;
  },

  // Insert and return the insert ID
  async insert(sql, params = []) {
    const result = await pool.execute(sql, params);
    return result[0].insertId;
  },

  // Update and return affected rows
  async update(sql, params = []) {
    const result = await pool.execute(sql, params);
    return result[0].affectedRows;
  },

  // Delete and return affected rows
  async delete(sql, params = []) {
    const result = await pool.execute(sql, params);
    return result[0].affectedRows;
  }
};

// Close pool on app shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

export default db;




