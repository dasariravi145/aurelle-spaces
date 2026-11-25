/**
 * Aurelle Spaces — Anonymous Chat Session Manager
 * 
 * Provides secure, unguessable anonymous session tokens stored in HTTP-only cookies.
 * Prevents unauthorized access or cross-visitor conversation hijacking.
 */

import { generateSecureId } from "@/lib/security/crypto";

export const CHAT_SESSION_COOKIE = "aurelle_chat_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Validates or generates an anonymous chat session token.
 */
export function getOrCreateSessionId(existingToken?: string | null): {
  sessionId: string;
  isNew: boolean;
} {
  if (
    existingToken &&
    typeof existingToken === "string" &&
    existingToken.startsWith("ses_chat_") &&
    existingToken.length >= 24 &&
    existingToken.length <= 64 &&
    /^[a-zA-Z0-9_-]+$/.test(existingToken)
  ) {
    return { sessionId: existingToken, isNew: false };
  }

  return {
    sessionId: generateSecureId("ses_chat_"),
    isNew: true,
  };
}

/**
 * Builds the Set-Cookie header string for an anonymous chat session.
 */
export function buildChatSessionCookieHeader(sessionId: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  return `${CHAT_SESSION_COOKIE}=${encodeURIComponent(
    sessionId
  )}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax; HttpOnly${
    isProduction ? "; Secure" : ""
  }`;
}

