# Secure n8n Integration, Webhook Delivery & Automation Architecture
**Project:** Aurelle Spaces — Premium Architecture & Interior Design Studio  
**Production Domain:** `https://aurelle.dsecops88.online`  
**Implemented In:** Prompts 14 & 15 of 20  
**Status:** Complete (Edge D1 Outbox, Signed Webhook Client, 5 Importable n8n Workflows, Delivery Tracking & Machine Integration APIs)

---

## 1. Executive Architectural Overview

The **Aurelle Spaces Automation Engine** provides an edge-native, reliable, transactional outbox architecture connecting studio web events with self-hosted or cloud-hosted **n8n workflow automation pipelines**.

### Core Tenets:
1. **Transactional Outbox Pattern:** Outbound events are written transactionally to the Cloudflare D1 `automation_events` table during the same request that persists the business entity (e.g. `enquiries`). Webhook calls are never fired directly from client browsers.
2. **End-to-End Cryptographic Authenticity:** Every webhook dispatch is cryptographically signed using **HMAC-SHA256** over the exact UTF-8 request body bytes. n8n workflows verify signatures using the shared secret to reject spoofed or tampered requests.
3. **At-Least-Once Delivery with Durable Idempotency:** Every event possesses a permanent, unique `event_id` and stable payload reference. Downstream workflows deduplicate using `idempotency_key` stored in D1 `automation_delivery_records` before triggering notifications.
4. **Bounded Exponential Backoff:** Failed webhook deliveries undergo exponential retry delays ($2^{\text{attempts}}$ minutes) up to a configurable maximum (default 5 attempts), after which they transition to a `dead_letter` state.
5. **Anti-Loop Alert Cascade Defense:** When an outbox event reaches dead letter status, a single `automation.delivery_failed` event is enqueued. Alert workflows check `failed_event_type !== "automation.delivery_failed"` to permanently prevent recursive failure loops.
6. **No Blind Success:** Delivery status transitions to `completed` ONLY when the target n8n endpoint acknowledges receipt with an HTTP 2xx response. Transport delivery is strictly distinguished from downstream provider delivery (e.g. SMTP / Resend).
7. **Data Minimisation & Privacy:** Outbox payloads contain only essential qualification fields. Full conversational chat histories, admin passwords, session tokens, and extraneous data are never transmitted to n8n or included in notification emails.

---

## 2. Event Envelope & Payload Contracts

### Versioned Envelope Schema (`AutomationEventEnvelope<T>`)
Every outbound webhook sends an identical envelope structure:

```typescript
interface AutomationEventEnvelope<T = unknown> {
  schema_version: "1.0.0";
  event_id: string;        // Permanent UUID (e.g. "evt_7f8a9b0c1d2e")
  event_type: string;      // Dot-notated domain event (e.g. "enquiry.created")
  occurred_at: string;     // ISO 8601 UTC timestamp
  source: "aurelle.spaces";// System origin identifier
  entity_id: string;       // Related entity ID (e.g. "enq_123456")
  payload: T;              // Strongly-typed event data
}
```

### Event Payload Contracts:

#### 1. `enquiry.created`
```typescript
interface EnquiryCreatedPayload {
  enquiry_id: string;
  reference_code: string;       // e.g. "AUR-2F3A4B"
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
```

#### 2. `enquiry.assigned`
```typescript
interface EnquiryAssignedPayload {
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
```

#### 3. `enquiry.followup_due`
```typescript
interface EnquiryFollowupDuePayload {
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
```

#### 4. `automation.delivery_failed`
```typescript
interface AutomationDeliveryFailedPayload {
  event_id: string;
  failed_event_type: string;
  related_entity_id: string;
  attempt_count: number;
  failure_category: "network_timeout" | "auth_failure" | "provider_rejected" | "max_retries_exceeded" | "malformed_payload" | "unconfigured";
  error_summary: string;
  failed_at: string;
  monitor_url: string;
}
```

---

## 3. Production n8n Business Workflows

The repository includes five importable n8n workflow definitions in `/automation/n8n/`:

### 1. New Enquiry Notification (`new-enquiry-notification.json`)
- **Trigger:** Webhook `POST /webhook/enquiry-created` (`enquiry.created`).
- **Function:** Verifies HMAC-SHA256 signature and timestamp drift (< 300s). Dispatches high-fidelity HTML and plaintext notifications to `STUDIO_NOTIFICATION_EMAIL`. Generates authenticated admin URL (`/admin/enquiries/[id]`). Reports outcome back to `/api/automations/callback`.

