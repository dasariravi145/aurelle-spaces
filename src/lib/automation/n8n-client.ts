/**
 * Aurelle Spaces — Server-Side n8n Webhook Client
 * 
 * Delivers signed, versioned event envelopes to the configured n8n webhook endpoint.
 * Signs exact request body bytes with HMAC-SHA256 for end-to-end authenticity.
 */

import { AutomationEventEnvelope, AutomationDeliveryResult } from "./types";
import { getAutomationConfig, AutomationConfig } from "./config";
import { signWebhookPayload } from "./signature";
import { logger } from "@/lib/logging/logger";

export async function deliverWebhookEvent<T>(
  envelope: AutomationEventEnvelope<T>,
  configOverride?: AutomationConfig
): Promise<AutomationDeliveryResult> {
  const config = configOverride || getAutomationConfig();
  const deliveredAt = new Date().toISOString();

  if (!config.isConfigured || !config.webhookUrl || !config.webhookSecret) {
    return {
      success: false,
      acknowledged: false,
      errorMessage:
        "n8n Webhook is not configured. Missing N8N_WEBHOOK_URL or N8N_WEBHOOK_SECRET.",
      deliveredAt,
    };
  }

  // 1. Serialize envelope to JSON bytes
  const jsonString = JSON.stringify(envelope);
  const encoder = new TextEncoder();
  const bodyBytes = encoder.encode(jsonString);

  // 2. Compute HMAC-SHA256 signature over exact body bytes
  let signatureHex: string;
  try {
    signatureHex = await signWebhookPayload(config.webhookSecret, bodyBytes);
  } catch (sigErr) {
    logger.error("Failed to compute HMAC signature for webhook payload", { eventId: envelope.event_id }, sigErr);
    return {
      success: false,
      acknowledged: false,
      errorMessage: "Cryptographic signing failure prior to delivery.",
      deliveredAt,
    };
  }

  // 3. Dispatch HTTP request with security and traceability headers
  let response: Response;
  try {
    response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Aurelle-Signature": signatureHex,
        "X-Aurelle-Event-ID": envelope.event_id,
        "X-Aurelle-Event-Type": envelope.event_type,
        "X-Aurelle-Timestamp": envelope.occurred_at,
        "X-Aurelle-Schema-Version": envelope.schema_version,
        "User-Agent": "AurelleSpaces-Automation/1.0",
      },
      body: bodyBytes as unknown as BodyInit,
      signal: AbortSignal.timeout(config.requestTimeoutMs),
    });
  } catch (fetchErr: unknown) {
    const isTimeout = fetchErr instanceof Error && fetchErr.name === "TimeoutError";
    const errorMsg = isTimeout
      ? `Webhook delivery timed out after ${config.requestTimeoutMs}ms`
      : fetchErr instanceof Error
      ? fetchErr.message
      : "Network communication failure connecting to n8n webhook.";

    logger.error("n8n webhook dispatch network error", {
      eventId: envelope.event_id,
      eventType: envelope.event_type,
      isTimeout,
    });

    return {
      success: false,
      acknowledged: false,
      errorMessage: errorMsg,
      deliveredAt,
    };
  }

  // 4. Handle HTTP responses
  const statusCode = response.status;

  // Extract Retry-After if returned by n8n (e.g. rate limit HTTP 429)
  let retryAfterSeconds: number | undefined;
  const retryHeader = response.headers.get("retry-after");
  if (retryHeader) {
    const parsed = parseInt(retryHeader, 10);
    if (!isNaN(parsed) && parsed > 0) {
      retryAfterSeconds = parsed;
    }
  }

  if (!response.ok) {
    const errorSnippet = await response.text().catch(() => "").then((t) => t.slice(0, 300));
    logger.error("n8n webhook returned non-2xx status", {
      status: statusCode,
      eventId: envelope.event_id,
      errorSnippet,
    });

    return {
      success: false,
      statusCode,
      acknowledged: false,
      retryAfterSeconds,
      errorMessage: `n8n webhook returned HTTP ${statusCode}: ${errorSnippet || "Request rejected"}`,
      deliveredAt,
    };
  }

  // 5. Parse n8n acknowledgement response
  let n8nExecutionId: string | undefined;
  let isExplicitlyAcknowledged = true;

  try {
    const responseJson = (await response.json().catch(() => null)) as {
      acknowledged?: boolean;
      executionId?: string;
      id?: string;
      message?: string;
    } | null;

    if (responseJson) {
      n8nExecutionId = responseJson.executionId || responseJson.id;
      if (responseJson.acknowledged === false) {
        isExplicitlyAcknowledged = false;
      }
    }
  } catch {
    // Non-JSON HTTP 200 response (standard n8n Webhook node returns "Workflow got started.")
  }

  return {
    success: true,
    statusCode,
    acknowledged: isExplicitlyAcknowledged,
    n8nExecutionId,
    deliveredAt,
  };
}

