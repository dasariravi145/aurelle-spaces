/**
 * Aurelle Spaces — Studio Chatbot & Conversational Experience Types
 * 
 * Defines typed contracts for the studio assistant interface, local state,
 * future API endpoints (POST /api/chat/message), and future lead qualification (Prompt 13).
 */

export type ChatMessageRole = "user" | "assistant" | "system";

export type ChatMessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  status?: ChatMessageStatus;
  error?: string;
  /**
   * Optional custom action or payload (e.g., suggested starter, lead card link)
   */
  actionType?: "contact_link" | "services_link" | "lead_form";
}

export interface ChatStarter {
  id: string;
  label: string;
  query: string;
  category?: "services" | "process" | "residential" | "consultation";
}

export type ChatFlowStatus = "idle" | "sending" | "typing" | "error";

export interface ConversationState {
  id: string;
  messages: ChatMessage[];
  status: ChatFlowStatus;
  error: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  backendAvailable: boolean;
}

/**
 * Contract for POST /api/chat/message (Implemented in Prompt 12)
 */
export interface ChatMessageRequest {
  conversationId?: string;
  message: string;
  safeContext?: {
    pageUrl?: string;
    discipline?: string;
    timestamp?: string;
  };
}

/**
 * Expected Response from POST /api/chat/message (Implemented in Prompt 12)
 */
export interface ChatMessageResponse {
  success: boolean;
  conversationId: string;
  messageId: string;
  message?: string;
  error?: string;
  timestamp: string;
  leadState?: ChatLeadState;
}

/**
 * Lead Qualification Stages (Prompt 13)
 */
export type LeadQualificationStage =
  | "not_started"
  | "discovering"
  | "specifying"
  | "contact_details"
  | "consent_review"
  | "submitted"
  | "declined";

/**
 * Structured Lead Qualification State Model (Prompt 13)
 */
export interface ChatLeadState {
  stage: LeadQualificationStage;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  city?: string;
  projectType?: string;
  propertyType?: string;
  approximateArea?: string;
  budgetRange?: string;
  expectedTimeline?: string;
  projectDescription?: string;
  consentGiven?: boolean;
  consentTimestamp?: string;
  linkedEnquiryId?: string;
  referenceCode?: string;
  submittedAt?: string;
}

/**
 * Request contract for POST /api/chat/enquiry (Prompt 13)
 */
export interface CreateChatEnquiryRequest {
  conversationId: string;
  leadData: {
    fullName: string;
    email: string;
    mobileNumber?: string;
    city: string;
    projectType: string;
    propertyType?: string;
    approximateArea?: string;
    budgetRange?: string;
    expectedTimeline?: string;
    projectDescription: string;
  };
  consentGiven: boolean;
  idempotencyKey?: string;
}

/**
 * Response contract for POST /api/chat/enquiry (Prompt 13)
 */
export interface CreateChatEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  referenceCode?: string;
  message: string;
  error?: string;
  details?: Record<string, string>;
}

/**
 * Legacy interface retained for compatibility
 */
export interface ChatLeadQualificationData {
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  projectType: "architecture" | "interior" | "turnkey" | "consultation";
  approximateBudget?: string;
  timeline?: string;
  consentGiven: boolean;
  notes?: string;
}
