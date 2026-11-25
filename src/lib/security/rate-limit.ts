/**
 * Aurelle Spaces — Login Abuse Protection & Rate Limiting
 * 
 * Protects administrative authentication against brute-force credential stuffing
 * using Cloudflare D1-backed login attempt tracking.
 * 
 * Rules:
 * - Max 5 failed attempts per IP address in 15 minutes.
 * - Max 5 failed attempts per email address in 15 minutes.
 * - Enforces generic error responses to prevent account enumeration.
 */

import type { D1Database } from "@/types/cloudflare";
import { queryOne, execute } from "@/lib/db/client";
import { generateSecureId } from "./crypto";
import { logger } from "@/lib/logging/logger";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

export interface RateLimitCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}

export const loginRateLimiter = {
  /**
   * Check whether a login attempt is permitted for the given email and IP.
   */
  async checkRateLimit(
    db: D1Database,
    email: string,
    ipAddress: string
  ): Promise<RateLimitCheckResult> {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Check failed attempts for this email within window
      const emailFailures = await queryOne<{ count: number }>(
        db,
        `SELECT COUNT(*) as count FROM admin_login_attempts
         WHERE email = ? AND success = 0
           AND attempted_at >= datetime('now', '-' || ? || ' minutes')`,
        normalizedEmail,
        LOCKOUT_WINDOW_MINUTES
      );

      // Check failed attempts for this IP within window
      const ipFailures = await queryOne<{ count: number }>(
        db,
        `SELECT COUNT(*) as count FROM admin_login_attempts
         WHERE ip_address = ? AND success = 0
           AND attempted_at >= datetime('now', '-' || ? || ' minutes')`,
        ipAddress,
        LOCKOUT_WINDOW_MINUTES
      );

      const maxFailed = Math.max(emailFailures?.count || 0, ipFailures?.count || 0);

      if (maxFailed >= MAX_FAILED_ATTEMPTS) {
        return {
          allowed: false,
          remainingAttempts: 0,
          retryAfterSeconds: LOCKOUT_WINDOW_MINUTES * 60,
        };
      }

      return {
        allowed: true,
        remainingAttempts: MAX_FAILED_ATTEMPTS - maxFailed,
      };
    } catch (error) {
      // In case of rate limiter DB failure, log error but allow login check to proceed
      logger.error("Rate limiter check query failed", { email, ipAddress }, error);
      return { allowed: true, remainingAttempts: 1 };
    }
  },

  /**
   * Record a login attempt (successful or failed).
   */
  async recordAttempt(
    db: D1Database,
    email: string,
    ipAddress: string,
    success: boolean
  ): Promise<void> {
    try {
      const id = generateSecureId("att_");
      const normalizedEmail = email.toLowerCase().trim();
      const successInt = success ? 1 : 0;

      await execute(
        db,
        `INSERT INTO admin_login_attempts (id, email, ip_address, attempted_at, success)
         VALUES (?, ?, ?, datetime('now'), ?)`,
        id,
        normalizedEmail,
        ipAddress,
        successInt
      );
    } catch (error) {
      logger.error("Failed to record login attempt", { email, ipAddress }, error);
    }
  },
};

