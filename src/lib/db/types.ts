/**
 * Aurelle Spaces — Database Entity Types & Query Contracts
 * 
 * Strict TypeScript representations of the Cloudflare D1 schema entities,
 * input shapes for create/update operations, query filters, and pagination parameters.
 */

/* ==========================================================================
   1. Core Entity Record Definitions (Mirroring D1 tables)
   ========================================================================== */

export type AdminRole = "super_admin" | "editor" | "viewer" | "studio_director" | "lead_architect";
export type AdminAccountStatus = "active" | "suspended" | "deactivated";

export interface AdminUserRecord {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  role: AdminRole;
  account_status: AdminAccountStatus;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface AdminSessionRecord {
  id: string;
  admin_id: string;
  token_hash: string;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: string;
  created_at: string;
  last_active_at: string;
}

export interface AdminLoginAttemptRecord {
  id: string;
  email: string;
  ip_address: string;
  attempted_at: string;
  success: number;
}

export type ContentStatus = "draft" | "published" | "archived";

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ContentStatus;
  sort_order: number;
  seo_metadata: string | null; // JSON string
  created_at: string;
  updated_at: string;
}

export type ProjectCategory =
  | "Residential Interiors"
  | "Commercial Interiors"
  | "Architecture & Space Planning"
  | "Renovation & Refurbishment";

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  summary: string;
  detailed_content: string; // JSON string
  featured: number; // 0 | 1
  publication_status: ContentStatus;
  seo_metadata: string | null; // JSON string
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRecord {
  id: string;
  r2_object_key: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  uploading_admin_id: string | null;
  created_at: string;
}

export interface ProjectMediaRecord {
  id: string;
  project_id: string;
  media_asset_id: string;
  sort_order: number;
  caption: string | null;
  alt_text: string | null;
  created_at: string;
}

export interface JournalArticleRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  article_content: string; // JSON string
  cover_media_id: string | null;
  publication_status: ContentStatus;
  published_at: string | null;
  seo_metadata: string | null; // JSON string
  created_at: string;
  updated_at: string;
}

export type EnquirySource = "web_form" | "website_contact" | "chatbot" | "ai_chatbot" | "direct_email" | "phone" | "partner";
export type EnquiryStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "qualified"
  | "consultation_scheduled"
  | "proposal_sent"
  | "won"
  | "lost"
  | "in_progress"
  | "closed"
  | "archived";

export interface EnquiryRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string;
  project_type: string;
  property_type: string | null;
  approximate_area: string | null;
  budget_range: string | null;
  expected_timeline: string | null;
  project_description: string;
  consent_at: string;
  enquiry_source: EnquirySource;
  status: EnquiryStatus;
  assigned_admin_id: string | null;
  idempotency_key?: string | null;
  conversation_id?: string | null;
  followup_reminder_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnquiryNoteRecord {
  id: string;
  enquiry_id: string;
  author_id: string;
  author_name?: string;
  author_email?: string;
  note_content: string;
  created_at: string;
}

export type ConversationStatus = "active" | "qualified_lead" | "resolved" | "abandoned";

export interface ChatConversationRecord {
  id: string;
  session_id: string;
  conversation_status: ConversationStatus;
  consent_state: number; // 0 | 1
  linked_enquiry_id?: string | null;
  lead_state?: string | null;
  created_at: string;
  updated_at: string;
}

export type SenderRole = "user" | "assistant" | "system";

export interface ChatMessageRecord {
  id: string;
  conversation_id: string;
  sender_role: SenderRole;
  message_content: string;
  created_at: string;
}

export type ProcessingStatus = "pending" | "processing" | "completed" | "failed" | "retrying" | "dead_letter";

export interface AutomationEventRecord {
  id: string;
  event_type: string;
  related_entity_id: string;
  payload_reference: string | null;
  processing_status: ProcessingStatus;
  attempt_count: number;
  next_retry_at: string | null;
  last_error_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationDeliveryRecord {
  id: string;
  event_id: string;
  workflow_name: string;
  entity_id: string;
  purpose: string;
  idempotency_key: string;
  status: string;
  provider_name: string | null;
  provider_message_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingRecord {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface AuditLogRecord {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  safe_metadata: string | null;
  created_at: string;
}

/* ==========================================================================
   2. Pagination & Sorting Parameters
   ========================================================================== */

export interface PageParams {
  page?: number;
  limit?: number;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOrder = "ASC" | "DESC";

export interface SortOptions<T extends string = string> {
  field: T;
  order: SortOrder;
}
