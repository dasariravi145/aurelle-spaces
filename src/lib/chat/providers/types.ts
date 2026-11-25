/**
 * Aurelle Spaces — LLM Provider Abstraction Types
 * 
 * Defines standard interfaces for multi-provider LLM integration (Google Gemini, OpenAI, etc.)
 * compatible with Cloudflare Workers and standard Web Fetch API without heavy Node.js SDKs.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface LLMCompletionResult {
  content: string;
  finishReason?: string;
  tokensUsed?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface LLMChatProvider {
  readonly name: string;
  readonly isConfigured: boolean;
  generateResponse(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResult>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly providerName: string,
    public readonly statusCode?: number,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class ProviderNotConfiguredError extends ProviderError {
  constructor(providerName: string) {
    super(
      `AI Provider '${providerName}' is not configured. Missing required API key or credentials.`,
      providerName,
      503,
      false
    );
    this.name = "ProviderNotConfiguredError";
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(providerName: string, timeoutMs: number) {
    super(
      `AI Provider '${providerName}' timed out after ${timeoutMs}ms.`,
      providerName,
      504,
      true
    );
    this.name = "ProviderTimeoutError";
  }
}

