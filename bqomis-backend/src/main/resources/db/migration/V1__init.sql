-- CREATE DATABASE IF NOT EXISTS bqomis_db;
-- USE bqomis_db;

-- Create table for users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255)
);

-- Create table for roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Create table for districts
CREATE TABLE IF NOT EXISTS districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    province VARCHAR(255) NOT NULL
);

-- Create table for branches
CREATE TABLE IF NOT EXISTS branches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    district VARCHAR(255) NOT NULL,
    province VARCHAR(255)
);

-- Create table for services
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Create table for branch_services
CREATE TABLE IF NOT EXISTS branch_services (
    id BIGSERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    available BOOLEAN NOT NULL DEFAULT TRUE -- Indicates if the service is available at the branch
);

-- Create table for appointments
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_service_id INT NOT NULL REFERENCES branch_services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(50) NOT NULL
);