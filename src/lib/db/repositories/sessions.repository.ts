/**
 * Aurelle Spaces — Admin Sessions Repository
 * 
 * Manages server-side session persistence in Cloudflare D1.
 * Only the SHA-256 hash of the session secret is stored in the database.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute } from "@/lib/db/client";
import type { AdminSessionRecord, AdminUserRecord } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";

export interface CreateSessionParams {
  adminId: string;
  tokenHash: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  durationDays?: number;
}

export const sessionsRepository = {
  async createSession(
    db: D1Database,
    params: CreateSessionParams
  ): Promise<AdminSessionRecord> {
    const id = generateSecureId("ses_");
    const days = params.durationDays ?? 7;

    await execute(
      db,
      `INSERT INTO admin_sessions (
        id, admin_id, token_hash, ip_address, user_agent, expires_at, created_at, last_active_at
      ) VALUES (
        ?, ?, ?, ?, ?, datetime('now', '+' || ? || ' days'), datetime('now'), datetime('now')
      )`,
      id,
      params.adminId,
      params.tokenHash,
      params.ipAddress || null,
      params.userAgent || null,
      days
    );

    const record = await queryOne<AdminSessionRecord>(
      db,
      `SELECT * FROM admin_sessions WHERE id = ? LIMIT 1`,
      id
    );

    if (!record) throw new Error("Failed to persist administrative session.");
    return record;
  },

  async findSessionByTokenHash(
    db: D1Database,
    tokenHash: string
  ): Promise<{ session: AdminSessionRecord; user: AdminUserRecord } | null> {
    const row = await queryOne<AdminSessionRecord & AdminUserRecord>(
      db,
      `SELECT 
        s.id as session_id,
        s.admin_id,
        s.token_hash,
        s.ip_address as session_ip,
        s.user_agent as session_ua,
        s.expires_at,
        s.created_at as session_created_at,
        s.last_active_at,
        u.id as user_id,
        u.email,
        u.password_hash,
        u.display_name,
        u.role,
        u.account_status,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at,
        u.last_login_at
       FROM admin_sessions s
       INNER JOIN admin_users u ON s.admin_id = u.id
       WHERE s.token_hash = ?
         AND s.expires_at > datetime('now')
         AND u.account_status = 'active'
       LIMIT 1`,
      tokenHash
    );

    if (!row) return null;

    const session: AdminSessionRecord = {
      id: (row as unknown as { session_id: string }).session_id,
      admin_id: row.admin_id,
      token_hash: row.token_hash,
      ip_address: (row as unknown as { session_ip: string | null }).session_ip,
      user_agent: (row as unknown as { session_ua: string | null }).session_ua,
      expires_at: row.expires_at,
      created_at: (row as unknown as { session_created_at: string }).session_created_at,
      last_active_at: row.last_active_at,
    };

    const user: AdminUserRecord = {
      id: (row as unknown as { user_id: string }).user_id,
      email: row.email,
      password_hash: row.password_hash,
      display_name: row.display_name,
      role: row.role,
      account_status: row.account_status,
      created_at: (row as unknown as { user_created_at: string }).user_created_at,
      updated_at: (row as unknown as { user_updated_at: string }).user_updated_at,
      last_login_at: row.last_login_at,
    };

    return { session, user };
  },

  async updateSessionActivity(db: D1Database, sessionId: string): Promise<void> {
    await execute(
      db,
      `UPDATE admin_sessions SET last_active_at = datetime('now') WHERE id = ?`,
      sessionId
    );
  },

  async deleteSession(db: D1Database, sessionId: string): Promise<boolean> {
    const result = await execute(
      db,
      `DELETE FROM admin_sessions WHERE id = ?`,
      sessionId
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async deleteSessionByTokenHash(db: D1Database, tokenHash: string): Promise<boolean> {
    const result = await execute(
      db,
      `DELETE FROM admin_sessions WHERE token_hash = ?`,
      tokenHash
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async deleteSessionsForUser(db: D1Database, adminId: string): Promise<void> {
    await execute(db, `DELETE FROM admin_sessions WHERE admin_id = ?`, adminId);
  },

  async cleanExpiredSessions(db: D1Database): Promise<number> {
    const result = await execute(
      db,
      `DELETE FROM admin_sessions WHERE expires_at <= datetime('now')`
    );
    return result.meta.changes ?? 0;
  },
};

