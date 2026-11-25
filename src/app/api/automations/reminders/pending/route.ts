/**
 * Aurelle Spaces — Machine Integration API: Pending Follow-up Reminders Query
 * GET /api/automations/reminders/pending
 * 
 * Returns uncontacted 'new' enquiries that have remained in triage beyond the configured threshold
 * (e.g. 24 hours). Used by n8n scheduled workflow to dispatch team reminders.
 * Strictly avoids Won, Lost, Closed, and Archived enquiries.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import { authenticateMachineRequest } from "@/lib/security/machine-auth";
import { logger } from "@/lib/logging/logger";

export async function GET(request: Request) {
  const auth = await authenticateMachineRequest(request);
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || "Machine authentication required." },
      { status: auth.statusCode || 401 }
    );
  }

  try {
    const db = getDatabase();
    const settings = await settingsRepository.getNotificationSettings(db);

    if (!settings.automationMasterEnabled) {
      return NextResponse.json({
        success: true,
        candidates: [],
        message: "Studio automations are currently disabled in settings.",
      });
    }

    const thresholdHours = settings.followupReminderHours || 24;

    const candidates = await enquiriesRepository.getPendingFollowupEnquiries(
      db,
      thresholdHours,
      25
    );

    const formatted = candidates.map((enq) => {
      // Calculate approximate hours since submission
      const createdDate = new Date(enq.created_at);
      const now = new Date();
      const hoursUncontacted = Math.max(
        thresholdHours,
        Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60))
      );

      return {
        enquiry_id: enq.id,
        reference_code: `AUR-${enq.id.slice(-6).toUpperCase()}`,
        client_name: enq.full_name,
        client_email: enq.email,
        city: enq.city,
        project_type: enq.project_type,
        status: enq.status,
        assigned_admin_id: enq.assigned_admin_id || null,
        assigned_admin_name: enq.assigned_admin_name || null,
        assigned_admin_email: enq.assigned_admin_email || null,
        recipient_email: enq.assigned_admin_email || settings.studioNotificationEmail,
        created_at: enq.created_at,
        hours_uncontacted: hoursUncontacted,
        admin_url: `https://aurelle.dsecops88.online/admin/enquiries/${enq.id}`,
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      thresholdHours,
      candidates: formatted,
    });
  } catch (error) {
    logger.error("Failed to fetch pending follow-up candidates", {}, error);
    return NextResponse.json(
      { success: false, error: "Database error retrieving follow-up candidates." },
      { status: 500 }
    );
  }
}

