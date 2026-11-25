/**
 * Aurelle Spaces — Machine Integration API: Mark Follow-up Reminder Dispatched
 * POST /api/automations/reminders/mark-sent
 * 
 * Updates the `followup_reminder_at` timestamp on an enquiry record after n8n
 * dispatches a reminder email to ensure durable deduplication and prevent reminder spam.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { authenticateMachineRequest } from "@/lib/security/machine-auth";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  const auth = await authenticateMachineRequest(request);
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || "Machine authentication required." },
      { status: auth.statusCode || 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const enquiryId = body?.enquiry_id as string | undefined;

  if (!enquiryId || typeof enquiryId !== "string" || enquiryId.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required enquiry_id parameter." },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();
    const updated = await enquiriesRepository.markFollowupReminderSent(db, enquiryId.trim());

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found or could not be updated." },
        { status: 404 }
      );
    }

    logger.info("Follow-up reminder recorded for enquiry", { enquiryId });

    return NextResponse.json({
      success: true,
      message: "Follow-up reminder recorded successfully.",
    });
  } catch (error) {
    logger.error("Failed to record follow-up reminder sent state", { enquiryId }, error);
    return NextResponse.json(
      { success: false, error: "Database error updating reminder status." },
      { status: 500 }
    );
  }
}

