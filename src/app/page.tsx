import React from "react";
import type { Metadata } from "next";
import { HomeHero } from "@/components/home/home-hero";
import { StudioIntroduction } from "@/components/home/studio-introduction";
import { SelectedProjects } from "@/components/home/selected-projects";
import { ServicesPreview } from "@/components/home/services-preview";
import { FullWidthFeature } from "@/components/home/full-width-feature";
import { DesignPhilosophy } from "@/components/home/design-philosophy";
import { JournalPreview } from "@/components/home/journal-preview";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Aurelle Spaces | Architecture & Curated Interior Design",
  description:
    "A bespoke architecture and interior design studio crafting residential and commercial spaces across India. Thoughtful planning, natural light, and authentic materials.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Premium image-led hero */}
      <HomeHero />

      {/* 2. Short studio introduction */}
      <StudioIntroduction />

      {/* 3. Featured project concepts */}
      <SelectedProjects />

      {/* 4. Services overview */}
      <ServicesPreview />

      {/* 5. Full-width architectural image feature */}
      <FullWidthFeature />

      {/* 6. Design philosophy */}
      <DesignPhilosophy />

      {/* 7. Selected journal content */}
      <JournalPreview />

      {/* 8. Strong final enquiry CTA */}
      <ConsultationCTA
        heading="Have a project in mind?"
        description="Tell us about your spatial aspirations. We would be pleased to learn about your site, timeline, and ideas."
        actionLabel="Start Your Project"
        actionHref="/contact"
        secondaryActionLabel="Explore Our Portfolio"
        secondaryActionHref="/portfolio"
        background="subtle"
      />
    </div>
  );
}
