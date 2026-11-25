import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { studioImages } from "@/lib/content/images";

/**
 * Varied Services Overview
 * Clean, image-led editorial composition without repetitive white boxed cards.
 */
export function ServicesPreview() {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#E6E0D8]">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-[#E6E0D8]">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
              Core Disciplines
            </span>
            <h2 className="h2-editorial text-[#242421]">
              Architecture and Interior Services for Real Living
            </h2>
            <p className="text-sm sm:text-base text-[#62615D]">
              Four integrated design practices shaped around everyday use, climate responsiveness, and clear execution.
            </p>
          </div>
          <TextLink href="/services" direction="right">
            All Service Details
          </TextLink>
        </div>

        <div className="mt-12 space-y-16 sm:space-y-20">
          {/* Discipline 01: Featured Lead — Residential Interiors */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={studioImages.services.residential.url}
                  alt={studioImages.services.residential.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Discipline 01
              </span>
              <h3 className="h2-editorial text-[#242421]">
                Residential Interiors
              </h3>
              <p className="body-large text-[#62615D]">
                Beautiful, functional interiors designed around your family&apos;s daily routines.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D] pt-2 border-t border-[#E6E0D8]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                  <span>Custom joinery, wardrobes, and tailored kitchen cabinetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                  <span>Tactile stone sourcing and breathable natural plaster finishes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                  <span>Layered architectural lighting for morning ease and evening rest</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button href="/services/residential-interiors" variant="primary" size="sm">
                  Explore Residential Scope
                </Button>
              </div>
            </div>
          </article>

          {/* Disciplines 02 & 03: Two-Column Editorial Spread — Commercial & Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-10 border-t border-[#E6E0D8]">
            {/* Commercial Interiors */}
            <article className="space-y-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={studioImages.services.commercial.url}
                  alt={studioImages.services.commercial.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                  Discipline 02
                </span>
                <h3 className="h3-editorial text-[#242421]">
                  Commercial Interiors
                </h3>
                <p className="text-sm text-[#62615D]">
                  Workspaces that balance brand identity, acoustic comfort, and practical focus.
                </p>
                <div className="pt-2">
                  <TextLink href="/services/commercial-interiors" direction="right">
                    Commercial Scope Details
                  </TextLink>
                </div>
              </div>
            </article>

            {/* Architecture & Space Planning */}
            <article className="space-y-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={studioImages.services.architecture.url}
                  alt={studioImages.services.architecture.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                  Discipline 03
                </span>
                <h3 className="h3-editorial text-[#242421]">
                  Architecture &amp; Space Planning
                </h3>
                <p className="text-sm text-[#62615D]">
                  Climate-sensitive layouts that make better use of daylight, verandas, and natural airflow.
                </p>
                <div className="pt-2">
                  <TextLink href="/services/architecture-space-planning" direction="right">
                    Architecture Scope Details
                  </TextLink>
                </div>
              </div>
            </article>
          </div>

          {/* Discipline 04: Split Editorial — Renovation & Refurbishment */}
          <article className="pt-10 border-t border-[#E6E0D8]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
                <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                  Discipline 04
                </span>
                <h3 className="h3-editorial text-[#242421]">
                  Renovation &amp; Refurbishment
                </h3>
                <p className="body-regular text-[#62615D]">
                  Reimagining existing spaces with architectural sensitivity and modern convenience.
                </p>

                <ul className="space-y-1.5 text-xs sm:text-sm text-[#62615D] pt-2 border-t border-[#E6E0D8]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                    <span>Adaptive structural layout improvements for modern routines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                    <span>Careful preservation of authentic woodwork, stone, and character</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
                    <span>Full MEP and thermal insulation modernization</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <TextLink href="/services/renovation-refurbishment" direction="right">
                    Renovation Scope Details
                  </TextLink>
                </div>
              </div>

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
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
