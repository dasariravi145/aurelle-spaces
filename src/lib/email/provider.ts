/**
 * Aurelle Spaces — Production Email Provider Abstraction
 * 
 * Edge-compatible transactional email delivery abstraction for Cloudflare Workers.
 * Supports Resend REST API without node-specific libraries.
 * Safely defaults to unconfigured mode when environment variables are omitted.
 * Never claims an email was sent if credentials are unconfigured.
 */

import { getCloudflareEnv } from "@/lib/env";
import { SendEmailOptions, EmailDeliveryResult, EmailProviderConfig } from "./types";
import { logger } from "@/lib/logging/logger";

export function getEmailProviderConfig(): EmailProviderConfig {
  const cfEnv = getCloudflareEnv();

  const apiKey =
    cfEnv?.EMAIL_API_KEY ||
    process.env.EMAIL_API_KEY ||
    cfEnv?.RESEND_API_KEY ||
    process.env.RESEND_API_KEY ||
    null;

  const fromAddress =
    cfEnv?.EMAIL_FROM_ADDRESS ||
    process.env.EMAIL_FROM_ADDRESS ||
    "notifications@aurelle.dsecops88.online";

  const studioContactEmail =
    cfEnv?.STUDIO_CONTACT_RECIPIENT ||
    process.env.STUDIO_CONTACT_RECIPIENT ||
    "studio@aurelle.dsecops88.online";

  const provider: EmailProviderConfig["provider"] = apiKey ? "resend" : "unconfigured";

  return {
    provider,
    apiKey,
    fromAddress,
    studioContactEmail,
    isConfigured: Boolean(apiKey && apiKey.trim().length > 0),
  };
}

/**
 * Dispatches an email using the configured provider.
 * When unconfigured, records an explicit failure rather than pretending to succeed.
 */
export async function sendEmail(
  options: SendEmailOptions,
  configOverride?: EmailProviderConfig
): Promise<EmailDeliveryResult> {
  const config = configOverride || getEmailProviderConfig();
  const attemptedAt = new Date().toISOString();

  if (!config.isConfigured || !config.apiKey) {
    logger.warn("Email delivery skipped: No email provider credentials configured (EMAIL_API_KEY).", {
      subject: options.subject,
      recipientCount: Array.isArray(options.to) ? options.to.length : 1,
    });

    return {
      success: false,
      configured: false,
      provider: "unconfigured",
      error: "Email delivery provider is unconfigured. Set EMAIL_API_KEY or RESEND_API_KEY in environment secrets.",
      attemptedAt,
    };
  }

  const from = options.from || config.fromAddress;
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  if (config.provider === "resend") {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey.trim()}`,
          "Content-Type": "application/json",
          "User-Agent": "AurelleSpaces-EmailClient/1.0",
        },
        body: JSON.stringify({
          from,
          to: toList,
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
          headers: options.headers,
        }),
      });

      const responseBody = await response.json().catch(() => null);

      if (response.ok && responseBody?.id) {
        return {
          success: true,
          configured: true,
          provider: "resend",
          messageId: responseBody.id,
          statusCode: response.status,
          attemptedAt,
        };
      }

      const errorMsg =
        responseBody?.message ||
        `Resend API error (HTTP ${response.status}): ${response.statusText}`;

      logger.error("Resend API rejected email dispatch", { status: response.status, error: errorMsg });

      return {
        success: false,
        configured: true,
        provider: "resend",
        error: errorMsg,
        statusCode: response.status,
        attemptedAt,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network failure connecting to email API.";
      logger.error("Failed to connect to Resend API endpoint", {}, err);

      return {
        success: false,
        configured: true,
        provider: "resend",
        error: message,
        attemptedAt,
      };
    }
  }

  return {
    success: false,
    configured: false,
    provider: config.provider,
    error: `Unsupported email provider '${config.provider}'.`,
    attemptedAt,
  };
}

