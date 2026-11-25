/**
 * Aurelle Spaces — Lead Intent Detection & Progressive Extraction
 * 
 * Accurately detects project discussion intent, extracts structured scoping fields,
 * and tracks the conversational qualification lifecycle without forcing every visitor into sales capture.
 */

import { ChatLeadState, LeadQualificationStage } from "./types";

export interface IntentDetectionResult {
  hasLeadIntent: boolean;
  suggestedDiscipline?: string;
  confidence: "high" | "medium" | "none";
}

const LEAD_INTENT_PATTERNS = [
  /(?:i\s+(?:want|need|would\s+like|wish)\s+to\s+(?:design|build|renovate|plan|discuss|create))/i,
  /(?:planning\s+(?:a|an|my|our)\s+(?:home|residence|villa|apartment|house|office|workspace|interior|renovation))/i,
  /(?:can\s+you\s+(?:help\s+with|take\s+up|design)\s+(?:my|our)?\s*(?:home|villa|flat|office|space|renovation|project))/i,
  /(?:how\s+(?:can|do)\s+i\s+(?:discuss|start|initiate|book|schedule)\s+(?:a\s+)?(?:project|consultation|brief))/i,
  /(?:looking\s+for\s+(?:an\s+)?architect|interior\s+designer|design\s+team)/i,
  /(?:we\s+are\s+(?:constructing|building|buying|renovating)\s+(?:a|an)\s+)/i,
  /(?:cost\s+to\s+design|fees\s+for\s+designing|how\s+much\s+would\s+it\s+cost\s+to\s+design)/i,
];

const GENERAL_INFO_PATTERNS = [
  /what\s+is\s+your\s+(?:design\s+)?philosophy/i,
  /where\s+is\s+the\s+(?:quiet\s+house|courtyard\s+residence|atelier)/i,
  /tell\s+me\s+about\s+(?:your\s+)?(?:materials|firm|team)/i,
  /who\s+founded\s+aurelle/i,
];

/**
 * Detects whether the visitor's message conveys genuine project intent.
 */
export function detectLeadIntent(
  message: string,
  currentStage: LeadQualificationStage
): IntentDetectionResult {
  // If already in qualification flow, continue
  if (currentStage !== "not_started" && currentStage !== "declined" && currentStage !== "submitted") {
    return { hasLeadIntent: true, confidence: "high" };
  }

  // Check for general informational query suppression
  for (const infoPattern of GENERAL_INFO_PATTERNS) {
    if (infoPattern.test(message)) {
      return { hasLeadIntent: false, confidence: "none" };
    }
  }

  // Evaluate lead intent patterns
  for (const pattern of LEAD_INTENT_PATTERNS) {
    if (pattern.test(message)) {
      let suggestedDiscipline = "Residential Interiors";
      if (/(?:commercial|office|workspace|studio|retail|workplace)/i.test(message)) {
        suggestedDiscipline = "Commercial Interiors";
      } else if (/(?:architecture|new\s+build|ground\s+up|construction|elevation|space\s+planning)/i.test(message)) {
        suggestedDiscipline = "Architecture & Space Planning";
      } else if (/(?:renovate|renovation|refurbish|remodel|restoration)/i.test(message)) {
        suggestedDiscipline = "Renovation & Refurbishment";
      }

      return {
        hasLeadIntent: true,
        suggestedDiscipline,
        confidence: "high",
      };
    }
  }

  return { hasLeadIntent: false, confidence: "none" };
}

/**
 * Common Indian metropolitan and regional architectural markets.
 */
const INDIAN_CITIES = [
  "Bengaluru",
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Pune",
  "Delhi",
  "New Delhi",
  "Gurugram",
  "Gurgaon",
  "Noida",
  "Kolkata",
  "Chennai",
  "Goa",
  "Alibaug",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Chandigarh",
  "Coimbatore",
  "Mysuru",
  "Mysore",
];

/**
 * Extracts structured spatial and contact parameters from visitor dialogue.
 */
