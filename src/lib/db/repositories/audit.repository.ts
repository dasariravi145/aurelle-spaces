/**
 * Aurelle Spaces — Audit Logs Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryAll, queryPaged } from "@/lib/db/client";
import type { AuditLogRecord, PageParams, PagedResult } from "@/lib/db/types";
import { recordAuditEvent, type AuditEventParams } from "@/lib/security/audit";

export const auditRepository = {
  /**
   * Safe audit logging helper. Wraps security audit module.
   */
  async log(db: D1Database, params: AuditEventParams): Promise<void> {
    return recordAuditEvent(db, params);
  },

  async listRecent(
    db: D1Database,
    pageParams?: PageParams
  ): Promise<PagedResult<AuditLogRecord>> {
    return queryPaged<AuditLogRecord>(
      db,
      `SELECT COUNT(*) as total FROM audit_logs`,
      `SELECT * FROM audit_logs ORDER BY created_at DESC`,
      [],
      pageParams
    );
  },

  async listByEntity(
    db: D1Database,
    entityType: string,
    entityId: string
  ): Promise<AuditLogRecord[]> {
    return queryAll<AuditLogRecord>(
      db,
      `SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC`,
      entityType,
      entityId
    );
  },

  async listByActor(
    db: D1Database,
    actorId: string,
    limit: number = 50
  ): Promise<AuditLogRecord[]> {
    return queryAll<AuditLogRecord>(
      db,
      `SELECT * FROM audit_logs WHERE actor_id = ? ORDER BY created_at DESC LIMIT ?`,
      actorId,
      limit
    );
  },
};

