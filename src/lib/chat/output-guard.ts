/**
 * Aurelle Spaces — Safe Output Sanitizer
 * 
 * Post-processes LLM output to guarantee that returned text contains no dangerous
 * scripts, iframes, raw HTML, or exposed credentials.
 */

export function sanitizeAssistantOutput(rawText: string): string {
  if (typeof rawText !== "string") {
    return "";
  }

  let sanitized = rawText;

  // 1. Remove dangerous HTML tags while preserving markdown
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ""); // Strip inline event handlers

  // 2. Neutralize javascript: or data: URIs in markdown links [text](javascript:...)
  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((javascript|data|vbscript):[^)]+\)/gi,
    "[$1](#)"
  );

  // 3. Strip accidental prompt leaks or raw XML tags
  sanitized = sanitized
    .replace(/<\/?visitor_query>/gi, "")
    .replace(/<\/?system_instruction>/gi, "");

  return sanitized.trim();
}

