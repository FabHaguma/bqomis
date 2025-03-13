CREATE DATABASE IF NOT EXISTS bqomis_db;
USE bqomis_db;

CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(100),
    district VARCHAR(100),
    sector VARCHAR(100),
    cell VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10,8),  -- For geolocation
    longitude DECIMAL(11,8)   -- For geolocation
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('customer', 'bank_staff', 'admin') DEFAULT 'customer', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branch_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    service_id INT,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    branch_id INT NOT NULL,
    service_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('booked', 'arrived', 'completed', 'cancelled') DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);


-- TABLES ARE DONE NOW WE CAN INSERT DATA INTO THEM
-- TABLES ARE DONE NOW WE CAN INSERT DATA INTO THEM
-- TABLES ARE DONE NOW WE CAN INSERT DATA INTO THEM

-- Insert Branches
INSERT INTO branches (name, province, district, sector, cell, address, latitude, longitude) 
VALUES 
('Kigali Main Branch', 'Kigali', 'Nyarugenge', 'Muhima', 'Cell 1', '123 Main Street', -1.9501, 30.0589),
('Huye Branch', 'Southern Province', 'Huye', 'Ngoma', 'Cell 2', '456 Huye Street', -2.5963, 29.7394);

-- Insert Services
INSERT INTO services (name, description) 
VALUES 
('Account Opening', 'Open a new bank account.'),
('Cash Deposit', 'Deposit cash into your account.'),
('Loan Processing', 'Apply for and process loans.');

-- Insert Users
INSERT INTO users (full_name, email, password_hash, role) 
VALUES 
('John Doe', 'john@example.com', 'hashed_password_here', 'customer'),
('Jane Smith', 'jane@bank.com', 'hashed_password_here', 'bank_staff');
