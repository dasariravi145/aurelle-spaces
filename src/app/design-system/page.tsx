import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Divider } from "@/components/ui/divider";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProjectPlaceholder } from "@/components/ui/project-placeholder";
import { ProcessItem } from "@/components/editorial/process-item";
import { ProjectInfoBlock } from "@/components/editorial/project-info-block";
import { Quotation } from "@/components/editorial/quotation";
import { SectionTransition } from "@/components/editorial/section-transition";

export const metadata: Metadata = {
  title: "Design System Specification | Aurelle Spaces",
  description: "Internal design system specifications, tokens, and component preview for Aurelle Spaces.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  const brandColors = [
    { name: "Warm Ivory", hex: "#F7F4EF", role: "Primary Background Canvas", textDark: true },
    { name: "Deep Charcoal", hex: "#242522", role: "Primary Text & Deep Surfaces", textDark: false },
    { name: "Muted Bronze", hex: "#A17C55", role: "Brand Accent & Active Cues", textDark: false },
    { name: "Soft Stone", hex: "#DCD5CB", role: "Architectural Borders & Rules", textDark: true },
    { name: "Pure White", hex: "#FFFFFF", role: "Elevated Cards & Form Inputs", textDark: true },
    { name: "Supporting Text", hex: "#6B6C67", role: "Secondary Editorial Text", textDark: false },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#242522]">
      {/* Design System Header */}
      <header className="border-b border-[#DCD5CB] bg-[#FFFFFF] py-8">
        <Container size="wide" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#A17C55]" />
              <span className="text-[0.68rem] font-mono uppercase tracking-[0.22em] text-[#A17C55] font-semibold">
                Internal Architectural Specification
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#242522]">
              Aurelle Spaces Design System
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#6B6C67]">
            <span>Prompt 02 / P20</span>
            <span className="px-2.5 py-1 bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px]">
              No Index
            </span>
            <Link
              href="/"
              className="text-[#242522] hover:text-[#A17C55] transition-colors underline"
            >
              ← Return Home
            </Link>
          </div>
        </Container>
      </header>

      {/* 1. Brand Palette */}
      <Section spacing="md" background="primary">
        <Container size="wide">
          <SectionHeading
            eyebrow="Canonical Palette"
            title="Material & Color Philosophy"
            description="Six deliberate shades rooted in limestone, cast bronze, weathered charcoal, and soft parchment."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {brandColors.map((color) => (
              <div
                key={color.name}
                className="flex flex-col border border-[#DCD5CB] bg-[#FFFFFF] p-3 rounded-[2px]"
              >
                <div
                  className="w-full h-24 rounded-[2px] border border-black/5 flex items-end p-2 mb-3"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className={`text-[0.68rem] font-mono ${
                      color.textDark ? "text-[#242522]" : "text-[#F7F4EF]"
                    }`}
                  >
                    {color.hex}
                  </span>
                </div>
                <h3 className="font-medium text-xs text-[#242522]">{color.name}</h3>
                <p className="text-[0.68rem] text-[#6B6C67] mt-1 leading-snug">
                  {color.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <SectionTransition label="Typography Scale" />

      {/* 2. Typography Hierarchy */}
      <Section spacing="md" background="surface">
        <Container size="wide">
          <SectionHeading
            eyebrow="Editorial Typography"
            title="Serif Dignity & Sans Clarity"
            description="Cormorant Garamond brings timeless warmth to major display titles, paired with Geist Sans for clean readability."
          />

          <div className="mt-12 space-y-8 divide-y divide-[#E7E2D9]">
            <div className="pt-6">
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                Display Title (Fluid clamp 2.5rem - 4.5rem)
              </span>
              <p className="display-heading text-[#242522]">
                Spatial Clarity &amp; Indian Craftsmanship
              </p>
            </div>

            <div className="pt-6">
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                H1 Editorial (Fluid clamp 2.0rem - 3.25rem)
              </span>
              <h1 className="h1-editorial text-[#242522]">
                Form, Materiality &amp; Quiet Architecture
              </h1>
            </div>

            <div className="pt-6">
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                H2 Editorial (Fluid clamp 1.6rem - 2.5rem)
              </span>
              <h2 className="h2-editorial text-[#242522]">
                Bespoke Residential Residences &amp; Commercial Workspaces
              </h2>
            </div>

            <div className="pt-6">
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                H3 Editorial (Fluid clamp 1.35rem - 1.85rem)
              </span>
              <h3 className="h3-editorial text-[#242522]">
                Detailed Joinery, Natural Stone &amp; Courtyard Planning
              </h3>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                  Body Large (1.1rem)
                </span>
                <p className="body-large">
                  We approach each architectural commission as an enduring dialogue with its site, solar orientation, and the living habits of its inhabitants.
                </p>
              </div>
              <div>
                <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                  Body Regular (0.95rem)
                </span>
                <p className="body-regular">
                  Our studio coordinates every phase from structural feasibility and municipality approvals through bespoke interior carpentry and lighting detailing.
                </p>
              </div>
              <div>
                <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-2">
                  Eyebrow &amp; Microcopy
                </span>
                <div className="space-y-3">
                  <Eyebrow>Turnkey Architecture</Eyebrow>
                  <p className="body-small">
                    Drawing Registry Ref: AS-2026-IND · Scale: 1:50 · Revision 03
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <SectionTransition label="Interactive Primitives" />

      {/* 3. Button & Link Primitives */}
      <Section spacing="md" background="primary">
        <Container size="wide">
          <SectionHeading
            eyebrow="Interactive Elements"
            title="Buttons, Links &amp; Motion States"
            description="Restrained button weights with zero playful bounce or glowing shadows. Clear focus rings and disabled styling."
          />

          <div className="mt-10 p-8 border border-[#DCD5CB] bg-[#FFFFFF] rounded-[2px] space-y-8">
            <div>
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-4">
                Button Variants
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Schedule Consultation</Button>
                <Button variant="secondary">View Portfolio</Button>
                <Button variant="outline">Studio Overview</Button>
                <Button variant="ghost">Download Monograph</Button>
              </div>
            </div>

            <Divider variant="subtle" />

            <div>
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-4">
                States &amp; Sizes
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" variant="primary">Small Action</Button>
                <Button size="md" variant="primary">Standard Action</Button>
                <Button size="lg" variant="primary">Large Hero Action</Button>
                <Button variant="primary" isLoading>Processing Brief</Button>
                <Button variant="outline" disabled>Disabled State</Button>
              </div>
            </div>

            <Divider variant="subtle" />

            <div>
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-4">
                Directional Text Links
              </span>
              <div className="flex flex-wrap items-center gap-8">
                <TextLink href="#">Explore Residential Typologies</TextLink>
                <TextLink href="#" direction="up-right" isExternal>
                  Consultation Portal
                </TextLink>
                <TextLink href="#" direction="none">
                  Editorial Archive
                </TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <SectionTransition label="Form Controls" />

      {/* 4. Form Controls */}
      <Section spacing="md" background="surface">
        <Container size="wide">
          <SectionHeading
            eyebrow="Client Input Controls"
            title="Accessible Form Primitives"
            description="Designed for client project briefs, budget selections, and consultation scheduling."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-[#DCD5CB] bg-[#F7F4EF] rounded-[2px]">
            <FormField
              id="spec-name"
              label="Full Name"
              placeholder="e.g. Vikram Malhotra"
              helperText="Enter your official contact name"
              required
            />

            <FormField
              id="spec-email"
              type="email"
              label="Email Address"
              placeholder="vikram@enterprise.in"
              required
            />

            <Select
              id="spec-service"
              label="Service Scope"
              required
              options={[
                { value: "res-arch", label: "Residential Architecture (Villa / Duplex)" },
                { value: "luxury-int", label: "Luxury Interior Architecture" },
                { value: "commercial", label: "Commercial Studio / Workspace" },
                { value: "turnkey", label: "Turnkey Design & Execution" },
              ]}
            />

            <FormField
              id="spec-error"
              label="Estimated Project Area (Sq. Ft.)"
              defaultValue="invalid-area"
              error="Please enter a valid numeric square footage (e.g. 4500)"
              required
            />

            <div className="md:col-span-2">
              <Textarea
                id="spec-brief"
                label="Project Narrative & Scope"
                placeholder="Briefly describe your site location, family requirements, timeline, and material preferences..."
                helperText="Our lead architect reviews all client submissions within 2 business days."
                rows={4}
              />
            </div>
          </div>
        </Container>
      </Section>

      <SectionTransition label="Architectural UI Primitives" />

      {/* 5. Primitives: Breadcrumbs, Loading, Empty State */}
      <Section spacing="md" background="primary">
        <Container size="wide">
          <SectionHeading
            eyebrow="Structural Primitives"
            title="Breadcrumbs, Loaders &amp; Empty States"
            description="Supporting navigation components and responsive state indicators."
          />

          <div className="mt-10 space-y-10">
            {/* Breadcrumb Demo */}
            <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-3">
                Breadcrumb Component
              </span>
              <Breadcrumb
                items={[
                  { label: "Portfolio", href: "#" },
                  { label: "Residential", href: "#" },
                  { label: "The Gulmohar Residence, Alibaug" },
                ]}
              />
            </div>

            {/* Loading Indicator Demo */}
            <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-3">
                Architectural Linear Loading Indicator
              </span>
              <LoadingIndicator label="Retrieving high-resolution spatial drawings..." />
            </div>

            {/* Empty State Demo */}
            <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px]">
              <span className="text-xs font-mono text-[#6B6C67] uppercase tracking-widest block mb-3">
                Empty State Component
              </span>
              <EmptyState
                title="No Projects in This Category"
                description="We are curating upcoming case studies for this typology. In the interim, explore our residential archives."
                actionLabel="Explore Residential Works"
                actionHref="#"
              />
            </div>
          </div>
        </Container>
      </Section>

      <SectionTransition label="Editorial Architectural Modules" />

      {/* 6. Editorial Components */}
      <Section spacing="lg" background="surface">
        <Container size="wide">
          <SectionHeading
            eyebrow="Editorial Modules"
            title="Architectural Storytelling Patterns"
            description="Distinctive components built specifically for spatial presentation, case studies, and studio insights."
          />

          <div className="mt-12 space-y-16">
            {/* Project Info Block Demo */}
            <div>
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-4">
                Component: Project Information Block
              </span>
              <div className="max-w-md">
                <ProjectInfoBlock
                  typology="Private Residence"
                  location="Jubilee Hills, Hyderabad"
                  areaSqFt="8,400"
                  year={2025}
                  materiality="Exposed Basalt Stone, Cast Bronze, Teak"
                />
              </div>
            </div>

            <Divider variant="bronze" />

            {/* Numbered Process Item Demo */}
            <div>
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-4">
                Component: Numbered Architectural Process
              </span>
              <div className="space-y-4 max-w-3xl">
                <ProcessItem
                  stepNumber={1}
                  title="Contextual Site Analysis & Solar Mapping"
                  description="Prior to drafting plans, our partners evaluate local wind directions, microclimate humidity, sun paths, and soil conditions to optimize passive cooling."
                  deliverables={["Topographical contour study", "Passive thermal diagram", "Zoning feasibility review"]}
                />
                <ProcessItem
                  stepNumber={2}
                  title="Spatial Schematic Design & Volumetric Massing"
                  description="We explore spatial flow through physical massing models and digital sketches, balancing public entertaining areas with private sanctuaries."
                  deliverables={["3D volumetric study", "Floor plate circulation", "Material palette samples"]}
                />
              </div>
            </div>

            <Divider variant="bronze" />

            {/* Quotation Demo */}
            <div>
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-4">
                Component: Refined Quotation Treatment
              </span>
              <Quotation
                quote="True luxury in Indian architecture is not excessive embellishment; it is the generous gift of proportion, natural ventilation, and honest local materials that age gracefully over decades."
                author="Aurelle Spaces Design Manifesto"
                role="Principal Architect"
                affiliation="Foundational Principle"
              />
            </div>

            <Divider variant="bronze" />

            {/* Project Blueprint Placeholder Demo */}
            <div>
              <span className="text-xs font-mono text-[#A17C55] uppercase tracking-widest block mb-4">
                Component: Architectural Project Canvas Placeholder
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageFrame aspectRatio="landscape" caption="Drawing Registry: Spatial Study 01">
                  <ProjectPlaceholder
                    title="The Pavilions at Nandi Hills"
                    category="Landscape Architecture"
                    aspectRatio="landscape"
                  />
                </ImageFrame>
                <ImageFrame aspectRatio="landscape" caption="Drawing Registry: Spatial Study 02">
                  <ProjectPlaceholder
                    title="Bandra West Penthouse"
                    category="Interior Architecture"
                    aspectRatio="landscape"
                  />
                </ImageFrame>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer Specification Note */}
      <footer className="py-12 border-t border-[#DCD5CB] bg-[#F7F4EF]">
        <Container size="wide" className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#6B6C67] gap-4">
          <p>© {new Date().getFullYear()} Aurelle Spaces · Design System v1.0</p>
          <p className="font-mono text-[0.7rem]">
            Built strictly adhering to canonical tokens: Warm Ivory, Deep Charcoal, Muted Bronze, Soft Stone.
          </p>
        </Container>
      </footer>
    </div>
  );
}

