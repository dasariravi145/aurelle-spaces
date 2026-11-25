"use client";

import React, { useState, useMemo } from "react";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  portfolioCategories,
  type ProjectCategory,
  type ProjectDetail,
} from "@/lib/content/portfolio-data";

export interface PortfolioFilterGridProps {
  initialProjects: ProjectDetail[];
}

/**
 * Premium Architectural Portfolio Filter & Editorial Grid
 * Replaces generic uniform cards with an art-directed monograph composition:
 * - Refined editorial text tabs with active bottom bronze indicator
 * - Featured lead project composition
 * - Controlled variation in aspect ratios (landscape, portrait, editorial)
 * - Adaptive layout: 0 (empty state), 1 (featured), 2 (balanced pair), 3+ (monograph rhythm)
 */
export function PortfolioFilterGrid({ initialProjects }: PortfolioFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All Projects" | ProjectCategory>(
    "All Projects"
  );

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Projects": initialProjects.length,
    };

    initialProjects.forEach((proj) => {
      counts[proj.category] = (counts[proj.category] || 0) + 1;
    });

    return counts;
  }, [initialProjects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Projects") {
      return initialProjects;
    }
    return initialProjects.filter((p) => p.category === selectedCategory);
  }, [initialProjects, selectedCategory]);

  const count = filteredProjects.length;

  return (
    <div className="w-full space-y-10 sm:space-y-14">
      {/* Editorial Filter Navigation (No bulky buttons, elegant monograph tabs) */}
      <div className="border-b border-[#E6E0D8]">
        <div
          role="tablist"
          aria-label="Filter portfolio projects by category"
          className="flex flex-wrap items-center gap-6 sm:gap-8 pb-3"
        >
          {portfolioCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            const categoryCount = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-[0.8125rem] tracking-wide transition-all duration-200 relative pb-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs cursor-pointer ${
                  isActive
                    ? "text-[#242421] font-medium after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#A17C55]"
                    : "text-[#7E7F7A] hover:text-[#242421]"
                }`}
              >
                <span>{cat}</span>
                <span className="ml-1.5 text-[0.6875rem] font-mono text-[#A17C55] tabular-nums">
                  [{categoryCount}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adaptive Grid Composition */}

      {/* Scenario A: Zero projects -> Polished Empty State */}
      {count === 0 && (
        <EmptyState
          title="No Studies in This Category"
          description="We are currently formulating upcoming demonstration studies for this discipline. In the interim, explore our other portfolios."
          actionLabel="View All Projects"
          onAction={() => setSelectedCategory("All Projects")}
        />
      )}

      {/* Scenario B: Exactly One Project -> Intentionally Composed Featured Layout */}
      {count === 1 && (
        <div className="w-full max-w-5xl mx-auto py-2">
          <ProjectCard
            project={filteredProjects[0]}
            featured={true}
            priority={true}
          />
        </div>
      )}

      {/* Scenario C: Exactly Two Projects -> Balanced Editorial 2-Column Grid */}
      {count === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className="w-full">
              <ProjectCard
                project={project}
                aspectRatio={idx === 0 ? "editorial" : "landscape"}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      )}

      {/* Scenario D: Three or more Projects -> Curated Editorial Monograph Rhythm */}
      {count >= 3 && (
        <div className="space-y-14 sm:space-y-20">
          {/* Lead Project: Featured Architectural Spread */}
          <div className="pb-10 sm:pb-14 border-b border-[#E6E0D8]">
            <ProjectCard
              project={filteredProjects[0]}
              featured={true}
              priority={true}
            />
          </div>

          {/* Supporting Projects: Controlled Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {filteredProjects.slice(1).map((project, index) => {
              // Asymmetric rhythm across remaining items
              let colSpan = "lg:col-span-6";
              let aspect: "landscape" | "portrait" | "editorial" | "widescreen" = "editorial";

              if (index % 3 === 0) {
                // Wide landscape study
                colSpan = "lg:col-span-7";
                aspect = "editorial";
              } else if (index % 3 === 1) {
                // Tall portrait study
                colSpan = "lg:col-span-5";
                aspect = "portrait";
              } else {
                // Balanced landscape study
                colSpan = "lg:col-span-6";
                aspect = "landscape";
              }

              return (
                <div key={project.id} className={`w-full col-span-1 md:col-span-1 ${colSpan}`}>
                  <ProjectCard
                    project={project}
                    aspectRatio={aspect}
                    priority={index < 2}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
