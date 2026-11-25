/**
 * Aurelle Spaces — Storage Types & Metadata Contracts
 */

export interface MediaUploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  altText?: string;
  category: "projects" | "journal" | "general" | "private";
  slug?: string;
}

export interface StoredMediaMetadata {
  id: string;
  key: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string;
  isPublic: boolean;
  publicUrl: string | null;
  createdAt: string;
}

export interface StorageFileDescriptor {
  key: string;
  size: number;
  etag: string;
  uploadedAt: Date;
  mimeType?: string;
}
