/**
 * Aurelle Spaces — Browser Voice Assistant Service & Hook
 * 
 * Provides zero-cost, browser-native SpeechSynthesis and SpeechRecognition.
 * Strictly respects user privacy:
 * - No audio autoplay without explicit user gesture
 * - No microphone activation on page load
 * - No raw audio recorded or sent to backend
 * - Intelligent English male voice detection with fallback and manual voice selector
 */

export interface VoiceOption {
  voiceURI: string;
  name: string;
  lang: string;
  isMaleLikely: boolean;
  default: boolean;
}

/**
 * Heuristic detector for natural-sounding male voices across browsers (Chrome, Edge, Safari, Firefox).
 * Looks for explicit voice metadata or known natural male voice descriptors.
 */
export function isLikelyMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  const uri = voice.voiceURI.toLowerCase();

  // Explicit male indicator in voice name
  if (name.includes("male") || uri.includes("male")) {
    return true;
  }

  // Known natural male voices across Windows, macOS, Android, and Chromium
  const knownMaleIdentifiers = [
    "david",
    "ravi",
    "george",
    "daniel",
    "guy",
    "james",
    "oliver",
    "arthur",
    "rishi",
    "neel",
    "alex",
    "fred",
    "alva",
    "microsoft ravi",
    "microsoft david",
    "microsoft mark",
    "microsoft george",
    "google uk english male",
    "google us english male",
    "en-in-standard-b",
    "en-in-wavenet-b",
  ];

  return knownMaleIdentifiers.some(
    (id) => name.includes(id) || uri.includes(id)
  );
}

/**
 * Filter and sort available voices, prioritizing en-IN male voices,
 * then other natural English male voices, then general English voices.
 */
export function getPrioritizedEnglishVoices(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice[] {
  // Only English voices
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (englishVoices.length === 0) return voices;

  return [...englishVoices].sort((a, b) => {
    const aIsIndian = a.lang.toLowerCase() === "en-in";
    const bIsIndian = b.lang.toLowerCase() === "en-in";
    const aIsMale = isLikelyMaleVoice(a);
    const bIsMale = isLikelyMaleVoice(b);

    // Prioritize Indian English male voices
    if (aIsIndian && aIsMale && (!bIsIndian || !bIsMale)) return -1;
    if (bIsIndian && bIsMale && (!aIsIndian || !aIsMale)) return 1;

    // Next prioritize any English male voice
    if (aIsMale && !bIsMale) return -1;
    if (bIsMale && !aIsMale) return 1;

    // Next prioritize Indian English
    if (aIsIndian && !bIsIndian) return -1;
    if (bIsIndian && !aIsIndian) return 1;

    return a.name.localeCompare(b.name);
  });
}

/**
 * Select the optimal default voice: prefers Indian English male, then general English male.
 */
export function selectDefaultMaleVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const prioritized = getPrioritizedEnglishVoices(voices);
  if (prioritized.length === 0) return null;

  // Find first confirmed/likely male English voice
  const maleVoice = prioritized.find((v) => isLikelyMaleVoice(v));
  if (maleVoice) return maleVoice;

  // Fallback to first available English voice
  return prioritized[0];
}

/**
 * Safe text cleaner for SpeechSynthesis. Strips markdown asterisks, URLs, and code blocks
 * to produce calm, natural conversational speech.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Remove markdown links [Label](url) -> Label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove bare URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold / italics
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    // Remove list bullets
    .replace(/^\s*[-*•]\s+/gm, "")
    // Remove numbered lists "1. "
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove markdown blockquotes
    .replace(/^\s*>\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]+>/g, "")
    // Normalize repeated whitespace
    .replace(/\s+/g, " ")
    .trim();
}

