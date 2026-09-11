CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('sme', 'ngo', 'sponsor')),
  organization_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires TIMESTAMP DEFAULT NULL,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP
);

-- Restaurant profiles: Additional info for restaurant users
CREATE TABLE IF NOT EXISTS restaurant_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  business_type VARCHAR(50),
  cuisine_type VARCHAR(255),
  capacity INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NGO profiles: Additional info for NGO users
CREATE TABLE IF NOT EXISTS ngo_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  service_area VARCHAR(255),
  beneficiary_count INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sponsor profiles: Additional info for sponsor users
CREATE TABLE IF NOT EXISTS sponsor_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  budget DECIMAL(12,2),
  focus_areas TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meals table: Food listings from restaurants
CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  storage_type VARCHAR(30),
  food_type VARCHAR(30),
  food_status VARCHAR(20),
  prepared_at TIMESTAMP NOT NULL,
  expiry_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES users(id)
);

-- Claims table: NGO claims on meals
CREATE TABLE IF NOT EXISTS claims (
  id SERIAL PRIMARY KEY,
  meal_id INT NOT NULL,
  ngo_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (meal_id) REFERENCES meals(id),
  FOREIGN KEY (ngo_id) REFERENCES users(id)
);

-- Meal logs: Audit trail for status changes
CREATE TABLE IF NOT EXISTS meal_logs (
  id SERIAL PRIMARY KEY,
  meal_id INT NOT NULL,
  changed_by_id INT,
  from_status VARCHAR(50),
  to_status VARCHAR(50),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (meal_id) REFERENCES meals(id),
  FOREIGN KEY (changed_by_id) REFERENCES users(id)
);

-- Sponsorships table: Sponsor contributions
CREATE TABLE IF NOT EXISTS sponsorships (
  id SERIAL PRIMARY KEY,
  sponsor_id INT NOT NULL, 
  meal_id INT,
  ngo_id INT,
  amount DECIMAL(10,2),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES users(id),
  FOREIGN KEY (meal_id) REFERENCES meals(id),
  FOREIGN KEY (ngo_id) REFERENCES users(id)
);

-- Only create the index if it doesn't exist (MySQL 8+)
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);