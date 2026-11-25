/**
 * Aurelle Spaces — Initial Admin Provisioning Strategy & Helper
 * 
 * Provides a secure server-side mechanism to generate initial administrator
 * credentials for deployment without exposing public registration endpoints
 * or committing hardcoded credentials into version control.
 */

import { hashPassword, generateSecureId } from "./crypto";
import type { AdminRole } from "@/lib/db/types";

export interface ProvisionAdminInput {
  email: string;
  password: string;
  displayName: string;
  role?: AdminRole;
}

export interface ProvisionAdminOutput {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  passwordHash: string;
  sqlInsertStatement: string;
}

/**
 * Generate a cryptographically secure administrative user record and D1 SQL insert statement.
 *
 * Usage for Deployment:
 * 1. Run this utility during staging setup with a strong, high-entropy password.
 * 2. Apply the generated SQL via Cloudflare D1 CLI:
 *    `npx wrangler d1 execute aurelle-db --remote --command="<SQL>"`
 * 3. Never commit passwords or raw secrets to Git.
 */
export async function prepareAdminUserSeed(
  input: ProvisionAdminInput
): Promise<ProvisionAdminOutput> {
  if (!input.email || !input.email.includes("@")) {
    throw new Error("A valid email address is required for admin provisioning.");
  }

  if (!input.password || input.password.length < 12) {
    throw new Error("Administrative passwords must be at least 12 characters long.");
  }

  const id = generateSecureId("usr_");
  const email = input.email.toLowerCase().trim();
  const displayName = input.displayName.trim();
  const role = input.role || "super_admin";
  const passwordHash = await hashPassword(input.password);

  const sqlInsertStatement = `INSERT INTO admin_users (id, email, password_hash, display_name, role, account_status, created_at, updated_at) VALUES ('${id}', '${email}', '${passwordHash}', '${displayName.replace(/'/g, "''")}', '${role}', 'active', datetime('now'), datetime('now'));`;

  return {
    id,
    email,
    displayName,
    role,
    passwordHash,
    sqlInsertStatement,
  };
}

