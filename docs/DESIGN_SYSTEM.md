# Aurelle Spaces — Design System & Visual Specification

**Version:** 1.0.0 (Prompt 02)  
**Target:** Aurelle Spaces Luxury Architecture & Interior Studio  
**Client / Organisation:** DRK Information Software Solutions  
**Production URL:** `https://aurelle.dsecops88.online`

---

## 1. Brand Palette & Semantic Token Reference

The visual identity of Aurelle Spaces is grounded in natural architectural materials: lime-washed stone, cast bronze fixtures, deep charcoal graphite, and sun-warmed ivory paper.

### Canonical Brand Palette

| Color Name | Hex Code | Semantic Role | Usage Context |
| :--- | :--- | :--- | :--- |
| **Warm Ivory** | `#F7F4EF` | `--bg-primary` | Main page background canvas, natural parchment feel. |
| **Deep Charcoal** | `#242522` | `--text-primary`, `--bg-dark` | Primary typography, deep structural elements, contrast panels. |
| **Muted Bronze** | `#A17C55` | `--accent-bronze` | Brand accents, eyebrow labels, focus rings, link hover states. |
| **Soft Stone** | `#DCD5CB` | `--border-medium` | Geometric architectural borders, dividers, subtle grids. |
| **Pure White** | `#FFFFFF` | `--bg-surface` | Form input surfaces, elevated card backgrounds, image mats. |
| **Supporting Text** | `#6B6C67` | `--text-secondary` | Body paragraphs, secondary metadata, photo captions. |

---

## 2. Typography System

### Typefaces
- **Serif Display & Headings:** `Cormorant Garamond` (Google Font via `next/font/google`). Delivers timeless editorial dignity with graceful proportions.
- **Sans-Serif Body & Interface:** `Geist Sans` (Google Font via `next/font/google`). Clean, legible, contemporary sans-serif engineered for optimal readability across device displays.
- **Monospace Metadata:** `Geist Mono`. Reserved for architectural registration marks, scale notations, and technical project parameters.

### Typographic Hierarchy Scale

| Token Class | Font Family | Size Range (Fluid) | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| `.display-heading` | Serif | `clamp(2.5rem, 5vw + 1rem, 4.5rem)` | `1.1` | `-0.025em` |
| `.h1-editorial` | Serif | `clamp(2rem, 3.5vw + 0.5rem, 3.25rem)` | `1.15` | `-0.02em` |
| `.h2-editorial` | Serif | `clamp(1.6rem, 2.5vw + 0.5rem, 2.5rem)` | `1.2` | `-0.015em` |
| `.h3-editorial` | Serif | `clamp(1.35rem, 1.8vw + 0.5rem, 1.85rem)` | `1.25` | `-0.01em` |
| `.h4-editorial` | Sans | `clamp(1.1rem, 1.2vw + 0.5rem, 1.35rem)` | `1.35` | `-0.01em` |
| `.body-large` | Sans | `clamp(1.05rem, 0.5vw + 0.95rem, 1.2rem)`| `1.65` | `-0.01em` |
| `.body-regular` | Sans | `0.95rem` | `1.6` | `-0.01em` |
| `.body-small` | Sans | `0.85rem` | `1.5` | `normal` |
| `.eyebrow-text` | Sans | `0.72rem` (Uppercase) | `1.2` | `0.22em` |

---

## 3. Layout & Spatial Grid System

### Container Widths
- **Reading Container:** `max-w-[680px]` (Optimized for editorial essays, monographs, and reading focus).
- **Standard Container:** `max-w-[1120px]` (Standard page layouts, service summaries, contact forms).
- **Wide Container:** `max-w-[1360px]` (Hero sections, project portfolio galleries, asymmetric grids).
- **Max Container:** `max-w-[1536px]` (Full viewport architectural photo spreads).

### Vertical Section Cadence
- `spacing="sm"`: `py-10 sm:py-14` (Compact sub-sections, breadcrumb bars)
- `spacing="md"`: `py-16 sm:py-24` (Standard content sections)
- `spacing="lg"`: `py-24 sm:py-32` (Major feature transitions)
- `spacing="xl"`: `py-32 sm:py-40` (Hero sections, homepage manifesto)

---

## 4. Component Catalog

### UI Primitives (`src/components/ui/`)
1. **`Container`**: Semantic responsive container enforcing canonical gutters.
2. **`Section`**: Section wrapper with controlled spacing, backgrounds, and architectural dividers.
3. **`SectionHeading`**: Eyebrow, serif title, and descriptive body layout.
4. **`Eyebrow`**: High-contrast, wide-tracked metadata label in Muted Bronze.
5. **`Button`**: Accessible buttons with primary, secondary, outline, and ghost variants.
6. **`TextLink`**: Directional links with subtle arrow indicators and underline transitions.
7. **`ImageFrame`**: Aspect-ratio constrained image canvas with tactile mat borders.
8. **`ProjectPlaceholder`**: Geometric blueprint canvas used prior to production photography.
9. **`Divider`**: Subtle stone, bronze, or dark horizontal separators with optional center tags.
10. **`Breadcrumb`**: Accessible navigation trail with schema metadata.
11. **`FormField`**: High-contrast text input with labels, errors, and helper cues.
12. **`Textarea`**: Multi-line brief input matching architectural form styling.
13. **`Select`**: Custom-styled accessible dropdown menu.
14. **`LoadingIndicator`**: Minimal linear geometric progress loader.
15. **`EmptyState`**: Restrained empty state with architectural iconography and call-to-action.

### Editorial Elements (`src/components/editorial/`)
1. **`EditorialImageComposition`**: Asymmetric dual-frame photo composition.
2. **`SplitSection`**: Reversible 50/50 and 60/40 narrative text and media sections.
3. **`AsymmetricGrid`**: Golden-ratio two-column layouts avoiding standard block grids.
4. **`FullWidthImage`**: Panoramic spatial spreads with metadata footer captions.
5. **`ProcessItem`**: Numbered architectural phase breakdowns with scope checklists.
6. **`ProjectInfoBlock`**: Tabular architectural specifications (typology, location, sq. ft., year).
7. **`Quotation`**: Architectural design manifesto quote with attribution lines.
8. **`SectionTransition`**: Architectural separator with bronze center emblem.

---

## 5. Accessibility & Motion Guidelines

- **Focus Rings:** All interactive components use a 2px offset focus ring in Muted Bronze (`#A17C55`).
- **Touch Targets:** Minimum 44px by 44px touch targets on mobile viewports.
- **Contrast Ratios:** All text elements meet or exceed WCAG 2.1 AA standards (minimum 4.5:1 for body copy against Warm Ivory or Pure White).
- **Reduced Motion:** When `prefers-reduced-motion` is detected, all transitions and animations are collapsed to instantaneous changes.
- **Form Semantics:** All inputs include explicit `id`, `htmlFor`, `aria-invalid`, `aria-describedby`, and `role="alert"` attributes.

---

## 6. Internal Design System Preview Route

An internal inspection page is available at:
`/design-system`

This route contains live demonstrations of all palette tokens, typography scales, buttons, forms, and editorial modules. It is explicitly marked with `robots: { index: false, follow: false }` to prevent search engine indexing.

