import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ConsultationCTA } from "@/components/ui/consultation-cta";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Our Process | Six-Stage Architectural Methodology",
  description:
    "Explore our six-stage architectural and interior design methodology: Discover, Plan, Design, Refine, Coordinate, and Complete across India.",
  path: "/process",
});

export default function ProcessPage() {
  const stages = [
    {
      number: "01",
      name: "Discover",
      tagline: "Site Context & Living Habits",
      description:
        "Every commission begins with open listening. We analyze your household routines, spatial priorities, sun orientation, and site context before drawing lines.",
      deliverable: "Project Brief & Feasibility Framework",
      image: studioImages.process[0],
    },
    {
      number: "02",
      name: "Plan",
      tagline: "Spatial Flow & Natural Light",
      description:
        "We test circulation paths, ceiling volumes, and window alignments to establish natural spatial flow and comfortable transitions between rooms.",
      deliverable: "Spatial Floor Plans & Circulation Strategy",
      image: studioImages.process[1],
    },
    {
      number: "03",
      name: "Design",
      tagline: "3D Form & Material Selection",
      description:
        "We develop the spatial concept in 3D: pairing natural daylighting with bespoke joinery, regional stone palettes, and layered architectural lighting.",
      deliverable: "3D Visual Concepts & Physical Material Swatches",
      image: studioImages.process[2],
    },
    {
      number: "04",
      name: "Refine",
      tagline: "Technical Construction Drawings",
      description:
        "We translate concept models into exact specifications: custom millwork details, plumbing shafts, electrical layouts, and stone cutting schedules.",
      deliverable: "Good-for-Construction (GFC) Drawing Package",
      image: studioImages.process[3],
    },
    {
      number: "05",
      name: "Coordinate",
      tagline: "Artisan Liaison & Site Quality",
      description:
        "We collaborate directly with carpenters, stone masons, and specialized contractors to ensure every drawing detail is built with craft precision.",
      deliverable: "Regular Site Quality Audits & Contractor Coordination",
      image: studioImages.process[4],
    },
    {
      number: "06",
      name: "Complete",
      tagline: "Final Snagging & Ready-to-Live Handover",
      description:
        "Before you move in, we conduct thorough snagging audits, verify mechanical fittings, style key focal areas, and deliver a clean, finished home.",
      deliverable: "Final Quality Handover & As-Built Documentation",
      image: studioImages.process[5],
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#F7F5F1] text-[#242522]">
      {/* 1. Process Header (Height reduced ~35%, clear methodology overview) */}
      <section className="w-full pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-[#E6E0D8] bg-[#FFFFFF]">
        <Container size="wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="max-w-2xl space-y-1 sm:space-y-1.5">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                Working Methodology
              </span>
              <h1 className="h1-editorial text-[#242522]">
                From First Conversation to Final Handover
              </h1>
              <p className="text-sm sm:text-base text-[#62615D] max-w-xl">
                We guide every commission through six disciplined stages. By separating exploration,
                technical documentation, and on-site coordination, we provide clarity, predictable timelines, and calm execution.
              </p>
            </div>
            <div className="text-xs text-[#7E7F7A] shrink-0 md:text-right pt-1 md:pt-0">
              <span className="text-[#242522] font-medium block">Six Structured Stages</span>
              <span>Rigorous planning with transparent milestone reviews.</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Horizontal Stage Overview Bar */}
      <section className="w-full py-3.5 bg-[#FFFFFF] border-b border-[#E6E0D8] hidden md:block">
        <Container size="wide">
          <div className="grid grid-cols-6 gap-3 text-xs">
            {stages.map((stage) => (
              <a
                key={stage.number}
                href={`#stage-${stage.number}`}
                className="group flex flex-col py-1 border-l-2 border-[#E6E0D8] hover:border-[#A17C55] pl-3 transition-colors"
              >
                <span className="text-[0.6875rem] font-mono text-[#A17C55] font-medium">Stage {stage.number}</span>
                <span className="text-xs font-serif text-[#242522] group-hover:text-[#A17C55] transition-colors">{stage.name}</span>
                <span className="text-[0.6875rem] text-[#7E7F7A] truncate">{stage.tagline}</span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Sophisticated, Varied Architectural Process Spread (No six identical cards) */}
      <section className="w-full pt-8 sm:pt-12 pb-16 sm:pb-24 bg-[#F7F5F1]">
        <Container size="wide" className="space-y-16 sm:space-y-24">
          
          {/* Phase 1: Exploration & Spatial Strategy (Stages 01 & 02) */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E6E0D8]">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium">Phase 1</span>
              <span className="text-xs text-[#7E7F7A]">·</span>
              <span className="text-xs uppercase tracking-wider text-[#62615D] font-medium">Exploration &amp; Spatial Strategy</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Stage 01: Discover */}
              <article id="stage-01" className="scroll-mt-24 space-y-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={stages[0].image.url}
                    alt={stages[0].image.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">01</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[0].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[0].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[0].description}
                  </p>
                  <div className="pt-3 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[0].deliverable}</span>
                  </div>
                </div>
              </article>

              {/* Stage 02: Plan */}
              <article id="stage-02" className="scroll-mt-24 space-y-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={stages[1].image.url}
                    alt={stages[1].image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">02</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[1].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[1].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[1].description}
                  </p>
                  <div className="pt-3 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[1].deliverable}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Phase 2: Concept Design & Technical Detail (Stages 03 & 04) */}
          <div className="space-y-8 pt-8 border-t border-[#E6E0D8]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E6E0D8]">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium">Phase 2</span>
              <span className="text-xs text-[#7E7F7A]">·</span>
              <span className="text-xs uppercase tracking-wider text-[#62615D] font-medium">Concept Design &amp; Technical Detail</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Stage 03 Visual Plate */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={stages[2].image.url}
                    alt={stages[2].image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                  <span>Stage 03 · 3D Visual Concepts</span>
                  <span className="italic">Material swatches &amp; light simulation</span>
                </div>
              </div>

              {/* Stages 03 & 04 Narrative Stack */}
              <div className="lg:col-span-5 space-y-8">
                {/* Stage 03: Design */}
                <article id="stage-03" className="scroll-mt-24 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">03</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[2].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[2].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[2].description}
                  </p>
                  <div className="pt-2 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[2].deliverable}</span>
                  </div>
                </article>

                {/* Stage 04: Refine */}
                <article id="stage-04" className="scroll-mt-24 pt-6 border-t border-[#E6E0D8] space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">04</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[3].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[3].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[3].description}
                  </p>
                  <div className="pt-2 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[3].deliverable}</span>
                  </div>
                </article>
              </div>
            </div>
          </div>

          {/* Phase 3: Craft Execution & Handover (Stages 05 & 06) */}
          <div className="space-y-8 pt-8 border-t border-[#E6E0D8]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E6E0D8]">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium">Phase 3</span>
              <span className="text-xs text-[#7E7F7A]">·</span>
              <span className="text-xs uppercase tracking-wider text-[#62615D] font-medium">Craft Execution &amp; Handover</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Stage 05: Coordinate */}
              <article id="stage-05" className="scroll-mt-24 space-y-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={stages[4].image.url}
                    alt={stages[4].image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">05</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[4].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[4].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[4].description}
                  </p>
                  <div className="pt-3 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[4].deliverable}</span>
                  </div>
                </div>
              </article>

              {/* Stage 06: Complete */}
              <article id="stage-06" className="scroll-mt-24 space-y-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={stages[5].image.url}
                    alt={stages[5].image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-normal text-[#A17C55]">06</span>
                    <h2 className="h2-editorial text-[#242522]">{stages[5].name}</h2>
                    <span className="text-xs text-[#7E7F7A] italic ml-auto">{stages[5].tagline}</span>
                  </div>
                  <p className="body-regular text-[#62615D] leading-relaxed">
                    {stages[5].description}
                  </p>
                  <div className="pt-3 border-t border-[#E6E0D8] text-xs">
                    <span className="text-[#7E7F7A] font-medium block">Stage Deliverable:</span>
                    <span className="text-[#242522] font-medium">{stages[5].deliverable}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

        </Container>
      </section>

      {/* 4. Consultation CTA */}
      <ConsultationCTA
        heading="Ready to begin your architectural journey?"
        description="Share a few details about what you have in mind. We would be pleased to evaluate your site and discuss how we can bring clarity to your project."
        actionLabel="Start a Consultation"
        actionHref="/contact"
        background="surface"
      />
    </div>
  );
}
