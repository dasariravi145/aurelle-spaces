# Technical SEO, Structured Data, Analytics & Conversion Tracking Architecture
**Project:** Aurelle Spaces — Premium Architecture & Interior Design Studio  
**Production Domain:** `https://aurelle.dsecops88.online`  
**Implemented In:** Prompt 16 of 20  
**Status:** Complete (Central SEO Config, Dynamic Sitemap, Robots Directives, Schema.org JSON-LD, Cloudflare Analytics & Admin Intelligence)

---

## 1. Central SEO & Metadata Framework

The SEO engine for Aurelle Spaces is designed for high editorial performance and edge compatibility across Cloudflare Workers.

### Core Configuration (`src/lib/seo/config.ts`)
- **Canonical Production Domain:** `https://aurelle.dsecops88.online`
- **Dynamic Resolution:** Resolves via `NEXT_PUBLIC_APP_URL` across edge and preview deployments without hardcoding development URLs into production output.
- **Default Locale:** `en_IN` (English, India)
- **Title Template:** `%s | Aurelle Spaces`
- **Canonical URL Utility:** `canonicalUrl(path)` enforces lowercase canonical URLs with trailing slash normalization.

### Metadata Generator Helper (`src/lib/seo/metadata.ts`)
Generates standardized Next.js App Router `Metadata` objects:
- Page-specific titles and natural meta descriptions without keyword stuffing.
- Self-referencing canonical URL tags (`alternates.canonical`).
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:type`, `og:image`).
- Twitter/X cards (`twitter:card: "summary_large_image"`).
- Search indexing directives (`robots.googleBot`).

---

## 2. Dynamic Sitemap & Robots Configuration

### Dynamic XML Sitemap (`src/app/sitemap.ts`)
Automatically generates the sitemap at `https://aurelle.dsecops88.online/sitemap.xml`:
1. **Static Public Routes:** `/`, `/about`, `/services`, `/process`, `/portfolio`, `/journal`, `/contact`, `/privacy-policy`, `/terms-of-use`.
2. **Dynamic Published Services:** `/services/[slug]` queried from CMS/static data.
3. **Dynamic Published Projects:** `/portfolio/[slug]` queried from CMS/static data.
4. **Dynamic Published Articles:** `/journal/[slug]` queried from CMS/static data.
5. **Strict Exclusion:** Excludes `/admin/*`, `/api/*`, private chat sessions, draft CMS records, and unauthenticated endpoints.
6. **Graceful CMS Fallback:** Ensures continuous sitemap availability even during database cold-starts or uninitialized states.

### Robots Directives (`src/app/robots.ts`)
Directs compliant search engine crawlers at `https://aurelle.dsecops88.online/robots.txt`:
- **Allowed:** Public marketing routes (`/`).
- **Disallowed:** `/admin/`, `/admin/*`, `/api/`, `/api/*`, `/design-system`.
- **Sitemap Link:** Points directly to `https://aurelle.dsecops88.online/sitemap.xml`.
- *Note:* Sensitive administrative paths remain strictly protected via server-side session checks and RBAC, not robots.txt alone.

---

## 3. Schema.org Structured Data (JSON-LD)

Implemented via `src/components/seo/structured-data.tsx` to provide rich search snippets:

| Schema Type | Location | Properties |
|---|---|---|
| **Organization** | Global (`src/app/layout.tsx`) | Studio name, URL, logo, parent organization (DRK Information Software Solutions). Strictly avoids fabricated physical addresses or phone numbers. |
| **WebSite** | Global (`src/app/layout.tsx`) | Site name, URL, inLanguage (`en-IN`), publisher. |
| **BreadcrumbList** | All breadcrumbs (`src/components/ui/breadcrumb.tsx`) | Ordered `ListItem` hierarchy from Studio root to current page. |
| **Service** | Service Details (`/services/[slug]`) | Service name, description, serviceType, provider, areaServed (`India`). |
| **Article** | Journal Details (`/journal/[slug]`) | Headline, description, published date, author name, publisher. |
| **WebPage** | Portfolio Studies (`/portfolio/[slug]`) | Title, description, URL, part of WebSite. Discloses demonstration architectural concept. |

---

## 4. Open Graph & Social Sharing

- **Dynamic OpenGraph Route:** `src/app/opengraph-image.tsx` renders edge-generated 1200x630 social sharing cards adhering to Aurelle Spaces editorial styling (dark charcoal background `#1A1615`, warm ochre typography `#A17C55`, and clean architectural hierarchy).
- **Page-specific Overrides:** Service, project, and journal pages supply customized Open Graph titles and descriptions.

---

## 5. Privacy-First Analytics & Conversion Tracking

### Philosophy & Privacy
- **Zero Third-Party Cookies:** Operates without tracking cookies or intrusive canvas fingerprinting.
- **Do Not Track (DNT) Compliance:** Automatically drops event telemetry if the client's browser sends `navigator.doNotTrack === "1"`.
- **Data Minimisation:** Telemetry payloads strictly exclude client names, emails, phone numbers, complete project descriptions, and chat transcripts.
- **Error Isolation:** Analytics failures are completely isolated and never interrupt user navigation or form submissions.

### Conversion Events Defined (`src/lib/analytics/types.ts`)
- `contact_form_started`: Logged on initial interaction with the consultation brief form.
- `contact_form_submitted`: Dispatched only after the server acknowledges D1 persistence with an assigned `enquiryId`.
- `contact_form_failed`: Logged when client validation or server rejection occurs.
- `chatbot_opened`: Fired when visitor activates the studio assistant launcher.
- `chatbot_lead_submitted`: Fired upon confirmed conversion from chatbot conversation to studio enquiry.
- `service_cta_clicked` & `portfolio_enquiry_clicked`: Inter-page intent tracking.

### Cloudflare Web Analytics (`src/components/analytics/cloudflare-analytics.tsx`)
- Conditionally injected into `src/app/layout.tsx`.
- Loads the lightweight Cloudflare beacon (`beacon.min.js`) **ONLY** when `NEXT_PUBLIC_CF_BEACON_TOKEN` is configured.
- Does not inject empty or placeholder scripts if the token is omitted.

---

## 6. Admin Analytics Overview (`/admin/analytics`)

Located at `/admin/analytics` and linked in the admin sidebar:
- **Total Ingested Volume:** Real count of consultations saved to Cloudflare D1.
- **Source Breakdown:** Authentic ratio of Web Form vs. AI Studio Chatbot vs. Direct referrals.
- **Triage Pipeline Funnel:** Distribution of leads across New, Reviewed, Contacted, Qualified, and Won stages.
- **Design Typology Breakdown:** Real counts categorized by requested service disciplines.
- **Recent Activity Feed:** Last 10 submissions with timestamps and status.
- **Authentic Telemetry Notice:** Explicitly declares that web traffic numbers are not fabricated; explains that edge telemetry streams live once Cloudflare Web Analytics beacon is verified in production.

