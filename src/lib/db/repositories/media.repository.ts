/**
 * Aurelle Spaces — Media Assets & Project Media Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { MediaAssetRecord, ProjectMediaRecord, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { AssociateProjectMediaInput } from "@/lib/validation/media-schema";

export interface CreateMediaAssetInput {
  r2ObjectKey: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  altText?: string;
  uploadingAdminId?: string | null;
}

export const mediaRepository = {
  async findById(db: D1Database, id: string): Promise<MediaAssetRecord | null> {
    return queryOne<MediaAssetRecord>(
      db,
      `SELECT * FROM media_assets WHERE id = ? LIMIT 1`,
      id
    );
  },

  async findByKey(db: D1Database, key: string): Promise<MediaAssetRecord | null> {
    return queryOne<MediaAssetRecord>(
      db,
      `SELECT * FROM media_assets WHERE r2_object_key = ? LIMIT 1`,
      key
    );
  },

  async list(db: D1Database, pageParams?: PageParams): Promise<PagedResult<MediaAssetRecord>> {
    return queryPaged<MediaAssetRecord>(
      db,
      `SELECT COUNT(*) as total FROM media_assets`,
      `SELECT * FROM media_assets ORDER BY created_at DESC`,
      [],
      pageParams
    );
  },

  async create(db: D1Database, input: CreateMediaAssetInput): Promise<MediaAssetRecord> {
    const id = generateSecureId("med_");

    await execute(
      db,
      `INSERT INTO media_assets (id, r2_object_key, original_filename, mime_type, file_size, width, height, alt_text, uploading_admin_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      id,
      input.r2ObjectKey,
      input.originalFilename,
      input.mimeType,
      input.fileSize,
      input.width || null,
      input.height || null,
      input.altText || "",
      input.uploadingAdminId || null
    );

    const record = await this.findById(db, id);
    if (!record) throw new Error("Failed to retrieve created media asset.");
    return record;
  },

  async updateAltText(db: D1Database, id: string, altText: string): Promise<void> {
    await execute(db, `UPDATE media_assets SET alt_text = ? WHERE id = ?`, altText, id);
  },

  async delete(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(db, `DELETE FROM media_assets WHERE id = ?`, id);
    return (result.meta.changes ?? 0) > 0;
  },

  async checkReferenceCount(db: D1Database, id: string): Promise<number> {
    const projCount = await queryOne<{ count: number }>(
      db,
      `SELECT COUNT(*) as count FROM project_media WHERE media_asset_id = ?`,
      id
    );
    const artCount = await queryOne<{ count: number }>(
      db,
      `SELECT COUNT(*) as count FROM journal_articles WHERE cover_media_id = ?`,
      id
    );

    return (projCount?.count || 0) + (artCount?.count || 0);
  },

  /* Project Media Relationships */

  async associateWithProject(db: D1Database, input: AssociateProjectMediaInput): Promise<ProjectMediaRecord> {
    const id = generateSecureId("prm_");

    await execute(
      db,
      `INSERT INTO project_media (id, project_id, media_asset_id, sort_order, caption, alt_text, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(project_id, media_asset_id) DO UPDATE SET
         sort_order = excluded.sort_order,
         caption = excluded.caption,
         alt_text = excluded.alt_text`,
      id,
      input.projectId,
      input.mediaAssetId,
      input.sortOrder ?? 0,
      input.caption || null,
      input.altText || null
    );

    const record = await queryOne<ProjectMediaRecord>(
      db,
      `SELECT * FROM project_media WHERE project_id = ? AND media_asset_id = ? LIMIT 1`,
      input.projectId,
      input.mediaAssetId
    );

    if (!record) throw new Error("Failed to associate media with project.");
    return record;
  },

  async getProjectMedia(
    db: D1Database,
    projectId: string
  ): Promise<Array<MediaAssetRecord & { sort_order: number; caption: string | null }>> {
    return queryAll<MediaAssetRecord & { sort_order: number; caption: string | null }>(
      db,
      `SELECT m.*, pm.sort_order, pm.caption
       FROM media_assets m
       INNER JOIN project_media pm ON m.id = pm.media_asset_id
       WHERE pm.project_id = ?
       ORDER BY pm.sort_order ASC`,
      projectId
    );
  },
};

