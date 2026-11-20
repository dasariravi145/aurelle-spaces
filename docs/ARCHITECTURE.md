# System Architecture & Technical Specifications

**Project:** Aurelle Spaces  
**Client / Organisation:** DRK Information Software Solutions  
**Planned Production Target:** `https://aurelle.dsecops88.online`  
**Current State:** Prompt 01 (Foundation Initialisation)

---

## 1. Architectural Philosophy & Objectives

Aurelle Spaces is designed as an architectural and interior design showcase platform. The digital architecture adheres to four foundational pillars:

1. **Modular Monolith over Microservices:** Rather than introducing multiple microservices, container orchestrators, or disparate backend APIs, the entire application lives inside a single, highly structured Next.js codebase. This minimizes infrastructure overhead, simplifies deployment, and eliminates distributed failure modes.
2. **Edge-First Deployment Target:** The application is architected for Cloudflare Workers via `@opennextjs/cloudflare`. By executing close to end-users on Cloudflare's global edge network, the studio achieves sub-100ms response times globally.
3. **Strict Domain Boundary Isolation:** Code is partitioned into distinct business domains (`portfolio`, `services`, `journal`, `enquiries`, `admin`) and infrastructure layers (`auth`, `db`, `storage`, `chat`, `automation`), preventing tight coupling and facilitating seamless incremental development across the 20-prompt sequence.
4. **Zero-Trust Secret Management:** No API keys, database credentials, or secret tokens are ever committed to version control. Local development relies on non-committed `.env.local` files, while production deployments use encrypted Cloudflare Worker secrets.

---

## 2. Technology Stack & Decision Matrix

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js App Router | Modern React Server Components (RSC), static and dynamic rendering, streaming SSR, and optimized asset handling. |
| **Language** | TypeScript (Strict) | Compile-time safety across all domain models, contracts, and API boundaries. |
| **Styling** | Tailwind CSS v4 | Zero-runtime CSS compilation, fine-grained typography tokens, and predictable design consistency. |
| **Edge Adapter** | `@opennextjs/cloudflare` | The official OpenNext adapter for Cloudflare Workers, supporting App Router server functions, image optimization, and worker routing. |
| **Edge Platform** | Cloudflare Workers (`workerd`) | Global edge compute with near-instant cold starts, zero server maintenance, and seamless binding to D1 and R2. |
| **Database** | Cloudflare D1 (Planned P12) | Serverless relational SQLite distributed at the edge, native to Cloudflare Workers with zero TCP connection pooling bottlenecks. |
| **Object Storage** | Cloudflare R2 (Planned P13) | S3-compatible object storage with zero egress fees, ideal for high-resolution architectural photography. |
| **Workflow Automation** | n8n Webhook Integration (Planned P14) | Extensible workflow orchestration for client consultation routing, CRM updates, and lead notifications. |
| **AI Assistant** | Google Gemini API (Planned P11) | High-performance, contextual conversational AI assisting prospective clients with design enquiries. |

---

## 3. Directory Layout & Layer Boundaries

```
src/
├── app/                      # Next.js App Router Layer
│   ├── (public)/             # (Future) Public-facing routes (home, portfolio, journal, contact)
│   ├── (admin)/              # (Future) Protected studio administrative routes
│   ├── api/                  # (Future) Edge API route handlers (webhooks, enquiries, chat)
│   ├── globals.css           # Global stylesheet and CSS design tokens
│   ├── layout.tsx            # Root HTML layout, font injection & metadata
│   ├── not-found.tsx         # Branded 404 error experience
│   └── page.tsx              # Foundational root presentation page
│
├── components/               # Presentation & UI Components
│   ├── ui/                   # Atomic, reusable design primitives (Container, Button, Modal)
│   └── layout/               # Layout components (Header, Footer, Navigation, Breadcrumbs)
│
├── modules/                  # Business Domain Boundaries
│   ├── admin/                # Admin dashboards, telemetry & content management contracts
│   ├── enquiries/            # Client consultation bookings & brief submissions
│   ├── journal/              # Design editorial articles, essays & thought leadership
│   ├── portfolio/            # Architectural projects, case studies & photography
│   └── services/             # Studio offerings, design methodology & deliverables
│
└── lib/                      # Infrastructure & External Integrations
    ├── auth/                 # Session tokens, RBAC, and user verification
    ├── automation/           # n8n payload formatting and HMAC webhook dispatch
    ├── chat/                 # Conversational business assistant interface & prompt contracts
    ├── db/                   # Cloudflare D1 query builders, migrations & connection abstraction
    ├── env.ts                # Environment variable parsing and type-safe validation
    └── storage/              # Cloudflare R2 media upload and presigned asset delivery
```

---

## 4. Cloudflare Workers Edge Compatibility Principles

Deploying Next.js to Cloudflare Workers requires adhering to specific runtime constraints:

1. **`nodejs_compat` Flag:** Enabled in `wrangler.jsonc` to provide polyfills for essential Node.js APIs (such as `crypto`, `Buffer`, and `AsyncLocalStorage`).
2. **No Native C++ Binaries:** No libraries relying on native Node bindings (e.g., standard `sqlite3`, `canvas`, `bcrypt` C++ addons) may be introduced. Use pure JavaScript/Wasm equivalents (e.g., Web Crypto API, D1 native binding).
3. **Direct D1 & R2 Bindings:** Rather than opening remote TCP connection pools to external databases, the application directly accesses Cloudflare D1 (`env.DB`) and Cloudflare R2 (`env.MEDIA_BUCKET`) via injected worker bindings.
4. **Asset Separation:** Static files and pre-rendered HTML are emitted to `.open-next/assets`, while server execution logic is bundled into `.open-next/worker.js`.

---

## 5. Security Architecture

1. **Secrets Isolation:** No credentials exist in code. All configuration values pass through `src/lib/env.ts`.
2. **Strict Sanitization:** Client submissions (consultation requests and enquiries) will be validated using strict schemas before dispatch to D1 or n8n webhooks.
3. **Content Security Policy (CSP):** Planned for implementation in Prompt 19, enforcing strict script sources, image origins (Cloudflare R2 domain), and HTTPS-only traffic.

