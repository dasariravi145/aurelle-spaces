import React from "react";
import Image from "next/image";
import { studioImages } from "@/lib/content/images";

export interface ProjectPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  category?: string;
  aspectRatio?: "square" | "landscape" | "portrait" | "widescreen" | "editorial";
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  priority?: boolean;
}

const aspectClasses = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  widescreen: "aspect-[16/9]",
  editorial: "aspect-[16/10]",
};

/**
 * Resolves an appropriate high-quality architectural image from our curated library
 * based on titles, locations, or categories when no direct image URL is provided.
 */
function resolveImageByContext(title: string, category: string): { url: string; alt: string } | null {
  const combined = `${title} ${category}`.toLowerCase();

  if (combined.includes("hyderabad") || combined.includes("courtyard")) {
    return {
      url: studioImages.projects["courtyard-residence-hyderabad"].cover.url,
      alt: studioImages.projects["courtyard-residence-hyderabad"].cover.alt,
    };
  }
  if (combined.includes("bengaluru") || combined.includes("quiet house")) {
    return {
      url: studioImages.projects["quiet-house-bengaluru"].cover.url,
      alt: studioImages.projects["quiet-house-bengaluru"].cover.alt,
    };
  }
  if (combined.includes("pune") || combined.includes("atelier")) {
    return {
      url: studioImages.projects["atelier-workspace-pune"].cover.url,
      alt: studioImages.projects["atelier-workspace-pune"].cover.alt,
    };
  }
  if (combined.includes("alibaug") || combined.includes("coastal")) {
    return {
      url: studioImages.projects["coastal-retreat-alibaug"].cover.url,
      alt: studioImages.projects["coastal-retreat-alibaug"].cover.alt,
    };
  }
  if (combined.includes("mumbai") || combined.includes("penthouse") || combined.includes("skyline")) {
    return {
      url: studioImages.projects["skyline-penthouse-mumbai"].cover.url,
      alt: studioImages.projects["skyline-penthouse-mumbai"].cover.alt,
    };
  }
  if (combined.includes("delhi") || combined.includes("heritage")) {
    return {
      url: studioImages.projects["heritage-apartment-delhi"].cover.url,
      alt: studioImages.projects["heritage-apartment-delhi"].cover.alt,
    };
  }
  if (combined.includes("residential")) {
    return {
      url: studioImages.services.residential.url,
      alt: studioImages.services.residential.alt,
    };
  }
  if (combined.includes("commercial")) {
    return {
      url: studioImages.services.commercial.url,
      alt: studioImages.services.commercial.alt,
    };
  }
  if (combined.includes("architecture") || combined.includes("space planning")) {
    return {
      url: studioImages.services.architecture.url,
      alt: studioImages.services.architecture.alt,
    };
  }
  if (combined.includes("renovation") || combined.includes("refurbishment")) {
    return {
      url: studioImages.services.renovation.url,
      alt: studioImages.services.renovation.alt,
    };
  }
  if (combined.includes("material") || combined.includes("methodology") || combined.includes("care")) {
    return {
      url: studioImages.aboutMaterials.url,
      alt: studioImages.aboutMaterials.alt,
    };
  }
  if (combined.includes("planning") || combined.includes("everyday")) {
    return {
      url: studioImages.journal["planning-a-home-that-works-for-everyday-life"].url,
      alt: studioImages.journal["planning-a-home-that-works-for-everyday-life"].alt,
    };
  }
  if (combined.includes("compact")) {
    return {
      url: studioImages.journal["making-better-use-of-compact-spaces"].url,
      alt: studioImages.journal["making-better-use-of-compact-spaces"].alt,
    };
  }

  // General elegant fallback
  return {
    url: studioImages.heroLivingRoom.url,
    alt: studioImages.heroLivingRoom.alt,
  };
}

/**
 * Architectural Project Image Component
 * Renders high-resolution, responsive architecture and interior design photography
 * with smooth loading, subtle hover scale, and elegant warm-stone frame.
 */
export function ProjectPlaceholder({
  title = "Spatial Study",
  category = "Architecture & Interiors",
  aspectRatio = "landscape",
  imageUrl,
  imageAlt,
  className = "",
  priority = false,
  ...props
}: ProjectPlaceholderProps) {
  const aspectClass = aspectClasses[aspectRatio] || aspectClasses.landscape;
  const resolved = imageUrl
    ? { url: imageUrl, alt: imageAlt || `${title} — ${category}` }
    : resolveImageByContext(title, category);

  const displayAlt = imageAlt || resolved?.alt || `${title} — ${category}`;

  return (
    <div
      role="img"
      aria-label={displayAlt}
      className={`relative w-full overflow-hidden bg-[#EFECE6] flex flex-col justify-end select-none ${aspectClass} ${className}`}
      {...props}
    >
      {resolved?.url ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src={resolved.url}
            alt={displayAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* Subtle gradient scrim at bottom to enhance legibility and depth */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#242522]/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"
            aria-hidden="true"
          />
        </div>
      ) : (
        /* Refined, quiet warm-stone canvas if no image matches */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#EAE6DE]">
          <span className="font-serif text-lg text-[#242522]">{title}</span>
          <span className="text-xs text-[#6B6C67] mt-1">{category}</span>
        </div>
      )}
    </div>
  );
}
