/**
 * Aurelle Spaces — Analytics & Conversion Tracking Contracts
 * 
 * Defines typed events, telemetry payloads, and conversion goals.
 * Strictly forbids PII (no names, emails, phones, or private project descriptions).
 */

export type ConversionEventName =
  | "page_view"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_failed"
  | "chatbot_opened"
  | "chatbot_conversation_started"
  | "chatbot_lead_submitted"
  | "service_cta_clicked"
  | "portfolio_enquiry_clicked";

export interface BaseEventProperties {
  path?: string;
  timestamp?: string;
  source?: string;
}

export interface ContactFormStartedProperties extends BaseEventProperties {
  initialProjectType?: string;
}

export interface ContactFormSubmittedProperties extends BaseEventProperties {
  enquiryId?: string;
  projectType: string;
  city: string;
  propertyType?: string | null;
  budgetRange?: string | null;
}

export interface ContactFormFailedProperties extends BaseEventProperties {
  errorCode?: string;
  validationFieldCount?: number;
}

export interface ChatbotOpenedProperties extends BaseEventProperties {
  triggerSource?: "launcher" | "banner" | "cta";
}

export interface ChatbotLeadSubmittedProperties extends BaseEventProperties {
  conversationId: string;
  projectType: string;
  city: string;
  referenceCode?: string;
}

export interface ServiceCtaClickedProperties extends BaseEventProperties {
  serviceSlug: string;
  serviceTitle: string;
}

export interface PortfolioEnquiryClickedProperties extends BaseEventProperties {
  projectSlug: string;
  projectTitle: string;
  category: string;
}

export type EventPropertiesMap = {
  page_view: BaseEventProperties;
  contact_form_started: ContactFormStartedProperties;
  contact_form_submitted: ContactFormSubmittedProperties;
  contact_form_failed: ContactFormFailedProperties;
  chatbot_opened: ChatbotOpenedProperties;
  chatbot_conversation_started: BaseEventProperties;
  chatbot_lead_submitted: ChatbotLeadSubmittedProperties;
  service_cta_clicked: ServiceCtaClickedProperties;
  portfolio_enquiry_clicked: PortfolioEnquiryClickedProperties;
};

