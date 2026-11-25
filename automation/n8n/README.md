# Aurelle Spaces — n8n Business Automation Workflows

This directory contains the production-grade, importable workflow definitions for **Aurelle Spaces**, powering real-time lead notifications, client acknowledgements, architect assignments, follow-up reminders, and dead-letter failure alerts.

---

## 1. Directory Structure

```
automation/n8n/
├── new-enquiry-notification.json       # Inbound webhook: enquiry.created -> Studio Team Alert
├── customer-acknowledgement.json       # Inbound webhook: enquiry.created -> Client Confirmation Receipt
├── lead-assignment-notification.json   # Inbound webhook: enquiry.assigned -> Assigned Architect Alert
├── follow-up-reminder.json             # Scheduled cron: 09:00 IST -> Uncontacted Enquiries Triage
├── automation-failure-alert.json       # Inbound webhook: automation.delivery_failed -> Tech Lead Alert
└── README.md                           # Operational runbook and import guide
```

---

## 2. Compatibility & Versioning

- **Required n8n Version:** `v1.0.0` or later (Tested with n8n `1.70.0+` using Node.js 20+ runtime).
- **Execution Order Engine:** `v1`
- **Application Compatibility:** Next.js App Router (15+ / 16.4.6) with Cloudflare Workers runtime.
- **Event Envelope Version:** `1.0.0` (`schema_version: "1.0.0"`).

---

## 3. Workflow Catalog

| # | Workflow File | Trigger | Purpose | Delivery Target |
|---|---|---|---|---|
| **1** | `new-enquiry-notification.json` | Webhook `enquiry.created` | Alerts the studio team of fresh consultation submissions with project scope | Studio Team Email |
| **2** | `customer-acknowledgement.json` | Webhook `enquiry.created` | Sends polite, formal confirmation to prospective clients adhering to exact brand copy | Client Email |
| **3** | `lead-assignment-notification.json` | Webhook `enquiry.assigned` | Informs assigned studio architects/directors of newly assigned project dossiers | Assigned Admin Email |
| **4** | `follow-up-reminder.json` | Schedule (`30 3 * * 1-5` / 09:00 IST) | Scans for New leads uncontacted beyond 24h to prevent stale triage | Assigned Admin / Studio Email |
| **5** | `automation-failure-alert.json` | Webhook `automation.delivery_failed` | Alerts technical administrators when an outbox event enters `dead_letter` status | Alerts Tech Lead Email |

---

## 4. Webhook Authentication & Cryptographic Contract

All inbound webhooks dispatched from the Aurelle Spaces Cloudflare transactional outbox are signed using **HMAC-SHA256** over raw request body bytes.

### Inbound Headers
- `X-Aurelle-Signature`: Hex-encoded HMAC-SHA256 signature using `N8N_WEBHOOK_SECRET`.
- `X-Aurelle-Timestamp`: ISO 8601 timestamp (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- `X-Aurelle-Event-ID`: Unique event identifier (e.g. `evt_...`).
- `X-Aurelle-Event-Type`: Dot-notated event type (e.g. `enquiry.created`).
- `X-Aurelle-Schema-Version`: `1.0.0`.

### In-Workflow Verification (Node: Code)
Every inbound webhook workflow begins with a cryptographic verification node executing:
1. **Header Presence Check:** Rejects requests missing signature, timestamp, or event ID.
2. **Replay Attack Window:** Calculates drift between `X-Aurelle-Timestamp` and `Date.now()`. Rejects requests older than **300 seconds (5 minutes)**.
3. **HMAC-SHA256 Match:** Calculates `crypto.createHmac('sha256', secret).update(body).digest('hex')` and validates equality.
4. **Anti-Loop Defense:** In `automation-failure-alert.json`, suppresses execution if the incoming failure was itself triggered by an alert failure, preventing infinite notification loops.

---

## 5. Environment Variables & Secret Configuration

Configure the following environment variables within your n8n environment (or via `Settings > Variables` in the n8n UI):

| Variable Name | Required | Default / Placeholder | Description |
|---|---|---|---|
| `N8N_WEBHOOK_SECRET` | **Yes** | `<configured_shared_secret>` | Shared secret for HMAC-SHA256 webhook verification. Must match Cloudflare Worker secret. |
| `AUTOMATION_INTEGRATION_TOKEN` | **Yes** | `<machine_bearer_token>` | Machine Bearer token for accessing Aurelle Spaces APIs (`/api/automations/*`). |
| `STUDIO_NOTIFICATION_EMAIL` | **Yes** | `studio@aurelle.dsecops88.online` | Destination address for internal studio notifications. |
| `ALERT_RECIPIENT_EMAIL` | **Yes** | `alerts@aurelle.dsecops88.online` | Destination address for technical failure alerts. |
| `SMTP_HOST` / Credentials | Conditional | Configured in n8n Credentials | SMTP relay or Resend integration credentials for email delivery. |

---

## 6. Import Procedure

> **IMPORTANT:** In accordance with project governance, do NOT activate these workflows or trigger live emails until testing and verification phases in Prompts 18–20.

1. **Log in to your n8n instance.**
2. Navigate to **Workflows** in the sidebar.
3. Click the menu dropdown `...` at the top right and select **Import from File**.
4. Import the workflows in the recommended sequence:
   - `automation-failure-alert.json` (Alert foundation)
   - `lead-assignment-notification.json`
   - `customer-acknowledgement.json`
   - `new-enquiry-notification.json`
   - `follow-up-reminder.json` (Scheduled trigger)
5. For each workflow:
   - Open the **Webhook** node and note the generated Webhook Path.
   - Verify that the Email node is mapped to your configured SMTP or email credentials.
   - Ensure the workflow toggle remains **INACTIVE (`active: false`)**.

---

## 7. Downstream Delivery Status Reporting

Each workflow reports delivery results back to the application via:
`POST https://aurelle.dsecops88.online/api/automations/callback`

### Headers:
- `Authorization: Bearer {{ $env.AUTOMATION_INTEGRATION_TOKEN }}`
- `Content-Type: application/json`

### Payload:
```json
{
  "event_id": "evt_abc123",
  "workflow_name": "customer-acknowledgement",
  "entity_id": "enq_xyz789",
  "purpose": "customer_acknowledgement",
  "idempotency_key": "cust_ack_enq_xyz789",
  "status": "provider_accepted",
  "provider_name": "smtp_client_relay"
}
```

The application tracks states across:
1. `event_created`
2. `webhook_delivered`
3. `workflow_accepted`
4. `notification_attempted`
5. `provider_accepted`
6. `provider_rejected`
7. `delivery_failed`

---

## 8. Failure Recovery & Dead Letter Triage

When an outbox event encounters transport failure:
1. **Exponential Retry:** The Cloudflare outbox worker retries at intervals of $2^{\text{attempts}}$ minutes ($2, 4, 8, 16, 32$ mins).
2. **Dead Letter Transition:** Upon exceeding 5 attempts, the event status transitions to `dead_letter`.
3. **Failure Alert Emission:** An `automation.delivery_failed` event is automatically enqueued to notify the tech lead.
4. **Manual Retry:** Authorized administrators can trigger immediate re-dispatch via the Admin Automation Dashboard at `/admin/automations` or `POST /api/admin/automations/[id]/retry`.

