/**
 * Aurelle Spaces — Server-Side Authentication & Session Guard
 * 
 * Validates HttpOnly session cookies against Cloudflare D1 session records.
 * Provides helper functions for Next.js App Router Server Components and Route Handlers.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db/client";
import { sessionsRepository } from "@/lib/db/repositories/sessions.repository";
import type { AdminSessionRecord, AdminUserRecord, AdminRole } from "@/lib/db/types";
import { hashSessionToken } from "./crypto";
import { ForbiddenError } from "@/lib/errors/app-error";

export const AUTH_COOKIE_NAME = "aurelle_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AuthenticatedAdminContext {
  session: AdminSessionRecord;
  user: AdminUserRecord;
}

/**
 * Retrieve the current authenticated administrative session.
 * Returns null if no valid session cookie exists or if the session has expired.
 */
export async function getAdminSession(): Promise<AuthenticatedAdminContext | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionToken || sessionToken.trim().length === 0) {
      return null;
    }

    const tokenHash = await hashSessionToken(sessionToken);
    const db = getDatabase();

    const authContext = await sessionsRepository.findSessionByTokenHash(db, tokenHash);
    if (!authContext) {
      return null;
    }

    // 1. Inactive or suspended accounts are denied access immediately
    if (authContext.user.account_status !== "active") {
      try {
        await sessionsRepository.deleteSession(db, authContext.session.id);
      } catch {
        // Non-blocking cleanup
      }
      return null;
    }

    // 2. Explicit session expiration check
    const expiresAt = new Date(authContext.session.expires_at).getTime();
    if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      try {
        await sessionsRepository.deleteSession(db, authContext.session.id);
      } catch {
        // Non-blocking cleanup
      }
      return null;
    }

    // Touch session activity asynchronously
    try {
      await sessionsRepository.updateSessionActivity(db, authContext.session.id);
    } catch {
      // Activity touch error is non-blocking
    }

    return authContext;
  } catch {
    // If D1 is unavailable in standard local dev without bindings, return null safely
    return null;
  }
}

/**
 * Enforce authentication for protected Server Components and Pages.
 * Automatically redirects unauthenticated requests to `/admin/login`.
 */
export async function requireAdminSession(): Promise<AuthenticatedAdminContext> {
  const authContext = await getAdminSession();

  if (!authContext) {
    redirect("/admin/login");
  }

  return authContext;
}

/**
 * Enforce role-based access control for protected administrative operations.
 * Throws a typed ForbiddenError if the authenticated user's role is not authorized.
 */
export async function requireAdminRole(
  allowedRoles: AdminRole[]
): Promise<AuthenticatedAdminContext> {
  const authContext = await requireAdminSession();

  if (!allowedRoles.includes(authContext.user.role)) {
    throw new ForbiddenError(
      `Role '${authContext.user.role}' is not authorized to access this administrative resource.`
    );
  }

  return authContext;
}

/**
 * Safely invalidate and remove the administrative session cookie.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

