CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE spaces (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50),
  area VARCHAR(200),
  description TEXT,
  price_per_hr INT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  image_url TEXT,
  has_seats BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  space_id INT REFERENCES spaces(id),
  booking_date DATE NOT NULL,
  time_slot VARCHAR(30),
  status VARCHAR(20) DEFAULT 'CONFIRMED',
  total_price INT,
  created_at TIMESTAMP DEFAULT NOW()
);
