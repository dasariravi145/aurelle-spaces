# Aurelle Spaces — Production Readiness Runbook & Deployment Checklist

**Project:** Aurelle Spaces — Luxury Architecture & Bespoke Interior Design Studio  
**Target Domain:** `https://aurelle.dsecops88.online`  
**Platform Architecture:** Cloudflare Workers with OpenNext (`@opennextjs/cloudflare`), Cloudflare D1 SQL Database, Cloudflare R2 Media Storage, and self-hosted n8n automation engine.

---

## 1. Pre-Deployment Architecture Verification

### 1.1 Edge Compatibility Baseline
- [x] **Next.js App Router (16.4.6)** configured with `@opennextjs/cloudflare` adapter.
- [x] **Cloudflare Workers Runtime:** Edge-compatible Web Crypto API (`crypto.subtle`) utilized exclusively for PBKDF2 password hashing, session tokens, and HMAC-SHA256 webhook signatures.
- [x] **Platform Bindings:** Cloudflare D1 (`DB`) and Cloudflare R2 (`MEDIA_BUCKET`) mapped via typed context helper (`src/lib/env.ts` and `src/lib/db/client.ts`).
- [x] **Zero Node.js Native Dependencies:** Pure TypeScript / Web Standards implementations without unsupported native binaries (`bcrypt`, `fs`, `path` avoided in edge execution paths).

### 1.2 Security & Threat Mitigation Controls
- [x] **HTTP Security Headers:** Configured in `next.config.ts`:
  - `Content-Security-Policy`: Restricts scripts, styles, fonts, connections, and forbids framing (`frame-ancestors 'none'`).
  - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`.
  - `X-Content-Type-Options`: `nosniff`.
  - `X-Frame-Options`: `DENY`.
  - `Referrer-Policy`: `strict-origin-when-cross-origin`.
  - `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()`.
- [x] **Origin & CSRF Guard:** State-changing endpoints (`/api/enquiries`, `/api/chat/enquiry`, `/api/admin/auth/login`, `/api/admin/media/upload`) validate `Origin` and `Referer` headers against `https://aurelle.dsecops88.online` and authorized hosts.
- [x] **Rate Limiting & Abuse Prevention:**
  - Administrative login attempts tracked in D1 (max 5 failed attempts per IP/email per 15-minute sliding window).
  - Public consultation submissions throttled (max 3 submissions per IP per 10-minute sliding window).
  - AI chat message rate limit enforced (max 30 messages per 10 minutes per session).
