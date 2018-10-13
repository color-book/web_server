-- Company Accounts Table
CREATE TABLE company_accounts (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  name TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users Default Work Info
CREATE TABLE user_default_work_info (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  user_default_weight DOUBLE PRECISION,
  user_default_rental_fee DOUBLE PRECISION,
  user_default_in_training BOOLEAN,
  user_default_revenue_bonus BOOLEAN
);

-- Password History Table
CREATE TABLE password_history (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  password_hash TEXT,
  changed_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
  date_applied TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_changed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users To Positions History Table
CREATE TABLE user_position_history (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  held_position_id INTEGER REFERENCES positions(id),
  date_started TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Users To Company Accounts
CREATE TABLE users_to_company_accounts (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  company_uuid VARCHAR(36) REFERENCES company_accounts(uuid),
  user_joined_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Job Information
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  project_title TEXT NOT NULL,
  provided_job_id TEXT,
  estimated_total_hours INTEGER,
  estimated_start_date TIMESTAMP WITH TIME ZONE,
  actual_start_date TIMESTAMP WITH TIME ZONE,
  actual_total_hours INTEGER,
  completed BOOLEAN,
  inProgress BOOLEAN,
  street_address TEXT,
  city VARCHAR(50),
  state VARCHAR(2),
  client_phone_number VARCHAR(11),
  client_name TEXT,
  down_payment_amount DOUBLE PRECISION,
  down_payment_percentage DOUBLE PRECISION,
  total DOUBLE PRECISION,
  contractor_split_percentage DOUBLE PRECISION,
  sub_contractor_split_percentage DOUBLE PRECISION,
  created_by VARCHAR(36) REFERENCES users(uuid)
);

-- Job Line Item
CREATE TABLE job_line_item (
  id SERIAL PRIMARY KEY,
  job_uuid VARCHAR(36) REFERENCES jobs(uuid),
  item TEXT,
  description text,
  hours DOUBLE PRECISION,
  price DOUBLE PRECISION
);

-- Users to Job
CREATE TABLE users_to_job (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  job_uuid VARCHAR(36) REFERENCES jobs(uuid),
  user_weight DOUBLE PRECISION,
  user_current_job_hours DOUBLE PRECISION,
  user_rental_fee DOUBLE PRECISION,
  user_reimbursement DOUBLE PRECISION,
  user_in_training BOOLEAN,
  user_trained_by VARCHAR(36) REFERENCES users(uuid),
  user_revenue_bonus BOOLEAN,
  user_gross_profit_bonus BOOLEAN,
  user_bonus_percentage DOUBLE PRECISION
);

-- Users to time
CREATE TABLE users_to_time (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  job_uuid VARCHAR(36) REFERENCES jobs(uuid),
  clocked_in TIMESTAMP WITH TIME ZONE,
  clocked_out TIMESTAMP WITH TIME ZONE,
  total_time DOUBLE PRECISION
);

-- Job to Users to materials
CREATE TABLE users_to_job_to_materials (
  id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) REFERENCES users(uuid),
  job_uuid VARCHAR(36) REFERENCES jobs(uuid),
  material_description TEXT,
  material_price DOUBLE PRECISION,
  created TIMESTAMP WITH TIME ZONE
);