/**
 * Aurelle Spaces — OpenAI-Compatible API Provider Adapter
 * 
 * Works with OpenAI, Azure OpenAI, Cloudflare AI Gateway, and OpenAI-compatible inference servers.
 * Direct Web Fetch API implementation with zero external dependencies.
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

export class OpenAIProvider implements LLMChatProvider {
  readonly name = "OpenAI Compatible";

  constructor(
    private readonly apiKey: string | null,
    private readonly model: string = "gpt-4o-mini",
    private readonly baseUrl: string = "https://api.openai.com/v1",
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

    const payload = {
      model: this.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.4,
      max_tokens: options?.maxTokens ?? 600,
    };

    const endpoint = `${this.baseUrl.replace(/\/+$/, "")}/chat/completions`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new ProviderTimeoutError(this.name, timeoutMs);
      }
      logger.error("OpenAI fetch network error", { model: this.model }, err);
      throw new ProviderError(
        "Network communication failure connecting to OpenAI provider.",
        this.name,
        502,
        true
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      logger.error("OpenAI API non-200 response", {
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
        `OpenAI provider returned error status ${response.status}`,
        this.name,
        response.status,
        response.status >= 500
      );
    }

    interface OpenAIChoice {
      message?: {
        content?: string;
      };
      finish_reason?: string;
    }

    interface OpenAIResponse {
      choices?: OpenAIChoice[];
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    }

    const data = (await response.json()) as OpenAIResponse;
    const choice = data.choices?.[0];
    const content = choice?.message?.content;

    if (!content || typeof content !== "string") {
      throw new ProviderError(
        "AI provider returned an empty or unparseable response structure.",
        this.name,
        502,
        false
      );
    }

    return {
      content: content.trim(),
      finishReason: choice.finish_reason,
      tokensUsed: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }
}

