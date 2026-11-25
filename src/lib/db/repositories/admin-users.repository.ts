/**
 * Aurelle Spaces — Admin Users Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute, queryPaged } from "@/lib/db/client";
import type { AdminUserRecord, AdminRole, AdminAccountStatus, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";

export interface CreateAdminUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
  role: AdminRole;
}

export const adminUsersRepository = {
  async findById(db: D1Database, id: string): Promise<AdminUserRecord | null> {
    return queryOne<AdminUserRecord>(
      db,
      `SELECT * FROM admin_users WHERE id = ? LIMIT 1`,
      id
    );
  },

  async findByEmail(db: D1Database, email: string): Promise<AdminUserRecord | null> {
    return queryOne<AdminUserRecord>(
      db,
      `SELECT * FROM admin_users WHERE email = ? LIMIT 1`,
      email.toLowerCase().trim()
    );
  },

  async create(db: D1Database, input: CreateAdminUserInput): Promise<AdminUserRecord> {
    const id = generateSecureId("usr_");

    await execute(
      db,
      `INSERT INTO admin_users (id, email, password_hash, display_name, role, account_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))`,
      id,
      input.email.toLowerCase().trim(),
      input.passwordHash,
      input.displayName.trim(),
      input.role
    );

    const user = await this.findById(db, id);
    if (!user) throw new Error("Failed to retrieve created admin user.");
    return user;
  },

  async updateLastLogin(db: D1Database, id: string): Promise<void> {
    await execute(
      db,
      `UPDATE admin_users SET last_login_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
      id
    );
  },

  async updateStatus(db: D1Database, id: string, status: AdminAccountStatus): Promise<void> {
    await execute(
      db,
      `UPDATE admin_users SET account_status = ?, updated_at = datetime('now') WHERE id = ?`,
      status,
      id
    );
  },

  async list(db: D1Database, pageParams?: PageParams): Promise<PagedResult<AdminUserRecord>> {
    return queryPaged<AdminUserRecord>(
      db,
      `SELECT COUNT(*) as total FROM admin_users`,
      `SELECT * FROM admin_users ORDER BY created_at DESC`,
      [],
      pageParams
    );
  },

  async countAdmins(db: D1Database): Promise<number> {
    const row = await queryOne<{ total: number }>(db, `SELECT COUNT(*) as total FROM admin_users`);
    return row?.total ?? 0;
  },
};

