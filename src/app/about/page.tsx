import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "About Us | Architecture & Interior Design Studio",
  description:
    "Learn about Aurelle Spaces, an architectural and interior design studio crafting residential and commercial spaces across India with functional clarity and natural materiality.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242421]">
      {/* 1. Memorable Monograph Hero (Compact, strong architectural photography, intentional copy) */}
      <header className="w-full pt-6 pb-8 sm:pt-8 sm:pb-12 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                About Aurelle Spaces
              </span>
              <h1 className="h1-editorial text-[#242421]">
                Architecture Shaped by Climate, Daylight &amp; Human Movement
              </h1>
              <p className="body-large text-[#62615D] max-w-xl">
                Aurelle Spaces crafts residential and commercial spaces across India with functional clarity,
                tactile materiality, and quiet architectural restraint.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button href="/portfolio" variant="primary" size="sm">
                  Explore Selected Works
                </Button>
                <Button href="/contact" variant="outline" size="sm">
                  Start a Conversation
                </Button>
              </div>

              <p className="text-xs text-[#7E7F7A] pt-2">
                Studio concept monograph created for architectural demonstration.
              </p>
            </div>

            {/* Right Photographic Anchor (Clean unboxed editorial canvas) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={studioImages.aboutStudioSpace.url}
                  alt={studioImages.aboutStudioSpace.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2.5 px-1 text-xs text-[#7E7F7A] italic">
                Spatial calm achieved through natural daylight, unhurried proportions, and tactile materials.
              </p>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Compact Philosophy Statement & Three Essential Tenets */}
      <section className="w-full py-14 sm:py-20 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="max-w-3xl mx-auto space-y-8 text-center sm:text-left">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Studio Philosophy
              </span>
              <p className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-normal text-[#242421] leading-snug">
                “Good architecture is measured not by decorative novelty, but by everyday ease:
                how rooms catch morning daylight, how breezes move between verandas, and how surfaces feel to the touch.”
              </p>
            </div>

            {/* Three Essential Tenets (Clean hairline grid, no marketing cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-[#E6E0D8] text-left">
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#242421]">Thoughtful Planning</h3>
                <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                  Circulation and room proportions arranged around daily rituals, intuitive storage, and comfortable privacy.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#242421]">Climate &amp; Daylight</h3>
                <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                  Deep overhangs, cross-ventilation, and courtyards that capture cooling air while softening afternoon solar glare.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#242421]">Honest Materiality</h3>
                <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                  Authentic regional stones, seasoned timbers, and mineral plasters selected to wear gracefully over decades.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Full-Width Architectural Visual Plate (Monograph Breathing Room) */}
      <section className="relative w-full py-8 sm:py-12 bg-[#FFFFFF] border-y border-[#E6E0D8]">
        <Container size="wide">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
            <Image
              src={studioImages.projects["courtyard-residence-hyderabad"].cover.url}
              alt={studioImages.projects["courtyard-residence-hyderabad"].cover.alt}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#242421]/30 via-transparent to-transparent opacity-40"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 px-1 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#7E7F7A] gap-1">
            <span>The Courtyard Residence · Hyderabad</span>
            <span className="italic">Passive stack ventilation and sheltered veranda living</span>
          </div>
        </Container>
      </section>

      {/* 4. Materiality in Practice (Large Material Detail Plate + Concise Commentary) */}
      <section className="w-full py-14 sm:py-20 bg-[#F7F5F1]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Material Detail */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                <Image
                  src={studioImages.aboutMaterials.url}
                  alt={studioImages.aboutMaterials.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2.5 px-1 text-xs text-[#7E7F7A] italic">
                Tactile palette: honed natural stone, breathable mineral lime plaster, and solid timber.
              </p>
            </div>

            {/* Commentary on Authentic Materials */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                  Material Honesty
                </span>
                <h2 className="h2-editorial text-[#242421]">
                  Surfaces Chosen for Longevity &amp; Touch
                </h2>
              </div>

              <p className="body-large text-[#62615D]">
                We avoid synthetic veneers and short-lived laminates. Lasting spatial quality emerges from
                surfaces with genuine tactile depth that weather honestly over time.
              </p>

              {/* Four Architectural Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E6E0D8]">
                <div className="space-y-1">
                  <h3 className="font-serif text-base text-[#242421]">Honed Regional Stone</h3>
                  <p className="text-xs text-[#7E7F7A] leading-relaxed">
                    Naturally cool underfoot, grounding living pavilions in warm regional climates.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-base text-[#242421]">Solid Seasoned Timber</h3>
                  <p className="text-xs text-[#7E7F7A] leading-relaxed">
                    Teak, oak, and walnut joinery finished with breathable oils that deepen with age.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-base text-[#242421]">Mineral Lime Plaster</h3>
                  <p className="text-xs text-[#7E7F7A] leading-relaxed">
                    Hand-troweled wall finishes that soften and diffuse daylight without surface glare.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-base text-[#242421]">Architectural Metalwork</h3>
                  <p className="text-xs text-[#7E7F7A] leading-relaxed">
                    Unlacquered brass, gunmetal, and blackened steel hardware with tactile mechanical weight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Guiding Principles (Restrained, Editorial Typography — No Generic Marketing Cards) */}
      <section className="w-full py-14 sm:py-20 bg-[#FFFFFF] border-t border-[#E6E0D8]">
        <Container size="wide">
          <div className="max-w-2xl mb-10 space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Studio Methodology
            </span>
            <h2 className="h2-editorial text-[#242421]">
              Guiding Architectural Principles
            </h2>
            <p className="text-sm sm:text-base text-[#62615D]">
              Three disciplined commitments that govern every commission from concept through construction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="pt-4 border-t-2 border-[#A17C55] space-y-2">
              <span className="text-xs font-mono text-[#A17C55] font-medium">01</span>
              <h3 className="font-serif text-xl font-normal text-[#242522]">
                Site Context &amp; Orientation
              </h3>
              <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                Analyzing sun paths, seasonal winds, and surrounding greenery before drafting initial plans.
              </p>
            </div>

            <div className="pt-4 border-t-2 border-[#A17C55] space-y-2">
              <span className="text-xs font-mono text-[#A17C55] font-medium">02</span>
              <h3 className="font-serif text-xl font-normal text-[#242522]">
                Living Habits First
              </h3>
              <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                Organizing internal space around actual household rituals, storage convenience, and acoustic buffers.
              </p>
            </div>

            <div className="pt-4 border-t-2 border-[#A17C55] space-y-2">
              <span className="text-xs font-mono text-[#A17C55] font-medium">03</span>
              <h3 className="font-serif text-xl font-normal text-[#242522]">
                Craft &amp; Technical Precision
              </h3>
              <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
                Drafting exact construction details and collaborating directly with skilled joiners and stonemasons.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Restrained Closing Invitation (Single primary CTA, sophisticated & concise) */}
      <ConsultationCTA
        heading="Have an architectural idea you wish to discuss?"
        description="Whether you are planning a private home, an executive workplace, or a sensitive renovation, we welcome an exploratory dialogue."
        actionLabel="Start a Project Discussion"
        actionHref="/contact"
        background="surface"
      />
    </div>
  );
}
