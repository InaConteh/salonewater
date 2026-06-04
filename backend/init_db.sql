-- SQLite initialization helper for CleanFlow SL.
--
-- The application schema is managed by Flask-Migrate/Alembic.
-- To initialize or upgrade the local SQLite database, run:
--
--   python -m flask db upgrade
--
-- The configured local database is:
--
--   instance/cleanflow.db
--
-- This file only enables useful SQLite safety settings for manual sqlite3
-- sessions. It is not a replacement for Alembic migrations.

PRAGMA foreign_keys = ON;
