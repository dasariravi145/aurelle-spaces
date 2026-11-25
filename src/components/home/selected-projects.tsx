import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { studioImages } from "@/lib/content/images";

export function SelectedProjects() {
  const projects = [
    {
      id: "courtyard-residence-hyderabad",
      slug: "courtyard-residence-hyderabad",
      title: "The Courtyard Residence",
      city: "Hyderabad",
      typology: "Residential Architecture",
      synopsis:
        "A family residence organized around an open central courtyard, maximizing natural cross-ventilation, shaded verandas, and daily privacy.",
      image: studioImages.projects["courtyard-residence-hyderabad"].cover,
      aspectClass: "aspect-[16/10]",
    },
    {
      id: "quiet-house-bengaluru",
      slug: "quiet-house-bengaluru",
      title: "The Quiet House",
      city: "Bengaluru",
      typology: "Residential Interior",
      synopsis:
        "A serene urban residence framed by lush garden views and lime plaster walls, creating a calm atmosphere buffered from city noise.",
      image: studioImages.projects["quiet-house-bengaluru"].cover,
      aspectClass: "aspect-[4/5]",
    },
    {
      id: "atelier-workspace-pune",
      slug: "atelier-workspace-pune",
      title: "The Atelier Workspace",
      city: "Pune",
      typology: "Commercial Interior",
      synopsis:
        "A creative studio workspace structured around daylight wells, custom timber benches, and acoustically insulated meeting rooms.",
      image: studioImages.projects["atelier-workspace-pune"].cover,
      aspectClass: "aspect-[16/10]",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#F7F5F1]">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-[#E6E0D8]">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
              Featured Concepts
            </span>
            <h2 className="h2-editorial text-[#242421]">
              Selected Architecture &amp; Interiors
            </h2>
            <p className="text-sm sm:text-base text-[#62615D]">
              Residential and commercial concepts illustrating spatial flow, daylight planning, and honest materials.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <TextLink href="/portfolio" direction="right">
              View All Projects
            </TextLink>
          </div>
        </div>

        {/* Distinctive Asymmetric Showcases */}
        <div className="mt-10 sm:mt-14 space-y-14 sm:space-y-20">
          {projects.map((project, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                {/* Visual Canvas Column */}
                <div
                  className={`col-span-1 lg:col-span-7 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] rounded-xs"
                  >
                    <div className={`relative w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs ${project.aspectClass}`}>
                      <Image
                        src={project.image.url}
                        alt={project.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
                      <span>{project.city}, India</span>
                      <span className="text-[#A17C55] font-medium group-hover:underline flex items-center gap-1">
                        View Project
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Narrative Column */}
                <div
                  className={`col-span-1 lg:col-span-5 space-y-4 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium">
                      {project.typology} · {project.city}
                    </span>
                    <h3 className="h2-editorial text-[#242421]">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="hover:text-[#A17C55] transition-colors"
                      >
                        {project.title}
                      </Link>
                    </h3>
                  </div>

                  <p className="body-regular text-[#62615D]">
                    {project.synopsis}
                  </p>

                  <div className="pt-2">
                    <TextLink href={`/portfolio/${project.slug}`} direction="right">
                      Read Project Story
                    </TextLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concise Concept Disclosure (Part 11 Spec) */}
        <div className="mt-14 pt-6 border-t border-[#E6E0D8] flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#7E7F7A] gap-2">
          <span>Selected design concepts created for demonstration.</span>
          <span>Aurelle Spaces · Hyderabad · Bengaluru · Mumbai · Delhi NCR · Pune</span>
        </div>
      </Container>
    </section>
  );
}
