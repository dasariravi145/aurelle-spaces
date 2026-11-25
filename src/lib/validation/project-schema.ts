/**
 * Aurelle Spaces — Project Portfolio Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";
import type { ProjectCategory, ContentStatus } from "@/lib/db/types";

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  "Residential Interiors",
  "Commercial Interiors",
  "Architecture & Space Planning",
  "Renovation & Refurbishment",
] as const;

export interface CreateProjectInput {
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  summary: string;
  detailedContent: Record<string, unknown>;
  featured?: boolean;
  publicationStatus?: ContentStatus;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCreateProject(data: unknown): CreateProjectInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Project data must be a valid object.");
  }

  const p = data as Record<string, unknown>;

  if (typeof p.slug !== "string" || !SLUG_REGEX.test(p.slug)) {
    throw new ValidationError("Project slug must be lowercase alphanumeric with hyphens.");
  }

  if (typeof p.title !== "string" || p.title.trim().length < 3) {
    throw new ValidationError("Project title must be at least 3 characters.");
  }

  if (typeof p.location !== "string" || p.location.trim().length < 2) {
    throw new ValidationError("Project location must be at least 2 characters.");
  }

  if (!PROJECT_CATEGORIES.includes(p.category as ProjectCategory)) {
    throw new ValidationError(`Invalid project category '${p.category}'.`);
  }

  if (typeof p.summary !== "string" || p.summary.trim().length < 15) {
    throw new ValidationError("Project summary must be at least 15 characters.");
  }

  if (!p.detailedContent || typeof p.detailedContent !== "object") {
    throw new ValidationError("Detailed project content object is required.");
  }

  return {
    slug: p.slug.trim(),
    title: p.title.trim(),
    location: p.location.trim(),
    category: p.category as ProjectCategory,
    summary: p.summary.trim(),
    detailedContent: p.detailedContent as Record<string, unknown>,
    featured: Boolean(p.featured),
    publicationStatus: p.publicationStatus === "published" || p.publicationStatus === "archived" ? p.publicationStatus : "draft",
    seoMetadata: p.seoMetadata as CreateProjectInput["seoMetadata"],
  };
}

