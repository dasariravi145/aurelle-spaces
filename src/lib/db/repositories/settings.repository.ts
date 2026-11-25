/**
 * Aurelle Spaces — System & Notification Settings Repository
 * 
 * Manages persisted studio automation preferences, recipient emails, and feature toggles.
 * Persists in D1 `system_settings` table with graceful environment variable fallback.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute } from "@/lib/db/client";
import { StudioNotificationSettings } from "@/lib/automation/types";
import { getCloudflareEnv } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

const SETTINGS_KEY = "studio_notification_settings";

export const settingsRepository = {
  /**
   * Retrieves notification settings with fallbacks.
   */
  async getNotificationSettings(db: D1Database): Promise<StudioNotificationSettings> {
    const cfEnv = getCloudflareEnv();

    const defaults: StudioNotificationSettings = {
      studioNotificationEmail:
        cfEnv?.STUDIO_CONTACT_RECIPIENT ||
        process.env.STUDIO_CONTACT_RECIPIENT ||
        "studio@aurelle.dsecops88.online",
      customerAckEnabled: true,
      assignmentNotificationEnabled: true,
      followupReminderHours: 24,
      failureAlertEmail:
        process.env.ALERT_RECIPIENT_EMAIL ||
        "alerts@aurelle.dsecops88.online",
      automationMasterEnabled:
        (cfEnv?.AUTOMATION_ENABLED || process.env.AUTOMATION_ENABLED || "true").toLowerCase() !== "false",
    };

    try {
      const row = await queryOne<{ value: string; updated_at: string; updated_by: string | null }>(
        db,
        `SELECT value, updated_at, updated_by FROM system_settings WHERE key = ? LIMIT 1`,
        SETTINGS_KEY
      );

      if (row && row.value) {
        const parsed = JSON.parse(row.value);
        return {
          studioNotificationEmail: parsed.studioNotificationEmail || defaults.studioNotificationEmail,
          customerAckEnabled: typeof parsed.customerAckEnabled === "boolean" ? parsed.customerAckEnabled : defaults.customerAckEnabled,
          assignmentNotificationEnabled: typeof parsed.assignmentNotificationEnabled === "boolean" ? parsed.assignmentNotificationEnabled : defaults.assignmentNotificationEnabled,
          followupReminderHours: Number(parsed.followupReminderHours) || defaults.followupReminderHours,
          failureAlertEmail: parsed.failureAlertEmail || defaults.failureAlertEmail,
          automationMasterEnabled: typeof parsed.automationMasterEnabled === "boolean" ? parsed.automationMasterEnabled : defaults.automationMasterEnabled,
          updatedAt: row.updated_at,
          updatedBy: row.updated_by || undefined,
        };
      }
    } catch {
      // Table may not yet be created prior to migration execution
      logger.info("System settings lookup defaulted to environment configuration.");
    }

    return defaults;
  },

  /**
   * Updates notification settings (Super Admin only).
   */
  async updateNotificationSettings(
    db: D1Database,
    settings: StudioNotificationSettings,
    adminId: string
  ): Promise<StudioNotificationSettings> {
    const jsonString = JSON.stringify({
      studioNotificationEmail: settings.studioNotificationEmail,
      customerAckEnabled: settings.customerAckEnabled,
      assignmentNotificationEnabled: settings.assignmentNotificationEnabled,
      followupReminderHours: settings.followupReminderHours,
      failureAlertEmail: settings.failureAlertEmail,
      automationMasterEnabled: settings.automationMasterEnabled,
    });

    try {
      await execute(
        db,
        `INSERT INTO system_settings (key, value, description, updated_at, updated_by)
         VALUES (?, ?, 'Studio notification and n8n automation configuration', datetime('now'), ?)
         ON CONFLICT(key) DO UPDATE SET
           value = excluded.value,
           updated_at = datetime('now'),
           updated_by = excluded.updated_by`,
        SETTINGS_KEY,
        jsonString,
        adminId
      );
    } catch (err) {
      logger.error("Failed to persist notification settings to D1 system_settings table", {}, err);
      throw new Error("Unable to save notification settings to database.");
    }

    return this.getNotificationSettings(db);
  },
};

