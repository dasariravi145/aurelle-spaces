import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { studioImages } from "@/lib/content/images";

/**
 * Short Studio Introduction (Part 7 Spec)
 * Concise, human-centered studio overview balancing authentic photography
 * with straightforward architectural practice principles.
 */
export function StudioIntroduction() {
  return (
    <section className="w-full py-18 sm:py-24 bg-[#FFFFFF] border-y border-[#E6E0D8]">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Tactile Materials Photography */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
              <Image
                src={studioImages.aboutMaterials.url}
                alt={studioImages.aboutMaterials.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
            <p className="mt-2.5 px-1 text-xs text-[#7E7F7A] italic">
              Natural stone, lime plaster, and solid timber samples in our studio library.
            </p>
          </div>

          {/* Right Column: Natural Studio Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-[#62615D]">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
                Studio Approach
              </span>
              <h2 className="h2-editorial text-[#242421]">
                Good design begins with understanding how you live.
              </h2>
            </div>

            <p className="body-large text-[#242421]">
              We design homes and creative workspaces that feel balanced, comfortable,
              and easy to inhabit. Before sketching plans or selecting finishes, we take
              time to understand how your household moves, where morning light gathers,
              and what brings everyday ease.
            </p>

            <p className="body-regular">
              Every project balances practical planning with enduring construction. In warm
              Indian climates, that means orienting rooms for cross-ventilation, shading
              windows from harsh afternoon heat, and selecting authentic stones, timbers,
              and plasters that age gracefully with honest use.
            </p>

            {/* Three Straightforward Pillars */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#E6E0D8]">
              <div>
                <h3 className="font-serif text-lg text-[#242421] mb-1">
                  Listening First
                </h3>
                <p className="text-xs sm:text-sm text-[#7E7F7A] leading-relaxed">
                  Clarifying daily routines and functional needs before drafting architectural schemes.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#242421] mb-1">
                  Authentic Materials
                </h3>
                <p className="text-xs sm:text-sm text-[#7E7F7A] leading-relaxed">
                  Selecting durable regional stones, seasoned timbers, and breathable mineral plasters.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#242421] mb-1">
                  Site Precision
                </h3>
                <p className="text-xs sm:text-sm text-[#7E7F7A] leading-relaxed">
                  Coordinating joinery detailing and construction quality through to final handover.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <TextLink href="/about" direction="right">
                Read more about our studio practice
              </TextLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
