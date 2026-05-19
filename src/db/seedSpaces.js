const pool = require("../db");
const bcrypt = require("bcryptjs");

async function seedSpaces() {
  try {
    console.log("Seeding database...");

    await pool.query(`
      INSERT INTO users (name, email, password, account_type)
      VALUES (
        'Default User',
        'user@spacebook.com',
        'password123',
        'buyer'
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    // Seed default admin user (password: admin123)
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE email='admin@spacebook.com'"
    );
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO users (name, email, password, account_type)
        VALUES ('SpaceBook Admin', 'admin@spacebook.com', $1, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `, [hashedPassword]);
      console.log("Admin user seeded (admin@spacebook.com / admin123)");
    }

    const defaultUser = await pool.query(
      "SELECT id FROM users WHERE email='user@spacebook.com'"
    );

    const defaultUserId = defaultUser.rows[0].id;

    const spaces = [
      {
        title: "Olympic Green Arena",
        category: "Sports Turfs",
        area: "Sports District, Playville",
        description: "Modern synthetic turfs designed for football and cricket with floodlights and secure fencing.",
        distance: "0.5",
        distance_km: 0.5,
        price_per_hr: 1200,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600",
        has_seats: false
      },
      {
        title: "Stellar Multi-Sports Park",
        category: "Sports Turfs",
        area: "Sports District, Playville",
        description: "Multi-purpose sports facility with multiple courts and fields.",
        distance: "1.2",
        distance_km: 1.2,
        price_per_hr: 950,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600",
        has_seats: false
      },
      {
        title: "Champion's Court Indoor",
        category: "Sports Turfs",
        area: "Playville Suburbs",
        description: "Indoor court with premium flooring and climate control.",
        distance: "2.4",
        distance_km: 2.4,
        price_per_hr: 1500,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600",
        has_seats: false
      },
      {
        title: 'Green Kick Football Arena',
        category: 'Sports Turfs',
        distance: '3.1',
        area: 'Playville Suburbs',
        description: 'Well-maintained football arena with proper lighting and secure fencing.',
        distance_km: 3.1,
        price_per_hr: 800,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600',
        has_seats: false,
      },
      {
        title: 'Elite Sports Ground',
        category: 'Sports Turfs',
        distance: '4.0',
        area: 'Playville Suburbs',
        description: 'Premium sports ground with excellent facilities and maintenance.',
        distance_km: 4.0,
        price_per_hr: 1100,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600',
        has_seats: false,
      },
      {
        title: "City Central Library",
        category: "Libraries",
        area: "Central Business District, Education City",
        description: "Spacious and quiet library with modern amenities and study rooms.",
        distance: "0.3",
        distance_km: 0.3,
        price_per_hr: 80,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
        has_seats: true
      },
      {
        title: "Knowledge Oasis Study Hall",
        category: "Libraries",
        area: "Education City",
        description: "Modern study hall with comfortable seating and high-speed internet.",
        distance: "0.9",
        distance_km: 0.9,
        price_per_hr: 120,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600",
        has_seats: true
      },
      {
        title: 'The Reading Room',
        category: 'Libraries',
        distance: '1.5',
        area: 'Education City',
        description: 'Cozy and quiet reading room with a vast collection of books and comfortable seating.',
        distance_km: 1.5,
        price_per_hr: 60,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop',
        has_seats: true,
      },
      {
        title: "Focus Study Hub",
        category: "Study Halls",
        area: "Education City",
        description: "Quiet study hub with high-speed Wi-Fi and ergonomic seating.",
        distance: "0.8",
        distance_km: 0.8,
        price_per_hr: 150,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600",
        has_seats: true
      },
      {
        title: 'Skyline Study Lounge',
        category: 'Study Halls',
        distance: '1.2',
        area: 'Education City',
        description: 'Modern study lounge with comfortable seating, high-speed internet, and a relaxing atmosphere.',
        distance_km: 1.2,
        price_per_hr: 100,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=600&fit=crop',
        has_seats: true,
      },
      {
        title: 'Quiet Corner Study Space',
        category: 'Study Halls',
        distance: '2.0',
        area: 'Education City',
        description: 'Quiet and comfortable study space with minimal distractions.',
        distance_km: 2.0,
        price_per_hr: 80,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&fit=crop',
        has_seats: true,
      },
      {
        title: "The Grand Ballroom",
        category: "Event Halls",
        area: "Historic District, Entertainment City",
        description: "Elegant ballroom with high ceilings and premium sound systems.",
        distance: "5.1",
        distance_km: 5.1,
        price_per_hr: 8000,
        rating: 5,
        no_of_rating: 1,
        image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
        has_seats: false
      },
      {
        title: 'Prestige Event Centre',
        category: 'Event Halls',
        distance: '3.4',
        area: 'Entertainment City',
        description: 'Modern event centre with premium facilities and flexible layouts.',
        distance_km: 3.4,
        price_per_hr: 5000,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&fit=crop',
        has_seats: false,
      },
      {
        title: 'Royal Banquet Hall',
        category: 'Event Halls',
        distance: '6.2',
        area: 'Entertainment City',
        description: 'Elegant banquet hall with premium facilities and a grand atmosphere.',
        distance_km: 6.2,
        price_per_hr: 10000,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop',
        has_seats: false,
      },
      {
        title: 'Premier Arena Soccer Turf',
        category: 'Sports Turfs',
        area: 'Downtown District, Playville',
        description: 'Modern synthetic turfs designed for football and cricket, featuring floodlights, secure fencing, and well-maintained playing surfaces.',
        distance: '2.4',
        distance_km: 2.4,
        price_per_hr: 1200,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600',
        has_seats: false,
      },
      {
        title: 'Focus Hub Study Library',
        category: 'Libraries',
        area: 'Central Business District, Education City',
        description: 'Spacious and quiet study halls with modern amenities, including high-speed internet, comfortable seating, and private study rooms.',
        distance: '0.8',
        distance_km: 0.8,
        price_per_hr: 150,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600',
        has_seats: true,
      },
      {
        title: 'The Grand Ballroom',
        category: 'Event Halls',
        area: 'Historic District, Entertainment City',
        description: 'Elegant ballroom with high ceilings, ornate decorations, and premium sound systems, perfect for grand events and celebrations.',
        distance: '5.1',
        distance_km: 5.1,
        price_per_hr: 8000,
        rating: 5,
        no_of_rating: 1,
        image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
        has_seats: true,
      },
    ];

    for (const s of spaces) {
      await pool.query(
        `
        INSERT INTO spaces
        (owner_id,title,category,area,description,distance,distance_km,
        price_per_hr,rating,no_of_rating,image_url,has_seats)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (title) DO NOTHING
        `,
        [
          defaultUserId,
          s.title,
          s.category,
          s.area,
          s.description,
          s.distance,
          s.distance_km,
          s.price_per_hr,
          s.rating,
          s.no_of_rating,
          s.image_url,
          s.has_seats,
        ]
      );

      const spaceRes = await pool.query("SELECT id FROM spaces WHERE title = $1", [s.title]);
      if (spaceRes.rows.length > 0) {
        const spaceId = spaceRes.rows[0].id;
        const defaultScore = 5

        await pool.query(`
          INSERT INTO ratings (user_id, space_id, score)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, space_id) DO NOTHING
        `, [1, spaceId, defaultScore]);
      }
    }

    const recommended = [
      { space_id: 1, user_id: defaultUserId },
      { space_id: 6, user_id: defaultUserId },
      { space_id: 10, user_id: defaultUserId }
    ];

    for (const r of recommended) {
      await pool.query(
        `
        INSERT INTO recommendations (user_id, space_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, space_id) DO NOTHING
        `,
        [r.user_id, r.space_id]
      );
    }

    console.log("Database seeded successfully");

  } catch (err) {
    console.error("Seeding error:", err);
  }
}

module.exports = seedSpaces;