/**
 * Aurelle Spaces — Admin Manual Automation Retry API
 * POST /api/admin/automations/[id]/retry
 * 
 * Allows studio administrators (super_admin, editor) to manually trigger an immediate
 * re-dispatch attempt for a failed or dead-letter outbox event.
 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { processPendingAutomationEvents } from "@/lib/automation/event-processor";
import { logger } from "@/lib/logging/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { user } = await requireAdminSession();
    const { id } = await params;

    // RBAC: super_admin and editor only
    if (user.role !== "super_admin" && user.role !== "editor") {
      return NextResponse.json(
        { error: "Insufficient permissions to retry automation events." },
        { status: 403 }
      );
    }

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json(
        { error: "Database service unavailable." },
        { status: 503 }
      );
    }

    const event = await automationRepository.getEventById(db, id);
    if (!event) {
      return NextResponse.json(
        { error: "Automation event not found." },
        { status: 404 }
      );
    }

    // Reset status to pending and clear retry backoff
    await automationRepository.resetForRetry(db, id);

    // Attempt immediate outbox execution
    const summary = await processPendingAutomationEvents(db, {
      eventId: id,
    });

    // Record audit log
    await auditRepository.log(db, {
      actorId: user.id,
      action: "automation.manual_retry",
      entityType: "automation_event",
      entityId: id,
      metadata: {
        adminName: user.display_name,
        eventType: event.event_type,
        succeeded: summary.succeeded > 0,
      },
    });

    const isSuccess = summary.succeeded > 0;
    const errorDetail = summary.results[0]?.error;

    return NextResponse.json({
      success: isSuccess,
      message: isSuccess
        ? "Automation event delivered successfully to n8n."
        : `Retry attempt failed: ${errorDetail || "n8n delivery error"}`,
    });
  } catch (err: unknown) {
    logger.error("Error in POST /api/admin/automations/[id]/retry", {}, err);
    return NextResponse.json(
      { error: "Failed to execute manual retry." },
      { status: 500 }
    );
  }
}

