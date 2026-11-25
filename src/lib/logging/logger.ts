/**
 * Aurelle Spaces — Structured Edge Logger with Sensitive Data Redaction
 * 
 * Lightweight, JSON-formatted structured logging designed for Cloudflare Workers
 * and Next.js server runtime with automatic sanitization of secrets, tokens,
 * passwords, phone numbers, and customer PII.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  requestId?: string;
  error?: {
    name?: string;
    message?: string;
    code?: string;
  };
}

const SENSITIVE_KEYS = new Set([
  "password",
  "password_hash",
  "token",
  "secret",
  "authorization",
  "cookie",
  "api_key",
  "apikey",
  "auth_secret",
  "gemini_api_key",
  "email_api_key",
  "webhook_secret",
  "phone",
  "mobile",
  "mobilenumber",
  "credit_card",
]);

/**
 * Recursively redacts sensitive fields in logging context.
 */
function redact(obj: unknown, depth: number = 0): unknown {
  if (depth > 5) return "[Truncated]";
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Basic heuristics for potential JWTs or bearer tokens
    if (obj.startsWith("Bearer ") || (obj.length > 64 && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(obj))) {
      return "[REDACTED_TOKEN]";
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redact(item, depth + 1));
  }

  if (typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lower) || lower.includes("secret") || lower.includes("password")) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = redact(value, depth + 1);
      }
    }
    return sanitized;
  }

  return obj;
}

function outputLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): void {
  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context: redact(context) as Record<string, unknown> } : {}),
  };

  if (error instanceof Error) {
    payload.error = {
      name: error.name,
      message: error.message,
      code: (error as { code?: string }).code,
    };
  }

  const serialized = JSON.stringify(payload);

  switch (level) {
    case "error":
      console.error(serialized);
      break;
    case "warn":
      console.warn(serialized);
      break;
    case "info":
      console.info(serialized);
      break;
    case "debug":
      console.debug(serialized);
      break;
  }
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    outputLog("debug", message, context);
  },
  info(message: string, context?: Record<string, unknown>): void {
    outputLog("info", message, context);
  },
  warn(message: string, context?: Record<string, unknown>, error?: unknown): void {
    outputLog("warn", message, context, error);
  },
  error(message: string, context?: Record<string, unknown>, error?: unknown): void {
    outputLog("error", message, context, error);
  },
};

