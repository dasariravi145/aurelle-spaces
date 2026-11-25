/**
 * Aurelle Spaces — Admin Automations List & Metrics API
 * GET /api/admin/automations
 * 
 * Provides authorized studio administrators with visibility into the outbound
 * automation event queue, delivery statuses, retry counters, and error summaries.
 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { ProcessingStatus } from "@/lib/db/types";
import { getAutomationConfig } from "@/lib/automation/config";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  try {
    await requireAdminSession();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = (searchParams.get("status") || "all") as ProcessingStatus | "all";
    const eventType = searchParams.get("eventType") || "all";
    const search = searchParams.get("search") || undefined;

    let db;
    try {
      db = getDatabase();
    } catch {
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
        metrics: { total: 0, pending: 0, processing: 0, completed: 0, retrying: 0, deadLetter: 0 },
        config: { isConfigured: false, isEnabled: false },
      });
    }

    const result = await automationRepository.listEvents(
      db,
      { status, eventType, search },
      { page, limit }
    );

    const metrics = await automationRepository.getMetrics(db);
    const config = getAutomationConfig();

    return NextResponse.json({
      ...result,
      metrics,
      config: {
        isConfigured: config.isConfigured,
        isEnabled: config.isEnabled,
        maxRetries: config.maxRetries,
      },
    });
  } catch (err: unknown) {
    logger.error("Error in GET /api/admin/automations", {}, err);
    return NextResponse.json(
      { error: "Failed to retrieve automation events." },
      { status: 500 }
    );
  }
}

