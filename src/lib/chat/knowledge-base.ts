/**
 * Aurelle Spaces — Approved Business Knowledge Base & Predefined FAQ Index
 * 
 * Verified studio information covering services, methodologies, demonstration concept studies,
 * material philosophy, and navigation routes.
 * 
 * Rules:
 * - Strictly aligned with authentic portfolio source data in src/lib/content/portfolio-data.ts.
 * - No invented project names, pricing rate cards, or client claims.
 * - Accurately states square footage, materiality, and regional climate considerations.
 * - Preserves transparent demonstration-project disclosures.
 * - Provides verified predefined FAQ answers for token efficiency ($0 API cost).
 */

export interface KnowledgeCategory {
  id: string;
  name: string;
  keywords: string[];
  summary: string;
  details: string[];
}

export interface PredefinedFAQ {
  id: string;
  category: string;
  matchPatterns: string[];
  answer: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
}

export const STUDIO_KNOWLEDGE_BASE: Record<string, KnowledgeCategory> = {
  studio_overview: {
    id: "studio_overview",
    name: "Aurelle Spaces Studio Identity",
    keywords: [
      "aurelle",
      "studio",
      "who are you",
      "about",
      "firm",
      "architect",
      "designer",
      "philosophy",
      "identity",
      "location",
      "cities",
      "india",
    ],
    summary:
      "Aurelle Spaces is a bespoke architecture and interior design studio crafting residential sanctuaries and thoughtful commercial workspaces across India. Demonstrated by DRK Information Software Solutions.",
    details: [
      "Design Philosophy: 'Spaces designed for the way you live.' Thoughtful planning, natural daylight, and authentic materials that patina with age.",
      "Studio Tenets: (1) Listening before designing, (2) Choreographing spaces around everyday domestic and work rituals, (3) Designing for Indian climatic realities (cross-ventilation, shaded verandas, monsoon resilience), (4) Natural materials (Deccan basalt, Kota stone, granite, seasoned teak, lime plaster, brass).",
      "Geographic Reach: The studio undertakes bespoke private commissions and studio interiors across Hyderabad, Bengaluru, Mumbai, Chennai, Pune, and Delhi NCR.",
      "Demonstration Nature: Aurelle Spaces is an architectural studio demonstration platform illustrating digital craftsmanship, spatial curation, and Cloudflare edge architecture.",
      "Navigation: /about for studio philosophy, /services for disciplines, /portfolio for projects, /process for methodology, /journal for essays, and /contact for project consultations.",
    ],
  },

  services: {
    id: "services",
    name: "Architectural & Interior Design Services",
    keywords: [
      "services",
      "residential",
      "commercial",
      "interior",
      "architecture",
      "renovation",
      "space planning",
      "villa",
      "apartment",
      "office",
      "workspace",
      "refurbishment",
      "scope",
      "disciplines",
    ],
    summary:
      "Aurelle Spaces provides four core design disciplines tailored for private homeowners, commercial founders, and adaptive heritage custodians.",
    details: [
      "1. Residential Interiors (/services/residential-interiors): Bespoke joinery, custom teak millwork, atmospheric lighting, spatial zoning, and climate-resilient material curation for villas, duplexes, and luxury residences.",
      "2. Commercial Interiors (/services/commercial-interiors): Acoustically disciplined creative studios, boutique offices, executive suites, and private chambers designed for deep focus and quiet collaboration.",
      "3. Architecture & Space Planning (/services/architecture-space-planning): Site master planning, structural envelopes, courtyard houses, passive solar shading, cross-ventilation, and seamless indoor-outdoor verandas.",
      "4. Renovation & Refurbishment (/services/renovation-refurbishment): Sensitive architectural retrofitting, structural strengthening, service modernization (MEP), and authentic material restoration for historic and mature properties.",
      "Fee Policy: Commissions are inherently bespoke. Fees are transparently structured based on built-up area, site complexity, and scope of services after reviewing your brief. No generic rate cards are used.",
    ],
  },

  process: {
    id: "process",
    name: "The Six-Stage Architectural Process",
    keywords: [
      "process",
      "steps",
      "methodology",
      "stages",
      "how do you work",
      "workflow",
      "timeline",
      "deliverables",
      "drawings",
      "supervision",
    ],
    summary:
      "A disciplined six-stage methodology ensuring spatial clarity, creative rigor, and meticulous site coordination from first conversation to handover.",
    details: [
      "Stage 01 — Initial Conversation (/process): Listening, scope definition, budget alignment, and lifestyle review. Deliverable: Agreed Project Brief (1–2 weeks).",
      "Stage 02 — Site Understanding: On-site forensic study, solar orientation, prevailing winds, structural constraints, and level assessments (1–2 weeks).",
      "Stage 03 — Conceptual Direction: Volumetric sketches, spatial flow layouts, and tactile materiality moodboards (3–4 weeks).",
      "Stage 04 — Design Development: Detailed architectural elevations, joinery details, 3D spatial models, and lighting layout drawings (4–6 weeks).",
      "Stage 05 — Technical Detailing & Sourcing: Bill of quantities (BOQs), contractor tenders, vendor curation, and technical specifications (3–4 weeks).",
      "Stage 06 — On-Site Realization & Handover: Periodic site supervision, material verification, quality snagging, and final client walkthrough.",
    ],
  },

  portfolio: {
    id: "portfolio",
    name: "Demonstration Portfolio & Concept Case Studies",
    keywords: [
      "portfolio",
      "projects",
      "case studies",
      "examples",
      "work",
      "courtyard",
      "hyderabad",
      "bengaluru",
      "pune",
      "chennai",
      "mumbai",
      "photos",
    ],
    summary:
      "A curated collection of six demonstration architectural and interior concepts illustrating spatial clarity across diverse Indian climates.",
    details: [
      "1. The Courtyard Residence, Hyderabad (/portfolio/courtyard-residence-hyderabad): 7,800 sq.ft private home organized around a central double-height monsoon courtyard, Deccan basalt plinth, seasoned teak joinery, and natural convective stack ventilation.",
      "2. The Quiet House, Bengaluru (/portfolio/quiet-house-bengaluru): 5,400 sq.ft inward-looking urban sanctuary featuring red terracotta jaali screens, polished green Kota stone flooring, acoustic decoupling (-32dB), and flush wall joinery.",
      "3. The Atelier Workspace, Pune (/portfolio/atelier-workspace-pune): 12,000 sq.ft commercial creative floor plate for 85 workstations, centered on an internal ficus atrium commons, raw architectural concrete arches, fluted glass, and dark walnut.",
      "4. The Veranda Home, Chennai (/portfolio/veranda-home-chennai): 6,600 sq.ft coastal pavilion on a 15,000 sq.ft plot, elevated 1.2m above grade, 2.4m roof cantilevers, deep wrap-around verandas (thinnai), and rough-chiseled granite.",
      "5. The Gallery Office, Mumbai (/portfolio/gallery-office-mumbai): 8,500 sq.ft high-floor executive private equity workplace at Nariman Point overlooking the Arabian Sea, with a central Jaisalmer limestone gallery spine and smoked oak paneling.",
      "6. The Renewal Apartment, Hyderabad (/portfolio/renewal-apartment-hyderabad): 3,800 sq.ft refurbishment in Banjara Hills dismantling five non-structural walls, creating an open-plan family suite with a 14-meter flush fluted ash joinery wall and Crema Marfil marble.",
      "Demonstration Disclosure: All six projects are conceptual architectural studies developed for DRK Information Software Solutions. They represent design methodologies, not completed client commissions.",
    ],
  },

  materials_and_craft: {
    id: "materials_and_craft",
    name: "Materiality, Craft & Climate Reality",
    keywords: [
      "materials",
      "craft",
      "stone",
      "timber",
      "wood",
      "teak",
      "brass",
      "kota",
      "plaster",
      "lime",
      "climate",
      "sustainability",
      "patina",
    ],
    summary:
      "Aurelle Spaces prioritizes honest, tactile materials that endure and age with dignity under Indian climatic conditions.",
    details: [
      "Stone: Honed Kota stone, Deccan basalt, Jaisalmer yellow limestone, and rough-chiseled granite plinths.",
      "Wood: Seasoned Burmese and Indian teak, American walnut, fluted ash, and smoked oak finished with breathable low-sheen oils.",
      "Plasters: Troweled lime plaster, breathable mineral slakes, and ivory textured sand finishes that regulate humidity naturally.",
      "Metals: Brushed satin brass, cast bronze, and champagne anodized aluminum that develop living patina over time.",
      "Climate Philosophy: Shaded verandas (thinnai), terracotta jaali screening, central thermal courtyards, and deep roof cantilevers minimizing mechanical cooling requirements.",
    ],
  },

  consultation: {
    id: "consultation",
    name: "Project Consultation & Inquiries",
    keywords: [
      "contact",
      "consultation",
      "enquiry",
      "discuss",
      "book",
      "appointment",
      "meeting",
      "reach out",
      "hire",
      "start",
      "cost",
      "fees",
      "pricing",
      "quote",
      "proposal",
    ],
    summary:
      "Studio consultations are arranged through the formal consultation brief on /contact.",
    details: [
      "How to Discuss a Project: Prospective clients submit their requirements via the structured consultation form on /contact.",
      "Required Information: Full name, email address, city/location, discipline (Residential, Commercial, Architecture, or Renovation), and an overview of spatial aspirations.",
      "Next Steps: Following submission, the studio principal reviews site parameters and coordinates an introductory discovery discussion.",
      "Fee Proposals: Transparent, milestone-based proposals are prepared following the initial discovery brief.",
    ],
  },
};

