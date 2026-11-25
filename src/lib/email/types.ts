/**
 * Aurelle Spaces — Email Abstraction & Delivery Contracts
 */

export type EmailProviderType = "resend" | "smtp" | "webhook" | "unconfigured";

export interface SendEmailOptions {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
}

export interface EmailDeliveryResult {
  success: boolean;
  configured: boolean;
  provider: EmailProviderType;
  messageId?: string;
  error?: string;
  statusCode?: number;
  attemptedAt: string;
}

export interface EmailProviderConfig {
  provider: EmailProviderType;
  apiKey: string | null;
  fromAddress: string;
  studioContactEmail: string;
  isConfigured: boolean;
}

