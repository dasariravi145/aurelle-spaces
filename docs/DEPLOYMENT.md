# Cloudflare Deployment Strategy & Operations Guide

**Application:** Aurelle Spaces  
**Production Target:** `https://aurelle.dsecops88.online`  
**Adapter:** `@opennextjs/cloudflare`  
**Runtime Engine:** Cloudflare Workers (`workerd`)

---

## 1. Deployment Architecture Overview

Next.js on Cloudflare Workers utilizes the **OpenNext for Cloudflare** architecture:

```
┌────────────────────────────────────────────────────────┐
│               Incoming Request from Client             │
│            https://aurelle.dsecops88.online            │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────▼────────────┐
               │ Cloudflare Edge Network │
               └────────────┬────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
    [Static Asset Request]          [Dynamic Route / SSR / API]
            │                               │
 ┌──────────▼──────────┐         ┌──────────▼──────────┐
 │ Cloudflare Assets   │         │ Cloudflare Worker   │
 │ (.open-next/assets) │         │ (.open-next/worker) │
 └─────────────────────┘         └──────────┬──────────┘
                                            │
                                 ┌──────────┴──────────┐
                                 │                     │
                          ┌──────▼──────┐       ┌──────▼──────┐
                          │ Cloudflare  │       │ Cloudflare  │
                          │ D1 Database │       │  R2 Bucket  │
                          │   (env.DB)  │       │ (MEDIA_...) │
                          └─────────────┘       └─────────────┘
```

1. **Static Assets:** Handled directly by Cloudflare's static asset pipeline via `.open-next/assets`, bypassing compute invocation and ensuring fast asset delivery.
2. **Server Logic:** Server components, API routes, and dynamic server-rendered pages execute inside `.open-next/worker.js` on the Cloudflare Workers edge runtime.
3. **Platform Bindings:** D1 database (`env.DB`) and R2 media bucket (`env.MEDIA_BUCKET`) are bound directly without external network latency.

---

## 2. Configuration Files

### `open-next.config.ts`
Defines Cloudflare adapter settings for OpenNext:

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
```

### `wrangler.jsonc`
Instructs Cloudflare Wrangler on how to package and deploy the worker:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "aurelle-spaces",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-02-14",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "vars": {
    "ENVIRONMENT": "production",
    "NEXT_PUBLIC_APP_URL": "https://aurelle.dsecops88.online"
  }
}
```

---

## 3. Provisioning Commands (Prompt 12 to 20)

When moving through the deployment phases, execute the following commands in sequence:

### A. Authentication
```bash
# Login via browser or configure CLOUDFLARE_API_TOKEN environment variable
npx wrangler login
```

### B. Cloudflare D1 Database (Planned for Prompt 12)
```bash
# Create the D1 database
npx wrangler d1 create aurelle-db

# The CLI output will display the database ID. Add it to wrangler.jsonc:
# "d1_databases": [
#   {
#     "binding": "DB",
#     "database_name": "aurelle-db",
#     "database_id": "<RETURNED_DATABASE_ID>"
#   }
# ]

# Apply SQL migrations locally and remotely:
npx wrangler d1 execute aurelle-db --local --file=./migrations/0001_initial_schema.sql
npx wrangler d1 execute aurelle-db --remote --file=./migrations/0001_initial_schema.sql
```

### C. Cloudflare R2 Media Storage (Planned for Prompt 13)
```bash
# Create the production media bucket
npx wrangler r2 bucket create aurelle-media

# Add binding to wrangler.jsonc:
# "r2_buckets": [
#   {
#     "binding": "MEDIA_BUCKET",
#     "bucket_name": "aurelle-media"
#   }
# ]
```

### D. Environment Secrets Provisioning
```bash
# Set encrypted secrets directly in Cloudflare Workers
npx wrangler secret put AUTH_SECRET
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put EMAIL_API_KEY
npx wrangler secret put N8N_WEBHOOK_SECRET
```

### E. Custom Domain Configuration (Planned for Prompt 20)
In Cloudflare Dashboard or via `wrangler.jsonc`:
```jsonc
"routes": [
  {
    "pattern": "aurelle.dsecops88.online/*",
    "custom_domain": true
  }
]
```
Ensure DNS for `aurelle.dsecops88.online` is proxied through Cloudflare with an appropriate SSL/TLS encryption mode (Full or Strict).

---

## 4. Build & Deployment Execution

```bash
# 1. Build the OpenNext Cloudflare bundle
npm run build:cloudflare

# 2. Preview locally using Wrangler Miniflare
npm run preview:cloudflare

# 3. Deploy to production
npm run deploy:cloudflare
```

---

## 5. Development vs Production Environment Matrix

| Setting | Local Development | Cloudflare Production |
| :--- | :--- | :--- |
| **Command** | `npm run dev` (`next dev`) | `npm run build:cloudflare && npm run deploy:cloudflare` |
| **Server Engine** | Node.js / Turbopack | Cloudflare Workers (`workerd`) |
| **App URL** | `http://localhost:3000` | `https://aurelle.dsecops88.online` |
| **Secrets Source** | `.env.local` | `wrangler secret put <KEY>` |
| **D1 Source** | Local Miniflare SQLite | Globally Distributed Cloudflare D1 |
| **R2 Source** | Local Mock / S3 emulator | Cloudflare R2 Global Edge |

