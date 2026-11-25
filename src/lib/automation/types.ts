/**
 * Aurelle Spaces — Automation Event & n8n Integration Types
 * 
 * Versioned event payload envelopes, webhook delivery results, downstream status tracking,
 * and event schemas for outbound workflow automation (CRM sync, lead notifications, alerts).
 */

export type AutomationSchemaVersion = "1.0.0";

export interface AutomationEventEnvelope<T = unknown> {
  schema_version: AutomationSchemaVersion;
  event_id: string;
  event_type: string;
  occurred_at: string;
  source: "aurelle.spaces";
  entity_id: string;
  payload: T;
}

/**
 * Payload contract for 'enquiry.created' event.
 * Data minimised for notification workflows without exposing private chat histories.
 */
export interface EnquiryCreatedPayload {
  enquiry_id: string;
  reference_code: string;
  source: "website_contact" | "ai_chatbot";
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  city: string;
  project_type: string;
  property_type?: string | null;
  approximate_area?: string | null;
  budget_range?: string | null;
  expected_timeline?: string | null;
  project_description: string;
  submitted_at: string;
}

/**
 * Payload contract for 'enquiry.assigned' event.
 * Dispatched when an administrator assigns an enquiry to a team member.
 */
export interface EnquiryAssignedPayload {
  enquiry_id: string;
  reference_code: string;
  assigned_admin_id: string;
  assigned_admin_name: string;
  assigned_admin_email: string;
  assigned_by_id?: string;
  assigned_by_name?: string;
  project_type: string;
  city: string;
  assigned_at: string;
}

/**
 * Payload contract for 'enquiry.followup_due' event.
 * Emitted during scheduled follow-up checks for uncontacted enquiries.
 */
export interface EnquiryFollowupDuePayload {
  enquiry_id: string;
  reference_code: string;
  client_name: string;
  client_email: string;
  project_type: string;
  city: string;
  status: string;
  assigned_admin_id: string | null;
  assigned_admin_name?: string | null;
  assigned_admin_email?: string | null;
  created_at: string;
  hours_uncontacted: number;
  reminder_window: string;
}

/**
 * Payload contract for 'automation.delivery_failed' alert event.
 * Dispatched when an outbox event reaches dead letter status or critical error.
 */
export interface AutomationDeliveryFailedPayload {
  event_id: string;
  failed_event_type: string;
  related_entity_id: string;
  attempt_count: number;
  failure_category:
    | "network_timeout"
    | "auth_failure"
    | "provider_rejected"
    | "max_retries_exceeded"
    | "malformed_payload"
    | "unconfigured";
  error_summary: string;
  failed_at: string;
  monitor_url: string;
}

/**
 * Downstream delivery status reported by n8n or notification providers.
 */
export type DeliveryTrackingStatus =
  | "event_created"
  | "webhook_delivered"
  | "workflow_accepted"
  | "notification_attempted"
  | "provider_accepted"
  | "provider_rejected"
  | "delivery_failed";

export interface AutomationDeliveryResult {
  success: boolean;
  statusCode?: number;
  acknowledged: boolean;
  n8nExecutionId?: string;
  retryAfterSeconds?: number;
  errorMessage?: string;
  deliveredAt: string;
}

export interface AutomationDeliveryCallbackPayload {
  event_id: string;
  workflow_name: string;
  entity_id: string;
  purpose: "studio_notification" | "customer_acknowledgement" | "lead_assignment" | "followup_reminder" | "failure_alert";
  idempotency_key: string;
  status: DeliveryTrackingStatus;
  provider_name?: string;
  provider_message_id?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export interface StudioNotificationSettings {
  studioNotificationEmail: string;
  customerAckEnabled: boolean;
  assignmentNotificationEnabled: boolean;
  followupReminderHours: number;
  failureAlertEmail: string;
  automationMasterEnabled: boolean;
  updatedAt?: string;
  updatedBy?: string;
}
