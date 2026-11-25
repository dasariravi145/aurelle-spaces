import { ChatMessageRequest, ChatMessageResponse } from "./types";

/**
 * Aurelle Spaces — Studio Chat Service Client
 * 
 * Manages communication with the studio chat API.
 * In Prompt 11, the backend endpoint (POST /api/chat/message) is not yet active.
 * This service implements the truthful integration contract without fabricating AI responses.
 * When called before Prompt 12 is completed, it cleanly reports that live chat is currently
 * unavailable and guides visitors toward the contact and services pages.
 */

export const UNAVAILABLE_MESSAGE =
  "Live chat is currently unavailable. You can still explore our services or use the contact page.";

/**
 * Sends a visitor message to the chat backend endpoint.
 * Strictly avoids simulated AI responses.
 */
export async function sendChatMessage(
  payload: ChatMessageRequest
): Promise<ChatMessageResponse> {
  try {
    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 404 || res.status === 503 || res.status === 502) {
      return {
        success: false,
        conversationId: payload.conversationId || `conv_${Date.now()}`,
        messageId: `msg_${Date.now()}`,
        error: UNAVAILABLE_MESSAGE,
        timestamp: new Date().toISOString(),
      };
    }

    if (!res.ok) {
      const errorData = (await res.json().catch(() => null)) as { error?: string } | null;
      return {
        success: false,
        conversationId: payload.conversationId || `conv_${Date.now()}`,
        messageId: `msg_${Date.now()}`,
        error: errorData?.error || UNAVAILABLE_MESSAGE,
        timestamp: new Date().toISOString(),
      };
    }

    const data = (await res.json()) as ChatMessageResponse;
    return data;
  } catch {
    // Network failure or backend not yet mounted
    return {
      success: false,
      conversationId: payload.conversationId || `conv_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      error: UNAVAILABLE_MESSAGE,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Generates a stable client-side message or conversation ID.
 */
export function generateClientChatId(prefix: "conv" | "msg" = "conv"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

