/**
 * Aurelle Spaces — Cloudflare R2 Storage Manager & Object Abstraction
 * 
 * Provides server-side object key partition strategies, streaming upload,
 * retrieval, deletion, and public CDN URL formatting without exposing
 * credentials to client-side code.
 */

import type { R2Bucket, R2Object, R2ObjectBody } from "@/types/cloudflare";
import { getCloudflareEnv, getServerConfig } from "@/lib/env";
import { StorageError, NotFoundError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logging/logger";
import { generateSecureId } from "@/lib/security/crypto";
import { sanitizeFilename } from "./validation";
import type { MediaUploadRequest } from "./types";

/**
 * Access the primary Cloudflare R2 Media Bucket binding.
 */
export function getMediaBucket(injectedBucket?: R2Bucket): R2Bucket {
  if (injectedBucket) {
    return injectedBucket;
  }

  const env = getCloudflareEnv();
  if (env && env.MEDIA_BUCKET) {
    return env.MEDIA_BUCKET;
  }

  throw new StorageError(
    "Cloudflare R2 Storage bucket binding 'MEDIA_BUCKET' is not available in the current context."
  );
}

/**
 * Generate a safe, partitioned, deterministic R2 object key.
 *
 * Hierarchy:
 * - Projects: `projects/{year}/{slug}/{uniqueId}-{filename}`
 * - Journal:  `journal/{year}/{slug}/{uniqueId}-{filename}`
 * - General:  `general/{year}/{uniqueId}-{filename}`
 * - Private:  `private/{category}/{uniqueId}-{filename}`
 */
export function generateObjectKey(request: MediaUploadRequest): string {
  const year = new Date().getFullYear().toString();
  const uniqueId = generateSecureId("ast_");
  const cleanFilename = sanitizeFilename(request.filename);

  switch (request.category) {
    case "projects": {
      const slug = request.slug ? sanitizeFilename(request.slug) : "unassigned";
      return `projects/${year}/${slug}/${uniqueId}-${cleanFilename}`;
    }
    case "journal": {
      const slug = request.slug ? sanitizeFilename(request.slug) : "unassigned";
      return `journal/${year}/${slug}/${uniqueId}-${cleanFilename}`;
    }
    case "private": {
      return `private/${year}/${uniqueId}-${cleanFilename}`;
    }
    case "general":
    default: {
      return `general/${year}/${uniqueId}-${cleanFilename}`;
    }
  }
}

/**
 * Upload an asset to Cloudflare R2 storage.
 */
export async function putMediaObject(
  bucket: R2Bucket,
  key: string,
  body: ReadableStream | ArrayBuffer | string,
  options: {
    mimeType: string;
    customMetadata?: Record<string, string>;
  }
): Promise<R2Object> {
  try {
    const object = await bucket.put(key, body, {
      httpMetadata: {
        contentType: options.mimeType,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: options.customMetadata,
    });

    if (!object) {
      throw new StorageError(`Failed to complete upload for key: ${key}`);
    }

    return object;
  } catch (error) {
    logger.error("R2 putMediaObject failed", { key }, error);
    throw new StorageError(`Storage upload failed for asset '${key}'.`, error);
  }
}

/**
 * Retrieve an asset body and metadata from R2.
 */
export async function getMediaObject(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody> {
  try {
    const object = await bucket.get(key);
    if (!object) {
      throw new NotFoundError("Media asset", key);
    }
    return object;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    logger.error("R2 getMediaObject failed", { key }, error);
    throw new StorageError(`Failed to retrieve media asset '${key}'.`, error);
  }
}

/**
 * Check asset existence and metadata without streaming binary content.
 */
export async function headMediaObject(
  bucket: R2Bucket,
  key: string
): Promise<R2Object | null> {
  try {
    return await bucket.head(key);
  } catch (error) {
    logger.error("R2 headMediaObject failed", { key }, error);
    throw new StorageError(`Failed to inspect media asset '${key}'.`, error);
  }
}

/**
 * Delete one or more assets from Cloudflare R2.
 */
export async function deleteMediaObject(
  bucket: R2Bucket,
  key: string | string[]
): Promise<void> {
  try {
    await bucket.delete(key);
  } catch (error) {
    logger.error("R2 deleteMediaObject failed", { key }, error);
    throw new StorageError("Failed to delete media asset from storage.", error);
  }
}

/**
 * Map an R2 object key to its canonical public delivery URL.
 * Private assets return null to enforce authenticated server route delivery.
 */
export function getPublicMediaUrl(key: string): string | null {
  if (key.startsWith("private/")) {
    return null; // Private assets must be served via authenticated endpoint
  }

  const config = getServerConfig();
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || `${config.appUrl}/api/media`;
  return `${baseUrl.replace(/\/$/, "")}/${key}`;
}

