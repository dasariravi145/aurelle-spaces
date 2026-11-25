/**
 * Aurelle Spaces — Chatbot Session & Message Validation Contracts
 */

import { ValidationError } from "@/lib/errors/app-error";
import type { SenderRole } from "@/lib/db/types";

export interface CreateChatMessageInput {
  sessionId: string;
  senderRole: SenderRole;
  content: string;
  consentState?: boolean;
}

export function validateChatMessageInput(data: unknown): CreateChatMessageInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Message input must be a valid object.");
  }

  const m = data as Record<string, unknown>;

  if (typeof m.sessionId !== "string" || m.sessionId.trim().length < 8) {
    throw new ValidationError("A valid anonymous session identifier is required.");
  }

  if (m.senderRole !== "user" && m.senderRole !== "assistant" && m.senderRole !== "system") {
    throw new ValidationError("Invalid sender role.");
  }

  if (typeof m.content !== "string" || m.content.trim().length === 0) {
    throw new ValidationError("Message content cannot be empty.");
  }

  if (m.content.length > 4000) {
    throw new ValidationError("Message content exceeds maximum permitted length of 4000 characters.");
  }

  return {
    sessionId: m.sessionId.trim(),
    senderRole: m.senderRole,
    content: m.content.trim(),
    consentState: Boolean(m.consentState),
  };
}

