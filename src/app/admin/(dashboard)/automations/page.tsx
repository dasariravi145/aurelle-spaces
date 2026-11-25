import React from "react";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/security/auth";
import { getDatabase } from "@/lib/db/client";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import { getAutomationConfig } from "@/lib/automation/config";
import { AutomationManager } from "@/components/admin/automation-manager";
import { StudioNotificationSettings } from "@/lib/automation/types";
import type { AutomationEventRecord } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Workflow Automations & n8n Outbox | Aurelle Spaces Admin",
};

export default async function AdminAutomationsPage() {
  const auth = await requireAdminSession();

  let events: AutomationEventRecord[] = [];
  let metrics = {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    retrying: 0,
    deadLetter: 0,
  };

  let settings: StudioNotificationSettings = {
    studioNotificationEmail: "studio@aurelle.dsecops88.online",
    customerAckEnabled: true,
    assignmentNotificationEnabled: true,
    followupReminderHours: 24,
    failureAlertEmail: "alerts@aurelle.dsecops88.online",
    automationMasterEnabled: true,
  };

  const config = getAutomationConfig();

  try {
    const db = getDatabase();
    const result = await automationRepository.listEvents(db, undefined, { limit: 50 });
    events = result.data;
    metrics = await automationRepository.getMetrics(db);
    settings = await settingsRepository.getNotificationSettings(db);
  } catch {
    // If D1 is in local uninitialized mode
  }

  return (
    <AutomationManager
      initialEvents={events}
      initialMetrics={metrics}
      initialSettings={settings}
      userRole={auth.user.role}
      config={{
        isConfigured: config.isConfigured,
        isEnabled: config.isEnabled,
        maxRetries: config.maxRetries,
      }}
    />
  );
}
