-- ============================================================================
-- Migration: 0005_chat_lead_qualification.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Adds bidirectional linking between chat conversations and enquiries,
--              and stores structured conversational lead qualification state.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. EXTEND CHAT CONVERSATIONS TABLE
-- ----------------------------------------------------------------------------
-- Add linked_enquiry_id to associate a qualified chat with its confirmed enquiry
ALTER TABLE chat_conversations ADD COLUMN linked_enquiry_id TEXT REFERENCES enquiries(id) ON DELETE SET NULL;

-- Store server-side structured qualification state (JSON string)
ALTER TABLE chat_conversations ADD COLUMN lead_state TEXT;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_enquiry ON chat_conversations(linked_enquiry_id);

-- ----------------------------------------------------------------------------
-- 2. EXTEND ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
-- Add conversation_id to track conversational provenance
ALTER TABLE enquiries ADD COLUMN conversation_id TEXT REFERENCES chat_conversations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_enquiries_conversation ON enquiries(conversation_id);

