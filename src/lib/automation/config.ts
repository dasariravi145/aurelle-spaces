/**
 * Aurelle Spaces — n8n Automation Server-Side Configuration
 * 
 * Validates webhook endpoints, secrets, retry limits, and SSRF protections.
 * Never leaks credentials or private webhook URLs to browser bundles.
 */

import { getCloudflareEnv } from "@/lib/env";

export interface AutomationConfig {
  webhookUrl: string | null;
  webhookSecret: string | null;
  requestTimeoutMs: number;
  maxRetries: number;
  retryDelayBaseSeconds: number;
  isEnabled: boolean;
  isConfigured: boolean;
}

/**
 * Validates a webhook URL to prevent SSRF (Server-Side Request Forgery).
 * Strictly requires HTTPS in production and rejects internal metadata services.
 */
export function validateWebhookUrl(url: string | null | undefined): {
  isValid: boolean;
  normalizedUrl: string | null;
  error?: string;
} {
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return { isValid: false, normalizedUrl: null, error: "Webhook URL is missing." };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // In production, enforce HTTPS
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction && parsed.protocol !== "https:") {
      return {
        isValid: false,
        normalizedUrl: null,
        error: "n8n Webhook URL must use HTTPS in production.",
      };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        normalizedUrl: null,
        error: "Invalid URL protocol. Only HTTP and HTTPS are permitted.",
      };
    }

    // SSRF defense: Disallow cloud metadata and link-local address blocks
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "169.254.169.254" ||
      hostname.startsWith("169.254.") ||
      hostname === "metadata.google.internal" ||
      hostname === "instance-data"
    ) {
      return {
        isValid: false,
        normalizedUrl: null,
        error: "Target URL references forbidden cloud metadata service.",
      };
    }

    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, normalizedUrl: null, error: "Malformed webhook URL." };
  }
}

/**
 * Accesses and validates the server-side automation settings.
 */
export function getAutomationConfig(): AutomationConfig {
  const cfEnv = getCloudflareEnv();

  const rawUrl =
    cfEnv?.N8N_WEBHOOK_URL ||
    process.env.N8N_WEBHOOK_URL ||
    null;

  const webhookSecret =
    cfEnv?.N8N_WEBHOOK_SECRET ||
    process.env.N8N_WEBHOOK_SECRET ||
    null;

  const { isValid, normalizedUrl } = validateWebhookUrl(rawUrl);

  const requestTimeoutMs = parseInt(
    cfEnv?.N8N_REQUEST_TIMEOUT ||
      process.env.N8N_REQUEST_TIMEOUT ||
      "10000",
    10
  );

  const maxRetries = parseInt(
    cfEnv?.AUTOMATION_MAX_RETRIES ||
      process.env.AUTOMATION_MAX_RETRIES ||
      "5",
    10
  );

  const retryDelayBaseSeconds = parseInt(
    cfEnv?.AUTOMATION_RETRY_DELAY ||
      process.env.AUTOMATION_RETRY_DELAY ||
      "120",
    10
  );

  const isExplicitlyEnabled =
    (
      cfEnv?.AUTOMATION_ENABLED ||
      process.env.AUTOMATION_ENABLED ||
      "false"
    ).toLowerCase() === "true";

  const isConfigured = Boolean(
    isValid &&
    normalizedUrl &&
    webhookSecret &&
    webhookSecret.trim().length > 0
  );

  return {
    webhookUrl: normalizedUrl,
    webhookSecret: webhookSecret ? webhookSecret.trim() : null,
    requestTimeoutMs: Math.max(2000, Math.min(requestTimeoutMs, 30000)),
    maxRetries: Math.max(1, Math.min(maxRetries, 10)),
    retryDelayBaseSeconds: Math.max(30, Math.min(retryDelayBaseSeconds, 3600)),
    isEnabled: isExplicitlyEnabled && isConfigured,
    isConfigured,
  };
}

