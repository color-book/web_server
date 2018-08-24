

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(80) UNIQUE NOT NULL,
  password TEXT,
  phone_number VARCHAR(11),
  street_address TEXT,
  city TEXT,
  state VARCHAR(2),
  zipcode VARCHAR(5),
  timezone TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Password History Table
CREATE TABLE password_history (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  password_hash TEXT,
  changed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

-- Positions Table
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  name TEXT
);

-- Users To Positions Joiner Table
CREATE TABLE users_to_positions (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  current_position_id INTEGER REFERENCES positions(id),
  intial_application_position INTEGER REFERENCES positions(id),
  date_applied TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_changed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users To Positions History Table
CREATE TABLE user_position_history (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  held_position_id INTEGER REFERENCES positions(id),
  date_started TIMESTAMP NOT NULL
)