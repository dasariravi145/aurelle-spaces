-- ============================================================================
-- Migration: 0001_initial_schema.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Core relational schema covering 11 architectural studio entities:
--              admin_users, services, projects, media_assets, project_media,
--              journal_articles, enquiries, chat_conversations, chat_messages,
--              automation_events, and audit_logs.
-- ============================================================================

-- Enforce Foreign Key integrity
PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. ADMIN USERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'studio_director', 'lead_architect', 'editor')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ----------------------------------------------------------------------------
-- 2. SERVICES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status_sort ON services(status, sort_order);

-- ----------------------------------------------------------------------------
-- 3. MEDIA ASSETS (Created before dependent tables)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  r2_object_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT NOT NULL DEFAULT '',
  uploading_admin_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_assets_key ON media_assets(r2_object_key);
CREATE INDEX IF NOT EXISTS idx_media_assets_mime ON media_assets(mime_type);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Residential Interiors',
    'Commercial Interiors',
    'Architecture & Space Planning',
    'Renovation & Refurbishment'
  )),
  summary TEXT NOT NULL,
  detailed_content TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  seo_metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_publication_featured ON projects(publication_status, featured);

-- ----------------------------------------------------------------------------
-- 5. PROJECT MEDIA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_media (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  alt_text TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (project_id, media_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_project_media_proj_sort ON project_media(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_media_asset ON project_media(media_asset_id);

-- ----------------------------------------------------------------------------
-- 6. JOURNAL ARTICLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  article_content TEXT NOT NULL,
  cover_media_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  published_at TEXT,
  seo_metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journal_articles_slug ON journal_articles(slug);
CREATE INDEX IF NOT EXISTS idx_journal_articles_pub_date ON journal_articles(publication_status, published_at);
CREATE INDEX IF NOT EXISTS idx_journal_articles_category ON journal_articles(category);

-- ----------------------------------------------------------------------------
-- 7. ENQUIRIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  project_type TEXT NOT NULL,
  property_type TEXT,
  approximate_area TEXT,
  budget_range TEXT,
  expected_timeline TEXT,
  project_description TEXT NOT NULL,
  consent_at TEXT NOT NULL DEFAULT (datetime('now')),
  enquiry_source TEXT NOT NULL DEFAULT 'web_form' CHECK (enquiry_source IN (
    'web_form',
    'chatbot',
    'direct_email',
    'phone',
    'partner'
  )),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',
    'reviewed',
    'contacted',
    'consultation_scheduled',
    'in_progress',
    'closed',
    'archived'
  )),
  assigned_admin_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);

-- ----------------------------------------------------------------------------
-- 8. CHAT CONVERSATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_conversations (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  conversation_status TEXT NOT NULL DEFAULT 'active' CHECK (conversation_status IN (
    'active',
    'qualified_lead',
    'resolved',
    'abandoned'
  )),
  consent_state INTEGER NOT NULL DEFAULT 0 CHECK (consent_state IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(conversation_status);

-- ----------------------------------------------------------------------------
-- 9. CHAT MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_created ON chat_messages(conversation_id, created_at);

-- ----------------------------------------------------------------------------
-- 10. AUTOMATION EVENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automation_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  related_entity_id TEXT NOT NULL,
  payload_reference TEXT,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'retrying',
    'dead_letter'
  )),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TEXT,
  last_error_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_automation_events_status_retry ON automation_events(processing_status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_automation_events_entity ON automation_events(related_entity_id);

-- ----------------------------------------------------------------------------
-- 11. AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  safe_metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created ON audit_logs(actor_id, created_at);

