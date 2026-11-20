/**
 * Cloudflare D1 Database Layer Contracts
 * Compatible with Cloudflare Workers D1 platform binding (`env.DB`).
 */

export interface D1QueryResult<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
  error?: string;
}

export interface CloudflareEnv {
  DB?: {
    prepare: (query: string) => {
      bind: (...values: unknown[]) => {
        all: <T = unknown>() => Promise<D1QueryResult<T>>;
        first: <T = unknown>(colName?: string) => Promise<T | null>;
        run: () => Promise<D1QueryResult>;
      };
    };
  };
  MEDIA_BUCKET?: unknown;
  ENVIRONMENT?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

