/**
 * Aurelle Spaces — Public Consultation Enquiry API Route Handler
 * POST /api/enquiries
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { validateServerEnquiry } from "@/lib/validation/enquiry-schema";
import { enquiryRateLimiter } from "@/lib/security/enquiry-rate-limit";
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

    // 1. Request payload size check (max 32KB)
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 32 * 1024) {
      return NextResponse.json(
        { success: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Enquiry payload exceeds maximum permitted size." } },
        { status: 413 }
      );
    }

    const body = await request.json().catch(() => null);

    // 2. Validate input on the server
    const validation = validateServerEnquiry(body);

    // Honeypot spam trap
    if (validation.isSpam) {
      logger.warn("Spam enquiry dropped silently via honeypot trap");
      return NextResponse.json({
        success: true,
        enquiryId: "enq_received",
        message: "Thank you for sharing your requirements. Your enquiry has been received.",
      });
    }

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please correct the highlighted errors in your consultation brief.",
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message: "Enquiry submission system is currently unavailable. Please contact the studio directly via email.",
          },
        },
        { status: 503 }
      );
    }

    // 3. Abuse prevention rate limiting
    const allowed = await enquiryRateLimiter.checkRateLimit(db, clientIp);
    if (!allowed) {
      logger.warn("Public enquiry submission rate limit reached", { clientIp });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many enquiries submitted from this location. Please wait 10 minutes before submitting another brief.",
          },
        },
        { status: 429 }
      );
    }

    // 4. Idempotency & duplicate protection
    const idempotencyKey =
      request.headers.get("x-idempotency-key") ||
      validation.data.idempotencyKey;

    if (idempotencyKey) {
      const existing = await enquiriesRepository.findByIdempotencyKey(db, idempotencyKey);
      if (existing) {
        return NextResponse.json({
          success: true,
          enquiryId: existing.id,
          message: "Thank you for sharing your requirements. Your enquiry has been received.",
        });
      }
    }

    // Secondary duplicate check: same email + projectType within 5 minutes
    const recentDuplicate = await enquiriesRepository.findRecentDuplicate(
      db,
      validation.data.email,
      validation.data.projectType,
      5
    );

    if (recentDuplicate) {
      return NextResponse.json({
        success: true,
        enquiryId: recentDuplicate.id,
        message: "Thank you for sharing your requirements. Your enquiry has been received.",
      });
    }

    // 5. Persist enquiry into Cloudflare D1
    const enquiry = await enquiriesRepository.create(db, {
      ...validation.data,
      source: "web_form",
      idempotencyKey: idempotencyKey || null,
    });

    // Record submission against rate limit
    await enquiryRateLimiter.recordSubmission(db, clientIp);

    // 6. Enqueue automation event for notification pipeline (Task 13)
    try {
      await automationRepository.createEvent(db, {
        eventType: "enquiry.created",
        relatedEntityId: enquiry.id,
        payloadReference: JSON.stringify({
          enquiryId: enquiry.id,
          fullName: enquiry.full_name,
          email: enquiry.email,
          projectType: enquiry.project_type,
          city: enquiry.city,
          source: "web_form",
        }),
      });
    } catch (eventErr) {
      logger.warn("Non-fatal: failed to record automation event for new enquiry", { id: enquiry.id }, eventErr);
    }

    // 7. Record immutable audit log
    await auditRepository.log(db, {
      actorId: "public_client",
      action: "enquiry.submitted",
      entityType: "enquiry",
      entityId: enquiry.id,
      metadata: {
        city: enquiry.city,
        projectType: enquiry.project_type,
        source: "web_form",
      },
    });

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        message: "Thank you for sharing your requirements. Your enquiry has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Enquiry submission unexpected error", {}, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while processing your enquiry. Please try again later.",
        },
      },
      { status: 500 }
    );
  }
}

