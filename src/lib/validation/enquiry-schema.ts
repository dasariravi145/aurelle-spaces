/**
 * Aurelle Spaces — Consultation Enquiry Validation Contract
 * 
 * Shared validation rules and types for project enquiries and scoping discussions.
 * Designed to be enforced both on client forms and future server-side Cloudflare Workers.
 */

export interface EnquiryFormData {
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
  privacyConsent: boolean;
}

export const projectTypeOptions = [
  "Residential Interiors",
  "Commercial Interiors",
  "Architecture & Space Planning",
  "Renovation & Refurbishment",
  "General Enquiry",
];

export const propertyTypeOptions = [
  "Independent Villa / Bungalow",
  "Apartment / Duplex / Penthouse",
  "Commercial Office / Studio",
  "Greenfield Plot / Farmhouse",
  "Other Spatial Typology",
];

export const budgetRangeOptions = [
  "Under ₹25 Lakhs (Approx.)",
  "₹25 Lakhs – ₹50 Lakhs (Approx.)",
  "₹50 Lakhs – ₹1 Crore (Approx.)",
  "₹1 Crore – ₹2.5 Crores (Approx.)",
  "Above ₹2.5 Crores (Approx.)",
  "To be Determined during Scoping",
];

export const timelineOptions = [
  "Immediate (Within 1 Month)",
  "1 to 3 Months",
  "3 to 6 Months",
  "Exploratory Planning (6+ Months)",
];

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof EnquiryFormData, string>>;
}

export const ENQUIRY_STATUS_CONFIG = {
  new: { label: "New Lead", badgeBg: "#EBF8FF", badgeText: "#2B6CB0", border: "#BEE3F8" },
  contacted: { label: "Contacted", badgeBg: "#FEFCBF", badgeText: "#B7791F", border: "#FAF089" },
  qualified: { label: "Qualified", badgeBg: "#E6FFFA", badgeText: "#285E61", border: "#B2F5EA" },
  consultation_scheduled: { label: "Consultation Scheduled", badgeBg: "#FAF5FF", badgeText: "#6B46C1", border: "#E9D8FD" },
  proposal_sent: { label: "Proposal Sent", badgeBg: "#EDFDFD", badgeText: "#234E52", border: "#C4F1F9" },
  won: { label: "Commission Won", badgeBg: "#F0FFF4", badgeText: "#22543D", border: "#C6F6D5" },
  lost: { label: "Lost / Closed", badgeBg: "#FFF5F5", badgeText: "#9B2C2C", border: "#FED7D7" },
  reviewed: { label: "Reviewed", badgeBg: "#F7FAFC", badgeText: "#4A5568", border: "#E2E8F0" },
  in_progress: { label: "In Progress", badgeBg: "#EDF2F7", badgeText: "#2D3748", border: "#CBD5E0" },
  closed: { label: "Closed", badgeBg: "#EDF2F7", badgeText: "#4A5568", border: "#E2E8F0" },
  archived: { label: "Archived", badgeBg: "#EDF2F7", badgeText: "#718096", border: "#CBD5E0" },
} as const;

export interface ServerEnquiryValidationResult {
  isValid: boolean;
  isSpam: boolean;
  errors: Record<string, string>;
  data?: {
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
    privacyConsent: boolean;
    idempotencyKey?: string;
  };
}

/**
 * Validates consultation form fields on the server with strict length limits,
 * email normalization, and honeypot detection.
 */
