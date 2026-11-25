/**
 * Aurelle Spaces — Server-Side Environment Access & Typed Configuration
 * 
 * Safely accesses environment variables and Cloudflare Worker platform bindings
 * (D1 Database, R2 Bucket, secrets). Handles both edge context and local Node development.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface ServerConfig {
  environment: "development" | "preview" | "production";
  appUrl: string;
  authSecret?: string;
  geminiApiKey?: string;
  aiApiKey?: string;
  aiProvider?: string;
  aiModel?: string;
  emailApiKey?: string;
  emailFrom?: string;
  studioContactEmail?: string;
  n8nWebhookUrl?: string;
  n8nWebhookSecret?: string;
  n8nRequestTimeout?: number;
  automationMaxRetries?: number;
  automationEnabled?: boolean;
  cronSecret?: string;
  isCloudflareWorker: boolean;
}

/**
 * Retrieve the current Cloudflare environment bindings safely.
 * Returns null if not running in a Cloudflare context (e.g. standard next dev without proxy).
 */
export function getCloudflareEnv(): CloudflareEnv | null {
  try {
    const ctx = getCloudflareContext();
    if (ctx && ctx.env) {
      return ctx.env;
    }
  } catch {
    // Graceful fallback when invoked outside Cloudflare runtime
  }
  return null;
}

/**
 * Access the server-side configuration with typed defaults.
 */
export function getServerConfig(): ServerConfig {
  const cfEnv = getCloudflareEnv();

  const appUrl =
    cfEnv?.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const envString = (cfEnv?.ENVIRONMENT || process.env.NODE_ENV || "development").toLowerCase();
  const environment: "development" | "preview" | "production" =
    envString === "production" ? "production" : envString === "preview" ? "preview" : "development";

  return {
    environment,
    appUrl,
    authSecret: cfEnv?.AUTH_SECRET || process.env.AUTH_SECRET,
    geminiApiKey: cfEnv?.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    aiApiKey: cfEnv?.AI_API_KEY || cfEnv?.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GEMINI_API_KEY,
    aiProvider: cfEnv?.AI_PROVIDER || process.env.AI_PROVIDER || "google-gemini",
    aiModel: cfEnv?.AI_MODEL || cfEnv?.AI_MODEL_NAME || process.env.AI_MODEL || process.env.AI_MODEL_NAME || "gemini-2.5-flash",
    emailApiKey: cfEnv?.EMAIL_API_KEY || process.env.EMAIL_API_KEY,
    emailFrom: cfEnv?.EMAIL_FROM_ADDRESS || process.env.EMAIL_FROM_ADDRESS || "notifications@aurelle.dsecops88.online",
    studioContactEmail: cfEnv?.STUDIO_CONTACT_RECIPIENT || process.env.STUDIO_CONTACT_RECIPIENT || "studio@aurelle.dsecops88.online",
    n8nWebhookUrl: cfEnv?.N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
    n8nWebhookSecret: cfEnv?.N8N_WEBHOOK_SECRET || process.env.N8N_WEBHOOK_SECRET,
    n8nRequestTimeout: parseInt(cfEnv?.N8N_REQUEST_TIMEOUT || process.env.N8N_REQUEST_TIMEOUT || "10000", 10),
    automationMaxRetries: parseInt(cfEnv?.AUTOMATION_MAX_RETRIES || process.env.AUTOMATION_MAX_RETRIES || "5", 10),
    automationEnabled: (cfEnv?.AUTOMATION_ENABLED || process.env.AUTOMATION_ENABLED || "false").toLowerCase() === "true",
    cronSecret: cfEnv?.CRON_SECRET || process.env.CRON_SECRET,
    isCloudflareWorker: cfEnv !== null,
  };
}
