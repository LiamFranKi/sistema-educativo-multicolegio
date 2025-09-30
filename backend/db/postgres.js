const { Pool } = require('pg');

// Soporta DATABASE_URL o variables PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        database: process.env.PGDATABASE || 'multicolegio',
      }
);

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('PG query', { text, duration: `${duration}ms`, rows: result.rowCount });
  }
  return result;
}

module.exports = { pool, query };