export function validateServerEnquiry(body: unknown): ServerEnquiryValidationResult {
  if (!body || typeof body !== "object") {
    return {
      isValid: false,
      isSpam: false,
      errors: { form: "Invalid request payload." },
    };
  }

  const b = body as Record<string, unknown>;

  // Honeypot check: If hidden field is filled, silently classify as spam
  if (b.websiteUrl || b._hp || b.studioRole) {
    return {
      isValid: false,
      isSpam: true,
      errors: {},
    };
  }

  const errors: Record<string, string> = {};

  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  if (!fullName || fullName.length < 2) {
    errors.fullName = "Please enter your full name (minimum 2 characters).";
  } else if (fullName.length > 100) {
    errors.fullName = "Full name cannot exceed 100 characters.";
  }

  const email = typeof b.email === "string" ? b.email.toLowerCase().trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 150) {
    errors.email = "Email cannot exceed 150 characters.";
  }

  const mobileNumber = typeof b.mobileNumber === "string" ? b.mobileNumber.trim() : undefined;
  if (mobileNumber && mobileNumber.length > 0) {
    const phoneRegex = /^[0-9+\s()-]{7,25}$/;
    if (!phoneRegex.test(mobileNumber)) {
      errors.mobileNumber = "Please enter a valid contact phone number (7-25 digits).";
    }
  }

  const city = typeof b.city === "string" ? b.city.trim() : "";
  if (!city || city.length < 2) {
    errors.city = "Please specify your project city or location.";
  } else if (city.length > 80) {
    errors.city = "City name cannot exceed 80 characters.";
  }

  const projectType = typeof b.projectType === "string" ? b.projectType.trim() : "";
  if (!projectType) {
    errors.projectType = "Please select a design discipline.";
  }

  const propertyType = typeof b.propertyType === "string" && b.propertyType.trim().length > 0
    ? b.propertyType.trim().substring(0, 100)
    : undefined;

  const approximateArea = typeof b.approximateArea === "string" && b.approximateArea.trim().length > 0
    ? b.approximateArea.trim().substring(0, 50)
    : undefined;

  const budgetRange = typeof b.budgetRange === "string" && b.budgetRange.trim().length > 0
    ? b.budgetRange.trim().substring(0, 80)
    : undefined;

  const expectedTimeline = typeof b.expectedTimeline === "string" && b.expectedTimeline.trim().length > 0
    ? b.expectedTimeline.trim().substring(0, 80)
    : undefined;

  const projectDescription = typeof b.projectDescription === "string" ? b.projectDescription.trim() : "";
  if (!projectDescription || projectDescription.length < 10) {
    errors.projectDescription = "Please provide brief notes on your spatial requirements (minimum 10 characters).";
  } else if (projectDescription.length > 3000) {
    errors.projectDescription = "Project description cannot exceed 3000 characters.";
  }

  const privacyConsent = Boolean(b.privacyConsent);
  if (!privacyConsent) {
    errors.privacyConsent = "Consent to data processing is required to initiate consultation.";
  }

  const idempotencyKey = typeof b.idempotencyKey === "string" && b.idempotencyKey.trim().length > 0
    ? b.idempotencyKey.trim().substring(0, 64)
    : undefined;

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    isSpam: false,
    errors,
    data: isValid
      ? {
          fullName,
          email,
          mobileNumber,
          city,
          projectType,
          propertyType,
          approximateArea,
          budgetRange,
          expectedTimeline,
          projectDescription,
          privacyConsent,
          idempotencyKey,
        }
      : undefined,
  };
}

/**
 * Validates consultation form fields against essential studio criteria.
 */
export function validateEnquiryForm(data: Partial<EnquiryFormData>): ValidationResult {
  const errors: Partial<Record<keyof EnquiryFormData, string>> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = "Please provide your full contact name (at least 2 characters).";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  if (data.mobileNumber && data.mobileNumber.trim().length > 0) {
    // Optional phone validation: basic check for 10 digits
    const cleaned = data.mobileNumber.replace(/[\s\-\+\(\)]/g, "");
    if (cleaned.length < 10) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = "Please specify the project location or city.";
  }

  if (!data.projectType || data.projectType.trim().length === 0) {
    errors.projectType = "Please select a relevant project type.";
  }

  if (!data.projectDescription || data.projectDescription.trim().length < 15) {
    errors.projectDescription =
      "Please provide a brief description of your space and requirements (minimum 15 characters).";
  }

  if (!data.privacyConsent) {
    errors.privacyConsent = "You must acknowledge and consent to our demonstration privacy terms.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

