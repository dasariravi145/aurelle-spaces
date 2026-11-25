/**
 * Aurelle Spaces — Cloudflare Workers & Platform Bindings Type Definitions
 * 
 * Provides strict TypeScript types for Cloudflare D1 Database and R2 Object Storage
 * compatible with @opennextjs/cloudflare and standard Workers runtime APIs.
 */

/* ==========================================================================
   1. Cloudflare D1 Database Types
   ========================================================================== */

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    rows_read?: number;
    rows_written?: number;
    last_row_id?: number;
    changes?: number;
    served_by?: string;
    internal_stats?: unknown;
  };
  error?: string;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

/* ==========================================================================
   2. Cloudflare R2 Storage Types
   ========================================================================== */

export interface R2HttpMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2CustomMetadata {
  [key: string]: string;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  checksums: unknown;
  uploaded: Date;
  httpMetadata?: R2HttpMetadata;
  customMetadata?: R2CustomMetadata;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface R2PutOptions {
  httpMetadata?: R2HttpMetadata | Headers;
  customMetadata?: R2CustomMetadata;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
  onlyIf?: unknown;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  include?: ("httpMetadata" | "customMetadata")[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
  get(key: string, options?: { onlyIf?: unknown; range?: unknown }): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: R2PutOptions
  ): Promise<R2Object | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
}

/* ==========================================================================
   3. Ambient Cloudflare Context Augmentation
   ========================================================================== */

declare global {
  interface CloudflareEnv {
    // Cloudflare D1 Database binding
    DB: D1Database;

    // Cloudflare R2 Media Storage binding
    MEDIA_BUCKET: R2Bucket;

    // Environment variables & configuration
    ENVIRONMENT?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_CF_BEACON_TOKEN?: string;

    // Secrets (provisioned via `wrangler secret put`)
    AUTH_SECRET?: string;
    GEMINI_API_KEY?: string;
    AI_API_KEY?: string;
    AI_PROVIDER?: string;
    AI_MODEL?: string;
    AI_MODEL_NAME?: string;
    AI_API_BASE_URL?: string;
    AI_REQUEST_TIMEOUT?: string;
    AI_MAX_OUTPUT_TOKENS?: string;
    AI_TEMPERATURE?: string;
    EMAIL_API_KEY?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM_ADDRESS?: string;
    STUDIO_CONTACT_RECIPIENT?: string;
    N8N_WEBHOOK_URL?: string;
    N8N_WEBHOOK_SECRET?: string;
    AUTOMATION_INTEGRATION_TOKEN?: string;
    N8N_REQUEST_TIMEOUT?: string;
    AUTOMATION_MAX_RETRIES?: string;
    AUTOMATION_RETRY_DELAY?: string;
    AUTOMATION_ENABLED?: string;
    CRON_SECRET?: string;
  }
}

export {};

