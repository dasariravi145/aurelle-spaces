/**
 * Aurelle Spaces — Chat Conversations & Messages Repository
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, queryAll, execute } from "@/lib/db/client";
import type {
  ChatConversationRecord,
  ChatMessageRecord,
  ConversationStatus,
  SenderRole,
} from "@/lib/db/types";
import { generateSecureId } from "@/lib/security/crypto";

export const chatRepository = {
  async findConversationBySession(
    db: D1Database,
    sessionId: string
  ): Promise<ChatConversationRecord | null> {
    return queryOne<ChatConversationRecord>(
      db,
      `SELECT * FROM chat_conversations WHERE session_id = ? LIMIT 1`,
      sessionId
    );
  },

  async getOrCreateConversation(
    db: D1Database,
    sessionId: string,
    consentState: boolean = false
  ): Promise<ChatConversationRecord> {
    const existing = await this.findConversationBySession(db, sessionId);
    if (existing) {
      return existing;
    }

    const id = generateSecureId("cnv_");
    const consentInt = consentState ? 1 : 0;

    await execute(
      db,
      `INSERT INTO chat_conversations (id, session_id, conversation_status, consent_state, created_at, updated_at)
       VALUES (?, ?, 'active', ?, datetime('now'), datetime('now'))
       ON CONFLICT(session_id) DO NOTHING`,
      id,
      sessionId,
      consentInt
    );

    const record = await this.findConversationBySession(db, sessionId);
    if (!record) throw new Error("Failed to initialize chat conversation.");
    return record;
  },

  async addMessage(
    db: D1Database,
    conversationId: string,
    senderRole: SenderRole,
    content: string
  ): Promise<ChatMessageRecord> {
    const id = generateSecureId("msg_");

    await execute(
      db,
      `INSERT INTO chat_messages (id, conversation_id, sender_role, message_content, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      id,
      conversationId,
      senderRole,
      content
    );

    // Update conversation updated_at timestamp
    await execute(
      db,
      `UPDATE chat_conversations SET updated_at = datetime('now') WHERE id = ?`,
      conversationId
    );

    const message = await queryOne<ChatMessageRecord>(
      db,
      `SELECT * FROM chat_messages WHERE id = ? LIMIT 1`,
      id
    );

    if (!message) throw new Error("Failed to record chat message.");
    return message;
  },

  async getConversationMessages(
    db: D1Database,
    conversationId: string,
    limit: number = 50
  ): Promise<ChatMessageRecord[]> {
    return queryAll<ChatMessageRecord>(
      db,
      `SELECT * FROM chat_messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC LIMIT ?`,
      conversationId,
      limit
    );
  },

  async updateConversationStatus(
    db: D1Database,
    id: string,
    status: ConversationStatus
  ): Promise<void> {
    await execute(
      db,
      `UPDATE chat_conversations 
       SET conversation_status = ?, updated_at = datetime('now') 
       WHERE id = ?`,
      status,
      id
    );
  },

  async findConversationById(
    db: D1Database,
    id: string
  ): Promise<ChatConversationRecord | null> {
    return queryOne<ChatConversationRecord>(
      db,
      `SELECT * FROM chat_conversations WHERE id = ? LIMIT 1`,
      id
    );
  },

  async listRecentConversations(
    db: D1Database,
    options: { page?: number; limit?: number; status?: ConversationStatus } = {}
  ): Promise<{
    data: Array<
      ChatConversationRecord & { message_count: number; last_message?: string }
    >;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(options.limit || 20, 100));
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: unknown[] = [];

    if (options.status) {
      whereClauses.push("c.conversation_status = ?");
      params.push(options.status);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countRow = await queryOne<{ total: number }>(
      db,
      `SELECT COUNT(*) as total FROM chat_conversations c ${whereSql}`,
      ...params
    );

    const total = countRow?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const data = await queryAll<
      ChatConversationRecord & { message_count: number; last_message?: string }
    >(
      db,
      `SELECT 
         c.*,
         (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) as message_count,
         (SELECT m2.message_content FROM chat_messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.created_at DESC LIMIT 1) as last_message
       FROM chat_conversations c
       ${whereSql}
       ORDER BY c.updated_at DESC
       LIMIT ? OFFSET ?`,
      ...params,
      limit,
      offset
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getConversationStats(
    db: D1Database
  ): Promise<{
    total: number;
    active: number;
    qualified: number;
    resolved: number;
  }> {
    const row = await queryOne<{
      total: number;
      active: number;
      qualified: number;
      resolved: number;
    }>(
      db,
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN conversation_status = 'active' THEN 1 ELSE 0 END) as active,
         SUM(CASE WHEN conversation_status = 'qualified_lead' THEN 1 ELSE 0 END) as qualified,
         SUM(CASE WHEN conversation_status = 'resolved' THEN 1 ELSE 0 END) as resolved
       FROM chat_conversations`
    );

    return {
      total: row?.total || 0,
      active: row?.active || 0,
      qualified: row?.qualified || 0,
      resolved: row?.resolved || 0,
    };
  },
};

