-- ============================================================================
-- Migration: 0006_automation_workflows_and_settings.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Extends enquiries with follow-up reminder timestamps, creates
--              system_settings table for studio automation preferences, and
--              creates automation_delivery_records for durable idempotency
--              and downstream provider delivery tracking.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. EXTEND ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
-- Tracks the last time a follow-up reminder was dispatched for uncontacted enquiries
ALTER TABLE enquiries ADD COLUMN followup_reminder_at TEXT;

CREATE INDEX IF NOT EXISTS idx_enquiries_followup ON enquiries(status, created_at, followup_reminder_at);

-- ----------------------------------------------------------------------------
-- 2. SYSTEM SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Seed default notification settings (safe defaults, no secrets stored)
INSERT OR IGNORE INTO system_settings (key, value, description, updated_at)
VALUES (
  'studio_notification_settings',
  '{"studioNotificationEmail":"studio@aurelle.dsecops88.online","customerAckEnabled":true,"assignmentNotificationEnabled":true,"followupReminderHours":24,"failureAlertEmail":"alerts@aurelle.dsecops88.online","automationMasterEnabled":true}',
  'Studio notification and n8n automation configuration',
  datetime('now')
);

-- ----------------------------------------------------------------------------
-- 3. AUTOMATION DELIVERY RECORDS TABLE (DURABLE IDEMPOTENCY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automation_delivery_records (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES automation_events(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'attempted',
    'provider_accepted',
    'provider_rejected',
    'completed',
    'failed'
  )),
  provider_name TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_delivery_records_event ON automation_delivery_records(event_id);
CREATE INDEX IF NOT EXISTS idx_delivery_records_entity_purpose ON automation_delivery_records(entity_id, purpose);
CREATE INDEX IF NOT EXISTS idx_delivery_records_idempotency ON automation_delivery_records(idempotency_key);

