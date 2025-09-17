-- V1: Consolidated Initial Schema
-- This file creates all tables with correct types, incorporating V1, V4, V5, and V6.

BEGIN;

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

-- Create table for branch_services (with BIGINT FKs from V4)
CREATE TABLE IF NOT EXISTS branch_services (
    id BIGSERIAL PRIMARY KEY,
    branch_id BIGINT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create table for appointments (with BIGINT FKs from V4)
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_service_id BIGINT NOT NULL REFERENCES branch_services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Create table for branch configuration overrides (from V5)
CREATE TABLE IF NOT EXISTS branch_configuration_overrides (
    id BIGSERIAL PRIMARY KEY,
    branch_id BIGINT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    queue_threshold_low INT NULL,
    queue_threshold_moderate INT NULL,
    slot_duration_mins INT NULL,
    max_appointments_per_slot INT NULL,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bco_branch_id ON branch_configuration_overrides(branch_id);

-- Create table for global application configuration (from V6)
CREATE TABLE IF NOT EXISTS global_application_configuration (
    id BIGSERIAL PRIMARY KEY,
    booking_window_days INT NOT NULL,
    min_booking_notice_hours INT NOT NULL,
    default_queue_threshold_low INT NOT NULL,
    default_queue_threshold_moderate INT NOT NULL,
    default_slot_duration_mins INT NOT NULL,
    default_allow_cancellation_hours INT NOT NULL,
    maintenance_mode_enabled BOOLEAN NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
