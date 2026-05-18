require('dotenv').config();
const pool = require('./src/db');

async function fixSpaces() {
  try {
    const seedUser = await pool.query("SELECT id FROM users WHERE email='user@spacebook.com'");
    if (seedUser.rows.length > 0) {
      const res = await pool.query(`
        UPDATE spaces SET approval_status = 'PENDING'
        WHERE owner_id != $1 AND approval_status = 'APPROVED'
      `, [seedUser.rows[0].id]);
      console.log('Updated rows:', res.rowCount);
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fixSpaces();
