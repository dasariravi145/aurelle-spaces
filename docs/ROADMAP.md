# Aurelle Spaces — 20-Prompt Implementation Roadmap

This document outlines the systematic, 20-prompt sequence for architecting, engineering, and deploying the **Aurelle Spaces** demonstration platform for DRK Information Software Solutions.

**Planned Production URL:** `https://aurelle.dsecops88.online`

---

## Roadmap Overview & Sequence

| Prompt | Focus Area | Deliverables & Scope | Status |
| :---: | :--- | :--- | :---: |
| **01** | **Technical Foundation & Cloudflare OpenNext Setup** | Next.js App Router, TypeScript, Tailwind CSS, OpenNext adapter, modular directory boundaries, `.env.example`, basic root layout, branded 404, architectural documentation. | **IN PROGRESS / CURRENT** |
| **02** | **Original Design System & UI Primitive Library** | Architectural color palette (warm stone, bronze, slate), typography scale, fluid spacing, Container, Section, Button, Card, Badge, and Input primitives. | PENDING |
| **03** | **Global Studio Navigation & Header/Footer Layouts** | Responsive navigation header, brand mark, mobile drawer menu, semantic footer, studio metadata, and quick contact action. | PENDING |
| **04** | **Studio Homepage Experience** | Hero banner with spatial imagery, studio manifesto, featured project carousel, key statistics, testimonial excerpts, and consultation prompt. | PENDING |
| **05** | **About the Studio & Design Philosophy** | Narrative on studio history, principals, architectural values, contextual design philosophy, and awards/accreditations. | PENDING |
| **06** | **Architecture & Interior Design Services** | Service category index, detailed breakdown of architectural, interior, landscape, and turnkey offerings with scope of deliverables. | PENDING |
| **07** | **Portfolio Archive & Typology Filtering** | Project portfolio gallery, typology filters (residential, commercial, hospitality, restoration), project cards, and hover materiality states. | PENDING |
| **08** | **Architectural Case Study Detail Pages** | In-depth project showcase, spatial brief, site plans, high-resolution photography gallery, material palette breakdown, and project credits. | PENDING |
| **09** | **Journal & Editorial Insights (Blog)** | Editorial archive, article reader view, estimated reading times, category tags, author cards, and related article links. | PENDING |
| **10** | **Client Consultation & Project Enquiry Workflow** | Multi-step interactive project enquiry form, budget selection, location input, architectural requirement capture, and client confirmation. | PENDING |
| **11** | **Conversational AI Studio Assistant** | Floating conversational assistant powered by Google Gemini API, answering studio questions, exploring services, and capturing initial project briefs. | PENDING |
| **12** | **Cloudflare D1 Database Schema & Data Layer** | D1 schema definitions (projects, services, enquiries, articles), migration files, query helper utilities, and edge-compatible data access routines. | PENDING |
| **13** | **Cloudflare R2 Media Storage Pipeline** | R2 bucket configuration, asset upload utility, CDN delivery mapping, and responsive image loading architecture. | PENDING |
| **14** | **n8n Workflow Automation Integration** | Webhook endpoint dispatching enquiry data to self-hosted n8n pipelines for CRM sync, lead triage, and team alerting. | PENDING |
| **15** | **Transactional Email Notifications** | Resend / email integration delivering styled confirmation emails to prospective clients and internal notification pings to the studio team. | PENDING |
| **16** | **Authentication & Role-Based Access Control (RBAC)** | Secure administrative authentication for studio directors, editors, and consultants using signed sessions and protected route middleware. | PENDING |
| **17** | **Studio Administration Dashboard & CMS** | Protected admin dashboard overview, project portfolio CRUD, journal article editor, and studio metric cards. | PENDING |
| **18** | **Enquiry & Consultation Management Portal** | Admin enquiry triage interface, consultation status management (pending, reviewed, scheduled, archived), and client notes. | PENDING |
| **19** | **SEO, Accessibility & Performance Audits** | OpenGraph tags, JSON-LD structured data (ArchitecturalFirm schema), sitemap.xml, robots.txt, WCAG 2.1 AA a11y audit, and Lighthouse optimizations. | PENDING |
| **20** | **Production Cloudflare Deployment & Final Verification** | Cloudflare Workers deployment, custom domain binding (`aurelle.dsecops88.online`), SSL verification, edge caching checks, and full regression test. | PENDING |

---

## Governance Rules

1. **Step-by-Step Execution:** Prompts must be completed sequentially. No prompt shall be jumped or executed in advance.
2. **Preserve Foundation:** Every new prompt builds upon the established code from preceding prompts without regressing previously passed tests.
3. **No Simulated Production:** Live Cloudflare provisioning (D1, R2, Workers deployment) is strictly executed when credentials and resources are intentionally provided in designated prompts.
4. **Natural Indian Business English:** All studio content, copy, and client-facing text must adopt natural, articulate Indian business English tailored to high-end architectural clientele.

