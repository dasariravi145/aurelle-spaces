import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PortfolioFilterGrid } from "@/components/portfolio/portfolio-filter-grid";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { getPublicProjects } from "@/lib/cms/content-service";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Portfolio | Selected Architecture & Interior Concepts",
  description:
    "Explore our collection of residential, commercial, and architectural concepts across India. Thoughtful planning, natural light, and everyday functionality.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const allProjects = await getPublicProjects();

  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      {/* 1. Compact Editorial Header (No right-aligned clutter, photography brought into view quickly) */}
      <header className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="max-w-3xl space-y-2">
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
              Portfolio Monograph
            </span>
            <h1 className="h1-editorial text-[#242522]">
              Selected Works &amp; Spatial Studies
            </h1>
            <p className="body-large text-[#62615D]">
              Residential and workplace architecture exploring natural daylight, tactile materiality, and spatial clarity across India.
            </p>
            <p className="text-xs text-[#7E7F7A] pt-1">
              Selected design concepts created for studio demonstration.
            </p>
          </div>
        </Container>
      </header>

      {/* 2. Interactive Category Filter & Curated Editorial Portfolio Grid */}
      <section className="w-full pt-6 sm:pt-8 pb-16 sm:pb-24 bg-[#F7F5F1]">
        <Container size="wide">
          <PortfolioFilterGrid initialProjects={allProjects} />
        </Container>
      </section>

      {/* 3. Restrained Consultation Invitation */}
      <ConsultationCTA
        heading="Have an architectural idea you wish to discuss?"
        description="We welcome private residential inquiries, commercial workplace briefs, and comprehensive renovation projects across India."
        actionLabel="Start a Project Discussion"
        actionHref="/contact"
        background="surface"
      />
    </div>
  );
}
