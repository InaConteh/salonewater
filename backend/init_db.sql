-- PostgreSQL Database Initialization Script for CleanFlow SL
-- Run this script with: psql -U postgres -f init_db.sql

-- Create database
CREATE DATABASE cleanflow_db
    WITH
    ENCODING 'UTF8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8'
    TEMPLATE template0;

-- Create application user
CREATE USER cleanflow_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cleanflow_db TO cleanflow_user;

-- Connect to the new database
\c cleanflow_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO cleanflow_user;

-- Grant default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cleanflow_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cleanflow_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO cleanflow_user;

-- Create extensions (if needed for PostGIS in the future)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify setup
SELECT datname FROM pg_database WHERE datname = 'cleanflow_db';
SELECT usename FROM pg_user WHERE usename = 'cleanflow_user';

\echo 'Database initialization complete!'
