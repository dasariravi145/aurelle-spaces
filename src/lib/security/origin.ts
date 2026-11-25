/**
 * Aurelle Spaces — Origin & CSRF Guard
 * 
 * Protects state-changing endpoints (POST, PUT, PATCH, DELETE) against
 * Cross-Site Request Forgery (CSRF) and unauthorized cross-origin execution.
 */

import { getServerConfig } from "@/lib/env";

const ALLOWED_ORIGINS_STATIC = [
  "https://aurelle.dsecops88.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export interface OriginValidationResult {
  allowed: boolean;
  reason?: string;
  origin?: string;
}

/**
 * Validates whether an incoming request originates from an authorized domain.
 * Safe methods (GET, HEAD, OPTIONS) are exempt.
 * State-changing methods (POST, PUT, PATCH, DELETE) require valid Origin or Referer.
 */
export function validateRequestOrigin(request: Request): OriginValidationResult {
  const method = request.method.toUpperCase();

  // Read-only or preflight requests are safe
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return { allowed: true };
  }

  const config = getServerConfig();
  const configuredAppUrl = config.appUrl.replace(/\/$/, "");

  const allowedSet = new Set(
    ALLOWED_ORIGINS_STATIC.concat(configuredAppUrl ? [configuredAppUrl] : [])
  );

  const rawOrigin = request.headers.get("origin");
  const rawReferer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");

  // 1. Explicit cross-site detection via Fetch Metadata
  if (secFetchSite === "cross-site") {
    return {
      allowed: false,
      reason: "Blocked by Sec-Fetch-Site cross-site policy.",
    };
  }

  // 2. Validate Origin header if present
  if (rawOrigin) {
    const normalizedOrigin = rawOrigin.trim().replace(/\/$/, "");
    if (allowedSet.has(normalizedOrigin)) {
      return { allowed: true, origin: normalizedOrigin };
    }
    return {
      allowed: false,
      reason: `Unauthorized origin: '${normalizedOrigin}'.`,
      origin: normalizedOrigin,
    };
  }

  // 3. Fallback to Referer header if Origin header was omitted
  if (rawReferer) {
    try {
      const refererUrl = new URL(rawReferer);
      const refererOrigin = refererUrl.origin.replace(/\/$/, "");
      if (allowedSet.has(refererOrigin)) {
        return { allowed: true, origin: refererOrigin };
      }
      return {
        allowed: false,
        reason: `Unauthorized referer origin: '${refererOrigin}'.`,
        origin: refererOrigin,
      };
    } catch {
      return {
        allowed: false,
        reason: "Malformed referer URL.",
      };
    }
  }

  // 4. In production environments, state-changing requests without Origin or Referer are rejected
  if (config.environment === "production") {
    return {
      allowed: false,
      reason: "Missing Origin or Referer header on state-changing request.",
    };
  }

  // In development, allow requests without Origin/Referer (e.g. local tooling or server calls)
  return { allowed: true };
}

