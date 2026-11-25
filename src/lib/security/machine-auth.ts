/**
 * Aurelle Spaces — Machine-to-Machine Authentication Guard
 * 
 * Secures integration endpoints accessed by n8n workflows and scheduled cron workers.
 * Validates bearer tokens and cryptographic request signatures with constant-time comparison.
 * Does NOT reuse browser admin cookies as machine credentials.
 */

import { getCloudflareEnv } from "@/lib/env";
import { verifyWebhookSignature } from "@/lib/automation/signature";
import { logger } from "@/lib/logging/logger";

export interface MachineAuthResult {
  isAuthenticated: boolean;
  clientId: string;
  error?: string;
  statusCode?: number;
}

/**
 * Constant-time string equality check to mitigate timing side-channel attacks.
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Validates an incoming machine request from n8n or an external scheduler.
 * Accepts:
 * 1. `Authorization: Bearer <token>` matching `AUTOMATION_INTEGRATION_TOKEN` or `CRON_SECRET`.
 * 2. `X-Aurelle-Integration-Token: <token>`.
 * 3. `X-Aurelle-Signature` HMAC-SHA256 signature when raw body is provided.
 */
export async function authenticateMachineRequest(
  request: Request,
  rawBodyBytes?: Uint8Array
): Promise<MachineAuthResult> {
  const cfEnv = getCloudflareEnv();

  const expectedToken =
    cfEnv?.AUTOMATION_INTEGRATION_TOKEN ||
    process.env.AUTOMATION_INTEGRATION_TOKEN ||
    cfEnv?.CRON_SECRET ||
    process.env.CRON_SECRET;

  const webhookSecret =
    cfEnv?.N8N_WEBHOOK_SECRET ||
    process.env.N8N_WEBHOOK_SECRET;

  // 1. Check Bearer token or custom header
  const authHeader = request.headers.get("authorization");
  const customHeader = request.headers.get("x-aurelle-integration-token");

  let providedToken: string | null = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    providedToken = authHeader.slice(7).trim();
  } else if (customHeader) {
    providedToken = customHeader.trim();
  }

  if (providedToken && expectedToken) {
    if (constantTimeCompare(providedToken, expectedToken)) {
      return { isAuthenticated: true, clientId: "n8n_integration_worker" };
    }
  }

  // 2. Check HMAC signature if raw body and signature header are available
  const signatureHeader = request.headers.get("x-aurelle-signature");
  if (signatureHeader && rawBodyBytes && webhookSecret) {
    const isValidSignature = await verifyWebhookSignature(
      webhookSecret,
      rawBodyBytes,
      signatureHeader.trim()
    );

    if (isValidSignature) {
      return { isAuthenticated: true, clientId: "n8n_signed_client" };
    }
  }

  // If neither credential was configured on the server
  if (!expectedToken && !webhookSecret) {
    logger.warn("Machine authentication rejected: No integration credentials configured on server.");
    return {
      isAuthenticated: false,
      clientId: "unknown",
      error: "Integration authentication is not configured on the server.",
      statusCode: 503,
    };
  }

  logger.warn("Machine request rejected: Invalid or missing authentication credentials.");
  return {
    isAuthenticated: false,
    clientId: "unauthorized",
    error: "Unauthorized machine access. Valid Bearer token or HMAC signature required.",
    statusCode: 401,
  };
}

