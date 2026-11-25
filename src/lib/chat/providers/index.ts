/**
 * Aurelle Spaces — LLM Provider Registry & Factory
 */

import { LLMChatProvider } from "./types";
import { GeminiProvider } from "./gemini-provider";
import { OpenAIProvider } from "./openai-provider";
import { AIProviderConfig, getAIConfig } from "../config";

export * from "./types";
export * from "./gemini-provider";
export * from "./openai-provider";

/**
 * Creates or retrieves the active LLM provider based on server configuration.
 */
export function getActiveAIProvider(
  configOverride?: AIProviderConfig
): LLMChatProvider {
  const config = configOverride || getAIConfig();

  if (config.provider === "openai" || config.provider === "openai-compatible") {
    return new OpenAIProvider(
      config.apiKey,
      config.model,
      config.baseUrl || "https://api.openai.com/v1",
      config.requestTimeoutMs
    );
  }

  // Default to Google Gemini
  return new GeminiProvider(
    config.apiKey,
    config.model,
    config.requestTimeoutMs
  );
}

