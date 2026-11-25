# Aurelle Spaces

> Premium Architecture and Interior Design Studio Demonstration Platform for DRK Information Software Solutions.

**Planned Production URL:** [https://aurelle.dsecops88.online](https://aurelle.dsecops88.online)  
**Implementation Stage:** Prompt 01 of 20 (Foundational Setup & Cloudflare Workers Architecture)

---

## Overview

**Aurelle Spaces** is a bespoke architecture and interior design studio digital presence engineered for exceptional performance, responsive visual typography, and edge deployment. The platform showcases luxury residential, commercial, and landscape projects while providing interactive consultation scheduling, conversational client assistance, and automated lead ingestion.

---

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime Target:** Cloudflare Workers (Edge) via `@opennextjs/cloudflare`
- **Deployment & Orchestration:** Wrangler CLI
- **Database (Planned):** Cloudflare D1 (Distributed SQLite)
- **Object Storage (Planned):** Cloudflare R2 (Global Asset & Portfolio Media Delivery)
- **Automation (Planned):** Self-hosted n8n webhook pipelines
- **Notifications (Planned):** Transactional email integration (Resend / SMTP)

---

## Project Structure

```
aurelle-spaces/
├── .env.example              # Environment variables template
├── docs/                     # Comprehensive architecture and roadmap documentation
│   ├── ARCHITECTURE.md       # Technical architecture and architectural decisions
│   ├── DEPLOYMENT.md         # Cloudflare Workers deployment guide
│   ├── DEVELOPMENT_RULES.md  # Engineering continuity and quality standards
│   └── ROADMAP.md            # 20-prompt complete implementation roadmap
├── open-next.config.ts       # OpenNext Cloudflare adapter configuration
├── public/                   # Static assets (favicons, SVG badges)
├── src/
│   ├── app/                  # Next.js App Router (pages, layouts, error boundaries)
│   │   ├── globals.css       # Tailwind CSS & design variables
│   │   ├── layout.tsx        # Semantic root layout with typography and metadata
│   │   ├── not-found.tsx     # Custom branded 404 handler
│   │   └── page.tsx          # Studio foundation placeholder
│   ├── components/
│   │   └── ui/               # Reusable presentation primitives (Container, etc.)
│   ├── lib/                  # Shared infrastructure & integration boundaries
│   │   ├── auth/             # Authentication & session contracts
│   │   ├── automation/       # n8n webhook & lead ingestion contracts
│   │   ├── chat/             # AI business assistant contracts
│   │   ├── db/               # Cloudflare D1 database contracts
│   │   ├── env.ts            # Environment variable validation & helper
│   │   └── storage/          # Cloudflare R2 media storage contracts
│   └── modules/              # Domain-specific feature modules
│       ├── admin/            # Studio administrative dashboard contracts
│       ├── enquiries/        # Client consultation and booking contracts
│       ├── journal/          # Editorial essays and design publications contracts
│       ├── portfolio/        # Architectural case studies and media contracts
│       └── services/         # Architectural services and scope contracts
├── tsconfig.json             # TypeScript strict configuration with `@/*` alias
└── wrangler.jsonc            # Cloudflare Workers configuration & bindings schema
```

---

## Local Development Setup

### Prerequisites

- **Node.js:** v20+ LTS (Tested on Node.js v22.17.0)
- **npm:** v10+ (Tested on npm 10.9.2)
- **Git:** Installed and available on system PATH

### Installation

```bash
# Clone or navigate to the workspace
cd D:\Projects\aurelle-spaces

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server locally at `http://localhost:3000` |
| `npm run build` | Runs standard Next.js production build |
| `npm run lint` | Executes ESLint across the codebase |
| `npm run type-check` | Performs strict TypeScript compiler checks without emitting files |
| `npm run build:cloudflare` | Builds the application using the OpenNext Cloudflare Workers adapter |
| `npm run preview:cloudflare` | Previews the OpenNext build locally using Cloudflare Wrangler |
| `npm run deploy:cloudflare` | Deploys the built worker to Cloudflare (requires credentials in Prompt 20) |

---

## Verification & Quality Assurance

To verify that the application satisfies all architectural standards:

```bash
# 1. Type check
npm run type-check

# 2. Lint check
npm run lint

# 3. Production build test
npm run build

# 4. Cloudflare adapter build
npm run build:cloudflare
```

---

## Documentation Links

- [Architecture Reference](docs/ARCHITECTURE.md)
- [20-Prompt Implementation Roadmap](docs/ROADMAP.md)
- [Cloudflare Deployment Guide](docs/DEPLOYMENT.md)
- [Development Rules & Continuity](docs/DEVELOPMENT_RULES.md)

---

## License & Attribution

Demonstration platform built for DRK Information Software Solutions. All rights reserved.
# aurelle-spaces
