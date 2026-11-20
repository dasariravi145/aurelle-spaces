/**
 * Aurelle Spaces - Environment Configuration
 * 
 * Provides centralized, safe access to application environment variables.
 * Designed to be compatible with both local development and Cloudflare Workers runtime.
 */

export interface AppConfig {
  appUrl: string;
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
  hasAiAssistantKey: boolean;
  hasEmailKey: boolean;
  hasN8nWebhook: boolean;
}

export function getAppConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV || "development";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (nodeEnv === "production"
      ? "https://aurelle.dsecops88.online"
      : "http://localhost:3000");

  return {
    appUrl,
    nodeEnv,
    isProduction: nodeEnv === "production",
    isDevelopment: nodeEnv === "development",
    hasAiAssistantKey: Boolean(process.env.GEMINI_API_KEY),
    hasEmailKey: Boolean(process.env.EMAIL_API_KEY),
    hasN8nWebhook: Boolean(process.env.N8N_WEBHOOK_URL),
  };
}

