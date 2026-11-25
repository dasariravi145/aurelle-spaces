/**
 * Aurelle Spaces — Audit Trail Utility
 * 
 * Records critical administrative mutations and system events into the D1 `audit_logs` table.
 * Automatically strips sensitive credentials, tokens, and PII from logged metadata.
 */

import type { D1Database } from "@/types/cloudflare";
import { generateSecureId } from "./crypto";
import { logger } from "@/lib/logging/logger";

export interface AuditEventParams {
  actorId: string;
  action: string;
  entityType:
  | "project"
  | "service"
  | "article"
  | "media"
  | "enquiry"
  | "admin_user"
  | "system"
  | "automation_event"
  | "system_settings";
  entityId: string;
  metadata?: Record<string, unknown>;
}

const REDACTED_METADATA_KEYS = new Set([
  "password",
  "password_hash",
  "token",
  "secret",
  "auth",
  "key",
  "phone",
  "email",
]);

/**
 * Sanitize metadata to ensure no passwords, secrets, or raw PII are stored in audit logs.
 */
function sanitizeAuditMetadata(metadata?: Record<string, unknown>): string | null {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lower = key.toLowerCase();
    if (REDACTED_METADATA_KEYS.has(lower) || lower.includes("secret") || lower.includes("password")) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      clean[key] = "[OBJECT]";
    } else {
      clean[key] = value;
    }
  }

  return JSON.stringify(clean);
}

/**
 * Persist an audit event to the D1 database.
 * Designed to fail gracefully without terminating the primary user transaction if logging fails.
 */
export async function recordAuditEvent(
  db: D1Database,
  params: AuditEventParams
): Promise<void> {
  try {
    const id = generateSecureId("aud_");
    const safeMetadata = sanitizeAuditMetadata(params.metadata);

    await db
      .prepare(
        `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, safe_metadata, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(
        id,
        params.actorId,
        params.action,
        params.entityType,
        params.entityId,
        safeMetadata
      )
      .run();
  } catch (error) {
    // Audit log failure is logged to system output but does not throw to avoid blocking the caller
    logger.error("Failed to record audit event to D1 database", {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
    }, error);
  }
}

