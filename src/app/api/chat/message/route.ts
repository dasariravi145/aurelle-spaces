/**
 * Aurelle Spaces — Conversational AI Chat API
 * POST /api/chat/message
 * 
 * Secure, edge-compatible endpoint combining:
 * 1. Zero-token Predefined FAQ matching for instant verified answers.
 * 2. Lightweight RAG retrieval engine with token-capped context injection.
 * 3. Server-side Google Gemini AI integration with prompt guarding.
 * 4. Graceful offline/unconfigured fallback synthesis.
 * 5. Lead intent qualification tracking and Cloudflare D1 persistence.
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { chatRepository } from "@/lib/db/repositories/chat.repository";
import { getAIConfig } from "@/lib/chat/config";
import { getActiveAIProvider } from "@/lib/chat/providers";
import { LLMMessage, ProviderError } from "@/lib/chat/providers/types";
import {
  retrieveRelevantKnowledge,
  synthesizeFallbackResponse,
} from "@/lib/chat/retrieval";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import {
  scanAndSanitizePrompt,
  formatUserMessageForLLM,
} from "@/lib/security/prompt-guard";
import { chatRateLimiter } from "@/lib/security/chat-rate-limit";
import {
  CHAT_SESSION_COOKIE,
  getOrCreateSessionId,
  buildChatSessionCookieHeader,
} from "@/lib/chat/session";
import { sanitizeAssistantOutput } from "@/lib/chat/output-guard";
import {
  detectLeadIntent,
  extractLeadInformation,
  computeNextLeadStage,
} from "@/lib/chat/lead-intent";
import { ChatLeadState } from "@/lib/chat/types";
import { UNAVAILABLE_MESSAGE } from "@/lib/chat/chat-service";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  try {
    // 1. Request body payload size guard (max 32KB)
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
      10
    );
    if (contentLength > 32 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Request payload exceeds maximum permitted size of 32KB.",
        },
        { status: 413 }
      );
    }

    const body = (await request.json().catch(() => null)) as {
      conversationId?: string;
      message?: string;
      safeContext?: {
        pageUrl?: string;
        discipline?: string;
      };
    } | null;

    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        { success: false, error: "A valid 'message' text string is required." },
        { status: 400 }
      );
    }

    // 2. Scan and sanitize user prompt (Prompt Injection Defense)
    const scan = scanAndSanitizePrompt(body.message);
    if (!scan.isSafe) {
      return NextResponse.json(
        {
          success: false,
          error: scan.rejectionReason || "Invalid message format.",
        },
        { status: 400 }
      );
    }

    // 3. Resolve anonymous session ownership via cookie or header
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .filter(([k]) => Boolean(k))
    );
    const existingCookieToken = cookies[CHAT_SESSION_COOKIE];

    const { sessionId, isNew: isNewSession } =
      getOrCreateSessionId(existingCookieToken);

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    // 4. Resolve D1 Database
    let db: ReturnType<typeof getDatabase> | null = null;
    try {
      db = getDatabase();
    } catch {
      // In local dev without D1 proxy, db remains null
    }

    // 5. Rate limiting & abuse guard
    if (db) {
      const rateLimit = await chatRateLimiter.checkRateLimit(
        db,
        sessionId,
        clientIp
      );
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error:
              rateLimit.reason ||
              "Rate limit exceeded. Please wait a moment before sending another message.",
          },
          {
            status: 429,
            headers: rateLimit.retryAfterSeconds
              ? { "Retry-After": String(rateLimit.retryAfterSeconds) }
              : undefined,
          }
        );
      }
    }

    // 6. Initialize or retrieve conversation record from D1
    let conversationId = body.conversationId;
    let currentLeadState: ChatLeadState = { stage: "not_started" };

    if (db) {
      try {
        const conversation = await chatRepository.getOrCreateConversation(
          db,
          sessionId,
          false
        );
        conversationId = conversation.id;
        if (conversation.lead_state) {
          try {
            currentLeadState = JSON.parse(conversation.lead_state);
          } catch {
            // Keep default
          }
        }
      } catch (err) {
        logger.error("Failed to retrieve or create chat conversation in D1", { sessionId }, err);
      }
    }

    // Fallback conversationId if D1 is offline
    if (!conversationId) {
      conversationId = `conv_${sessionId.slice(0, 16)}`;
    }

    // 7. Lead Intent Detection & Progressive Information Extraction
    const intentResult = detectLeadIntent(scan.sanitizedText, currentLeadState.stage);
    let updatedLeadState: ChatLeadState = { ...currentLeadState };

    if (intentResult.hasLeadIntent) {
      const extracted = extractLeadInformation(scan.sanitizedText, currentLeadState);
      updatedLeadState = {
        ...currentLeadState,
        ...extracted,
        projectType: extracted.projectType || currentLeadState.projectType || intentResult.suggestedDiscipline,
      };
      updatedLeadState.stage = computeNextLeadStage(
        currentLeadState.stage === "not_started" ? "discovering" : currentLeadState.stage,
        updatedLeadState
      );

      // Persist updated lead state to D1
      if (db && conversationId) {
        await db
          .prepare("UPDATE chat_conversations SET lead_state = ?, updated_at = datetime('now') WHERE id = ?")
          .bind(JSON.stringify(updatedLeadState), conversationId)
          .run()
          .catch(() => {});
      }
    }

    // 8. Lightweight RAG Retrieval: Check for zero-token Predefined FAQ match first
    const retrievedKnowledge = retrieveRelevantKnowledge(scan.sanitizedText);

    // If an exact verified FAQ match exists, return it immediately (0 tokens, instant response)
    if (retrievedKnowledge.matchedFAQ) {
      const faqAnswer = sanitizeAssistantOutput(retrievedKnowledge.matchedFAQ.answer);
      let assistantMessageId = `msg_${Date.now()}`;

      if (db && conversationId) {
        try {
          await chatRepository.addMessage(db, conversationId, "user", scan.sanitizedText);
          const savedMsg = await chatRepository.addMessage(db, conversationId, "assistant", faqAnswer);
          assistantMessageId = savedMsg.id;
          await chatRateLimiter.recordMessage(db, clientIp);
        } catch (err) {
          logger.error("Failed to persist FAQ chat message to D1", { conversationId }, err);
        }
      }

      const res = NextResponse.json(
        {
          success: true,
          conversationId,
          messageId: assistantMessageId,
          message: faqAnswer,
          timestamp: new Date().toISOString(),
          leadState: updatedLeadState,
        },
        { status: 200 }
      );

      if (isNewSession) {
        res.headers.set("Set-Cookie", buildChatSessionCookieHeader(sessionId));
      }
      return res;
    }

    // 9. Inspect server-side AI provider configuration
    const aiConfig = getAIConfig();

    // If AI provider is unconfigured or unavailable, provide high-quality local knowledge fallback
    if (!aiConfig.isAvailable) {
      const fallbackText = sanitizeAssistantOutput(
        synthesizeFallbackResponse(scan.sanitizedText, retrievedKnowledge)
      );

      let assistantMessageId = `msg_${Date.now()}`;
      if (db && conversationId) {
        try {
          await chatRepository.addMessage(db, conversationId, "user", scan.sanitizedText);
          const savedMsg = await chatRepository.addMessage(db, conversationId, "assistant", fallbackText);
          assistantMessageId = savedMsg.id;
          await chatRateLimiter.recordMessage(db, clientIp);
        } catch (err) {
          logger.error("Failed to persist fallback chat message to D1", { conversationId }, err);
        }
      }

      const res = NextResponse.json(
        {
          success: true,
          conversationId,
          messageId: assistantMessageId,
          message: fallbackText,
          timestamp: new Date().toISOString(),
          leadState: updatedLeadState,
        },
        { status: 200 }
      );

      if (isNewSession) {
        res.headers.set("Set-Cookie", buildChatSessionCookieHeader(sessionId));
      }
      return res;
    }

    // 10. AI is configured: Build contextual prompt with retrieved knowledge
    let systemPrompt = buildSystemPrompt(retrievedKnowledge.formattedContext);

    if (intentResult.hasLeadIntent && updatedLeadState.stage !== "not_started") {
      systemPrompt += `\n\nCONVERSATION CONTEXT - PROJECT INQUIRY:
The visitor is planning or inquiring about a spatial project.
Current recognized details:
- Discipline: ${updatedLeadState.projectType || "General"}
- Location: ${updatedLeadState.city || "Unspecified"}
- Area: ${updatedLeadState.approximateArea || "Unspecified"}
Hospitably answer their questions and gently guide them toward completing their consultation brief.`;
    }

    // Fetch recent conversation history from D1 (up to 6 messages)
    const historyMessages: LLMMessage[] = [];
    if (db && conversationId) {
      try {
        const recentRows = await chatRepository.getConversationMessages(
          db,
          conversationId,
          6
        );
        for (const row of recentRows) {
          if (row.sender_role === "user" || row.sender_role === "assistant") {
            historyMessages.push({
              role: row.sender_role,
              content: row.message_content,
            });
          }
        }
      } catch {
        // Continue without history on error
      }
    }

    const llmMessages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      {
        role: "user",
        content: formatUserMessageForLLM(scan.sanitizedText),
      },
    ];

    // 11. Execute completion via configured AI provider (Google Gemini)
    const provider = getActiveAIProvider(aiConfig);
    let outputContent: string;

    try {
      const completionResult = await provider.generateResponse(llmMessages, {
        temperature: aiConfig.temperature,
        maxTokens: Math.min(aiConfig.maxOutputTokens, 600),
        timeoutMs: aiConfig.requestTimeoutMs,
      });
      outputContent = completionResult.content;
    } catch (err: unknown) {
      logger.error("LLM Provider generation failed, falling back to local RAG synthesis", { provider: provider.name }, err);
      // Graceful fallback to local RAG synthesis rather than a hard failure
      outputContent = synthesizeFallbackResponse(scan.sanitizedText, retrievedKnowledge);
    }

    // 12. Sanitize assistant output
    const sanitizedOutput = sanitizeAssistantOutput(outputContent);

    // 13. Persist messages to Cloudflare D1
    let assistantMessageId = `msg_${Date.now()}`;
    if (db && conversationId) {
      try {
        await chatRepository.addMessage(
          db,
          conversationId,
          "user",
          scan.sanitizedText
        );
        const savedAssistantMsg = await chatRepository.addMessage(
          db,
          conversationId,
          "assistant",
          sanitizedOutput
        );
        assistantMessageId = savedAssistantMsg.id;
        await chatRateLimiter.recordMessage(db, clientIp);
      } catch (err) {
        logger.error("Failed to persist chat messages to D1", { conversationId }, err);
      }
    }

    // 14. Return successful response with conversation identity & lead qualification state
    const responsePayload = {
      success: true,
      conversationId,
      messageId: assistantMessageId,
      message: sanitizedOutput,
      timestamp: new Date().toISOString(),
      leadState: updatedLeadState,
    };

    const res = NextResponse.json(responsePayload, { status: 200 });

    if (isNewSession) {
      res.headers.set(
        "Set-Cookie",
        buildChatSessionCookieHeader(sessionId)
      );
    }

    return res;
  } catch (error: unknown) {
    logger.error("Unhandled error in POST /api/chat/message", {}, error);
    return NextResponse.json(
      {
        success: false,
        error: UNAVAILABLE_MESSAGE,
      },
      { status: 500 }
    );
  }
}