/**
 * Cloudflare R2 Media Storage Layer Contracts
 * Compatible with Cloudflare Workers R2 platform binding (`env.MEDIA_BUCKET`).
 */

export interface UploadMediaResult {
  key: string;
  url: string;
  sizeBytes: number;
  contentType: string;
  uploadedAt: string;
}

export interface R2ObjectHeader {
  key: string;
  size: number;
  etag: string;
  uploaded: Date;
}

