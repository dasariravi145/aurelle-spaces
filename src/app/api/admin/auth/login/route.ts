/**
 * Aurelle Spaces — Admin Sign-In Route Handler
 * POST /api/admin/auth/login
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db/client";
import { adminUsersRepository } from "@/lib/db/repositories/admin-users.repository";
import { sessionsRepository } from "@/lib/db/repositories/sessions.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { verifyPassword, generateSessionToken, hashSessionToken } from "@/lib/security/crypto";
import { loginRateLimiter } from "@/lib/security/rate-limit";
import { AUTH_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/security/auth";
import { validateRequestOrigin } from "@/lib/security/origin";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  try {
    // 0. Enforce origin & CSRF guard
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.allowed) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN_ORIGIN", message: originCheck.reason || "Forbidden origin." } },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request payload." } },
        { status: 400 }
      );
    }

    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Email and password are required." } },
        { status: 400 }
      );
    }

    // Extract client IP (safely fallback for edge)
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const userAgent = request.headers.get("user-agent") || "unknown";

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message: "Database binding is not available. Please verify Cloudflare D1 configuration.",
          },
        },
        { status: 503 }
      );
    }

    // 1. Enforce login attempt rate limits
    const rateLimit = await loginRateLimiter.checkRateLimit(db, email, clientIp);
    if (!rateLimit.allowed) {
      logger.warn("Admin sign-in blocked by rate limiter", { email, clientIp });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many failed attempts. Please try again in 15 minutes.",
          },
        },
        { status: 429 }
      );
    }

    // 2. Lookup user by email
    const user = await adminUsersRepository.findByEmail(db, email);

    if (!user) {
      await loginRateLimiter.recordAttempt(db, email, clientIp, false);
      await auditRepository.log(db, {
        actorId: "system",
        action: "admin.login_failed",
        entityType: "admin_user",
        entityId: "unknown",
        metadata: { reason: "account_not_found" },
      });

      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    // 3. Verify password hash using constant-time PBKDF2 comparison
    const passwordValid = await verifyPassword(password, user.password_hash);

    if (!passwordValid) {
      await loginRateLimiter.recordAttempt(db, email, clientIp, false);
      await auditRepository.log(db, {
        actorId: user.id,
        action: "admin.login_failed",
        entityType: "admin_user",
        entityId: user.id,
        metadata: { reason: "invalid_credentials" },
      });

      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    // 4. Verify account active status
    if (user.account_status !== "active") {
      logger.warn("Sign-in attempted for inactive account", { email, status: user.account_status });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "This administrative account is currently suspended or inactive.",
          },
        },
        { status: 403 }
      );
    }

    // 5. Generate secure session token and hash
    const rawToken = generateSessionToken();
    const tokenHash = await hashSessionToken(rawToken);

    await sessionsRepository.createSession(db, {
      adminId: user.id,
      tokenHash,
      ipAddress: clientIp,
      userAgent,
      durationDays: 7,
    });

    // 6. Record successful login and touch last_login_at
    await adminUsersRepository.updateLastLogin(db, user.id);
    await loginRateLimiter.recordAttempt(db, email, clientIp, true);
    await auditRepository.log(db, {
      actorId: user.id,
      action: "admin.login_success",
      entityType: "admin_user",
      entityId: user.id,
    });

    // 7. Set secure session cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Unexpected error during admin sign-in", {}, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected server error occurred during sign-in.",
        },
      },
      { status: 500 }
    );
  }
}

