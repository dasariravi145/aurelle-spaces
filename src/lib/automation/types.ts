/**
 * Automation & n8n Integration Contracts
 */

export interface LeadWebhookPayload {
  source: "web_enquiry" | "consultation_request" | "assistant_lead";
  timestamp: string;
  enquiryId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  city: string;
  projectType: string;
  message: string;
}

export interface AutomationResult {
  success: boolean;
  webhookStatus?: number;
  messageId?: string;
  error?: string;
}

