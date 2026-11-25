/**
 * Aurelle Spaces — Media Asset & Association Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";

export interface UpdateMediaAssetInput {
  altText?: string;
}

export interface AssociateProjectMediaInput {
  projectId: string;
  mediaAssetId: string;
  sortOrder?: number;
  caption?: string;
  altText?: string;
}

export function validateAssociateProjectMedia(data: unknown): AssociateProjectMediaInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Input must be a valid object.");
  }

  const m = data as Record<string, unknown>;

  if (typeof m.projectId !== "string" || m.projectId.trim().length === 0) {
    throw new ValidationError("Valid projectId is required.");
  }

  if (typeof m.mediaAssetId !== "string" || m.mediaAssetId.trim().length === 0) {
    throw new ValidationError("Valid mediaAssetId is required.");
  }

  return {
    projectId: m.projectId.trim(),
    mediaAssetId: m.mediaAssetId.trim(),
    sortOrder: typeof m.sortOrder === "number" ? Math.floor(m.sortOrder) : 0,
    caption: typeof m.caption === "string" ? m.caption.trim() : undefined,
    altText: typeof m.altText === "string" ? m.altText.trim() : undefined,
  };
}

