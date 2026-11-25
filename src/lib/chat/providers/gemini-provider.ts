/**
 * Aurelle Spaces — Google Gemini API Provider Adapter
 * 
 * Direct HTTP integration with Google Gemini API via standard Web Fetch.
 * Compatible with Cloudflare Workers edge runtime with zero external SDKs.
 */

import {
  LLMChatProvider,
  LLMMessage,
  LLMCompletionOptions,
  LLMCompletionResult,
  ProviderError,
  ProviderNotConfiguredError,
  ProviderTimeoutError,
} from "./types";
import { logger } from "@/lib/logging/logger";

export class GeminiProvider implements LLMChatProvider {
  readonly name = "Google Gemini";

  constructor(
    private readonly apiKey: string | null,
    private readonly model: string = "gemini-2.5-flash",
    private readonly defaultTimeoutMs: number = 15000
  ) {}

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateResponse(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResult> {
    if (!this.isConfigured || !this.apiKey) {
      throw new ProviderNotConfiguredError(this.name);
    }

    const timeoutMs = options?.timeoutMs || this.defaultTimeoutMs;

    // Separate system message from conversation contents
    const systemMessage = messages.find((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    // Format Gemini contents payload
    const contents = conversationMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // If no conversational turns remain, ensure at least one prompt is provided
    if (contents.length === 0 && systemMessage) {
      contents.push({
        role: "user",
        parts: [{ text: "Hello" }],
      });
    }

    const payload: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.4,
        maxOutputTokens: options?.maxTokens ?? 600,
      },
    };

    if (systemMessage) {
      payload.system_instruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new ProviderTimeoutError(this.name, timeoutMs);
      }
      logger.error("Gemini fetch network error", { model: this.model }, err);
      throw new ProviderError(
        "Network communication failure connecting to Gemini AI provider.",
        this.name,
        502,
        true
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      logger.error("Gemini API non-200 response", {
        status: response.status,
        model: this.model,
        errorExcerpt: errorText.slice(0, 300),
      });

      if (response.status === 429) {
        throw new ProviderError(
          "AI service rate limit reached. Please wait a moment and try again.",
          this.name,
          429,
          true
        );
      }

      if (response.status === 401 || response.status === 403) {
        throw new ProviderError(
          "AI provider authentication failed. Check configured API key.",
          this.name,
          response.status,
          false
        );
      }

      throw new ProviderError(
        `Gemini provider returned error status ${response.status}`,
        this.name,
        response.status,
        response.status >= 500
      );
    }

    interface GeminiCandidate {
      content?: {
        parts?: Array<{ text?: string }>;
      };
      finishReason?: string;
    }

    interface GeminiResponse {
      candidates?: GeminiCandidate[];
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    }

    const data = (await response.json()) as GeminiResponse;

    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart || typeof textPart !== "string") {
      throw new ProviderError(
        "AI provider returned an empty or unparseable response structure.",
        this.name,
        502,
        false
      );
    }

    return {
      content: textPart.trim(),
      finishReason: candidate.finishReason,
      tokensUsed: {
        promptTokens: data.usageMetadata?.promptTokenCount,
        completionTokens: data.usageMetadata?.candidatesTokenCount,
        totalTokens: data.usageMetadata?.totalTokenCount,
      },
    };
  }
}

