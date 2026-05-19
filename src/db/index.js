const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected!'))
  .catch((err) => console.error('DB connection error:', err));

module.exports = pool;