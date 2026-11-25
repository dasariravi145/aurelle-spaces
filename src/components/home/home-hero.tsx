import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { studioImages } from "@/lib/content/images";

/**
 * Editorial Homepage Hero
 * An immersive, image-dominant architectural composition.
 * Clean, restrained typography without metadata clutter.
 */
export function HomeHero() {
  return (
    <section className="relative w-full pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pb-20 bg-[#F7F5F1]">
      <Container size="wide">
        {/* Editorial Composition: Immersive Photography Leading the Visual Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <span className="text-[0.6875rem] font-medium tracking-widest text-[#A17C55] uppercase block">
                Architecture &amp; Interior Design
              </span>
              <h1 className="display-heading text-[#242421]">
                Spaces designed for the way you live.
              </h1>
            </div>

            <p className="body-large text-[#62615D] max-w-lg">
              Thoughtful interiors and architecture, shaped around everyday routines and natural light.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button href="/portfolio" variant="primary" size="md">
                Explore Projects
              </Button>
              <Button href="/contact" variant="outline" size="md">
                Discuss Your Project
              </Button>
            </div>
          </div>

          {/* Architectural Photography Anchor (Clean unboxed editorial plate) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
              <Image
                src={studioImages.heroLivingRoom.url}
                alt={studioImages.heroLivingRoom.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#242421]/20 via-transparent to-transparent opacity-30"
                aria-hidden="true"
              />
            </div>
            <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-[#7E7F7A]">
              <span>The Courtyard Residence · Living Pavilion</span>
              <span className="italic">Design Concept Study</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
