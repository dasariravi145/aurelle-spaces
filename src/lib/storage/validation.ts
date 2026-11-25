/**
 * Aurelle Spaces — Media Upload Validation & Filename Sanitization
 * 
 * Enforces strict MIME types, file size limits, safe character sets,
 * and extension consistency. Configurable constants without magic numbers.
 */

import { ValidationError } from "@/lib/errors/app-error";

export const STORAGE_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  MAX_FILENAME_LENGTH: 120,
  ALLOWED_IMAGE_MIMES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ] as const,
  MIME_TO_EXTENSIONS: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/avif": [".avif"],
  } as Record<string, string[]>,
  MAX_DIMENSION: 8192, // 8K resolution maximum
} as const;

export type AllowedMimeType = (typeof STORAGE_LIMITS.ALLOWED_IMAGE_MIMES)[number];

export interface MediaValidationInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface ValidationSuccess {
  isValid: true;
  sanitizedFilename: string;
  normalizedMime: AllowedMimeType;
}

/**
 * Sanitizes a client-provided filename to prevent path traversal and unsafe characters.
 * Strips directory delimiters (/, \), replaces whitespace with hyphens,
 * removes non-alphanumeric chars (except . - _), and enforces max length.
 */
export function sanitizeFilename(raw: string): string {
  if (!raw || typeof raw !== "string") {
    return "unnamed-asset";
  }

  // Strip path traversal attempts and absolute directory references
  const basename = raw.replace(/^.*[\\/]/, "");

  // Normalize Unicode, lowercase, remove control characters
  const clean = basename
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");

  // Enforce max length while preserving extension
  if (clean.length > STORAGE_LIMITS.MAX_FILENAME_LENGTH) {
    const ext = clean.substring(clean.lastIndexOf("."));
    const base = clean.substring(0, STORAGE_LIMITS.MAX_FILENAME_LENGTH - ext.length);
    return `${base}${ext}`;
  }

  return clean || "unnamed-asset";
}

/**
 * Validates file extension against declared MIME type to detect extension spoofing.
 */
export function validateExtensionMatchesMime(filename: string, mimeType: string): boolean {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return false;

  const ext = filename.substring(dotIndex).toLowerCase();
  const validExtensions = STORAGE_LIMITS.MIME_TO_EXTENSIONS[mimeType];

  return validExtensions ? validExtensions.includes(ext) : false;
}

/**
 * Validates incoming media upload metadata prior to storage.
 * Note: While MIME and extension checks are mandatory initial gates, binary magic-byte
 * inspection is also recommended during binary body streaming.
 */
export function validateMediaUpload(input: MediaValidationInput): ValidationSuccess {
  if (!input.filename || input.filename.trim().length === 0) {
    throw new ValidationError("A valid filename is required.");
  }

  if (input.sizeBytes <= 0) {
    throw new ValidationError("Uploaded file must not be empty (0 bytes).");
  }

  if (input.sizeBytes > STORAGE_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    const maxMb = STORAGE_LIMITS.MAX_IMAGE_SIZE_BYTES / (1024 * 1024);
    throw new ValidationError(`File size exceeds maximum allowed limit of ${maxMb}MB.`);
  }

  const normalizedMime = input.mimeType.toLowerCase() as AllowedMimeType;
  if (!STORAGE_LIMITS.ALLOWED_IMAGE_MIMES.includes(normalizedMime)) {
    throw new ValidationError(
      `Unsupported media format '${input.mimeType}'. Allowed formats: JPEG, PNG, WebP, AVIF.`
    );
  }

  const sanitizedFilename = sanitizeFilename(input.filename);

  if (!validateExtensionMatchesMime(sanitizedFilename, normalizedMime)) {
    throw new ValidationError(
      `File extension does not match the provided content type '${input.mimeType}'.`
    );
  }

  if (input.width !== undefined && (input.width <= 0 || input.width > STORAGE_LIMITS.MAX_DIMENSION)) {
    throw new ValidationError(`Image width must be between 1 and ${STORAGE_LIMITS.MAX_DIMENSION} pixels.`);
  }

  if (input.height !== undefined && (input.height <= 0 || input.height > STORAGE_LIMITS.MAX_DIMENSION)) {
    throw new ValidationError(`Image height must be between 1 and ${STORAGE_LIMITS.MAX_DIMENSION} pixels.`);
  }

  return {
    isValid: true,
    sanitizedFilename,
    normalizedMime,
  };
}

/**
 * Validates the binary header (magic bytes) of an uploaded file against its declared MIME type.
 * Prevents file extension and MIME header spoofing attacks.
 */
export function validateMagicBytes(buffer: ArrayBuffer, mimeType: AllowedMimeType): boolean {
  if (!buffer || buffer.byteLength < 12) {
    return false;
  }

  const bytes = new Uint8Array(buffer.slice(0, 16));

  switch (mimeType) {
    case "image/jpeg":
      // JPEG starts with FF D8 FF
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    case "image/png":
      // PNG starts with 89 50 4E 47 0D 0A 1A 0A
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );

    case "image/webp":
      // WebP: RIFF header (bytes 0-3: 52 49 46 46) and WEBP identifier (bytes 8-11: 57 45 42 50)
      return (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );

    case "image/avif": {
      // AVIF / ISO Base Media: ftyp box (bytes 4-7: 66 74 79 70) followed by major brand avif or avis
      const isFtyp =
        bytes[4] === 0x66 &&
        bytes[5] === 0x74 &&
        bytes[6] === 0x79 &&
        bytes[7] === 0x70;

      if (!isFtyp) return false;

      const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]).toLowerCase();
      return brand === "avif" || brand === "avis" || brand === "mif1";
    }

    default:
      return false;
  }
}


