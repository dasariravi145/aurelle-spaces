/**
 * Aurelle Spaces — Internal Enquiry Notes Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute } from "@/lib/db/client";
import type { EnquiryNoteRecord } from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";

export const enquiryNotesRepository = {
  async createNote(
    db: D1Database,
    enquiryId: string,
    authorId: string,
    noteContent: string
  ): Promise<EnquiryNoteRecord> {
    const id = generateSecureId("not_");

    await execute(
      db,
      `INSERT INTO enquiry_notes (id, enquiry_id, author_id, note_content, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      id,
      enquiryId,
      authorId,
      noteContent.trim()
    );

    const note = await this.findById(db, id);
    if (!note) throw new Error("Failed to retrieve created enquiry note.");
    return note;
  },

  async findById(db: D1Database, id: string): Promise<EnquiryNoteRecord | null> {
    const row = await queryOne<{
      id: string;
      enquiry_id: string;
      author_id: string;
      note_content: string;
      created_at: string;
      author_name: string | null;
      author_email: string | null;
    }>(
      db,
      `SELECT n.*, u.display_name as author_name, u.email as author_email
       FROM enquiry_notes n
       LEFT JOIN admin_users u ON n.author_id = u.id
       WHERE n.id = ? LIMIT 1`,
      id
    );

    if (!row) return null;

    return {
      id: row.id,
      enquiry_id: row.enquiry_id,
      author_id: row.author_id,
      author_name: row.author_name || "Studio Administrator",
      author_email: row.author_email || undefined,
      note_content: row.note_content,
      created_at: row.created_at,
    };
  },

  async listByEnquiry(db: D1Database, enquiryId: string): Promise<EnquiryNoteRecord[]> {
    const rows = await queryAll<{
      id: string;
      enquiry_id: string;
      author_id: string;
      note_content: string;
      created_at: string;
      author_name: string | null;
      author_email: string | null;
    }>(
      db,
      `SELECT n.*, u.display_name as author_name, u.email as author_email
       FROM enquiry_notes n
       LEFT JOIN admin_users u ON n.author_id = u.id
       WHERE n.enquiry_id = ?
       ORDER BY n.created_at ASC`,
      enquiryId
    );

    return rows.map((r) => ({
      id: r.id,
      enquiry_id: r.enquiry_id,
      author_id: r.author_id,
      author_name: r.author_name || "Studio Administrator",
      author_email: r.author_email || undefined,
      note_content: r.note_content,
      created_at: r.created_at,
    }));
  },

  async deleteNote(db: D1Database, id: string): Promise<boolean> {
    const result = await execute(db, `DELETE FROM enquiry_notes WHERE id = ?`, id);
    return (result.meta.changes ?? 0) > 0;
  },
};

