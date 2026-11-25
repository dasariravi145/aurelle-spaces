/**
 * Aurelle Spaces — Server-Side AI Chatbot Configuration
 * 
 * Safely accesses and validates AI environment settings across Cloudflare Workers and local Node runtime.
 * Never leaks API keys or secrets to client components.
 */

import { getCloudflareEnv } from "@/lib/env";

export type SupportedAIProvider = "google-gemini" | "openai" | "openai-compatible";

export interface AIProviderConfig {
  provider: SupportedAIProvider;
  apiKey: string | null;
  model: string;
  baseUrl?: string;
  requestTimeoutMs: number;
  maxOutputTokens: number;
  temperature: number;
  isAvailable: boolean;
}

/**
 * Resolves the server-side AI configuration.
 * Prioritizes Cloudflare worker environment bindings before checking process.env.
 */
export function getAIConfig(): AIProviderConfig {
  const cfEnv = getCloudflareEnv();

  // 1. Resolve API Key
  const apiKey =
    cfEnv?.AI_API_KEY ||
    cfEnv?.GEMINI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    null;

  // 2. Resolve Provider Name
  const rawProvider = (
    cfEnv?.AI_PROVIDER ||
    process.env.AI_PROVIDER ||
    (process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY ? "openai" : "google-gemini")
  ).toLowerCase();

  const provider: SupportedAIProvider =
    rawProvider === "openai" || rawProvider === "openai-compatible"
      ? (rawProvider as SupportedAIProvider)
      : "google-gemini";

  // 3. Resolve Model Name
  const defaultModel =
    provider === "google-gemini" ? "gemini-2.5-flash" : "gpt-4o-mini";

  const model =
    cfEnv?.AI_MODEL ||
    cfEnv?.AI_MODEL_NAME ||
    process.env.AI_MODEL ||
    process.env.AI_MODEL_NAME ||
    defaultModel;

  // 4. Resolve Base URL for OpenAI-compatible proxies
  const baseUrl =
    cfEnv?.AI_API_BASE_URL ||
    process.env.AI_API_BASE_URL ||
    (provider === "openai" ? "https://api.openai.com/v1" : undefined);

  // 5. Numerical limits & tuning
  const requestTimeoutMs = parseInt(
    cfEnv?.AI_REQUEST_TIMEOUT || process.env.AI_REQUEST_TIMEOUT || "15000",
    10
  );

  const maxOutputTokens = parseInt(
    cfEnv?.AI_MAX_OUTPUT_TOKENS || process.env.AI_MAX_OUTPUT_TOKENS || "600",
    10
  );

  const temperature = parseFloat(
    cfEnv?.AI_TEMPERATURE || process.env.AI_TEMPERATURE || "0.4"
  );

  return {
    provider,
    apiKey,
    model,
    baseUrl,
    requestTimeoutMs: Math.max(5000, Math.min(requestTimeoutMs, 30000)),
    maxOutputTokens: Math.max(100, Math.min(maxOutputTokens, 1500)),
    temperature: Math.max(0, Math.min(temperature, 1.0)),
    isAvailable: Boolean(apiKey && apiKey.trim().length > 0),
  };
}

