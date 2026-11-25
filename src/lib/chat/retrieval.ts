/**
 * Aurelle Spaces — Lightweight Knowledge & FAQ Retrieval Engine
 * 
 * Provides:
 * 1. Zero-cost Predefined FAQ matching for instant verified responses.
 * 2. Token-efficient keyword & intent RAG context builder (max 3 categories, strict token budget).
 * 3. Fallback knowledge synthesizer when AI APIs are unavailable.
 */

import {
  STUDIO_KNOWLEDGE_BASE,
  PREDEFINED_FAQS,
  KnowledgeCategory,
  PredefinedFAQ,
} from "./knowledge-base";

export interface RetrievedContext {
  categories: KnowledgeCategory[];
  formattedContext: string;
  matchedFAQ: PredefinedFAQ | null;
}

/**
 * Normalizes text for matching: lowercases, removes punctuation, collapses whitespace.
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Attempts to match the query to a verified predefined FAQ.
 * Returns null if no strong intent match is found.
 */
export function findPredefinedFAQ(query: string): PredefinedFAQ | null {
  if (!query) return null;
  const clean = normalizeQuery(query);

  for (const faq of PREDEFINED_FAQS) {
    for (const pattern of faq.matchPatterns) {
      const cleanPattern = normalizeQuery(pattern);
      if (clean.includes(cleanPattern) || cleanPattern.includes(clean)) {
        return faq;
      }
    }
  }

  return null;
}

/**
 * Retrieves the most relevant knowledge categories for a given visitor query,
 * enforcing a strict context-size budget (maximum 3 categories, truncated key facts).
 */
export function retrieveRelevantKnowledge(
  query: string,
  maxCategories: number = 3
): RetrievedContext {
  const clean = normalizeQuery(query);
  const words = clean.split(/\s+/).filter((w) => w.length > 2);

  // Check for direct FAQ match first
  const matchedFAQ = findPredefinedFAQ(query);

  const scoredCategories = Object.values(STUDIO_KNOWLEDGE_BASE).map((cat) => {
    let score = 0;

    // Keyword matching
    for (const kw of cat.keywords) {
      const cleanKw = normalizeQuery(kw);
      if (clean.includes(cleanKw)) {
        score += 4;
      }
      for (const w of words) {
        if (cleanKw.includes(w)) {
          score += 1;
        }
      }
    }

    // Direct name match
    if (clean.includes(normalizeQuery(cat.name))) {
      score += 5;
    }

    return { category: cat, score };
  });

  // Sort descending by score
  scoredCategories.sort((a, b) => b.score - a.score);

  // Take top categories with score > 0
  let selected = scoredCategories
    .filter((sc) => sc.score > 0)
    .slice(0, maxCategories)
    .map((sc) => sc.category);

  // Fallback if no strong match
  if (selected.length === 0) {
    selected = [
      STUDIO_KNOWLEDGE_BASE.studio_overview,
      STUDIO_KNOWLEDGE_BASE.services,
      STUDIO_KNOWLEDGE_BASE.consultation,
    ];
  }

  // Format into a concise, token-efficient markdown context block
  const formattedLines: string[] = [
    "### APPROVED STUDIO KNOWLEDGE CONTEXT (AURELLE SPACES):",
  ];

  for (const cat of selected) {
    formattedLines.push(`\n#### ${cat.name}`);
    formattedLines.push(`Summary: ${cat.summary}`);
    formattedLines.push("Verified Facts:");
    // Limit to top 3 details per category to protect token budget
    for (const d of cat.details.slice(0, 3)) {
      formattedLines.push(`- ${d}`);
    }
  }

  return {
    categories: selected,
    formattedContext: formattedLines.join("\n"),
    matchedFAQ,
  };
}

/**
 * Synthesizes a helpful, factual response directly from the retrieved knowledge
 * when external AI providers (Gemini) are unconfigured or unavailable.
 */
export function synthesizeFallbackResponse(
  query: string,
  retrieved: RetrievedContext
): string {
  // If a direct FAQ was matched, return it
  if (retrieved.matchedFAQ) {
    return retrieved.matchedFAQ.answer;
  }

  // Otherwise, construct a calm, concise answer from the top matched category
  const primary = retrieved.categories[0] || STUDIO_KNOWLEDGE_BASE.studio_overview;

  const keyPoints = primary.details.slice(0, 2).map((d) => `• ${d}`).join("\n");

  return `${primary.summary}\n\nKey Studio Details:\n${keyPoints}\n\nWould you like to explore our portfolio concepts (/portfolio) or submit an architectural consultation brief (/contact)?`;
}
