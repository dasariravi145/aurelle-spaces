/**
 * Aurelle Spaces — Demonstration Data Seed Strategy & Generator
 * 
 * Bridges existing static content datasets (services-data, portfolio-data, journal-data)
 * with the Cloudflare D1 relational schema.
 * 
 * Preserves exact slugs, titles, categories, concept narratives, and demonstration disclosures
 * without inserting artificial admin credentials or hardcoded secrets.
 */

import { servicesData } from "@/lib/content/services-data";
import { portfolioProjects } from "@/lib/content/portfolio-data";
import { journalArticles } from "@/lib/content/journal-data";
import type { ServiceRecord, ProjectRecord, JournalArticleRecord } from "@/lib/db/types";

/**
 * Generate D1-compatible Service records from centralized static data.
 */
export function getDemonstrationServiceSeeds(): Omit<ServiceRecord, "created_at" | "updated_at">[] {
  return Object.values(servicesData).map((s, index) => ({
    id: `srv_demo_${s.slug.replace(/-/g, "_")}`,
    slug: s.slug,
    title: s.title,
    summary: s.shortDescription,
    description: s.heroSynopsis,
    status: "published" as const,
    sort_order: index + 1,
    seo_metadata: JSON.stringify({
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
    }),
  }));
}

/**
 * Generate D1-compatible Project records from centralized static data.
 */
export function getDemonstrationProjectSeeds(): Omit<ProjectRecord, "created_at" | "updated_at">[] {
  return Object.values(portfolioProjects).map((p) => ({
    id: `prj_demo_${p.slug.replace(/-/g, "_")}`,
    slug: p.slug,
    title: p.title,
    location: `${p.location}, ${p.city}`,
    category: p.category,
    summary: p.shortDescription,
    detailed_content: JSON.stringify({
      conceptNarrative: p.conceptNarrative,
      designApproach: p.designApproach,
      keyConsiderations: p.keyConsiderations,
      materialPalette: p.materialPalette,
      spacePlanningNotes: p.spacePlanningNotes,
      galleryItems: p.galleryItems,
      coverAspect: p.coverAspect,
      demonstrationNotice: "Concept study developed for DRK Information Software Solutions.",
    }),
    featured: p.slug === "gulmohar-sanctuary" || p.slug === "atelier-vellum" || p.slug === "terrace-of-echoes" ? 1 : 0,
    publication_status: "published" as const,
    seo_metadata: JSON.stringify({
      metaTitle: `${p.title} | Aurelle Spaces Portfolio`,
      metaDescription: p.shortDescription,
    }),
  }));
}

/**
 * Generate D1-compatible Journal Article records from centralized static data.
 */
export function getDemonstrationArticleSeeds(): Omit<JournalArticleRecord, "created_at" | "updated_at">[] {
  return Object.values(journalArticles).map((a) => ({
    id: `art_demo_${a.slug.replace(/-/g, "_")}`,
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    article_content: JSON.stringify({
      readingTime: a.readingTime,
      sections: a.sections,
      keyTakeaways: a.keyTakeaways,
      relatedSlugs: a.relatedSlugs,
      coverAspect: a.coverAspect,
      demonstrationNotice: "Editorial architectural monograph for demonstration purposes.",
    }),
    cover_media_id: null,
    publication_status: "published" as const,
    published_at: "2025-11-15T00:00:00Z",
    seo_metadata: JSON.stringify({
      metaTitle: a.metaTitle,
      metaDescription: a.metaDescription,
    }),
  }));
}

