/**
 * Aurelle Spaces — Journal Articles Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute, queryPaged } from "@/lib/db/client";
import type { JournalArticleRecord, PageParams, PagedResult } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";
import type { CreateArticleInput } from "@/lib/validation/article-schema";

export const articlesRepository = {
  async findBySlug(db: D1Database, slug: string): Promise<JournalArticleRecord | null> {
    return queryOne<JournalArticleRecord>(
      db,
      `SELECT * FROM journal_articles WHERE slug = ? LIMIT 1`,
      slug
    );
  },

  async findById(db: D1Database, id: string): Promise<JournalArticleRecord | null> {
    return queryOne<JournalArticleRecord>(
      db,
      `SELECT * FROM journal_articles WHERE id = ? LIMIT 1`,
      id
    );
  },

  async listPublished(db: D1Database, pageParams?: PageParams): Promise<PagedResult<JournalArticleRecord>> {
    return queryPaged<JournalArticleRecord>(
      db,
      `SELECT COUNT(*) as total FROM journal_articles WHERE publication_status = 'published'`,
      `SELECT * FROM journal_articles WHERE publication_status = 'published' ORDER BY published_at DESC, created_at DESC`,
      [],
      pageParams
    );
  },

  async listRecent(db: D1Database, limit: number = 3): Promise<JournalArticleRecord[]> {
    return queryAll<JournalArticleRecord>(
      db,
      `SELECT * FROM journal_articles 
       WHERE publication_status = 'published' 
       ORDER BY published_at DESC LIMIT ?`,
      limit
    );
  },

  async create(db: D1Database, input: CreateArticleInput): Promise<JournalArticleRecord> {
    const id = generateSecureId("art_");
    const contentJson = JSON.stringify(input.articleContent);
    const seoJson = input.seoMetadata ? JSON.stringify(input.seoMetadata) : null;
    const publishedAt = input.publicationStatus === "published"
      ? (input.publishedAt || new Date().toISOString())
      : null;

    await execute(
      db,
      `INSERT INTO journal_articles (id, slug, title, category, excerpt, article_content, cover_media_id, publication_status, published_at, seo_metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      id,
      input.slug,
      input.title,
      input.category,
      input.excerpt,
      contentJson,
      input.coverMediaId || null,
      input.publicationStatus || "draft",
      publishedAt,
      seoJson
    );

    const record = await this.findById(db, id);
    if (!record) throw new Error("Failed to retrieve created article record.");
    return record;
  },

  async update(
    db: D1Database,
    id: string,
    updates: Partial<Omit<CreateArticleInput, "slug">> & { slug?: string }
  ): Promise<JournalArticleRecord | null> {
    const existing = await this.findById(db, id);
    if (!existing) return null;

    const slug = updates.slug ?? existing.slug;
    const title = updates.title ?? existing.title;
    const category = updates.category ?? existing.category;
    const excerpt = updates.excerpt ?? existing.excerpt;
    const articleContent = updates.articleContent
      ? JSON.stringify(updates.articleContent)
      : existing.article_content;
    const coverMediaId = updates.coverMediaId !== undefined ? updates.coverMediaId : existing.cover_media_id;
    const publicationStatus = updates.publicationStatus ?? existing.publication_status;
    const publishedAt = updates.publishedAt !== undefined ? updates.publishedAt : existing.published_at;
    const seoMetadata = updates.seoMetadata
      ? JSON.stringify(updates.seoMetadata)
      : existing.seo_metadata;

    await execute(
      db,
      `UPDATE journal_articles 
       SET slug = ?, title = ?, category = ?, excerpt = ?, article_content = ?, cover_media_id = ?, publication_status = ?, published_at = ?, seo_metadata = ?, updated_at = datetime('now')
       WHERE id = ?`,
      slug,
      title,
      category,
      excerpt,
      articleContent,
      coverMediaId,
      publicationStatus,
      publishedAt,
      seoMetadata,
      id
    );

    return this.findById(db, id);
  },

  async listAll(db: D1Database, pageParams?: PageParams): Promise<PagedResult<JournalArticleRecord>> {
    return queryPaged<JournalArticleRecord>(
      db,
      `SELECT COUNT(*) as total FROM journal_articles`,
      `SELECT * FROM journal_articles ORDER BY created_at DESC`,
      [],
      pageParams
    );
  },

  async updateStatus(db: D1Database, id: string, status: "draft" | "published" | "archived"): Promise<boolean> {
    const publishedAt = status === "published" ? new Date().toISOString() : null;
    const result = await execute(
      db,
      `UPDATE journal_articles 
       SET publication_status = ?, 
           published_at = COALESCE(?, published_at),
           updated_at = datetime('now') 
       WHERE id = ?`,
      status,
      publishedAt,
      id
    );
    return (result.meta.changes ?? 0) > 0;
  },

  async delete(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(db, `DELETE FROM journal_articles WHERE id = ?`, id);
    return (result.meta.changes ?? 0) > 0;
  },
};

