/**
 * Aurelle Spaces — Public Enquiry Rate Limiter
 * 
 * Protects the public contact form against denial-of-service and lead flooding.
 * Enforces a strict limit of 3 submissions per IP address within 10 minutes.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute } from "@/lib/db/client";
import { generateSecureId } from "@/lib/security/crypto";
import { logger } from "@/lib/logging/logger";

const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_MINUTES = 10;

export const enquiryRateLimiter = {
  async checkRateLimit(db: D1Database, ipAddress: string): Promise<boolean> {
    try {
      const row = await queryOne<{ count: number }>(
        db,
        `SELECT COUNT(*) as count FROM enquiry_rate_limits
         WHERE ip_address = ?
           AND submitted_at >= datetime('now', '-' || ? || ' minutes')`,
        ipAddress,
        WINDOW_MINUTES
      );

      return (row?.count || 0) < MAX_SUBMISSIONS_PER_WINDOW;
    } catch (error) {
      logger.error("Enquiry rate limit query error", { ipAddress }, error);
      // In case of error, fail open to avoid rejecting legitimate clients
      return true;
    }
  },

  async recordSubmission(db: D1Database, ipAddress: string): Promise<void> {
    try {
      const id = generateSecureId("lim_");
      await execute(
        db,
        `INSERT INTO enquiry_rate_limits (id, ip_address, submitted_at)
         VALUES (?, ?, datetime('now'))`,
        id,
        ipAddress
      );
    } catch (error) {
      logger.error("Failed to record enquiry rate limit attempt", { ipAddress }, error);
    }
  },
};

