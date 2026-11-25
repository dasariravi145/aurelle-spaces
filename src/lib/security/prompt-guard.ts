/**
 * Aurelle Spaces — Prompt Injection Defense & Input Guard
 * 
 * Inspects incoming visitor chat messages for malicious prompt overrides, jailbreaks,
 * and dangerous payloads before passing to the LLM.
 */

export interface PromptScanResult {
  isSafe: boolean;
  sanitizedText: string;
  rejectionReason?: string;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /reveal\s+(the\s+)?(system\s+prompt|instructions|developer\s+mode)/i,
  /you\s+are\s+now\s+(DAN|unrestricted|jailbroken)/i,
  /bypass\s+all\s+(rules|guidelines|safety)/i,
  /system:\s*override/i,
  /<script[\s>]/i,
  /javascript:/i,
];

/**
 * Validates and sanitizes a visitor chat message.
 */
export function scanAndSanitizePrompt(rawInput: string): PromptScanResult {
  if (typeof rawInput !== "string") {
    return {
      isSafe: false,
      sanitizedText: "",
      rejectionReason: "Input must be a valid text string.",
    };
  }

  const trimmed = rawInput.trim();

  if (trimmed.length === 0) {
    return {
      isSafe: false,
      sanitizedText: "",
      rejectionReason: "Message cannot be empty.",
    };
  }

  if (trimmed.length > 1000) {
    return {
      isSafe: false,
      sanitizedText: trimmed.slice(0, 1000),
      rejectionReason: "Message exceeds maximum permitted length of 1,000 characters.",
    };
  }

  // Check for adversarial injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitizedText: trimmed,
        rejectionReason:
          "Message contains unsupported formatting or override directives.",
      };
    }
  }

  // Strip null bytes and non-printable control characters (except newline and tab)
  const sanitized = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();

  return {
    isSafe: true,
    sanitizedText: sanitized,
  };
}

/**
 * Wraps user input in demarcated XML tags to prevent context bleed into system instructions.
 */
export function formatUserMessageForLLM(sanitizedText: string): string {
  return `<visitor_query>\n${sanitizedText}\n</visitor_query>`;
}

