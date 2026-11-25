import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { studioImages } from "@/lib/content/images";

/**
 * Full-Width Architectural Image Feature (Part 7 Spec)
 * An expansive photographic feature showcasing architectural light,
 * structural flow, and the atmosphere of a carefully executed residence.
 */
export function FullWidthFeature() {
  const image = studioImages.projects["courtyard-residence-hyderabad"].cover;

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#F7F5F1] overflow-hidden">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-[2px] border border-[#E6E0D8] bg-[#222320] shadow-studio">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#222320]/80 via-[#222320]/25 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Understated Editorial Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-12 text-[#F7F5F1] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="max-w-xl space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Atmosphere &amp; Light
              </span>
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal leading-snug">
                “Architecture is experienced through the senses: the coolness of stone underfoot, the warmth of timber, and the natural flow of morning light.”
              </p>
            </div>
            <div className="text-xs text-[#DCD5CB] shrink-0 sm:text-right">
              <span>The Courtyard Residence · Hyderabad</span>
              <span className="block text-[#A17C55] mt-0.5">Demonstration Study</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

