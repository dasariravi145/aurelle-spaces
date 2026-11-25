/**
 * Aurelle Spaces — Services Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";
import type { ContentStatus } from "@/lib/db/types";

export interface CreateServiceInput {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status?: ContentStatus;
  sortOrder?: number;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface UpdateServiceInput {
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  status?: ContentStatus;
  sortOrder?: number;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCreateService(data: unknown): CreateServiceInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Service input must be a valid object.");
  }

  const s = data as Record<string, unknown>;

  if (typeof s.slug !== "string" || !SLUG_REGEX.test(s.slug)) {
    throw new ValidationError("Slug must be lowercase alphanumeric with hyphens (e.g. 'residential-interiors').");
  }

  if (typeof s.title !== "string" || s.title.trim().length < 3) {
    throw new ValidationError("Title must be at least 3 characters.");
  }

  if (typeof s.summary !== "string" || s.summary.trim().length < 10) {
    throw new ValidationError("Summary must be at least 10 characters.");
  }

  if (typeof s.description !== "string" || s.description.trim().length < 20) {
    throw new ValidationError("Description must be at least 20 characters.");
  }

  const status: ContentStatus = s.status === "draft" || s.status === "archived" ? s.status : "published";
  const sortOrder = typeof s.sortOrder === "number" ? Math.floor(s.sortOrder) : 0;

  return {
    slug: s.slug.trim(),
    title: s.title.trim(),
    summary: s.summary.trim(),
    description: s.description.trim(),
    status,
    sortOrder,
    seoMetadata: s.seoMetadata as CreateServiceInput["seoMetadata"],
  };
}