- [x] **Media Upload Hardening:**
  - 10MB file size limit enforced.
  - Strict MIME whitelist (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
  - Binary magic byte validation (`validateMagicBytes`) prevents extension/header spoofing.
  - Deterministic key partitioning with alphanumeric filename sanitization.
- [x] **Server-Side RBAC Enforcement:**
  - Granular permissions (`cms:*`, `media:*`, `enquiries:*`, `chat:read`, `automations:*`).
  - Automatic rejection of inactive or suspended administrative accounts.
  - Session expiration checks on every authenticated request.

---

## 2. Cloudflare Infrastructure Provisioning Runbook

Execute these steps during production deployment in Prompts 18–20 when credentials and permissions are supplied.

### 2.1 Cloudflare D1 Database Provisioning

1. **Create the Remote D1 Database:**
   ```bash
   npx wrangler d1 create aurelle-db
   ```
   *Record the generated `database_id` and replace the placeholder in `wrangler.jsonc`.*

2. **Apply Database Migrations Sequentially:**
   Apply migrations in exact numerical order:
   ```bash
   # Migration 0001: Core initial schema
   npx wrangler d1 migrations apply aurelle-db --remote
   ```
   *Migrations applied in order:*
   - `0001_initial_schema.sql` — Core tables (projects, services, journal, media, admin_users, sessions, audit_logs)
   - `0002_demonstration_seed.sql` — Demonstration studio data, service offerings, and initial admin account
   - `0003_admin_sessions.sql` — Session tracking and last activity timestamps
   - `0004_enquiry_management.sql` — Consultation enquiries, internal notes, activity timeline, automation events
   - `0005_chat_lead_qualification.sql` — Conversational AI sessions, chat threads, affirmative consent, structured lead parameters
   - `0006_n8n_automation_and_outbox.sql` — Outbox queue, delivery attempts, idempotency keys, automation settings

3. **Verify Seed Administrator Account:**
   Ensure the default Super Administrator credentials have been replaced with a strong production passphrase:
   ```bash
   # Update super admin password hash using PBKDF2-generated string
   npx wrangler d1 execute aurelle-db --remote --command="UPDATE admin_users SET password_hash = '<PBKDF2_HASH>', updated_at = datetime('now') WHERE email = 'director@aurelle.dsecops88.online';"
   ```

### 2.2 Cloudflare R2 Media Storage Provisioning

1. **Create the Production Storage Bucket:**
   ```bash
   npx wrangler r2 bucket create aurelle-media
   ```

2. **Configure Bucket Public Access or Custom Subdomain:**
   Attach the custom domain `media.aurelle.dsecops88.online` to the `aurelle-media` bucket in the Cloudflare Dashboard under **R2 > aurelle-media > Settings > Custom Domains**.

3. **Configure R2 CORS Policy:**
   Under **R2 > aurelle-media > Settings > CORS Policy**, set:
   ```json
   [
     {
       "AllowedOrigins": [
         "https://aurelle.dsecops88.online"
       ],
       "AllowedMethods": [
         "GET",
         "HEAD"
       ],
       "AllowedHeaders": [
         "*"
       ],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

### 2.3 Production Secrets Provisioning

Store all production secrets in Cloudflare Workers encrypted secret storage:

```bash
# 1. Administrative session cryptographic secret (min 32 characters)
npx wrangler secret put AUTH_SECRET

# 2. Google Gemini API Key for conversational studio assistant
npx wrangler secret put GEMINI_API_KEY

# 3. Transactional Email API Key (Resend / SendGrid)
npx wrangler secret put EMAIL_API_KEY

# 4. n8n Outbox Webhook HMAC-SHA256 Signing Secret
npx wrangler secret put N8N_WEBHOOK_SECRET

# 5. Scheduled Batch Trigger Cron Secret
npx wrangler secret put CRON_SECRET
```

### 2.4 Production Variables in `wrangler.jsonc`

Verify that `wrangler.jsonc` specifies the production values:
```jsonc
"vars": {
  "ENVIRONMENT": "production",
  "NEXT_PUBLIC_APP_URL": "https://aurelle.dsecops88.online",
  "NEXT_PUBLIC_MEDIA_URL": "https://media.aurelle.dsecops88.online",
  "AI_PROVIDER": "google-gemini",
  "AI_MODEL": "gemini-2.5-flash",
  "EMAIL_FROM_ADDRESS": "notifications@aurelle.dsecops88.online",
  "STUDIO_CONTACT_RECIPIENT": "studio@aurelle.dsecops88.online",
  "AUTOMATION_ENABLED": "true",
  "AUTOMATION_MAX_RETRIES": "5",
  "N8N_REQUEST_TIMEOUT": "10000"
}
```

---

## 3. Build & Deployment Execution (Prompt 20)

When ready to build and publish to Cloudflare Workers:

```bash
# Step 1: Execute OpenNext Cloudflare Adapter Build
npm run build:cf
# (or: npx @opennextjs/cloudflare)

# Step 2: Deploy to Cloudflare Workers
npx wrangler deploy
```

---

## 4. Post-Deployment Verification Matrix (Smoke Test)

| Step | Surface / Route | Expected Result | Pass/Fail Criteria |
| :---: | :--- | :--- | :--- |
| **1** | `https://aurelle.dsecops88.online/` | HTTP 200, editorial hero, fonts loaded, zero console errors | Must render in under 1.2s |
| **2** | `/sitemap.xml` | Valid XML listing all static & CMS published pages | Must exclude `/admin/` and `/api/` |
| **3** | `/robots.txt` | Disallow `/admin/` and `/api/`, links sitemap | Must return valid text/plain |
| **4** | `/admin/login` | Renders luxury admin sign-in form | Branded, no public indexing |
| **5** | `/admin/login` (Auth test) | Enters valid credentials, redirects to `/admin` | HttpOnly session cookie set |
| **6** | `/admin/projects` | Lists projects from remote D1 | CRUD operations functional |
| **7** | `/admin/media` | Uploads test image (JPEG/PNG/WebP) | Stored in R2, visible in catalog |
| **8** | `/contact` | Submits test consultation brief | Stored in D1, 201 response received |
| **9** | Studio Chatbot | Greets user, answers question, triggers lead card | Structured parameters extracted |
| **10** | Lead Consent Card | Accepts affirmative consent, submits enquiry | Linked to conversation, enquiry created |
| **11** | `/admin/automations` | Verifies outbox event queued for n8n | Status: pending/delivered |
| **12** | Global 404 / 500 | Accesses non-existent route | Branded architectural fallback |

---

## 5. Emergency Rollback & Maintenance Procedures

### 5.1 Immediate Rollback
If an unexpected edge regression occurs after deployment:
```bash
# Roll back to the previous stable Cloudflare Worker deployment:
npx wrangler rollback
```

### 5.2 D1 Database Backup & Export
```bash
# Export remote D1 database to SQL backup file:
npx wrangler d1 export aurelle-db --remote --output="./backups/d1-backup-$(date +%Y%m%d).sql"
```

### 5.3 Administrative Emergency Lockout
To immediately suspend an administrator account in the event of compromised credentials:
```bash
npx wrangler d1 execute aurelle-db --remote --command="UPDATE admin_users SET account_status = 'suspended' WHERE email = 'compromised@domain.com'; DELETE FROM admin_sessions WHERE admin_id = (SELECT id FROM admin_users WHERE email = 'compromised@domain.com');"
```

---

## 6. Summary

The Aurelle Spaces demonstration platform is fully architected and hardened for production deployment. All operational commands, configuration variables, database migration scripts, security policies, and rollback mechanisms are documented and verified.

