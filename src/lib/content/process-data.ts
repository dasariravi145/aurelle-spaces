/**
 * Aurelle Spaces — Our Process Centralized Demonstration Data
 * 
 * Defines the six disciplined stages of our architectural journey.
 * Explains scope, site understanding, design development, and handover.
 */

export interface ProcessStage {
  step: string;
  name: string;
  tagline: string;
  description: string;
  activities: string[];
  clientCheckpoint: string;
  timeframeGuidance: string;
}

export const processStagesData: ProcessStage[] = [
  {
    step: "01",
    name: "Initial Conversation",
    tagline: "Listening, Alignment & Scope Definition",
    description:
      "We begin with an open exploratory conversation to understand your spatial requirements, personal priorities, approximate budget boundaries, and intended timeline.",
    activities: [
      "Reviewing your lifestyle, family habits, or business working patterns",
      "Discussing spatial preferences, aesthetic inclinations, and must-have priorities",
      "Clarifying budget expectations and phased investment parameters",
      "Explaining the studio's engagement model and deliverables checklist",
    ],
    clientCheckpoint: "Agreed Project Brief & Studio Engagement Memorandum",
    timeframeGuidance: "1–2 Weeks · Initial Studio Consultations",
  },
  {
    step: "02",
    name: "Site Understanding",
    tagline: "Forensic Analysis & Physical Context",
    description:
      "Our architects visit the site to evaluate physical dimensions, existing structural constraints, orientation relative to sun and wind, and neighborhood context.",
    activities: [
      "Conducting accurate physical site measurements and levels assessment",
      "Analyzing solar paths, prevailing monsoon breeze directions, and ambient noise",
      "Auditing existing plumbing, electrical shafts, and structural boundaries (for renovations)",
      "Cataloguing sightlines, mature trees, and surrounding architectural influences",
    ],
    clientCheckpoint: "Comprehensive Site Diagnostics & Spatial Constraints Report",
    timeframeGuidance: "1–2 Weeks · On-site Studies",
  },
  {
    step: "03",
    name: "Concept Development",
    tagline: "Volumetric Exploration & Preliminary Layouts",
    description:
      "We translate your brief and site conditions into preliminary architectural floor plates, exploring how rooms relate, flow, and open to natural light.",
    activities: [
      "Developing multiple floor plan zoning options and circulation schemes",
      "Creating 3D volumetric massing diagrams to study ceiling heights and voids",
      "Assembling physical material mood boards (stones, timbers, metals, plasters)",
      "Presenting conceptual sketch studies for client review and discussion",
    ],
    clientCheckpoint: "Concept Presentation Review & Selection of Preferred Direction",
    timeframeGuidance: "3–4 Weeks · Iterative Studio Design",
  },
  {
    step: "04",
    name: "Design Refinement",
    tagline: "Precision Detailing & Material Finalisation",
    description:
      "We develop the selected concept with meticulous attention to detail: bespoke joinery, kitchen layouts, bathroom designs, lighting mood boards, and finishes.",
    activities: [
      "Refining millwork elevations, wardrobe internals, and custom furniture designs",
      "Drafting layered architectural lighting, electrical switchboards, and cove plans",
      "Specifying exact stone slabs, tile layouts, paint formulations, and ironmongery",
      "Developing 3D photorealistic spatial studies for key living volumes",
    ],
    clientCheckpoint: "Comprehensive Design Package Approval & Physical Material Sign-off",
    timeframeGuidance: "4–6 Weeks · Technical Detailing",
  },
  {
    step: "05",
    name: "Planning & Coordination",
    tagline: "Tender Documentation & Consultant Alignment",
    description:
      "We prepare exhaustive Good-for-Construction (GFC) drawing packages and coordinate with structural engineers, MEP consultants, and specialized contractors.",
    activities: [
      "Issuing complete architectural, interior, and electrical drawing sets",
      "Compiling Bill of Quantities (BOQ) with exact material specifications",
      "Aligning structural grids, plumbing shafts, and air-conditioning routes",
      "Assisting in contractor tender reviews, vendor queries, and milestone scheduling",
    ],
    clientCheckpoint: "Complete Good-for-Construction (GFC) Package Delivery",
    timeframeGuidance: "3–4 Weeks · Pre-construction Alignment",
  },
  {
    step: "06",
    name: "Project Handover",
    tagline: "Quality Benchmarking & Spatial Commissioning",
    description:
      "We conduct rigorous on-site quality reviews throughout execution, culminating in an orderly final inspection and handover of your completed space.",
    activities: [
      "Conducting periodic on-site inspections to verify drawing adherence",
      "Inspecting joinery alignment, stone polishing quality, and paint finishes",
      "Testing electrical circuits, sanitary fittings, and ventilation operations",
      "Compiling as-built record drawings, warranty dossiers, and care maintenance guides",
    ],
    clientCheckpoint: "Final Snag-list Clearance & Orderly Studio Handover",
    timeframeGuidance: "Execution Phase · Active Site Oversight",
  },
];