export function extractLeadInformation(
  message: string,
  existingState: Partial<ChatLeadState> = {}
): Partial<ChatLeadState> {
  const extracted: Partial<ChatLeadState> = {};

  // 1. Extract Email Address
  const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch && !existingState.email) {
    extracted.email = emailMatch[0].toLowerCase().trim();
  }

  // 2. Extract Phone Number (Indian mobile formats: +91..., 10 digits starting with 6-9)
  const phoneMatch = message.match(/(?:(?:\+?91[\s-]?)?[6-9]\d{9})\b/);
  if (phoneMatch && !existingState.mobileNumber) {
    extracted.mobileNumber = phoneMatch[0].trim();
  }

  // 3. Extract Full Name (e.g., "My name is Priya Sharma", "I am Arjun Rao", "This is Rahul")
  const nameMatch = message.match(/(?:my\s+name\s+is|i\s+am|this\s+is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1] && !existingState.fullName) {
    extracted.fullName = nameMatch[1].trim();
  }

  // 4. Extract City / Location
  for (const city of INDIAN_CITIES) {
    const cityRegex = new RegExp(`\\b${city}\\b`, "i");
    if (cityRegex.test(message) && !existingState.city) {
      // Normalize Bangalore -> Bengaluru, Gurgaon -> Gurugram
      let normalized = city;
      if (/bangalore/i.test(city)) normalized = "Bengaluru";
      if (/gurgaon/i.test(city)) normalized = "Gurugram";
      if (/mysore/i.test(city)) normalized = "Mysuru";
      extracted.city = normalized;
      break;
    }
  }

  // 5. Extract Project Type / Discipline
  if (!existingState.projectType) {
    if (/(?:commercial|office|workspace|studio|retail)/i.test(message)) {
      extracted.projectType = "Commercial Interiors";
    } else if (/(?:architecture|new\s+build|construction|elevation|structure)/i.test(message)) {
      extracted.projectType = "Architecture & Space Planning";
    } else if (/(?:renovat|refurbish|remodel|restor)/i.test(message)) {
      extracted.projectType = "Renovation & Refurbishment";
    } else if (/(?:residential|home|villa|apartment|house|flat|duplex|penthouse)/i.test(message)) {
      extracted.projectType = "Residential Interiors";
    }
  }

  // 6. Extract Property Typology
  if (!existingState.propertyType) {
    if (/(?:villa|bungalow|independent\s+house)/i.test(message)) {
      extracted.propertyType = "Independent Villa / Bungalow";
    } else if (/(?:apartment|flat|duplex|penthouse)/i.test(message)) {
      extracted.propertyType = "Apartment / Duplex / Penthouse";
    } else if (/(?:office|workplace|commercial\s+space)/i.test(message)) {
      extracted.propertyType = "Commercial Office / Studio";
    } else if (/(?:plot|land|farmhouse|greenfield)/i.test(message)) {
      extracted.propertyType = "Greenfield Plot / Farmhouse";
    }
  }

  // 7. Extract Approximate Area
  const areaMatch = message.match(/(\d[\d,\.]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sft)/i);
  if (areaMatch && !existingState.approximateArea) {
    extracted.approximateArea = `${areaMatch[1].replace(/,/g, "")} sq.ft`;
  }

  // 8. Extract Budget mentions
  if (!existingState.budgetRange) {
    if (/(?:under\s*25|below\s*25)\s*(?:l|lac|lakh)/i.test(message)) {
      extracted.budgetRange = "Under ₹25 Lakhs (Approx.)";
    } else if (/(?:25\s*(?:to|-)\s*50)\s*(?:l|lac|lakh)/i.test(message)) {
      extracted.budgetRange = "₹25 Lakhs – ₹50 Lakhs (Approx.)";
    } else if (/(?:50\s*(?:l|lac|lakh)\s*(?:to|-)\s*1\s*(?:cr|crore))/i.test(message)) {
      extracted.budgetRange = "₹50 Lakhs – ₹1 Crore (Approx.)";
    } else if (/(?:1\s*(?:to|-)\s*2\.?5)\s*(?:cr|crore)/i.test(message)) {
      extracted.budgetRange = "₹1 Crore – ₹2.5 Crores (Approx.)";
    } else if (/(?:above|more\s*than|over)\s*(?:2\.?5)?\s*(?:cr|crore)/i.test(message)) {
      extracted.budgetRange = "Above ₹2.5 Crores (Approx.)";
    }
  }

  // 9. Extract Timeline mentions
  if (!existingState.expectedTimeline) {
    if (/(?:immediate|asap|within\s*a?\s*month|this\s*month)/i.test(message)) {
      extracted.expectedTimeline = "Immediate (Within 1 Month)";
    } else if (/(?:1\s*(?:to|-)\s*3\s*months?|next\s*(?:couple\s+of\s+)?months?)/i.test(message)) {
      extracted.expectedTimeline = "1 to 3 Months";
    } else if (/(?:3\s*(?:to|-)\s*6\s*months?)/i.test(message)) {
      extracted.expectedTimeline = "3 to 6 Months";
    } else if (/(?:6\+?\s*months?|later|exploring|not\s*rushed)/i.test(message)) {
      extracted.expectedTimeline = "Exploratory Planning (6+ Months)";
    }
  }

  return extracted;
}

/**
 * Computes the recommended qualification stage progression.
 */
export function computeNextLeadStage(
  currentStage: LeadQualificationStage,
  lead: Partial<ChatLeadState>
): LeadQualificationStage {
  if (currentStage === "submitted" || currentStage === "declined") {
    return currentStage;
  }

  const hasBasics = Boolean(lead.projectType || lead.city);
  const hasContact = Boolean(lead.fullName && lead.email);

  if (hasContact && hasBasics) {
    return "consent_review";
  }

  if (hasBasics) {
    return "contact_details";
  }

  return "discovering";
}

