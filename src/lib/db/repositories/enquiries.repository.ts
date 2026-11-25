/**
 * Aurelle Spaces — Enquiries Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { EnquiryRecord, EnquiryStatus, EnquirySource, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { EnquiryFormData } from "@/lib/validation/enquiry-schema";

export interface CreateEnquiryDbInput extends EnquiryFormData {
  source?: EnquirySource;
  idempotencyKey?: string | null;
}

export interface EnquiryMetrics {
  total: number;
  newCount: number;
  qualifiedCount: number;
  unassignedCount: number;
}

export const enquiriesRepository = {
  async findById(db: D1Database, id: string): Promise<EnquiryRecord | null> {
    return queryOne<EnquiryRecord>(
      db,
      `SELECT * FROM enquiries WHERE id = ? LIMIT 1`,
      id
    );
  },

  async findByIdempotencyKey(db: D1Database, key: string): Promise<EnquiryRecord | null> {
    return queryOne<EnquiryRecord>(
      db,
      `SELECT * FROM enquiries WHERE idempotency_key = ? LIMIT 1`,
      key
    );
  },

  async findRecentDuplicate(
    db: D1Database,
    email: string,
    projectType: string,
    windowMinutes: number = 5
  ): Promise<EnquiryRecord | null> {
    return queryOne<EnquiryRecord>(
      db,
      `SELECT * FROM enquiries 
       WHERE email = ? AND project_type = ? 
         AND created_at >= datetime('now', '-' || ? || ' minutes')
       ORDER BY created_at DESC LIMIT 1`,
      email.toLowerCase().trim(),
      projectType,
      windowMinutes
    );
  },

  async list(
    db: D1Database,
    filter?: { status?: EnquiryStatus | "all"; projectType?: string; search?: string },
    pageParams?: PageParams
  ): Promise<PagedResult<EnquiryRecord>> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter?.status && filter.status !== "all") {
      conditions.push("status = ?");
      params.push(filter.status);
    }

    if (filter?.projectType && filter.projectType !== "all") {
      conditions.push("project_type = ?");
      params.push(filter.projectType);
    }

    if (filter?.search && filter.search.trim().length > 0) {
      const q = `%${filter.search.trim()}%`;
      conditions.push("(full_name LIKE ? OR email LIKE ? OR city LIKE ?)");
      params.push(q, q, q);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    return queryPaged<EnquiryRecord>(
      db,
      `SELECT COUNT(*) as total FROM enquiries ${whereClause}`,
      `SELECT * FROM enquiries ${whereClause} ORDER BY created_at DESC`,
      params,
      pageParams
    );
  },

  async create(db: D1Database, input: CreateEnquiryDbInput): Promise<EnquiryRecord> {
    const id = generateSecureId("enq_");

    const source =
      input.source === "website_contact" ? "web_form" :
        input.source === "ai_chatbot" ? "chatbot" :
          (input.source || "web_form");

    await execute(
      db,
      `INSERT INTO enquiries (
        id, full_name, email, phone, city, project_type, property_type,
        approximate_area, budget_range, expected_timeline, project_description,
        consent_at, enquiry_source, status, idempotency_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, 'new', ?, datetime('now'), datetime('now'))`,
      id,
      input.fullName.trim(),
      input.email.toLowerCase().trim(),
      input.mobileNumber?.trim() || null,
      input.city.trim(),
      input.projectType,
      input.propertyType || null,
      input.approximateArea || null,
      input.budgetRange || null,
      input.expectedTimeline || null,
      input.projectDescription.trim(),
      source,
      input.idempotencyKey || null
    );

    const record = await this.findById(db, id);
    if (!record) throw new Error("Failed to retrieve created enquiry record.");
    return record;
  },

  async updateStatus(
    db: D1Database,
    id: string,
    status: EnquiryStatus
  ): Promise<boolean> {
    const result = await execute(
      db,
      `UPDATE enquiries 
       SET status = ?, updated_at = datetime('now')
       WHERE id = ?`,
      status,
      id
    );

    return (result.meta.changes ?? 0) > 0;
  },

  async assignAdmin(
    db: D1Database,
    id: string,
    assignedAdminId: string | null
  ): Promise<boolean> {
    const result = await execute(
      db,
      `UPDATE enquiries 
       SET assigned_admin_id = ?, updated_at = datetime('now')
       WHERE id = ?`,
      assignedAdminId,
      id
    );

    return (result.meta.changes ?? 0) > 0;
  },

  async findByIdWithAssignee(
    db: D1Database,
    id: string
  ): Promise<(EnquiryRecord & { assigned_admin_name?: string; assigned_admin_email?: string }) | null> {
    return queryOne<EnquiryRecord & { assigned_admin_name?: string; assigned_admin_email?: string }>(
      db,
      `SELECT e.*, u.display_name as assigned_admin_name, u.email as assigned_admin_email
       FROM enquiries e
       LEFT JOIN admin_users u ON e.assigned_admin_id = u.id
       WHERE e.id = ? LIMIT 1`,
      id
    );
  },

  async getPendingFollowupEnquiries(
    db: D1Database,
    thresholdHours: number = 24,
    limit: number = 20
  ): Promise<Array<EnquiryRecord & { assigned_admin_name?: string; assigned_admin_email?: string }>> {
    return queryAll<EnquiryRecord & { assigned_admin_name?: string; assigned_admin_email?: string }>(
      db,
      `SELECT e.*, u.display_name as assigned_admin_name, u.email as assigned_admin_email
       FROM enquiries e
       LEFT JOIN admin_users u ON e.assigned_admin_id = u.id
       WHERE e.status = 'new'
         AND e.created_at <= datetime('now', '-' || ? || ' hours')
         AND (e.followup_reminder_at IS NULL OR e.followup_reminder_at <= datetime('now', '-7 days'))
       ORDER BY e.created_at ASC
       LIMIT ?`,
      thresholdHours,
      limit
    );
  },

  async markFollowupReminderSent(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(
      db,
      `UPDATE enquiries 
       SET followup_reminder_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
      id
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async getMetrics(db: D1Database): Promise<EnquiryMetrics> {
    const totalRow = await queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM enquiries`);
    const newRow = await queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'`);
    const qualifiedRow = await queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM enquiries WHERE status = 'qualified'`);
    const unassignedRow = await queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM enquiries WHERE assigned_admin_id IS NULL`);

    return {
      total: totalRow?.count || 0,
      newCount: newRow?.count || 0,
      qualifiedCount: qualifiedRow?.count || 0,
      unassignedCount: unassignedRow?.count || 0,
    };
  },

  async getAnalyticsSummary(db: D1Database): Promise<{
    total: number;
    sources: {
      websiteContact: number;
      aiChatbot: number;
      directOrOther: number;
    };
    statuses: Record<string, number>;
    projectTypes: Array<{ type: string; count: number }>;
    recentActivity: Array<{
      id: string;
      fullName: string;
      projectType: string;
      city: string;
      source: string;
      status: string;
      createdAt: string;
    }>;
  }> {
    const totalRow = await queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM enquiries`);
    const total = totalRow?.count || 0;

    const sourceRows = await queryAll<{ source: string; count: number }>(
      db,
      `SELECT enquiry_source as source, COUNT(*) as count FROM enquiries GROUP BY enquiry_source`
    );

    let websiteContact = 0;
    let aiChatbot = 0;
    let directOrOther = 0;

    for (const row of sourceRows) {
      if (row.source === "website_contact" || row.source === "web_form") {
        websiteContact += row.count;
      } else if (row.source === "ai_chatbot" || row.source === "chatbot") {
        aiChatbot += row.count;
      } else {
        directOrOther += row.count;
      }
    }

    const statusRows = await queryAll<{ status: string; count: number }>(
      db,
      `SELECT status, COUNT(*) as count FROM enquiries GROUP BY status`
    );

    const statuses: Record<string, number> = {};
    for (const row of statusRows) {
      statuses[row.status] = row.count;
    }

    const projectTypeRows = await queryAll<{ project_type: string; count: number }>(
      db,
      `SELECT project_type, COUNT(*) as count FROM enquiries GROUP BY project_type ORDER BY count DESC LIMIT 6`
    );

    const projectTypes = projectTypeRows.map((r) => ({
      type: r.project_type,
      count: r.count,
    }));

    const recentRows = await queryAll<{
      id: string;
      full_name: string;
      project_type: string;
      city: string;
      enquiry_source: string;
      status: string;
      created_at: string;
    }>(
      db,
      `SELECT id, full_name, project_type, city, enquiry_source, status, created_at 
       FROM enquiries ORDER BY created_at DESC LIMIT 10`
    );

    const recentActivity = recentRows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      projectType: r.project_type,
      city: r.city,
      source: r.enquiry_source,
      status: r.status,
      createdAt: r.created_at,
    }));

    return {
      total,
      sources: {
        websiteContact,
        aiChatbot,
        directOrOther,
      },
      statuses,
      projectTypes,
      recentActivity,
    };
  },
};

