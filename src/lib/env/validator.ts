/**
 * Aurelle Spaces — Production Environment & Security Configuration Validator
 * 
 * Verifies that required environment variables, bindings, and secrets are properly
 * configured before deployment or during startup diagnostic checks.
 */

import { getServerConfig } from "@/lib/env";

export interface EnvironmentValidationReport {
  isValid: boolean;
  environment: "development" | "preview" | "production";
  errors: string[];
  warnings: string[];
  checks: {
    authSecret: boolean;
    appUrl: boolean;
    aiKey: boolean;
    emailKey: boolean;
    n8nWebhook: boolean;
  };
}

/**
 * Validates the runtime environment against production security and operational baselines.
 */
export function validateEnvironment(): EnvironmentValidationReport {
  const config = getServerConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  const checks = {
    authSecret: false,
    appUrl: false,
    aiKey: false,
    emailKey: false,
    n8nWebhook: false,
  };

  // 1. Validate AUTH_SECRET
  if (!config.authSecret || config.authSecret.trim().length === 0) {
    if (config.environment === "production") {
      errors.push("AUTH_SECRET is mandatory in production for administrative session security.");
    } else {
      warnings.push("AUTH_SECRET is not configured; fallback dev token will be utilized.");
    }
  } else if (config.authSecret.length < 32) {
    if (config.environment === "production") {
      errors.push("AUTH_SECRET must be at least 32 characters in length for production cryptographic strength.");
    } else {
      warnings.push("AUTH_SECRET is shorter than 32 characters.");
    }
  } else if (config.authSecret.includes("placeholder") || config.authSecret.includes("your_secure_random")) {
    warnings.push("AUTH_SECRET appears to contain template placeholder text.");
  } else {
    checks.authSecret = true;
  }

  // 2. Validate App URL
  try {
    const url = new URL(config.appUrl);
    if (config.environment === "production" && url.protocol !== "https:") {
      errors.push(`Production NEXT_PUBLIC_APP_URL must use HTTPS protocol (received: '${url.protocol}').`);
    } else {
      checks.appUrl = true;
    }
  } catch {
    errors.push(`NEXT_PUBLIC_APP_URL is malformed: '${config.appUrl}'.`);
  }

  // 3. Validate AI / LLM Provider Key
  if (!config.aiApiKey || config.aiApiKey.includes("placeholder")) {
    warnings.push("AI provider key is unconfigured or contains placeholder. Chatbot will operate in fallback mode.");
  } else {
    checks.aiKey = true;
  }

  // 4. Validate Email Provider Key
  if (!config.emailApiKey || config.emailApiKey.includes("placeholder")) {
    warnings.push("Transactional email API key is unconfigured. Client confirmation emails will be logged rather than dispatched.");
  } else {
    checks.emailKey = true;
  }

  // 5. Validate n8n Automation Webhook
  if (config.automationEnabled) {
    if (!config.n8nWebhookUrl) {
      errors.push("AUTOMATION_ENABLED is true, but N8N_WEBHOOK_URL is missing.");
    }
    if (!config.n8nWebhookSecret) {
      errors.push("AUTOMATION_ENABLED is true, but N8N_WEBHOOK_SECRET is missing.");
    }
    if (config.n8nWebhookUrl && config.n8nWebhookSecret) {
      checks.n8nWebhook = true;
    }
  } else {
    checks.n8nWebhook = true; // Not required when automation is disabled
  }

  return {
    isValid: errors.length === 0,
    environment: config.environment,
    errors,
    warnings,
    checks,
  };
}

