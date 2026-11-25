/**
 * Aurelle Spaces — Admin Sign-Out Route Handler
 * POST /api/admin/auth/logout
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db/client";
import { sessionsRepository } from "@/lib/db/repositories/sessions.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { hashSessionToken } from "@/lib/security/crypto";
import { AUTH_COOKIE_NAME } from "@/lib/security/auth";
import { logger } from "@/lib/logging/logger";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      try {
        const db = getDatabase();
        const tokenHash = await hashSessionToken(token);
        const existing = await sessionsRepository.findSessionByTokenHash(db, tokenHash);

        if (existing) {
          await sessionsRepository.deleteSessionByTokenHash(db, tokenHash);
          await auditRepository.log(db, {
            actorId: existing.user.id,
            action: "admin.logout",
            entityType: "admin_user",
            entityId: existing.user.id,
          });
        }
      } catch (err) {
        logger.warn("Non-fatal error while purging session from database on sign-out", {}, err);
      }
    }

    // Always clear the cookie
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Signed out successfully.",
    });
  } catch (error) {
    logger.error("Error during admin sign-out", {}, error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to sign out cleanly." },
      },
      { status: 500 }
    );
  }
}

