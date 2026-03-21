const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('[db] ERROR: DATABASE_URL environment variable is not set.');
  console.error('[db] Copy .env.example to .env and fill in your database credentials.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDB() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

module.exports = { pool, initDB };
