import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { studioImages } from "@/lib/content/images";

/**
 * Design Philosophy Section (Part 4, Part 7, Part 18 Spec)
 * A sophisticated dark charcoal (#222320) section with high-contrast text (#F7F5F1).
 * Clear, grounded, professional architectural values without AI clichés.
 */
export function DesignPhilosophy() {
  const principles = [
    {
      title: "Daily Comfort & Function",
      description:
        "A space must serve the actual living patterns of its residents before making an aesthetic statement. Storage, movement paths, and acoustics guide every line we draw.",
    },
    {
      title: "Natural Light & Airflow",
      description:
        "We capture morning daylight while shielding living rooms from intense western heat using deep overhangs, recessed windows, and natural cross-ventilation.",
    },
    {
      title: "Authentic Materials",
      description:
        "We prioritize materials in their natural state: unpolished regional stones, lime plasters, and seasoned solid timbers that grow richer with age and honest use.",
    },
    {
      title: "Enduring Construction",
      description:
        "Rejecting short-lived trends, we rely on timeless architectural proportions, generous ceiling volumes, and durable details that last for decades.",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-[#222320] text-[#F7F5F1]">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Design Values
            </span>
            <h2 className="display-heading text-[#F7F5F1]">
              Architecture shaped for real life.
            </h2>
            <p className="body-large text-[#DCD5CB] font-light">
              We do not believe in superficial ornament. From an urban apartment
              to a private weekend home, lasting quality comes from how rooms catch
              daylight, how air moves through hallways, and how surfaces feel to the touch.
            </p>

            <div className="pt-4 p-6 border-l-2 border-[#A17C55] bg-[#2A2B27] rounded-[2px] space-y-2">
              <p className="font-serif text-lg text-[#F7F5F1] italic">
                “True luxury is a home that makes daily living peaceful, unhurried, and comfortable in every season.”
              </p>
              <span className="text-xs text-[#A17C55] uppercase tracking-wider block font-medium">
                Aurelle Spaces · Studio Commitment
              </span>
            </div>
          </div>

          {/* Right Column: Detail Image + 2x2 Principles Grid */}
          <div className="lg:col-span-6 space-y-8">
            {/* Craft Detail Photography */}
            <div className="relative group overflow-hidden rounded-[2px] bg-[#2A2B27] p-2 border border-[#383935] shadow-studio">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs bg-[#1C1D1A]">
                <Image
                  src={studioImages.craftDetail.url}
                  alt={studioImages.craftDetail.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Principles 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="p-5 border border-[#383935] bg-[#2A2B27] rounded-[2px] space-y-2"
                >
                  <h3 className="font-serif text-lg font-normal text-[#F7F5F1]">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#DCD5CB] leading-relaxed font-light">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
