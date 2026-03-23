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
      status VARCHAR(20) DEFAULT 'CONFIRMED',
      total_price INT,
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

  try {
    await pool.query(usersTable);
    console.log("Users table initialized");

    await pool.query(spacesTable);
    console.log("Spaces table initialized");

    await pool.query(bookingsTable);
    console.log("Bookings table initialized");

    await pool.query(favoritesTable);
    console.log("Favorites table initialized");

    await pool.query(recommendationsTable);
    console.log("Recommendations table initialized");

  } catch (err) {
    console.error("Error initializing tables:", err);
  }
}

module.exports = initTables;