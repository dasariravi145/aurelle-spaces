/**
 * Aurelle Spaces — Chat Rate Limiter & Abuse Guard
 * 
 * Protects LLM inference costs and edge resources against abuse.
 * Limits:
 * - Max 10 messages per chat session per 10 minutes.
 * - Max 15 messages per IP address per 10 minutes.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute } from "@/lib/db/client";
import { generateSecureId } from "@/lib/security/crypto";
import { logger } from "@/lib/logging/logger";

const MAX_SESSION_MESSAGES = 10;
const MAX_IP_MESSAGES = 15;
const WINDOW_MINUTES = 10;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: string;
}

export const chatRateLimiter = {
  async checkRateLimit(
    db: D1Database | null,
    sessionId: string,
    ipAddress: string
  ): Promise<RateLimitResult> {
    if (!db) {
      // In development or when D1 is uninitialized, allow request
      return { allowed: true };
    }

    try {
      // Check session message count in chat_messages table via conversation join
      const sessionCountRow = await queryOne<{ count: number }>(
        db,
        `SELECT COUNT(m.id) as count
         FROM chat_messages m
         JOIN chat_conversations c ON m.conversation_id = c.id
         WHERE c.session_id = ?
           AND m.created_at >= datetime('now', '-' || ? || ' minutes')
           AND m.sender_role = 'user'`,
        sessionId,
        WINDOW_MINUTES
      );

      const sessionCount = sessionCountRow?.count || 0;
      if (sessionCount >= MAX_SESSION_MESSAGES) {
        return {
          allowed: false,
          retryAfterSeconds: 60,
          reason:
            "You have sent several messages in a short time. Please wait a minute or continue your project discussion on our contact page.",
        };
      }

      // Check IP abuse records if rate limits table is active
      const ipCountRow = await queryOne<{ count: number }>(
        db,
        `SELECT COUNT(*) as count FROM enquiry_rate_limits
         WHERE ip_address = ?
           AND submitted_at >= datetime('now', '-' || ? || ' minutes')`,
        `chat_${ipAddress}`,
        WINDOW_MINUTES
      ).catch(() => null);

      const ipCount = ipCountRow?.count || 0;
      if (ipCount >= MAX_IP_MESSAGES) {
        return {
          allowed: false,
          retryAfterSeconds: 120,
          reason:
            "Too many requests from this network. Please wait a few moments or contact the studio directly.",
        };
      }

      return { allowed: true };
    } catch (err) {
      logger.error("Chat rate limit check error", { sessionId, ipAddress }, err);
      // Fail open to avoid blocking legitimate visitors on transient DB errors
      return { allowed: true };
    }
  },

  async recordMessage(
    db: D1Database | null,
    ipAddress: string
  ): Promise<void> {
    if (!db) return;
    try {
      const id = generateSecureId("lim_");
      await execute(
        db,
        `INSERT INTO enquiry_rate_limits (id, ip_address, submitted_at)
         VALUES (?, ?, datetime('now'))`,
        id,
        `chat_${ipAddress}`
      ).catch(() => {});
    } catch {
      // Non-critical, ignore
    }
  },
};

