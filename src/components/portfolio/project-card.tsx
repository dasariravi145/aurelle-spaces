import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProjectDetail } from "@/lib/content/portfolio-data";
import { studioImages } from "@/lib/content/images";

export interface ProjectCardProps {
  project: ProjectDetail;
  aspectRatio?: "landscape" | "portrait" | "widescreen" | "editorial";
  className?: string;
  priority?: boolean;
  featured?: boolean;
}

const aspectClasses = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  widescreen: "aspect-[16/9]",
  editorial: "aspect-[16/10]",
};

function getProjectImage(slug: string) {
  const match = studioImages.projects[slug as keyof typeof studioImages.projects];
  if (match) return match.cover;

  if (slug.includes("hyderabad") && slug.includes("courtyard")) return studioImages.projects["courtyard-residence-hyderabad"].cover;
  if (slug.includes("bengaluru") || slug.includes("quiet")) return studioImages.projects["quiet-house-bengaluru"].cover;
  if (slug.includes("pune") || slug.includes("atelier")) return studioImages.projects["atelier-workspace-pune"].cover;
  if (slug.includes("chennai") || slug.includes("veranda")) return studioImages.projects["veranda-home-chennai"].cover;
  if (slug.includes("mumbai") || slug.includes("gallery")) return studioImages.projects["gallery-office-mumbai"].cover;
  if (slug.includes("renewal") || slug.includes("hyderabad")) return studioImages.projects["renewal-apartment-hyderabad"].cover;

  return studioImages.heroLivingRoom;
}

/**
 * Premium Architectural Project Card (Monograph Edition)
 * Minimal framing, restrained metadata, clear image-to-project association,
 * and subtle hover interactions. Free of heavy card boxes or redundant labels.
 */
export function ProjectCard({
  project,
  aspectRatio,
  className = "",
  priority = false,
  featured = false,
}: ProjectCardProps) {
  const chosenAspect = aspectRatio || project.coverAspect || "landscape";
  const aspectClass = aspectClasses[chosenAspect] || aspectClasses.editorial;
  const image = getProjectImage(project.slug);

  // Featured Layout: Wide horizontal architectural composition
  if (featured) {
    return (
      <article className={`group w-full ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <Link
              href={`/portfolio/${project.slug}`}
              className="block relative overflow-hidden rounded-xs bg-[#EAE6DE] aspect-[16/10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55]"
            >
              <Image
                src={image.url}
                alt={image.alt || project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={priority}
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A17C55] font-medium">
              <span>{project.category}</span>
              <span>·</span>
              <span className="text-[#7E7F7A]">{project.city}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#242421] leading-tight">
              <Link
                href={`/portfolio/${project.slug}`}
                className="hover:text-[#A17C55] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
              >
                {project.title}
              </Link>
            </h2>

            <p className="text-sm sm:text-base text-[#62615D] leading-relaxed">
              {project.shortDescription}
            </p>

            <div className="pt-2">
              <Link
                href={`/portfolio/${project.slug}`}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#242421] hover:text-[#A17C55] transition-colors group-hover:translate-x-0.5"
              >
                <span>Explore Case Study</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Editorial Project Presentation (Monograph styling, no boxed cards)
  return (
    <article className={`group flex flex-col space-y-3.5 ${className}`}>
      <Link
        href={`/portfolio/${project.slug}`}
        className="block relative overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55]"
      >
        <div className={`relative w-full overflow-hidden ${aspectClass}`}>
          <Image
            src={image.url}
            alt={image.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity"
            aria-hidden="true"
          />
        </div>
      </Link>

      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A17C55] font-medium">
          <span>{project.category}</span>
          <span>·</span>
          <span className="text-[#7E7F7A]">{project.city}</span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#242522] leading-snug">
          <Link
            href={`/portfolio/${project.slug}`}
            className="hover:text-[#A17C55] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm text-[#62615D] line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="pt-1.5">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#242421] hover:text-[#A17C55] transition-colors group-hover:translate-x-0.5"
          >
            <span>View Case Study</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