### 2. Customer Acknowledgement (`customer-acknowledgement.json`)
- **Trigger:** Webhook `POST /webhook/customer-acknowledgement` (`enquiry.created`).
- **Function:** Validates client email format and affirmative privacy consent. Queries pre-flight idempotency check (`/api/automations/callback?check_only=true`) with `idempotency_key = "cust_ack_{enquiry_id}"`. Dispatches respectful, calm Indian business English acknowledgement to prospective client without making premature promises or false consultation scheduling claims. Reports provider status.

### 3. Lead Assignment Notification (`lead-assignment-notification.json`)
- **Trigger:** Webhook `POST /webhook/enquiry-assigned` (`enquiry.assigned`).
- **Function:** Emitted when an administrator assigns an enquiry via `PATCH /api/admin/enquiries/[id]/assign`. Verifies active target assignee email. Dispatches notification to the assigned architect or studio director with reference code and safe link. Applies data minimisation by excluding complete client transcripts.

### 4. Pending Enquiry Follow-up Reminder (`follow-up-reminder.json`)
- **Trigger:** Scheduled Cron Trigger (`30 3 * * 1-5` / 09:00 IST weekdays).
- **Function:** Authenticates against `/api/automations/reminders/pending` using Bearer machine token. Scans for New status enquiries remaining uncontacted beyond configured threshold (e.g. 24h). Dispatches reminder to assigned architect or studio fallback. Calls `/api/automations/reminders/mark-sent` to update `followup_reminder_at` and prevent duplicate alerts.

### 5. Automation Failure Alert (`automation-failure-alert.json`)
- **Trigger:** Webhook `POST /webhook/automation-failure-alert` (`automation.delivery_failed`).
- **Function:** Dispatched when an outbox event enters `dead_letter` status. Features strict anti-loop suppression (`if (failed_event_type === 'automation.delivery_failed') drop`). Sends high-priority alert to `ALERT_RECIPIENT_EMAIL` with error summary, retry count, and direct link to `/admin/automations`.

---

## 4. Machine-to-Machine API Security Contract

To support n8n workflows without reusing browser session cookies, dedicated machine integration endpoints are protected via `src/lib/security/machine-auth.ts`:

### Authentication Mechanism
- Header: `Authorization: Bearer <AUTOMATION_INTEGRATION_TOKEN>` or `CRON_SECRET`.
- Alternatively: `X-Aurelle-Signature` HMAC-SHA256 header.
- Verification uses constant-time string comparison (`constantTimeCompare`) to prevent timing side channels.

### Scoped Machine Endpoints:
1. `GET /api/automations/enquiry/[id]`:
   - Returns minimal authorised enquiry details. Never returns password hashes or chat transcripts.
2. `POST /api/automations/callback`:
   - Ingests downstream delivery status (`attempted`, `provider_accepted`, `provider_rejected`, `completed`, `failed`).
   - Supports `?check_only=true` for durable pre-flight idempotency checks.
3. `GET /api/automations/reminders/pending`:
   - Queries uncontacted enquiries older than configured threshold (default 24h). Strictly ignores Won, Lost, Closed, and Archived records.
4. `POST /api/automations/reminders/mark-sent`:
   - Records reminder timestamp to enforce single notification per window.

---

## 5. D1 Schema & Outbox Migration

Implemented via `migrations/0006_automation_workflows_and_settings.sql`:
- **`enquiries.followup_reminder_at`**: Timestamp tracking last dispatched reminder.
- **`system_settings`**: Key-value table storing studio automation and notification preferences (`studio_notification_settings`).
- **`automation_delivery_records`**: Durable idempotency and provider delivery log table with unique constraint on `idempotency_key`.

---

## 6. Admin Automation Management & Settings

Accessible at `/admin/automations`:
1. **Real-time Outbox Monitor:** Real metrics (Total, In Flight, Delivered, Retry Backoff, Dead Letter).
2. **Workflow Name Tagging:** Maps raw event types to human-readable workflow titles.
3. **Manual Retry Action:** Single-click retry for retrying or dead letter events.
4. **Outbox Queue Flush:** Triggers immediate batch run of `processPendingAutomationEvents`.
5. **Studio Notification Settings Modal:** Allows Super Admins to configure studio notification email, failure alert recipient, customer acknowledgement toggle, assignment notification toggle, and follow-up interval hours.
