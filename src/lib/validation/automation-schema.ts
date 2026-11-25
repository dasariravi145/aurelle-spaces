/**
 * Aurelle Spaces — Automation Event Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";

export interface CreateAutomationEventInput {
  eventType: string;
  relatedEntityId: string;
  payloadReference?: string;
}

export function validateAutomationEventInput(data: unknown): CreateAutomationEventInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Automation event must be a valid object.");
  }

  const e = data as Record<string, unknown>;

  if (typeof e.eventType !== "string" || e.eventType.trim().length < 3) {
    throw new ValidationError("Valid eventType is required.");
  }

  if (typeof e.relatedEntityId !== "string" || e.relatedEntityId.trim().length === 0) {
    throw new ValidationError("Valid relatedEntityId is required.");
  }

  return {
    eventType: e.eventType.trim(),
    relatedEntityId: e.relatedEntityId.trim(),
    payloadReference: typeof e.payloadReference === "string" ? e.payloadReference.trim() : undefined,
  };
}

