const pool = require("../db");

async function initTables() {

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      account_type VARCHAR(20) DEFAULT 'buyer',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const spacesTable = `
    CREATE TABLE IF NOT EXISTS spaces (
      id SERIAL PRIMARY KEY,
      owner_id INT REFERENCES users(id),
      title VARCHAR(200) UNIQUE NOT NULL,
      category VARCHAR(50),
      area VARCHAR(200),
      description TEXT,
      distance VARCHAR(20),
      distance_km DOUBLE PRECISION,
      price_per_hr INTEGER,
      rating DOUBLE PRECISION DEFAULT 0,
      no_of_rating DOUBLE PRECISION DEFAULT 0,
      image_url TEXT,
      has_seats BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      approval_status VARCHAR(20) DEFAULT 'APPROVED',
      admin_rejection_reason TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const bookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      space_id INT REFERENCES spaces(id),
      booking_date DATE NOT NULL,
      time_slot VARCHAR(30),
      seat VARCHAR(10),
      status VARCHAR(20) DEFAULT 'FUNCTIONAL',
      is_confirmed BOOLEAN DEFAULT FALSE,
      total_price INT,
      rejection_reason TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const favoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      space_id INT REFERENCES spaces(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, space_id)
    );
  `;

  const recommendationsTable = `
    CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    space_id INT REFERENCES spaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, space_id)
    );
  `;

  const ratingsTable = `
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      space_id INT REFERENCES spaces(id) ON DELETE CASCADE,
      score INT NOT NULL CHECK (score >= 1 AND score <= 5),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, space_id)
    );
  `;


  try {
    await pool.query(usersTable);
    console.log("Users table initialized");

    await pool.query(spacesTable);
    console.log("Spaces table initialized");

    // Add approval columns if they don't exist (for existing databases)
    await pool.query(`
      ALTER TABLE spaces ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'APPROVED';
    `).catch(() => {});
    await pool.query(`
      ALTER TABLE spaces ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT;
    `).catch(() => {});

    // Set user-created spaces (non-seed) that defaulted to APPROVED back to PENDING
    // Seed spaces belong to 'user@spacebook.com' — those stay APPROVED
    const seedUser = await pool.query("SELECT id FROM users WHERE email='user@spacebook.com'").catch(() => ({ rows: [] }));
    if (seedUser.rows.length > 0) {
      await pool.query(`
        UPDATE spaces SET approval_status = 'PENDING'
        WHERE owner_id != $1 AND approval_status = 'APPROVED'
        AND created_at > NOW() - INTERVAL '1 day'
      `, [seedUser.rows[0].id]).catch(() => {});
    }
    console.log("Spaces approval columns initialized");

    await pool.query(bookingsTable);
    console.log("Bookings table initialized");

    // Add rejection_reason column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `).catch(() => { /* column may already exist */ });

    // Add seat column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS seat VARCHAR(10);
    `).catch(() => { /* column may already exist */ });

    await pool.query(favoritesTable);
    console.log("Favorites table initialized");

    await pool.query(recommendationsTable);
    console.log("Recommendations table initialized");

    await pool.query(ratingsTable);
    console.log("Ratings table initialized");

  } catch (err) {
    console.error("Error initializing tables:", err);
  }
}

module.exports = initTables;