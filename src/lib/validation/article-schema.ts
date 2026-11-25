/**
 * Aurelle Spaces — Journal Article Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";
import type { ContentStatus } from "@/lib/db/types";

export interface CreateArticleInput {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  articleContent: Record<string, unknown>;
  coverMediaId?: string;
  publicationStatus?: ContentStatus;
  publishedAt?: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCreateArticle(data: unknown): CreateArticleInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Article input must be a valid object.");
  }

  const a = data as Record<string, unknown>;

  if (typeof a.slug !== "string" || !SLUG_REGEX.test(a.slug)) {
    throw new ValidationError("Article slug must be lowercase alphanumeric with hyphens.");
  }

  if (typeof a.title !== "string" || a.title.trim().length < 5) {
    throw new ValidationError("Article title must be at least 5 characters.");
  }

  if (typeof a.category !== "string" || a.category.trim().length < 2) {
    throw new ValidationError("Category is required.");
  }

  if (typeof a.excerpt !== "string" || a.excerpt.trim().length < 20) {
    throw new ValidationError("Excerpt must be at least 20 characters.");
  }

  if (!a.articleContent || typeof a.articleContent !== "object") {
    throw new ValidationError("Article content structure is required.");
  }

  return {
    slug: a.slug.trim(),
    title: a.title.trim(),
    category: a.category.trim(),
    excerpt: a.excerpt.trim(),
    articleContent: a.articleContent as Record<string, unknown>,
    coverMediaId: typeof a.coverMediaId === "string" ? a.coverMediaId.trim() : undefined,
    publicationStatus: a.publicationStatus === "published" || a.publicationStatus === "archived" ? a.publicationStatus : "draft",
    publishedAt: typeof a.publishedAt === "string" ? a.publishedAt : undefined,
    seoMetadata: a.seoMetadata as CreateArticleInput["seoMetadata"],
  };
}

