/**
 * Aurelle Spaces — Public & Preview Content Service
 * 
 * Bridges Cloudflare D1 published records with existing static demonstration data.
 * Guarantees:
 * 1. Only 'published' content is visible to public visitors.
 * 2. Unauthenticated visitors never see draft or archived content.
 * 3. Fallbacks to demonstration data when D1 is uninitialized or in local dev.
 * 4. Authenticated preview loader for administrators.
 */

import { getDatabase } from "@/lib/db/client";
import { projectsRepository } from "@/lib/db/repositories/projects.repository";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { articlesRepository } from "@/lib/db/repositories/articles.repository";
import type { ProjectRecord, ServiceRecord, JournalArticleRecord } from "@/lib/db/types";
import { portfolioProjects, type ProjectDetail, type ProjectCategory } from "@/lib/content/portfolio-data";
import { servicesData, type ServiceDetail } from "@/lib/content/services-data";
import { journalArticles, type JournalArticleDetail } from "@/lib/content/journal-data";

/**
 * Maps a D1 ProjectRecord to the frontend ProjectDetail shape.
 */
function mapRecordToProjectDetail(record: ProjectRecord): ProjectDetail {
  let content: Record<string, unknown> = {};
  try {
    content = JSON.parse(record.detailed_content || "{}");
  } catch {
    content = {};
  }

  let seo: { metaTitle?: string; metaDescription?: string } = {};
  try {
    seo = JSON.parse(record.seo_metadata || "{}");
  } catch {
    seo = {};
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    location: record.location,
    city: record.location.split(",")[1]?.trim() || record.location,
    category: record.category as ProjectCategory,
    shortDescription: record.summary,
    conceptNarrative: (content.conceptNarrative as string[]) || [record.summary],
    designApproach: (content.designApproach as ProjectDetail["designApproach"]) || [],
    keyConsiderations: (content.keyConsiderations as ProjectDetail["keyConsiderations"]) || [],
    materialPalette: (content.materialPalette as ProjectDetail["materialPalette"]) || [],
    spacePlanningNotes: (content.spacePlanningNotes as string[]) || [],
    galleryItems: (content.galleryItems as ProjectDetail["galleryItems"]) || [],
    coverAspect: (content.coverAspect as ProjectDetail["coverAspect"]) || "landscape",
    areaSqFt: (content.areaSqFt as string) || "5,400 sq.ft",
    year: (content.year as number) || 2024,
    featured: record.featured === 1,
    relatedSlugs: (content.relatedSlugs as string[]) || [],
    metaTitle: seo.metaTitle || `${record.title} | Aurelle Spaces Portfolio`,
    metaDescription: seo.metaDescription || record.summary,
    demonstrationDisclosure:
      (content.demonstrationDisclosure as string) ||
      "Demonstration project concept for architectural portfolio.",
  };
}

/**
 * Maps a D1 ServiceRecord to the frontend ServiceDetail shape.
 */
function mapRecordToServiceDetail(record: ServiceRecord): ServiceDetail {
  let seo: { metaTitle?: string; metaDescription?: string } = {};
  try {
    seo = JSON.parse(record.seo_metadata || "{}");
  } catch {
    seo = {};
  }

  // Check if static definition provides rich scopeItems and FAQs
  const staticFallback = servicesData[record.slug];

  return {
    slug: record.slug,
    number: String(record.sort_order).padStart(2, "0"),
    title: record.title,
    shortDescription: record.summary,
    heroSynopsis: record.description,
    overview: staticFallback?.overview || [record.description],
    scopeItems: staticFallback?.scopeItems || [],
    approach: staticFallback?.approach || [],
    keyConsiderations: staticFallback?.keyConsiderations || [],
    relevantProjects: staticFallback?.relevantProjects || [],
    faqs: staticFallback?.faqs || [],
    metaTitle: seo.metaTitle || staticFallback?.metaTitle || `${record.title} | Aurelle Spaces`,
    metaDescription: seo.metaDescription || staticFallback?.metaDescription || record.summary,
  };
}

/**
 * Maps a D1 JournalArticleRecord to the frontend JournalArticleDetail shape.
 */
