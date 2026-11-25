import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";

export function ProcessPreview() {
  const steps = [
    {
      phase: "Stage 01",
      name: "Discover & Listen",
      description: "Understanding your lifestyle rituals, family routines, site orientation, and spatial aspirations.",
      deliverable: "Comprehensive Consultation Brief & Feasibility Framework",
    },
    {
      phase: "Stage 02",
      name: "Spatial Planning",
      description: "Developing volumetric layouts, circulation studies, and light alignments across the floor plan.",
      deliverable: "Dimensional Layout Plans & Circulation Strategy",
    },
    {
      phase: "Stage 03",
      name: "Design & Materiality",
      description: "Selecting authentic regional stones, custom joinery details, and layered lighting schemes.",
      deliverable: "Tactile Material Swatches & Visual Concept Schemes",
    },
    {
      phase: "Stage 04",
      name: "Detailing & Execution",
      description: "Overseeing artisan carpentry, masonry precision, and quality control through to final handover.",
      deliverable: "Turnkey Project Snagging & Ready-to-Live Handover",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-[#F7F4EF] border-b border-[#DCD5CB]">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-12 border-b border-[#DCD5CB]">
          <SectionHeading
            eyebrow="Our Methodology"
            title="A disciplined, transparent path to completion."
            description="Four deliberate stages ensuring clarity of scope, cost transparency, and seamless execution from sketch to site handover."
          />
          <TextLink href="/process" direction="right">
            Explore Full Six-Stage Journey
          </TextLink>
        </div>

        {/* Process Step Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 border border-[#E8E3DA] bg-[#FFFFFF] rounded-[2px] shadow-studio flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#A17C55] font-medium block">
                  {step.phase}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#242522]">
                  {step.name}
                </h3>
                <p className="text-sm text-[#595A55] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E3DA]">
                <span className="text-xs uppercase tracking-wider text-[#7E7F7A] block mb-1">
                  Deliverable
                </span>
                <p className="text-sm font-medium text-[#242522]">
                  {step.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
