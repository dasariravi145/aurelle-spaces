/**
 * Aurelle Spaces — Homepage Centralized Demonstration Data
 * 
 * Separates editorial copy and demonstration portfolio records from presentation components.
 * Structured for future mapping to Cloudflare D1 database records.
 */

import { portfolioProjects } from "./portfolio-data";

export interface NavLink {
  label: string;
  href: string;
}

export const navigationLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export interface DemonstrationProject {
  id: string;
  slug: string;
  title: string;
  city: string;
  typology: string;
  areaSqFt: string;
  year: number;
  synopsis: string;
  materiality: string;
  aspectRatio: "landscape" | "portrait" | "widescreen" | "editorial";
}

/**
 * Derived from the central portfolio-data.ts source of truth.
 */
export const selectedProjectsData: DemonstrationProject[] = [
  portfolioProjects["courtyard-residence-hyderabad"],
  portfolioProjects["quiet-house-bengaluru"],
  portfolioProjects["atelier-workspace-pune"],
].map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  city: p.city,
  typology: p.category,
  areaSqFt: p.areaSqFt,
  year: p.year,
  synopsis: p.shortDescription,
  materiality: p.materialPalette.map((m) => m.name).join(", "),
  aspectRatio: p.coverAspect,
}));

export interface ServicePreviewItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  deliverables: string[];
}

export const servicesPreviewData: ServicePreviewItem[] = [
  {
    id: "srv-01",
    slug: "residential-interiors",
    number: "01",
    title: "Residential Interiors",
    shortDescription:
      "Beautiful, functional interiors designed around your everyday routines.",
    deliverables: ["Custom cabinetry & millwork", "Natural material selection", "Spatial flow & circulation", "Layered architectural lighting"],
  },
  {
    id: "srv-02",
    slug: "commercial-interiors",
    number: "02",
    title: "Commercial Interiors",
    shortDescription:
      "Workspaces that balance identity, comfort and practical needs.",
    deliverables: ["Acoustic & collaborative zoning", "Executive suite planning", "Ergonomic daylight workstations", "Integrated technical joinery"],
  },
  {
    id: "srv-03",
    slug: "architecture-space-planning",
    number: "03",
    title: "Architecture & Space Planning",
    shortDescription:
      "Thoughtful layouts that make better use of light, space and movement.",
    deliverables: ["Solar orientation & cross-ventilation", "Volumetric massing & floor plans", "Courtyard integration", "Structural consultant liaison"],
  },
  {
    id: "srv-04",
    slug: "renovation-refurbishment",
    number: "04",
    title: "Renovation & Refurbishment",
    shortDescription:
      "Reimagining existing spaces with purpose and care.",
    deliverables: ["Adaptive structural reconfiguration", "Architectural restoration", "Services & MEP modernising", "Phased turnkey execution"],
  },
];

export interface ProcessStep {
  step: string;
  name: string;
  description: string;
  deliverable: string;
}

export const processStepsData: ProcessStep[] = [
  {
    step: "01",
    name: "Discover",
    description:
      "We begin by understanding how you live, your daily routines, and the natural orientation of your site.",
    deliverable: "Project Brief & Feasibility Framework",
  },
  {
    step: "02",
    name: "Plan",
    description:
      "We test circulation paths, ceiling volumes, and natural light to establish clear spatial harmony.",
    deliverable: "Spatial Floor Plans & Circulation Strategy",
  },
  {
    step: "03",
    name: "Design",
    description:
      "We develop 3D spatial models pairing natural daylighting with bespoke joinery and authentic materials.",
    deliverable: "3D Visual Concepts & Finishes Schedule",
  },
  {
    step: "04",
    name: "Refine",
    description:
      "We draft exact construction specifications: custom millwork, plumbing shafts, and stone cutting schedules.",
    deliverable: "Complete Good-for-Construction Drawing Package",
  },
  {
    step: "05",
    name: "Coordinate",
    description:
      "We supervise on-site execution with specialist carpenters, masons, and contractors to ensure precision.",
    deliverable: "Site Quality Audits & Artisan Coordination",
  },
  {
    step: "06",
    name: "Complete",
    description:
      "We conduct rigorous snagging, style key focal areas, and deliver a space ready for living.",
    deliverable: "Final Quality Handover & Documentation",
  },
];
