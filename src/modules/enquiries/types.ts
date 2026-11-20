/**
 * Enquiries & Consultation Module Contracts
 * Manages project enquiries, consultation bookings, and client briefs.
 */

export type EnquiryStatus = "pending" | "reviewed" | "scheduled" | "archived";

export interface ProjectEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  approximateArea?: string;
  budgetRange?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