function mapRecordToArticleDetail(record: JournalArticleRecord): JournalArticleDetail {
  let content: Record<string, unknown> = {};
  try {
    content = JSON.parse(record.article_content || "{}");
  } catch {
    content = {};
  }

  let seo: { metaTitle?: string; metaDescription?: string } = {};
  try {
    seo = JSON.parse(record.seo_metadata || "{}");
  } catch {
    seo = {};
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    category: record.category,
    excerpt: record.excerpt,
    publicationDate: record.published_at
      ? new Date(record.published_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Recent Monograph",
    readingTime: (content.readingTime as string) || "5 min read",
    featured: false,
    coverAspect: (content.coverAspect as JournalArticleDetail["coverAspect"]) || "widescreen",
    sections: (content.sections as JournalArticleDetail["sections"]) || [
      { heading: "Overview", paragraphs: [record.excerpt] },
    ],
    keyTakeaways: (content.keyTakeaways as string[]) || [],
    relatedSlugs: (content.relatedSlugs as string[]) || [],
    metaTitle: seo.metaTitle || `${record.title} | Aurelle Spaces Journal`,
    metaDescription: seo.metaDescription || record.excerpt,
  };
}

/* ==========================================================================
   Public Content Queries (Published Only)
   ========================================================================== */

export async function getPublicProjects(category?: ProjectCategory): Promise<ProjectDetail[]> {
  try {
    const db = getDatabase();
    const result = await projectsRepository.listPublished(db, { category });
    if (result.data.length > 0) {
      return result.data.map(mapRecordToProjectDetail);
    }
  } catch {
    // Graceful fallback to demonstration records
  }

  const all = Object.values(portfolioProjects);
  if (category) {
    return all.filter((p) => p.category === category);
  }
  return all;
}

export async function getPublicProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const db = getDatabase();
    const record = await projectsRepository.findBySlug(db, slug);
    if (record && record.publication_status === "published") {
      return mapRecordToProjectDetail(record);
    }
  } catch {
    // Fallback
  }

  return portfolioProjects[slug] || null;
}

export async function getPublicServices(): Promise<ServiceDetail[]> {
  try {
    const db = getDatabase();
    const records = await servicesRepository.listPublished(db);
    if (records.length > 0) {
      return records.map(mapRecordToServiceDetail);
    }
  } catch {
    // Fallback
  }

  return Object.values(servicesData);
}

export async function getPublicServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    const db = getDatabase();
    const record = await servicesRepository.findBySlug(db, slug);
    if (record && record.status === "published") {
      return mapRecordToServiceDetail(record);
    }
  } catch {
    // Fallback
  }

  return servicesData[slug] || null;
}

export async function getPublicArticles(): Promise<JournalArticleDetail[]> {
  try {
    const db = getDatabase();
    const result = await articlesRepository.listPublished(db);
    if (result.data.length > 0) {
      return result.data.map(mapRecordToArticleDetail);
    }
  } catch {
    // Fallback
  }

  return Object.values(journalArticles);
}

export async function getPublicArticleBySlug(slug: string): Promise<JournalArticleDetail | null> {
  try {
    const db = getDatabase();
    const record = await articlesRepository.findBySlug(db, slug);
    if (record && record.publication_status === "published") {
      return mapRecordToArticleDetail(record);
    }
  } catch {
    // Fallback
  }

  return journalArticles[slug] || null;
}

/* ==========================================================================
   Authenticated Preview Queries (Draft / Any Status)
   ========================================================================== */

export async function getProjectForPreview(idOrSlug: string): Promise<{ project: ProjectDetail; isDraft: boolean } | null> {
  try {
    const db = getDatabase();
    let record = await projectsRepository.findById(db, idOrSlug);
    if (!record) {
      record = await projectsRepository.findBySlug(db, idOrSlug);
    }

    if (record) {
      return {
        project: mapRecordToProjectDetail(record),
        isDraft: record.publication_status !== "published",
      };
    }
  } catch {
    // Fallback
  }

  const staticProj = portfolioProjects[idOrSlug];
  if (staticProj) {
    return { project: staticProj, isDraft: false };
  }

  return null;
}

export async function getArticleForPreview(idOrSlug: string): Promise<{ article: JournalArticleDetail; isDraft: boolean } | null> {
  try {
    const db = getDatabase();
    let record = await articlesRepository.findById(db, idOrSlug);
    if (!record) {
      record = await articlesRepository.findBySlug(db, idOrSlug);
    }

    if (record) {
      return {
        article: mapRecordToArticleDetail(record),
        isDraft: record.publication_status !== "published",
      };
    }
  } catch {
    // Fallback
  }

  const staticArt = journalArticles[idOrSlug];
  if (staticArt) {
    return { article: staticArt, isDraft: false };
  }

  return null;
}

