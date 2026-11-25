/**
 * Aurelle Spaces — Services Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { ServiceRecord, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { CreateServiceInput, UpdateServiceInput } from "@/lib/validation/service-schema";

export const servicesRepository = {
  async findBySlug(db: D1Database, slug: string): Promise<ServiceRecord | null> {
    return queryOne<ServiceRecord>(
      db,
      `SELECT * FROM services WHERE slug = ? LIMIT 1`,
      slug
    );
  },

  async findById(db: D1Database, id: string): Promise<ServiceRecord | null> {
    return queryOne<ServiceRecord>(
      db,
      `SELECT * FROM services WHERE id = ? LIMIT 1`,
      id
    );
  },

  async listPublished(db: D1Database): Promise<ServiceRecord[]> {
    return queryAll<ServiceRecord>(
      db,
      `SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC, title ASC`
    );
  },

  async listAll(db: D1Database, pageParams?: PageParams): Promise<PagedResult<ServiceRecord>> {
    return queryPaged<ServiceRecord>(
      db,
      `SELECT COUNT(*) as total FROM services`,
      `SELECT * FROM services ORDER BY sort_order ASC, created_at DESC`,
      [],
      pageParams
    );
  },

  async create(db: D1Database, input: CreateServiceInput): Promise<ServiceRecord> {
    const id = generateSecureId("srv_");
    const seoJson = input.seoMetadata ? JSON.stringify(input.seoMetadata) : null;

    await execute(
      db,
      `INSERT INTO services (id, slug, title, summary, description, status, sort_order, seo_metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      id,
      input.slug,
      input.title,
      input.summary,
      input.description,
      input.status || "published",
      input.sortOrder ?? 0,
      seoJson
    );

    const record = await this.findById(db, id);
    if (!record) throw new Error("Failed to retrieve created service record.");
    return record;
  },

  async update(db: D1Database, id: string, input: UpdateServiceInput): Promise<ServiceRecord | null> {
    const existing = await this.findById(db, id);
    if (!existing) return null;

    const slug = input.slug ?? existing.slug;
    const title = input.title ?? existing.title;
    const summary = input.summary ?? existing.summary;
    const description = input.description ?? existing.description;
    const status = input.status ?? existing.status;
    const sortOrder = input.sortOrder ?? existing.sort_order;
    const seoJson = input.seoMetadata ? JSON.stringify(input.seoMetadata) : existing.seo_metadata;

    await execute(
      db,
      `UPDATE services 
       SET slug = ?, title = ?, summary = ?, description = ?, status = ?, sort_order = ?, seo_metadata = ?, updated_at = datetime('now')
       WHERE id = ?`,
      slug,
      title,
      summary,
      description,
      status,
      sortOrder,
      seoJson,
      id
    );

    return this.findById(db, id);
  },

  async delete(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(db, `DELETE FROM services WHERE id = ?`, id);
    return (result.meta.changes ?? 0) > 0;
  },
};

