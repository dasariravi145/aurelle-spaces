-- ============================================================================
-- Migration: 0003_admin_sessions.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Creates server-managed admin_sessions table with SHA-256 token
--              hashing, and admin_login_attempts table for rate-limiting.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. ADMIN SESSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_active_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- ----------------------------------------------------------------------------
-- 2. ADMIN LOGIN ATTEMPTS (Abuse Prevention & Rate Limiting)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now')),
  success INTEGER NOT NULL DEFAULT 0 CHECK (success IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_email ON admin_login_attempts(email, attempted_at);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip ON admin_login_attempts(ip_address, attempted_at);

