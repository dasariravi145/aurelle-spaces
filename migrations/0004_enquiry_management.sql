-- ============================================================================
-- Migration: 0004_enquiry_management.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Adds idempotency tracking to enquiries, creates enquiry_notes
--              table for internal studio discussions, and enquiry_rate_limits
--              for public abuse prevention.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. EXTEND ENQUIRIES TABLE WITH IDEMPOTENCY KEY
-- ----------------------------------------------------------------------------
-- Add idempotency_key column to prevent duplicate form submissions
ALTER TABLE enquiries ADD COLUMN idempotency_key TEXT;

CREATE INDEX IF NOT EXISTS idx_enquiries_idempotency ON enquiries(idempotency_key);

-- ----------------------------------------------------------------------------
-- 2. INTERNAL ENQUIRY NOTES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry ON enquiry_notes(enquiry_id, created_at);
CREATE INDEX IF NOT EXISTS idx_enquiry_notes_author ON enquiry_notes(author_id);

-- ----------------------------------------------------------------------------
-- 3. PUBLIC ENQUIRY RATE LIMITS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiry_rate_limits (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiry_rate_limits_ip ON enquiry_rate_limits(ip_address, submitted_at);

