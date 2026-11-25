/**
 * Aurelle Spaces — Admin Notification & Automation Settings API
 * GET /api/admin/settings/notifications
 * PUT /api/admin/settings/notifications
 * 
 * Enforces Super Admin RBAC permission. Allows configuring notification recipients,
 * reminder hours, and feature toggles. Never displays stored secrets.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/security/auth";
import { hasPermission } from "@/lib/security/rbac";
import { getDatabase } from "@/lib/db/client";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import { auditRepository } from "@/lib/db/repositories/audit.repository";
import { StudioNotificationSettings } from "@/lib/automation/types";
import { logger } from "@/lib/logging/logger";

export async function GET() {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 }
    );
  }

  if (!hasPermission(auth.user.role, "automations:read") && !hasPermission(auth.user.role, "settings:manage")) {
    return NextResponse.json(
      { success: false, error: "Permission required to view settings." },
      { status: 403 }
    );
  }

  try {
    const db = getDatabase();
    const settings = await settingsRepository.getNotificationSettings(db);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    logger.error("Failed to retrieve notification settings", {}, error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve notification settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await getAdminSession();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 }
    );
  }

  if (!hasPermission(auth.user.role, "settings:manage") && auth.user.role !== "super_admin") {
    return NextResponse.json(
      { success: false, error: "Super Admin or Studio Director permission required to update settings." },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<StudioNotificationSettings> | null;
  if (!body) {
    return NextResponse.json(
      { success: false, error: "Invalid settings request body." },
      { status: 400 }
    );
  }

  // Validate email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (body.studioNotificationEmail && !emailRegex.test(body.studioNotificationEmail.trim())) {
    return NextResponse.json(
      { success: false, error: "Invalid studio notification email format." },
      { status: 400 }
    );
  }

  if (body.failureAlertEmail && !emailRegex.test(body.failureAlertEmail.trim())) {
    return NextResponse.json(
      { success: false, error: "Invalid failure alert email format." },
      { status: 400 }
    );
  }

  try {
    const db = getDatabase();
    const current = await settingsRepository.getNotificationSettings(db);

    const updatedSettings: StudioNotificationSettings = {
      studioNotificationEmail: body.studioNotificationEmail?.trim() || current.studioNotificationEmail,
      customerAckEnabled: typeof body.customerAckEnabled === "boolean" ? body.customerAckEnabled : current.customerAckEnabled,
      assignmentNotificationEnabled: typeof body.assignmentNotificationEnabled === "boolean" ? body.assignmentNotificationEnabled : current.assignmentNotificationEnabled,
      followupReminderHours: Math.max(1, Math.min(168, Number(body.followupReminderHours) || current.followupReminderHours)),
      failureAlertEmail: body.failureAlertEmail?.trim() || current.failureAlertEmail,
      automationMasterEnabled: typeof body.automationMasterEnabled === "boolean" ? body.automationMasterEnabled : current.automationMasterEnabled,
    };

    const saved = await settingsRepository.updateNotificationSettings(db, updatedSettings, auth.user.id);

    await auditRepository.log(db, {
      actorId: auth.user.id,
      action: "settings.notifications_updated",
      entityType: "system_settings",
      entityId: "studio_notification_settings",
      metadata: {
        studioNotificationEmail: saved.studioNotificationEmail,
        customerAckEnabled: saved.customerAckEnabled,
        followupReminderHours: saved.followupReminderHours,
      },
    });

    return NextResponse.json({
      success: true,
      settings: saved,
      message: "Studio notification settings updated successfully.",
    });
  } catch (error) {
    logger.error("Failed to save notification settings", {}, error);
    return NextResponse.json(
      { success: false, error: "Database error saving notification settings." },
      { status: 500 }
    );
  }
}

