/**
 * Aurelle Spaces — Projects Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { ProjectRecord, ProjectCategory, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { CreateProjectInput } from "@/lib/validation/project-schema";

export const projectsRepository = {
  async findBySlug(db: D1Database, slug: string): Promise<ProjectRecord | null> {
    return queryOne<ProjectRecord>(
      db,
      `SELECT * FROM projects WHERE slug = ? LIMIT 1`,
      slug
    );
  },

  async findById(db: D1Database, id: string): Promise<ProjectRecord | null> {
    return queryOne<ProjectRecord>(
      db,
      `SELECT * FROM projects WHERE id = ? LIMIT 1`,
      id
    );
  },

  async listPublished(
    db: D1Database,
    filter?: { category?: ProjectCategory; featuredOnly?: boolean },
    pageParams?: PageParams
  ): Promise<PagedResult<ProjectRecord>> {
    const conditions = ["publication_status = 'published'"];
    const params: unknown[] = [];

    if (filter?.category) {
      conditions.push("category = ?");
      params.push(filter.category);
    }

    if (filter?.featuredOnly) {
      conditions.push("featured = 1");
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    return queryPaged<ProjectRecord>(
      db,
      `SELECT COUNT(*) as total FROM projects ${whereClause}`,
      `SELECT * FROM projects ${whereClause} ORDER BY featured DESC, created_at DESC`,
      params,
      pageParams
    );
  },

  async listFeatured(db: D1Database, limit: number = 3): Promise<ProjectRecord[]> {
    return queryAll<ProjectRecord>(
      db,
      `SELECT * FROM projects 
       WHERE publication_status = 'published' AND featured = 1 
       ORDER BY created_at DESC LIMIT ?`,
      limit
    );
  },

  async create(db: D1Database, input: CreateProjectInput): Promise<ProjectRecord> {
    const id = generateSecureId("prj_");
    const contentJson = JSON.stringify(input.detailedContent);
    const seoJson = input.seoMetadata ? JSON.stringify(input.seoMetadata) : null;
    const featuredNum = input.featured ? 1 : 0;

    await execute(
      db,
      `INSERT INTO projects (id, slug, title, location, category, summary, detailed_content, featured, publication_status, seo_metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      id,
      input.slug,
      input.title,
      input.location,
      input.category,
      input.summary,
      contentJson,
      featuredNum,
      input.publicationStatus || "draft",
      seoJson
    );

    const record = await this.findById(db, id);
    if (!record) throw new Error("Failed to retrieve created project record.");
    return record;
  },

  async update(
    db: D1Database,
    id: string,
    updates: Partial<Omit<CreateProjectInput, "slug">> & { slug?: string }
  ): Promise<ProjectRecord | null> {
    const existing = await this.findById(db, id);
    if (!existing) return null;

    const slug = updates.slug ?? existing.slug;
    const title = updates.title ?? existing.title;
    const location = updates.location ?? existing.location;
    const category = updates.category ?? existing.category;
    const summary = updates.summary ?? existing.summary;
    const detailedContent = updates.detailedContent
      ? JSON.stringify(updates.detailedContent)
      : existing.detailed_content;
    const featured = updates.featured !== undefined ? (updates.featured ? 1 : 0) : existing.featured;
    const publicationStatus = updates.publicationStatus ?? existing.publication_status;
    const seoMetadata = updates.seoMetadata
      ? JSON.stringify(updates.seoMetadata)
      : existing.seo_metadata;

    await execute(
      db,
      `UPDATE projects 
       SET slug = ?, title = ?, location = ?, category = ?, summary = ?, detailed_content = ?, featured = ?, publication_status = ?, seo_metadata = ?, updated_at = datetime('now')
       WHERE id = ?`,
      slug,
      title,
      location,
      category,
      summary,
      detailedContent,
      featured,
      publicationStatus,
      seoMetadata,
      id
    );

    return this.findById(db, id);
  },

  async listAll(db: D1Database, pageParams?: PageParams): Promise<PagedResult<ProjectRecord>> {
    return queryPaged<ProjectRecord>(
      db,
      `SELECT COUNT(*) as total FROM projects`,
      `SELECT * FROM projects ORDER BY created_at DESC`,
      [],
      pageParams
    );
  },

  async updateStatus(db: D1Database, id: string, status: "draft" | "published" | "archived"): Promise<boolean> {
    const result = await execute(
      db,
      `UPDATE projects SET publication_status = ?, updated_at = datetime('now') WHERE id = ?`,
      status,
      id
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async toggleFeatured(db: D1Database, id: string, featured: boolean): Promise<boolean> {
    const val = featured ? 1 : 0;
    const result = await execute(
      db,
      `UPDATE projects SET featured = ?, updated_at = datetime('now') WHERE id = ?`,
      val,
      id
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async delete(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(db, `DELETE FROM projects WHERE id = ?`, id);
    return (result.meta.changes ?? 0) > 0;
  },
};

