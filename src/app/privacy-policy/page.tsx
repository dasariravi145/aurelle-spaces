import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | Aurelle Spaces",
  description:
    "Privacy policy, data protection practices, and digital information handling guidelines for the Aurelle Spaces demonstration platform.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 2026";

  return (
    <div className="w-full flex flex-col bg-[#F7F4EF] text-[#242522]">
      {/* Editorial Header */}
      <section className="w-full pt-8 pb-14 border-b border-[#DCD5CB]">
        <Container size="wide">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Privacy Policy" }]} />
          </div>

          <div className="max-w-3xl space-y-4">
            <Eyebrow>Legal & Compliance</Eyebrow>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#242522]">
              Privacy Policy
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-[#A17C55] pt-1">
              Effective Date: {lastUpdated} · Version 1.0 (Demonstration Edition)
            </p>
            <p className="body-large text-[#6B6C67] pt-2 leading-relaxed">
              This privacy policy articulates our principles regarding the collection, protection, and handling of information submitted through the Aurelle Spaces digital platform.
            </p>
          </div>
        </Container>
      </section>

      {/* Advisory Banner */}
      <section className="w-full py-6 bg-[#FFFFFF] border-b border-[#DCD5CB]">
        <Container size="wide">
          <div className="p-4 sm:p-5 border-l-2 border-[#A17C55] bg-[#F7F4EF] text-xs text-[#242522] space-y-1">
            <p className="font-mono uppercase tracking-wider text-[#A17C55] font-medium">
              Demonstration Environment Notice
            </p>
            <p className="text-[#6B6C67] leading-relaxed">
              Aurelle Spaces is a bespoke architectural and interior design studio demonstration platform engineered for DRK Information Software Solutions. This document outlines representative privacy standards and compliance structures intended for production deployment under applicable Indian data protection frameworks.
            </p>
          </div>
        </Container>
      </section>

      {/* Policy Content Sections */}
      <Section background="surface" spacing="lg">
        <Container size="reading">
          <div className="space-y-12 max-w-3xl">
            {/* 1. Overview & Applicability */}
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                01 / Scope & Purpose
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Scope and Applicability
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  This Privacy Policy applies to the digital web platform hosted at{" "}
                  <code className="font-mono text-xs bg-[#E7E2D9] px-1.5 py-0.5 rounded text-[#242522]">
                    https://aurelle.dsecops88.online
                  </code>{" "}
                  and any related digital communication channels operated by Aurelle Spaces. It governs how prospective clients, collaborators, and visitors interact with our digital portfolio and consultation intake workflows.
                </p>
                <p>
                  We are committed to maintaining data privacy in accordance with applicable Indian digital protection standards, including the Digital Personal Data Protection Act (DPDPA), ensuring that your personal and spatial project requirements are processed with transparency and discretion.
                </p>
              </div>
            </div>

            {/* 2. Information We Collect */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                02 / Information Gathering
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Information We Collect
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  When you voluntarily submit a project inquiry or consultation brief through our studio contact form, we collect the following categories of information:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#242522]">
                  <li>
                    <strong className="font-medium">Personal Contact Data:</strong> Full name, verified email address, telephone contact number, and city of residence.
                  </li>
                  <li>
                    <strong className="font-medium">Spatial Project Details:</strong> Project typology (residential villa, apartment duplex, commercial studio, heritage restoration), site location, estimated carpet area or plot footprint, target commencement timeline, and indicative investment bracket.
                  </li>
                  <li>
                    <strong className="font-medium">Architectural Brief Notes:</strong> Design preferences, lifestyle objectives, spatial aspirations, and contextual background shared within narrative fields.
                  </li>
                  <li>
                    <strong className="font-medium">Technical Telemetry:</strong> Standard non-identifying telemetry including browser user-agent, operating system, anonymized IP addresses, and page navigation patterns utilized exclusively to ensure edge platform stability.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Use of Information */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                03 / Purpose of Processing
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                How We Use Your Information
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  We utilize submitted information solely for legitimate architectural studio operations and bespoke design inquiries:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#242522]">
                  <li>To review project feasibility, typology match, and studio scheduling availability.</li>
                  <li>To coordinate initial exploratory consultations and prepare contextual spatial briefs.</li>
                  <li>To deliver bespoke proposals, material references, and preliminary phase schedules.</li>
                  <li>To verify technical reliability and audit platform performance across distributed edge nodes.</li>
                </ul>
                <p>
                  Aurelle Spaces never sells, rents, monetizes, or distributes personal or spatial brief data to third-party marketing entities.
                </p>
              </div>
            </div>

            {/* 4. Storage & Edge Processing */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                04 / Data Storage & Security
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Storage, Retention & Edge Infrastructure
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  Our digital platform operates on modern serverless edge architecture powered by Cloudflare Workers and secure edge database protocols. All transmitted information is secured using TLS 1.3 encryption in transit.
                </p>
                <p>
                  Consultation inquiries are retained only for the duration required to evaluate feasibility, maintain communication during project development, or satisfy administrative and statutory compliance obligations. Prospective inquiries that do not proceed to a formal studio commission are archived or purged in accordance with our data lifecycle schedules.
                </p>
              </div>
            </div>

            {/* 5. User Rights */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                05 / Individual Rights
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Your Rights & Data Discretion
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  As an individual interacting with our studio, you hold full discretion over the data you furnish to us. You possess the right to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#242522]">
                  <li>Request a summary of personal information held by our studio records.</li>
                  <li>Request rectification of inaccurate contact or project information.</li>
                  <li>Request the complete deletion or erasure of your consultation brief and contact history.</li>
                  <li>Withdraw consent for exploratory communications at any point.</li>
                </ul>
                <p>
                  To exercise any of these privileges, please address a written communication to our studio privacy contact.
                </p>
              </div>
            </div>

            {/* 6. Studio Contact & Inquiries */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                06 / Studio Contact
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Privacy Questions & Communications
              </h2>
              <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-3 text-sm text-[#242522]">
                <p className="font-mono text-xs uppercase tracking-wider text-[#A17C55]">
                  Aurelle Spaces · Legal & Privacy Operations
                </p>
                <p className="text-xs text-[#6B6C67]">
                  DRK Information Software Solutions demonstration project.
                </p>
                <div className="pt-2 border-t border-[#E7E2D9] space-y-1 font-mono text-xs text-[#6B6C67]">
                  <p>Inquiries: <span className="text-[#242522]">enquiries@aurelle.dsecops88.online</span></p>
                  <p>Studio: <span className="text-[#242522]">84/2 Indiranagar, 100 Feet Road, Bengaluru 560038</span></p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
                <Link
                  href="/terms-of-use"
                  className="text-[#A17C55] hover:text-[#242522] underline underline-offset-4 transition-colors"
                >
                  Review Terms of Use →
                </Link>
                <span className="text-[#DCD5CB]">|</span>
                <Link
                  href="/contact"
                  className="text-[#6B6C67] hover:text-[#242522] transition-colors"
                >
                  Contact Studio
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

