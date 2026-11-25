/**
 * Aurelle Spaces — Transactional Outbox Event Processor
 * 
 * Selects, claims, and delivers queued events to external webhook targets (n8n).
 * Enforces atomic conditional updates to prevent concurrent dispatch without table locks.
 */

import type { D1Database } from "@/types/cloudflare";
import type { AutomationEventRecord } from "@/lib/db/types";
import { automationRepository } from "@/lib/db/repositories/automation.repository";
import { enquiriesRepository } from "@/lib/db/repositories/enquiries.repository";
import { deliverWebhookEvent } from "./n8n-client";
import { getAutomationConfig, AutomationConfig } from "./config";
import {
  AutomationEventEnvelope,
  EnquiryCreatedPayload,
  EnquiryAssignedPayload,
  EnquiryFollowupDuePayload,
  AutomationDeliveryFailedPayload,
} from "./types";
import { logger } from "@/lib/logging/logger";

export interface OutboxProcessOptions {
  limit?: number;
  eventId?: string;
  configOverride?: AutomationConfig;
}

export interface OutboxProcessSummary {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  results: Array<{
    eventId: string;
    eventType: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Processes queued outbox events sequentially with atomic claims.
 */
export async function processPendingAutomationEvents(
  db: D1Database,
  options: OutboxProcessOptions = {}
): Promise<OutboxProcessSummary> {
  const config = options.configOverride || getAutomationConfig();
  const limit = options.limit || 20;

  const summary: OutboxProcessSummary = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    results: [],
  };

  if (!config.isConfigured) {
    logger.warn("Outbox processor skipped: n8n webhook is unconfigured.");
    return summary;
  }

  // 1. Fetch candidate events
  let candidateEvents: AutomationEventRecord[] = [];
  if (options.eventId) {
    const single = await automationRepository.getEventById(db, options.eventId);
    if (single) {
      candidateEvents = [single];
    }
  } else {
    candidateEvents = await automationRepository.getPendingEvents(db, limit);
  }

