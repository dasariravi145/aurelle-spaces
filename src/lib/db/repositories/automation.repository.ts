/**
 * Aurelle Spaces — Automation Events Repository
 * 
 * Manages reliable event dispatching for background workflows (e.g. n8n pipelines,
 * lead triage, email dispatch) with retry scheduling and status transitions.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { AutomationEventRecord, AutomationDeliveryRecord, ProcessingStatus, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { CreateAutomationEventInput } from "@/lib/validation/automation-schema";
import type { AutomationDeliveryCallbackPayload } from "@/lib/automation/types";

export const automationRepository = {
  async createEvent(
    db: D1Database,
    input: CreateAutomationEventInput
  ): Promise<AutomationEventRecord> {
    const id = generateSecureId("evt_");

    await execute(
      db,
      `INSERT INTO automation_events (
        id, event_type, related_entity_id, payload_reference, processing_status,
        attempt_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'pending', 0, datetime('now'), datetime('now'))`,
      id,
      input.eventType,
      input.relatedEntityId,
      input.payloadReference || null
    );

    const record = await queryOne<AutomationEventRecord>(
      db,
      `SELECT * FROM automation_events WHERE id = ? LIMIT 1`,
      id
    );

    if (!record) throw new Error("Failed to record automation event.");
    return record;
  },

  async getPendingEvents(
    db: D1Database,
    limit: number = 20
  ): Promise<AutomationEventRecord[]> {
    return queryAll<AutomationEventRecord>(
      db,
      `SELECT * FROM automation_events 
       WHERE processing_status IN ('pending', 'retrying')
         AND (next_retry_at IS NULL OR next_retry_at <= datetime('now'))
       ORDER BY created_at ASC LIMIT ?`,
      limit
    );
  },

  async markProcessing(db: D1Database, id: string): Promise<void> {
    await execute(
      db,
      `UPDATE automation_events 
       SET processing_status = 'processing', attempt_count = attempt_count + 1, updated_at = datetime('now')
       WHERE id = ?`,
      id
    );
  },

  async markCompleted(db: D1Database, id: string): Promise<void> {
    await execute(
      db,
      `UPDATE automation_events 
       SET processing_status = 'completed', updated_at = datetime('now')
       WHERE id = ?`,
      id
    );
  },

  async markFailed(
    db: D1Database,
    id: string,
    errorSummary: string,
    maxRetries: number = 5
  ): Promise<void> {
    const event = await queryOne<AutomationEventRecord>(
      db,
      `SELECT * FROM automation_events WHERE id = ? LIMIT 1`,
      id
    );

    const attempts = event ? event.attempt_count : 1;
    const isDeadLetter = attempts >= maxRetries;
    const nextStatus = isDeadLetter ? "dead_letter" : "retrying";

    // Exponential backoff: 2 ^ attempts minutes
    const backoffMinutes = Math.pow(2, attempts);

    await execute(
      db,
      `UPDATE automation_events 
       SET processing_status = ?, 
           last_error_summary = ?, 
           next_retry_at = datetime('now', '+' || ? || ' minutes'),
           updated_at = datetime('now')
       WHERE id = ?`,
      nextStatus,
      errorSummary.substring(0, 500),
      backoffMinutes,
      id
    );

    // If event permanently failed (dead letter) and is NOT itself a failure alert,
    // enqueue an 'automation.delivery_failed' alert event (anti-loop safeguard)
    if (isDeadLetter && event && event.event_type !== "automation.delivery_failed") {
      try {
        await this.createEvent(db, {
          eventType: "automation.delivery_failed",
          relatedEntityId: event.id,
          payloadReference: JSON.stringify({
            eventId: event.id,
            failedEventType: event.event_type,
            relatedEntityId: event.related_entity_id,
            attemptCount: attempts,
            failureCategory: "max_retries_exceeded",
            errorSummary: errorSummary.substring(0, 300),
            failedAt: new Date().toISOString(),
            monitorUrl: "https://aurelle.dsecops88.online/admin/automations",
          }),
        });
      } catch {
        // Non-blocking alert emission
      }
    }
  },

  /**
   * Records downstream delivery outcome reported by n8n or an external provider.
   */
  async recordDeliveryRecord(
    db: D1Database,
    payload: AutomationDeliveryCallbackPayload
  ): Promise<boolean> {
    const id = generateSecureId("del_");
    try {
      await execute(
        db,
        `INSERT INTO automation_delivery_records (
          id, event_id, workflow_name, entity_id, purpose, idempotency_key,
          status, provider_name, provider_message_id, error_message, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(idempotency_key) DO UPDATE SET
          status = excluded.status,
          provider_name = excluded.provider_name,
          provider_message_id = excluded.provider_message_id,
          error_message = excluded.error_message,
          updated_at = datetime('now')`,
        id,
        payload.event_id,
        payload.workflow_name,
        payload.entity_id,
        payload.purpose,
        payload.idempotency_key,
        payload.status,
        payload.provider_name || null,
        payload.provider_message_id || null,
        payload.error_message || null
      );
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Durable idempotency check to verify if a notification purpose has already succeeded.
   */
  async checkIdempotencyKey(
    db: D1Database,
    idempotencyKey: string
  ): Promise<boolean> {
    try {
      const record = await queryOne<{ id: string; status: string }>(
        db,
        `SELECT id, status FROM automation_delivery_records 
         WHERE idempotency_key = ? AND status IN ('provider_accepted', 'completed') LIMIT 1`,
        idempotencyKey
      );
      return Boolean(record);
    } catch {
      return false;
    }
  },

  /**
   * Retrieves downstream delivery records associated with an event.
   */
  async getDeliveryRecords(
    db: D1Database,
    eventId: string
  ): Promise<AutomationDeliveryRecord[]> {
    try {
      return await queryAll<AutomationDeliveryRecord>(
        db,
        `SELECT * FROM automation_delivery_records WHERE event_id = ? ORDER BY created_at DESC`,
        eventId
      );
    } catch {
      return [];
    }
  },

  async claimPendingEvent(
    db: D1Database,
    id: string
  ): Promise<boolean> {
    const res = await db
      .prepare(
        `UPDATE automation_events 
         SET processing_status = 'processing', 
             attempt_count = attempt_count + 1, 
             updated_at = datetime('now')
         WHERE id = ? AND processing_status IN ('pending', 'retrying')`
      )
      .bind(id)
      .run();

    return Boolean(res.meta?.changes && res.meta.changes > 0);
  },

  async getEventById(
    db: D1Database,
    id: string
  ): Promise<AutomationEventRecord | null> {
    return queryOne<AutomationEventRecord>(
      db,
      `SELECT * FROM automation_events WHERE id = ? LIMIT 1`,
      id
    );
  },

  async resetForRetry(
    db: D1Database,
    id: string
  ): Promise<void> {
    await execute(
      db,
      `UPDATE automation_events 
       SET processing_status = 'pending', 
           next_retry_at = NULL, 
           last_error_summary = NULL,
           updated_at = datetime('now')
       WHERE id = ?`,
      id
    );
  },

  async listEvents(
    db: D1Database,
    filter?: {
      status?: ProcessingStatus | "all";
      eventType?: string;
      search?: string;
    },
    pageParams?: PageParams
  ): Promise<PagedResult<AutomationEventRecord>> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter?.status && filter.status !== "all") {
      conditions.push("processing_status = ?");
      params.push(filter.status);
    }

    if (filter?.eventType && filter.eventType !== "all") {
      conditions.push("event_type = ?");
      params.push(filter.eventType);
    }

    if (filter?.search && filter.search.trim().length > 0) {
      const q = `%${filter.search.trim()}%`;
      conditions.push("(id LIKE ? OR related_entity_id LIKE ?)");
      params.push(q, q);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    return queryPaged<AutomationEventRecord>(
      db,
      `SELECT COUNT(*) as total FROM automation_events ${whereClause}`,
      `SELECT * FROM automation_events ${whereClause} ORDER BY created_at DESC`,
      params,
      pageParams
    );
  },

  async getMetrics(
    db: D1Database
  ): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    retrying: number;
    deadLetter: number;
  }> {
    const row = await queryOne<{
      total: number;
      pending: number;
      processing: number;
      completed: number;
      retrying: number;
      dead_letter: number;
    }>(
      db,
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN processing_status = 'pending' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN processing_status = 'processing' THEN 1 ELSE 0 END) as processing,
         SUM(CASE WHEN processing_status = 'completed' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN processing_status = 'retrying' THEN 1 ELSE 0 END) as retrying,
         SUM(CASE WHEN processing_status = 'dead_letter' THEN 1 ELSE 0 END) as dead_letter
       FROM automation_events`
    );

    return {
      total: row?.total || 0,
      pending: row?.pending || 0,
      processing: row?.processing || 0,
      completed: row?.completed || 0,
      retrying: row?.retrying || 0,
      deadLetter: row?.dead_letter || 0,
    };
  },
};