/**
 * Predefined Verified FAQ Index
 * When a visitor asks common questions, we serve immediate, accurate, factual answers
 * without calling external AI APIs ($0 cost, 0 latency, high reliability).
 */
export const PREDEFINED_FAQS: PredefinedFAQ[] = [
  {
    id: "faq_services",
    category: "services",
    matchPatterns: [
      "what services do you offer",
      "what services does aurelle provide",
      "what do you do",
      "what are your services",
      "list your services",
      "disciplines",
    ],
    answer:
      "Aurelle Spaces offers four integrated architectural and interior design disciplines across India:\n\n1. **Residential Interiors** — Bespoke joinery, tailored spatial flow, and atmospheric lighting for private homes.\n2. **Commercial Interiors** — Acoustically tuned, human-centred workspaces and boutique creative studios.\n3. **Architecture & Space Planning** — Climate-responsive structural envelopes, courtyard houses, and passive solar shading.\n4. **Renovation & Refurbishment** — Sensitive structural retrofitting and adaptive modernizations for mature properties.\n\nEach commission is tailored to your site and daily routines.",
    suggestedAction: {
      label: "Explore All Services",
      href: "/services",
    },
  },
  {
    id: "faq_locations",
    category: "studio",
    matchPatterns: [
      "where are you located",
      "where are your projects",
      "which cities do you work in",
      "do you work in",
      "where is your office",
      "where do you operate",
      "locations",
      "hyderabad",
      "bengaluru",
      "mumbai",
      "delhi",
    ],
    answer:
      "Aurelle Spaces undertakes residential and commercial architectural commissions across India's major metropolitan and coastal regions, including **Hyderabad, Bengaluru, Mumbai, Chennai, Pune, and Delhi NCR**.\n\nOur team conducts on-site forensic studies and collaborates closely with skilled regional craftspeople across all project locations.",
    suggestedAction: {
      label: "View Selected Projects",
      href: "/portfolio",
    },
  },
  {
    id: "faq_portfolio",
    category: "portfolio",
    matchPatterns: [
      "what projects have you designed",
      "show me your portfolio",
      "tell me about your projects",
      "what work have you done",
      "explore our projects",
      "explore projects",
      "portfolio projects",
      "list projects",
      "courtyard residence",
      "quiet house",
      "atelier workspace",
      "veranda home",
      "gallery office",
      "renewal apartment",
    ],
    answer:
      "Aurelle Spaces features six conceptual demonstration projects tailored for diverse Indian climates:\n\n1. **The Courtyard Residence** (Hyderabad) — A 7,800 sq.ft home organized around a double-height monsoon courtyard with Deccan basalt and teak millwork.\n2. **The Quiet House** (Bengaluru) — A 5,400 sq.ft inward-looking sanctuary with terracotta jaali screens and polished Kota stone.\n3. **The Atelier Workspace** (Pune) — A 12,000 sq.ft creative commercial studio framed by raw concrete arches and an internal atrium garden.\n4. **The Veranda Home** (Chennai) — A 6,600 sq.ft coastal residential pavilion with deep wrap-around verandas capturing sea breezes.\n5. **The Gallery Office** (Mumbai) — An 8,500 sq.ft executive workplace in Nariman Point with Jaisalmer limestone gallery circulation.\n6. **The Renewal Apartment** (Hyderabad) — A 3,800 sq.ft Banjara Hills refurbishment unlocking an open-plan layout with a 14-meter flush fluted ash joinery wall.\n\nYou can explore each project in depth on our Portfolio page (/portfolio).",
    suggestedAction: {
      label: "Explore All Projects",
      href: "/portfolio",
    },
  },
  {
    id: "faq_consultation",
    category: "consultation",
    matchPatterns: [
      "how do i book a consultation",
      "how to contact",
      "how to start a project",
      "can i meet an architect",
      "book appointment",
      "schedule consultation",
      "get in touch",
    ],
    answer:
      "You can arrange an architectural consultation by submitting your project details through our structured brief on the **Contact** page.\n\nWe ask for your site location, estimated timeline, preferred discipline (Residential, Commercial, Architecture, or Renovation), and a brief description of your spatial aspirations. A studio principal will review your brief and coordinate an introductory discovery meeting.",
    suggestedAction: {
      label: "Start a Consultation Brief",
      href: "/contact",
    },
  },
  {
    id: "faq_pricing",
    category: "fees",
    matchPatterns: [
      "how much does it cost",
      "what are your charges",
      "what are your fees",
      "how do you charge",
      "pricing",
      "rate card",
      "cost per square foot",
    ],
    answer:
      "Because architectural and interior commissions are inherently bespoke, Aurelle Spaces does not use generic rate cards.\n\nOur design fees are structured transparently based on your project's built-up area, site complexity, and required scope (concept planning, detailed joinery, or full turnkey site coordination). Following an initial brief review on our Contact page, we prepare a detailed milestone-based fee proposal.",
    suggestedAction: {
      label: "Discuss Your Project Budget",
      href: "/contact",
    },
  },
  {
    id: "faq_process",
    category: "process",
    matchPatterns: [
      "what is your design process",
      "how do you work",
      "what are the steps",
      "process",
      "stages",
      "methodology",
      "how long does it take",
    ],
    answer:
      "We guide every project through our structured **Six-Stage Architectural Process**:\n\n1. **Stage 01 — Initial Conversation:** Lifestyle brief and budget alignment.\n2. **Stage 02 — Site Understanding:** Orientation, natural daylight, and site forensic survey.\n3. **Stage 03 — Conceptual Direction:** Spatial flow layouts and materiality moodboards.\n4. **Stage 04 — Design Development:** Detailed 3D spatial models and architectural elevations.\n5. **Stage 05 — Technical Detailing:** BOQs, joinery drawings, and contractor specifications.\n6. **Stage 06 — Site Realization:** Periodic supervision, craftsmanship verification, and handover.",
    suggestedAction: {
      label: "Read Detailed Process",
      href: "/process",
    },
  },
  {
    id: "faq_demonstration",
    category: "disclosure",
    matchPatterns: [
      "are these real projects",
      "is this a real studio",
      "demonstration",
      "who built this website",
      "drk information",
      "are the photos real",
    ],
    answer:
      "Aurelle Spaces is a bespoke architectural and interior design demonstration platform created for **DRK Information Software Solutions**.\n\nThe featured portfolio case studies—such as *The Courtyard Residence* in Hyderabad and *The Quiet House* in Bengaluru—are meticulously developed conceptual design studies created to demonstrate spatial clarity, editorial curation, and Cloudflare edge technology.",
    suggestedAction: {
      label: "Explore Concept Studies",
      href: "/portfolio",
    },
  },
  {
    id: "faq_materials",
    category: "materials",
    matchPatterns: [
      "what materials do you use",
      "materiality",
      "teak",
      "stone",
      "lime plaster",
      "sustainable materials",
    ],
    answer:
      "Our material philosophy centers on **honest, tactile regional materials** that patina with dignity over time. We frequently specify honed Kota and basalt stone, hand-oiled Burmese and Indian teak, unlacquered satin brass, breathable lime plaster, and hand-cast terrazzo.\n\nWe deliberately avoid synthetic veneers and high-gloss laminates that deteriorate under tropical Indian sunlight.",
    suggestedAction: {
      label: "Read Our Journal on Materials",
      href: "/journal/choosing-materials-with-care",
    },
  },
];
