/**
 * Aurelle Spaces — Scheduled / Batch Outbox Dispatch API
 * POST /api/automations/process
 * 
 * Endpoint triggered by Cloudflare Worker Cron Triggers (or external monitors)
 * to process pending outbox events. Protected by CRON_SECRET or administrative session.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { processPendingAutomationEvents } from "@/lib/automation/event-processor";
import { getCloudflareEnv } from "@/lib/env";
import { getAdminSession } from "@/lib/security/auth";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  try {
    const cfEnv = getCloudflareEnv();
    const cronSecret = cfEnv?.CRON_SECRET || process.env.CRON_SECRET;

    // Check authorization: either Bearer CRON_SECRET or authenticated admin session
    const authHeader = request.headers.get("authorization") || "";
    let isAuthorized = false;

    if (cronSecret && authHeader.startsWith("Bearer ")) {
      const providedToken = authHeader.slice(7).trim();
      if (providedToken === cronSecret) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      // Check for active admin session as fallback
      const adminSession = await getAdminSession();
      if (adminSession) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access to scheduled automation worker." },
        { status: 401 }
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    const summary = await processPendingAutomationEvents(db, {
      limit: Math.min(limit, 50),
    });

    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    logger.error("Unhandled error in POST /api/automations/process", {}, err);
    return NextResponse.json(
      { error: "Failed to process outbox events." },
      { status: 500 }
    );
  }
}

