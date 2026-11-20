# Development Standards & Engineering Continuity Rules

**Project:** Aurelle Spaces  
**Platform Client:** DRK Information Software Solutions  
**Governing Context:** 20-Prompt Sequential Engineering Process

---

## 1. Project Discipline & Scope Preservation

1. **Strict Working Directory:** All operations, files, scripts, and commands must remain strictly within `D:\Projects\aurelle-spaces`. Never create nested `aurelle-spaces` directories.
2. **Sequential Execution:** The project is delivered across a predetermined 20-prompt sequence. Never execute future prompt scopes in advance. Stop upon satisfying the current prompt's acceptance criteria.
3. **No Code Loss / Destructive Overwrites:** Never blindly delete files or revert work created in earlier prompts. All updates must be additive and integrate safely with existing logic.
4. **No Simulated Success:** Do not claim that external integrations (such as Cloudflare D1, R2, Gemini API, or n8n webhooks) succeeded in live cloud environments unless real commands with actual credentials were run and verified.
5. **Demonstration Ethics:** Do not represent fictional architectural projects, testimonials, or metrics as real client endorsements. Label demonstration content clearly where appropriate.

---

## 2. Code Quality & Technical Standards

### TypeScript
- Enable `strict: true` at all times.
- Never use `any` without an explicit, documented explanation. Prefer `unknown`, generics, or discriminated unions.
- Define shared domain contracts in `src/modules/<domain>/types.ts` or `src/lib/<infra>/types.ts`.
- Use the `@/*` import alias pointing to `src/*`.

### Next.js & React
- Use App Router patterns (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
- Default to React Server Components (RSC). Only mark components with `"use client"` when interactivity (state, effects, browser event listeners) is strictly required.
- Do not import Node.js built-ins (`fs`, `child_process`, `net`) into client components or code paths targeting Cloudflare Workers without verifying edge runtime polyfill compatibility.

### Styling & Design System
- Use Tailwind CSS with clean utility composition.
- Follow the architectural design tokens established in Prompt 02 (warm neutrals, bronze accents, slate contrasts).
- Ensure all layouts are mobile-first, responsive, and accessible (WCAG 2.1 AA standards).
- All semantic tags (`<header>`, `<main>`, `<nav>`, `<article>`, `<aside>`, `<footer>`) must be properly used.

---

## 3. Editorial Tone: Natural Indian Business English

All customer-facing text, portfolio descriptions, service offerings, and consultation forms must adopt **natural Indian business English**:
- **Tone:** Refined, articulate, professional, understated luxury, and contextually grounded.
- **Terminology:** Use standard Indian spatial and real estate terminology where appropriate (e.g., *sq. ft.*, *bungalow*, *duplex*, *penthouse*, *bespoke joinery*, *turnkey architectural execution*, *monsoon-resistant detailing*).
- **Spelling:** British / Indian English conventions (e.g., *colour*, *programme*, *customise*, *spatial design*).

---

## 4. Verification Checklists Before Completing Any Prompt

Before declaring a prompt complete, the following four verification gates must pass:

```bash
# Gate 1: Type Checking
npm run type-check

# Gate 2: Linting
npm run lint

# Gate 3: Next.js Production Build
npm run build

# Gate 4: Cloudflare OpenNext Adapter Build
npm run build:cloudflare
```

If any check fails, resolve the underlying issue immediately before reporting to the user.

