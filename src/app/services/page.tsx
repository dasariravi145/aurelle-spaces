import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Design Services | Architecture & Interiors",
  description:
    "Explore our four core design disciplines: Residential Interiors, Commercial Workplaces, Architecture & Space Planning, and Renovation & Refurbishment across India.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242421]">
      {/* 1. Services Header (Height reduced ~35%, visual content brought close to top) */}
      <section className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="max-w-2xl space-y-1 sm:space-y-1.5">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                Studio Disciplines
              </span>
              <h1 className="h1-editorial text-[#242421]">
                Design Services for Spaces That Matter
              </h1>
              <p className="text-sm sm:text-base text-[#62615D] max-w-xl">
                Integrated architectural and interior design services tailored to individual living habits,
                workplace comfort, and regional climatic context across India.
              </p>
            </div>
            <div className="text-xs text-[#7E7F7A] shrink-0 md:text-right pt-1 md:pt-0">
              <span className="text-[#242522] font-medium block">Four Integrated Practices</span>
              <span>Planned with cost transparency and technical clarity.</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Varied Editorial Compositions (No repetitive white boxed cards) */}
      <section className="w-full pt-6 sm:pt-8 pb-16 sm:pb-24 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="space-y-16 sm:space-y-24">
            {/* Discipline 01: Residential Interiors (Image-Led Horizontal Editorial Spread) */}
            <article id="residential-interiors" className="scroll-mt-24 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                {/* Visual Lead */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                    <Image
                      src={studioImages.services.residential.url}
                      alt={studioImages.services.residential.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                    <span>Discipline 01 · Residential Interiors</span>
                    <span className="italic">Daily living routines &amp; natural daylighting</span>
                  </div>
                </div>

                {/* Narrative & Scope */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                      Discipline 01
                    </span>
                    <h2 className="h2-editorial text-[#242421]">
                      Residential Interiors
                    </h2>
                  </div>

                  <p className="body-large text-[#62615D]">
                    Beautiful, functional homes shaped around the way your family moves and gathers each day.
                  </p>

                  <p className="text-sm text-[#62615D] leading-relaxed">
                    From bespoke kitchen joinery and intuitive storage to natural stone and breathable lime plasters,
                    we design residential interiors that stay comfortable through changing seasons and daily use.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#E6E0D8]">
                    <span className="text-xs font-medium text-[#242421] block">
                      Scope Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Custom joinery, wardrobes, and tailored kitchen cabinetry</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Honed regional stone sourcing and natural mineral finishes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Architectural lighting schemes for calm mornings and restful evenings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3 items-center">
                    <Button href="/services/residential-interiors" variant="primary" size="sm">
                      View Service Scope
                    </Button>
                    <Button href="/contact?service=residential-interiors" variant="outline" size="sm">
                      Discuss This Scope
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Disciplines 02 & 03: Varied Asymmetric Pair (Commercial Workplaces & Architecture) */}
            <div className="pt-8 border-t border-[#E6E0D8] space-y-16 sm:space-y-24">
              {/* Discipline 02: Commercial Interiors (Image Right Editorial Spread) */}
              <article id="commercial-interiors" className="scroll-mt-24 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  {/* Narrative Column */}
                  <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                        Discipline 02
                      </span>
                      <h2 className="h2-editorial text-[#242421]">
                        Commercial Interiors
                      </h2>
                    </div>

                    <p className="body-large text-[#62615D]">
                      Workplaces that balance brand identity, acoustic comfort, and collaborative energy.
                    </p>

                    <p className="text-sm text-[#62615D] leading-relaxed">
                      We craft creative studios, boutique offices, and client hospitality suites where
                      teams thrive. Spaces are acoustically buffered, daylight-optimized, and built to last.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-[#E6E0D8]">
                      <span className="text-xs font-medium text-[#242421] block">
                        Scope Highlights:
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Acoustically isolated conference rooms and focus pods</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Ergonomic collaborative workstations with integrated cable routing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Tactile reception lounges and hospitality beverage counters</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3 items-center">
                      <Button href="/services/commercial-interiors" variant="primary" size="sm">
                        View Service Scope
                      </Button>
                      <Button href="/contact?service=commercial-interiors" variant="outline" size="sm">
                        Inquire About Workplace
                      </Button>
                    </div>
                  </div>

                  {/* Visual Plate */}
                  <div className="lg:col-span-7 order-1 lg:order-2">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                      <Image
                        src={studioImages.services.commercial.url}
                        alt={studioImages.services.commercial.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                      <span>Discipline 02 · Commercial Interiors</span>
                      <span className="italic">Acoustic comfort &amp; purposeful collaboration</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Discipline 03: Architecture & Space Planning (Landscape-Dominant Architectural Spread) */}
              <article id="architecture-space-planning" className="scroll-mt-24 pt-8 border-t border-[#E6E0D8] space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  {/* Visual Plate */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                      <Image
                        src={studioImages.services.architecture.url}
                        alt={studioImages.services.architecture.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                      <span>Discipline 03 · Architecture &amp; Space Planning</span>
                      <span className="italic">Courtyard ventilation, shaded verandas &amp; climate planning</span>
                    </div>
                  </div>

                  {/* Narrative Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                        Discipline 03
                      </span>
                      <h2 className="h2-editorial text-[#242421]">
                        Architecture &amp; Space Planning
                      </h2>
                    </div>

                    <p className="body-large text-[#62615D]">
                      Climate-responsive building design and natural layouts that connect with outdoor landscapes.
                    </p>

                    <p className="text-sm text-[#62615D] leading-relaxed">
                      We design residences and boutique structures around sun paths, cooling breezes, and shaded verandas,
                      creating comfortable living volumes that reduce energy reliance.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-[#E6E0D8]">
                      <span className="text-xs font-medium text-[#242421] block">
                        Scope Highlights:
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Solar orientation, seasonal breeze modeling, and passive cooling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Courtyard layouts, shaded porticos, and indoor-outdoor thresholds</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                          <span>Structural engineering coordination and complete municipal drawing sets</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3 items-center">
                      <Button href="/services/architecture-space-planning" variant="primary" size="sm">
                        View Service Scope
                      </Button>
                      <Button href="/contact?service=architecture-space-planning" variant="outline" size="sm">
                        Discuss Architectural Scope
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Discipline 04: Renovation & Refurbishment (Split Editorial with Historical Integrity) */}
            <article id="renovation-refurbishment" className="scroll-mt-24 pt-8 border-t border-[#E6E0D8] space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                {/* Narrative Column */}
                <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                      Discipline 04
                    </span>
                    <h2 className="h2-editorial text-[#242421]">
                      Renovation &amp; Refurbishment
                    </h2>
                  </div>

                  <p className="body-large text-[#62615D]">
                    Reimagining existing spaces with architectural sensitivity and modern convenience.
                  </p>

                  <p className="text-sm text-[#62615D] leading-relaxed">
                    We evaluate structural potential, remove non-bearing partitions to open daylight corridors,
                    and restore original character while modernizing plumbing, electrical, and thermal comfort.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#E6E0D8]">
                    <span className="text-xs font-medium text-[#242421] block">
                      Scope Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Adaptive internal reconfiguration for contemporary family routines</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Careful restoration of authentic woodwork, stone, and historic elements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                        <span>Comprehensive concealed MEP infrastructure upgrades</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3 items-center">
                    <Button href="/services/renovation-refurbishment" variant="primary" size="sm">
                      View Service Scope
                    </Button>
                    <Button href="/contact?service=renovation-refurbishment" variant="outline" size="sm">
                      Discuss Renovation Scope
                    </Button>
                  </div>
                </div>

                {/* Visual Plate */}
                <div className="lg:col-span-7 order-1 lg:order-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                    <Image
                      src={studioImages.services.renovation.url}
                      alt={studioImages.services.renovation.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                    <span>Discipline 04 · Renovation &amp; Refurbishment</span>
                    <span className="italic">Adaptive spatial reuse &amp; honest material restoration</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* 3. Consultation CTA */}
      <ConsultationCTA
        heading="Not sure which design scope fits your project?"
        description="In an initial conversation, we can help assess your site, timeline, and spatial requirements to determine the right collaborative approach."
        actionLabel="Start a Consultation"
        actionHref="/contact"
        background="surface"
      />
    </div>
  );
}
