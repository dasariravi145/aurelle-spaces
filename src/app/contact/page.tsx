import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ConsultationForm } from "@/components/contact/consultation-form";
import { studioImages } from "@/lib/content/images";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact & Consultations | Aurelle Spaces",
  description:
    "Initiate an architectural or interior design discussion with Aurelle Spaces. Share your site location, project brief, and spatial aspirations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-[#F7F5F1] text-[#242522]">
      {/* Refined Split Layout (Padding reduced, form and visual content brought near top) */}
      <section className="w-full pt-6 sm:pt-8 pb-16 sm:pb-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Short Introduction & Relevant Interior Image */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[0.6875rem] uppercase tracking-widest text-[#A17C55] font-medium block">
                  Studio Inquiry
                </span>
                <h1 className="h1-editorial text-[#242522]">
                  Let&apos;s Talk About Your Space
                </h1>
                <p className="body-large text-[#62615D]">
                  Tell us what you&apos;re planning. We would be pleased to evaluate your site and discuss feasibility.
                </p>
              </div>

              {/* Relevant Interior Vignette Image (Clean unboxed editorial frame) */}
              <div>
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-xs">
                  <Image
                    src={studioImages.contactVignette.url}
                    alt={studioImages.contactVignette.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#242421]/25 via-transparent to-transparent opacity-30"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2.5 px-1 text-xs text-[#7E7F7A] italic">
                  {studioImages.contactVignette.caption}
                </p>
              </div>

              {/* What to Expect & Studio Locations (Clean architectural panel) */}
              <div className="p-5 sm:p-6 border border-[#E6E0D8] bg-[#FFFFFF] rounded-[2px] shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-normal text-[#242522] pb-2 border-b border-[#E6E0D8]">
                  What to Expect
                </h2>

                <div className="space-y-3 text-xs sm:text-sm text-[#62615D]">
                  <div>
                    <span className="font-medium text-[#242522] block">1. Brief Review</span>
                    <p className="text-xs text-[#7E7F7A] mt-0.5">
                      Our architects review your spatial brief and site context within two business days.
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-[#242522] block">2. Initial Conversation</span>
                    <p className="text-xs text-[#7E7F7A] mt-0.5">
                      We schedule an introductory meeting to discuss scope, timeline, and preliminary feasibility.
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-[#242522] block">3. Site Consultation</span>
                    <p className="text-xs text-[#7E7F7A] mt-0.5">
                      If aligned, we conduct an on-site evaluation of light orientation, levels, and structure.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6E0D8] text-xs text-[#7E7F7A] space-y-1">
                  <p className="font-medium text-[#242522]">Demonstration Project Contexts Across India</p>
                  <p>Hyderabad · Bengaluru · Mumbai · Delhi NCR · Pune</p>
                  <p className="pt-1">Inquiries: enquiries@aurelle.dsecops88.online</p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Enquiry Form */}
            <div className="lg:col-span-7">
              <ConsultationForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
