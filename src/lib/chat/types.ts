/**
 * Conversational AI Assistant Contracts
 */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface StudioAssistantContext {
  studioName: string;
  specialization: string[];
  serviceRegions: string[];
  contactEmail: string;
}