  for (const event of candidateEvents) {
    // 2. Conditionally claim event to prevent concurrent double-processing
    const claimed = await automationRepository.claimPendingEvent(db, event.id);
    if (!claimed) {
      summary.skipped++;
      continue;
    }

    summary.processed++;

    try {
      // 3. Assemble versioned envelope based on event type
      let envelope: AutomationEventEnvelope;

      if (event.event_type === "enquiry.created") {
        let payloadData: EnquiryCreatedPayload;

        // Try parsing stored reference payload
        let parsedRef: Record<string, unknown> | null = null;
        if (event.payload_reference) {
          try {
            parsedRef = JSON.parse(event.payload_reference);
          } catch {
            // Fallback to database lookup
          }
        }

        // If stored payload is incomplete, load entity directly from D1
        if (parsedRef && parsedRef.email && parsedRef.fullName) {
          payloadData = {
            enquiry_id: event.related_entity_id,
            reference_code: `AUR-${event.related_entity_id.slice(-6).toUpperCase()}`,
            source: (parsedRef.source as "website_contact" | "ai_chatbot") || "website_contact",
            client_name: String(parsedRef.fullName),
            client_email: String(parsedRef.email),
            client_phone: parsedRef.mobileNumber ? String(parsedRef.mobileNumber) : null,
            city: String(parsedRef.city || "Unknown"),
            project_type: String(parsedRef.projectType || "General"),
            property_type: parsedRef.propertyType ? String(parsedRef.propertyType) : null,
            approximate_area: parsedRef.approximateArea ? String(parsedRef.approximateArea) : null,
            budget_range: parsedRef.budgetRange ? String(parsedRef.budgetRange) : null,
            expected_timeline: parsedRef.expectedTimeline ? String(parsedRef.expectedTimeline) : null,
            project_description: String(parsedRef.projectDescription || "No description provided"),
            submitted_at: String(parsedRef.submittedAt || event.created_at),
          };
        } else {
          const enquiry = await enquiriesRepository.findById(db, event.related_entity_id);
          if (!enquiry) {
            throw new Error(`Related enquiry entity not found: ${event.related_entity_id}`);
          }
          payloadData = {
            enquiry_id: enquiry.id,
            reference_code: `AUR-${enquiry.id.slice(-6).toUpperCase()}`,
            source: (enquiry.enquiry_source as "website_contact" | "ai_chatbot") || "website_contact",
            client_name: enquiry.full_name,
            client_email: enquiry.email,
            client_phone: enquiry.phone,
            city: enquiry.city,
            project_type: enquiry.project_type,
            property_type: enquiry.property_type,
            approximate_area: enquiry.approximate_area,
            budget_range: enquiry.budget_range,
            expected_timeline: enquiry.expected_timeline,
            project_description: enquiry.project_description,
            submitted_at: enquiry.created_at,
          };
        }

        envelope = {
          schema_version: "1.0.0",
          event_id: event.id,
          event_type: "enquiry.created",
          occurred_at: event.created_at,
          source: "aurelle.spaces",
          entity_id: event.related_entity_id,
          payload: payloadData,
        };
      } else if (event.event_type === "enquiry.assigned") {
        let assignedData: EnquiryAssignedPayload;
        let parsedRef: Record<string, unknown> | null = null;
        if (event.payload_reference) {
          try {
            parsedRef = JSON.parse(event.payload_reference);
          } catch {
            // fallback
          }
        }

        if (parsedRef && parsedRef.assignedAdminEmail) {
          assignedData = {
            enquiry_id: event.related_entity_id,
            reference_code: String(parsedRef.referenceCode || `AUR-${event.related_entity_id.slice(-6).toUpperCase()}`),
            assigned_admin_id: String(parsedRef.assignedAdminId),
            assigned_admin_name: String(parsedRef.assignedAdminName || "Assigned Team Member"),
            assigned_admin_email: String(parsedRef.assignedAdminEmail),
            assigned_by_id: parsedRef.assignedById ? String(parsedRef.assignedById) : undefined,
            assigned_by_name: parsedRef.assignedByName ? String(parsedRef.assignedByName) : undefined,
            project_type: String(parsedRef.projectType || "General"),
            city: String(parsedRef.city || "Unknown"),
            assigned_at: String(parsedRef.assignedAt || event.created_at),
          };
        } else {
          const enquiryWithAssignee = await enquiriesRepository.findByIdWithAssignee(db, event.related_entity_id);
          assignedData = {
            enquiry_id: event.related_entity_id,
            reference_code: `AUR-${event.related_entity_id.slice(-6).toUpperCase()}`,
            assigned_admin_id: enquiryWithAssignee?.assigned_admin_id || "unassigned",
            assigned_admin_name: enquiryWithAssignee?.assigned_admin_name || "Assigned Team Member",
            assigned_admin_email: enquiryWithAssignee?.assigned_admin_email || "studio@aurelle.dsecops88.online",
            project_type: enquiryWithAssignee?.project_type || "General",
            city: enquiryWithAssignee?.city || "Unknown",
            assigned_at: event.created_at,
          };
        }

        envelope = {
          schema_version: "1.0.0",
          event_id: event.id,
          event_type: "enquiry.assigned",
          occurred_at: event.created_at,
          source: "aurelle.spaces",
          entity_id: event.related_entity_id,
          payload: assignedData,
        };
      } else if (event.event_type === "enquiry.followup_due") {
        let parsedRef: Record<string, unknown> | null = null;
        if (event.payload_reference) {
          try {
            parsedRef = JSON.parse(event.payload_reference);
          } catch {
            // fallback
          }
        }

        const followupData: EnquiryFollowupDuePayload = {
          enquiry_id: event.related_entity_id,
          reference_code: String(parsedRef?.referenceCode || `AUR-${event.related_entity_id.slice(-6).toUpperCase()}`),
          client_name: String(parsedRef?.clientName || "Valued Client"),
          client_email: String(parsedRef?.clientEmail || ""),
          project_type: String(parsedRef?.projectType || "General"),
          city: String(parsedRef?.city || "Unknown"),
          status: String(parsedRef?.status || "new"),
          assigned_admin_id: parsedRef?.assignedAdminId ? String(parsedRef.assignedAdminId) : null,
          assigned_admin_name: parsedRef?.assignedAdminName ? String(parsedRef.assignedAdminName) : null,
          assigned_admin_email: parsedRef?.assignedAdminEmail ? String(parsedRef.assignedAdminEmail) : null,
          created_at: String(parsedRef?.createdAt || event.created_at),
          hours_uncontacted: Number(parsedRef?.hoursUncontacted || 24),
          reminder_window: String(parsedRef?.reminderWindow || "24_hours"),
        };

        envelope = {
          schema_version: "1.0.0",
          event_id: event.id,
          event_type: "enquiry.followup_due",
          occurred_at: event.created_at,
          source: "aurelle.spaces",
          entity_id: event.related_entity_id,
          payload: followupData,
        };
      } else if (event.event_type === "automation.delivery_failed") {
        let parsedRef: Record<string, unknown> | null = null;
        if (event.payload_reference) {
          try {
            parsedRef = JSON.parse(event.payload_reference);
          } catch {
            // fallback
          }
        }

        const failureData: AutomationDeliveryFailedPayload = {
          event_id: String(parsedRef?.eventId || event.id),
          failed_event_type: String(parsedRef?.failedEventType || "unknown"),
          related_entity_id: String(parsedRef?.relatedEntityId || event.related_entity_id),
          attempt_count: Number(parsedRef?.attemptCount || event.attempt_count),
          failure_category: (parsedRef?.failureCategory as AutomationDeliveryFailedPayload["failure_category"]) || "max_retries_exceeded",
          error_summary: String(parsedRef?.errorSummary || event.last_error_summary || "Delivery attempts exhausted"),
          failed_at: String(parsedRef?.failedAt || event.created_at),
          monitor_url: String(parsedRef?.monitorUrl || "https://aurelle.dsecops88.online/admin/automations"),
        };

        envelope = {
          schema_version: "1.0.0",
          event_id: event.id,
          event_type: "automation.delivery_failed",
          occurred_at: event.created_at,
          source: "aurelle.spaces",
          entity_id: event.related_entity_id,
          payload: failureData,
        };
      } else {
        // Generic envelope for other event types
        envelope = {
          schema_version: "1.0.0",
          event_id: event.id,
          event_type: event.event_type,
          occurred_at: event.created_at,
          source: "aurelle.spaces",
          entity_id: event.related_entity_id,
          payload: event.payload_reference ? JSON.parse(event.payload_reference) : {},
        };
      }

      // 4. Deliver event to n8n webhook
      const delivery = await deliverWebhookEvent(envelope, config);

      if (delivery.success) {
        await automationRepository.markCompleted(db, event.id);
        summary.succeeded++;
        summary.results.push({
          eventId: event.id,
          eventType: event.event_type,
          success: true,
        });
      } else {
        await automationRepository.markFailed(
          db,
          event.id,
          delivery.errorMessage || "Webhook delivery failed",
          config.maxRetries
        );
        summary.failed++;
        summary.results.push({
          eventId: event.id,
          eventType: event.event_type,
          success: false,
          error: delivery.errorMessage,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unexpected outbox processor error";
      logger.error("Outbox event dispatch threw unhandled exception", { eventId: event.id }, err);

      await automationRepository.markFailed(
        db,
        event.id,
        errMsg,
        config.maxRetries
      );

      summary.failed++;
      summary.results.push({
        eventId: event.id,
        eventType: event.event_type,
        success: false,
        error: errMsg,
      });
    }
  }

  return summary;
}

