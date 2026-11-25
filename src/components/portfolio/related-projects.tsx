import React from "react";
import { ProjectCard } from "./project-card";
import { TextLink } from "@/components/ui/text-link";
import { portfolioProjects, type ProjectDetail } from "@/lib/content/portfolio-data";

export interface RelatedProjectsProps {
  currentSlug: string;
  relatedSlugs: string[];
  className?: string;
}

/**
 * Related Projects Recommendation Component
 * Suggests two relevant architectural studies while excluding the active project.
 */
export function RelatedProjects({
  currentSlug,
  relatedSlugs,
  className = "",
}: RelatedProjectsProps) {
  // Resolve related projects from slugs, excluding current project
  const resolvedProjects: ProjectDetail[] = relatedSlugs
    .map((slug) => portfolioProjects[slug])
    .filter((p): p is ProjectDetail => Boolean(p) && p.slug !== currentSlug)
    .slice(0, 2);

  // Fallback if relatedSlugs has less than 2: pick other projects
  if (resolvedProjects.length < 2) {
    const fallbacks = Object.values(portfolioProjects)
      .filter((p) => p.slug !== currentSlug && !resolvedProjects.some((rp) => rp.slug === p.slug))
      .slice(0, 2 - resolvedProjects.length);
    resolvedProjects.push(...fallbacks);
  }

  return (
    <div className={`w-full space-y-8 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-[#E6E0D8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block mb-1">
            Curated Studies
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
            Related Architectural Studies
          </h3>
        </div>
        <TextLink href="/portfolio" direction="right" className="text-xs">
          View All Portfolio Studies
        </TextLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resolvedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            aspectRatio="landscape"
          />
        ))}
      </div>
    </div>
  );
}
