import React from "react";
import Image from "next/image";
import type { GalleryPlate } from "@/lib/content/portfolio-data";
import { studioImages } from "@/lib/content/images";

export interface ProjectGalleryProps {
  plates: GalleryPlate[];
  projectTitle: string;
  projectSlug?: string;
  className?: string;
}

function resolveGalleryImage(projectSlug: string | undefined, plateIndex: number) {
  if (projectSlug && projectSlug in studioImages.projects) {
    const proj = studioImages.projects[projectSlug as keyof typeof studioImages.projects];
    if (proj.gallery[plateIndex]) {
      return proj.gallery[plateIndex];
    }
  }

  // Fallbacks
  const pool = [
    studioImages.heroLivingRoom,
    studioImages.aboutMaterials,
    studioImages.craftDetail,
    studioImages.services.residential,
  ];
  return pool[plateIndex % pool.length];
}

/**
 * Architectural Project Gallery Component
 * Renders large architectural photography with clean captions and responsive asymmetric layout.
 */
export function ProjectGallery({
  plates,
  projectTitle,
  projectSlug,
  className = "",
}: ProjectGalleryProps) {
  return (
    <div className={`w-full space-y-10 sm:space-y-14 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {plates.map((plate, index) => {
          const colSpan =
            index === 0
              ? "lg:col-span-8"
              : index === 1
              ? "lg:col-span-4"
              : "lg:col-span-12";

          const image = resolveGalleryImage(projectSlug, index);
          const aspectClass =
            index === 1 ? "aspect-[4/5]" : index === 0 ? "aspect-[16/10]" : "aspect-[16/9]";

          return (
            <figure
              key={plate.id || index}
              className={`col-span-1 ${colSpan} group flex flex-col space-y-2.5`}
            >
              <div className="relative overflow-hidden rounded-[2px] bg-[#FFFFFF] p-2 border border-[#E6E0D8] shadow-studio hover:shadow-studio-hover transition-all duration-300">
                <div className={`relative w-full overflow-hidden rounded-xs bg-[#EAE6DE] ${aspectClass}`}>
                  <Image
                    src={image.url}
                    alt={image.alt || `${projectTitle} — ${plate.title}`}
                    fill
                    sizes={index === 1 ? "(max-width: 1024px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 66vw"}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#242421]/25 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <figcaption className="px-1 flex flex-col sm:flex-row justify-between text-xs text-[#7E7F7A] gap-1">
                <span className="font-medium text-[#242522]">
                  {plate.title}
                </span>
                <span className="italic">{plate.caption || image.caption}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
