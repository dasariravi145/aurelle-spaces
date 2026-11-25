/**
 * Aurelle Spaces — About Studio Centralized Demonstration Data
 * 
 * Defines studio narrative, design approach, design values, and conceptual team presentation.
 * Adheres to natural Indian business English without unverified claims.
 */

export interface DesignValue {
  number: string;
  title: string;
  shortDescription: string;
  extendedNarrative: string;
}

export interface TeamMember {
  role: string;
  focus: string;
  discipline: string;
  demonstrationNote: string;
}

export const aboutData = {
  hero: {
    eyebrow: "About Aurelle Spaces",
    headline: "Thoughtful spaces. Considered details.",
    introduction:
      "At Aurelle Spaces, we approach every space with a simple belief: good design should make everyday life more comfortable, practical and meaningful.",
    subtext:
      "We are an architecture and interior design studio crafting private residences, workplaces, and bespoke spatial environments across India. We believe in attentive listening, thorough planning, and building spaces that age with grace and dignity.",
  },
  approachTenets: [
    {
      title: "Listening Before Designing",
      description:
        "Every project begins with attentive dialogue. We seek to understand how you live, your family habits, your work requirements, and how you wish to feel inside your space before drafting a single wall.",
    },
    {
      title: "Planning Around People",
      description:
        "Architecture must support human daily rituals. We organize circulation paths, natural daylighting, and storage to bring quiet ease to daily life rather than forcing residents to adapt to rigid forms.",
    },
    {
      title: "Balancing Aesthetics & Practicality",
      description:
        "A space must function flawlessly through summer heat, monsoon humidity, and lively family gatherings. We evaluate every detail through the lens of durability, maintenance ease, and clean proportion.",
    },
    {
      title: "Choosing Materials with Care",
      description:
        "We source regional natural stones, seasoned solid timber, cast brass, and breathable lime plasters that feel honest to the touch and develop a richer character over decades of everyday use.",
    },
    {
      title: "Attention to Execution Details",
      description:
        "Design is realized on site. We prepare exhaustive Good-for-Construction technical drawings, inspect joinery junctions, coordinate with artisans, and verify that built execution honors the agreed vision.",
    },
  ],
  designValues: [
    {
      number: "01",
      title: "Clarity",
      shortDescription: "Clear thinking, legible plans, and straightforward communication.",
      extendedNarrative:
        "We eliminate visual noise and unnecessary complexity. Our drawings, cost discussions, and spatial plans are presented with transparent honesty so you remain fully confident at every project milestone.",
    },
    {
      number: "02",
      title: "Craftsmanship",
      shortDescription: "Honoring skilled hands, regional materials, and meticulous joinery.",
      extendedNarrative:
        "We work closely with regional stone carvers, master carpenters, and metal fabricators across India. Handcrafted elements bring warmth, soul, and tactile delight that mass-manufactured materials cannot reproduce.",
    },
    {
      number: "03",
      title: "Functionality",
      shortDescription: "Spaces that genuinely work for daily living and working rituals.",
      extendedNarrative:
        "True architectural beauty never compromises utility. From ergonomic kitchen counter clearances to acoustic quiet in bedrooms, functional comfort remains the bedrock of our design practice.",
    },
    {
      number: "04",
      title: "Lasting Relevance",
      shortDescription: "Timeless proportions that endure long after temporary design trends fade.",
      extendedNarrative:
        "We avoid fleeting decorative fads. By rooting our work in timeless classical geometry, passive climatic ventilation, and durable materiality, our projects remain proud family homes for generations.",
    },
  ] as DesignValue[],
  teamLeadership: [
    {
      role: "Studio Principal & Lead Architect",
      focus: "Spatial Planning, Volumetric Massing & Site Context",
      discipline: "Architecture & Master Planning",
      demonstrationNote: "Conceptual Leadership Profile · Demonstrating Studio Direction",
    },
    {
      role: "Lead Interior Architect",
      focus: "Bespoke Millwork, Materiality Curation & Lighting Schemes",
      discipline: "Interior Architecture & Joinery Detailing",
      demonstrationNote: "Conceptual Leadership Profile · Demonstrating Interior Design Scope",
    },
    {
      role: "Senior Project & Site Coordinator",
      focus: "Technical Drawings, Vendor Coordination & Quality Audits",
      discipline: "Site Management & Turnkey Execution",
      demonstrationNote: "Conceptual Leadership Profile · Demonstrating Execution Oversight",
    },
  ] as TeamMember[],
};
