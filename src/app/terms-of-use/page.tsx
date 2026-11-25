import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use | Aurelle Spaces",
  description:
    "Terms of use, concept demonstration disclosures, and platform terms governing the Aurelle Spaces digital website.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  const lastUpdated = "November 2026";

  return (
    <div className="w-full flex flex-col bg-[#F7F4EF] text-[#242522]">
      {/* Editorial Header */}
      <section className="w-full pt-8 pb-14 border-b border-[#DCD5CB]">
        <Container size="wide">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Terms of Use" }]} />
          </div>

          <div className="max-w-3xl space-y-4">
            <Eyebrow>Legal & Compliance</Eyebrow>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#242522]">
              Terms of Use
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-[#A17C55] pt-1">
              Effective Date: {lastUpdated} · Version 1.0 (Demonstration Edition)
            </p>
            <p className="body-large text-[#6B6C67] pt-2 leading-relaxed">
              These terms govern access to and usage of the Aurelle Spaces digital platform, portfolio monographs, design documentation, and consultation submission interfaces.
            </p>
          </div>
        </Container>
      </section>

      {/* Concept Demonstration Advisory */}
      <section className="w-full py-6 bg-[#FFFFFF] border-b border-[#DCD5CB]">
        <Container size="wide">
          <div className="p-4 sm:p-5 border-l-2 border-[#A17C55] bg-[#F7F4EF] text-xs text-[#242522] space-y-1">
            <p className="font-mono uppercase tracking-wider text-[#A17C55] font-medium">
              Concept Demonstration & Portfolio Disclosure
            </p>
            <p className="text-[#6B6C67] leading-relaxed">
              Aurelle Spaces is an original architectural and interior design studio website developed as an advanced technical demonstration for DRK Information Software Solutions. Project studies, architectural photography representations, spatial narratives, and client references presented herein represent concept studies and simulated architectural paradigms.
            </p>
          </div>
        </Container>
      </section>

      {/* Terms Content Sections */}
      <Section background="surface" spacing="lg">
        <Container size="reading">
          <div className="space-y-12 max-w-3xl">
            {/* 1. Acceptance of Terms */}
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                01 / Platform Agreement
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Acceptance of Terms
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  By accessing, browsing, or utilizing the web platform located at{" "}
                  <code className="font-mono text-xs bg-[#E7E2D9] px-1.5 py-0.5 rounded text-[#242522]">
                    https://aurelle.dsecops88.online
                  </code>{" "}
                  (the &ldquo;Platform&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our companion Privacy Policy.
                </p>
                <p>
                  If you do not agree with any provision stated in these terms, your sole remedy is to discontinue browsing and interacting with this platform.
                </p>
              </div>
            </div>

            {/* 2. Demonstration Status & Concept Studies */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                02 / Architectural Content
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Demonstration Portfolio & Case Studies
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  The architectural case studies, interior monographs, floor plans, material specifications, and design essays showcased across this platform are produced to demonstrate high-fidelity editorial curation and web architectural craft.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#242522]">
                  <li>
                    <strong className="font-medium">No Formal Architectural Sanction:</strong> Content published on this platform does not constitute certified structural engineering drawings, municipal sanction approvals, or construction-ready civil blueprints.
                  </li>
                  <li>
                    <strong className="font-medium">Fictional Concept Disclosures:</strong> Case study client names, specific spatial dimensions, and private residence locations are curated for conceptual illustration and do not represent actual private residential owners.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Intellectual Property */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                03 / Intellectual Property
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Intellectual Property & Copyright
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  All proprietary content, brand identity elements, the Aurelle Spaces logomark, editorial monographs, custom interface designs, component libraries, typography compositions, and source code are the intellectual property of DRK Information Software Solutions.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable license to access and view the platform solely for personal evaluation, design research, and prospective project consultation inquiries. Any unauthorized republication, commercial redistribution, or automated extraction without express prior written consent is strictly prohibited.
                </p>
              </div>
            </div>

            {/* 4. Consultation Inquiries & Non-Binding Nature */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                04 / Client Inquiries
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Consultation Briefs & Studio Engagement
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  Submitting a consultation inquiry, preliminary budget tier, or spatial brief via the interactive consultation interface represents an exploratory communication and request for dialogue.
                </p>
                <p>
                  Such submission does not establish a formal architect-client relationship, nor does it obligate Aurelle Spaces or DRK Information Software Solutions to accept, commence, or execute any architectural, interior design, or turnkey commissioning until a bilateral professional agreement is executed.
                </p>
              </div>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                05 / Disclaimers
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Limitation of Liability & Warranty Disclaimers
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  The platform and all included materials are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
                </p>
                <p>
                  In no event shall Aurelle Spaces, DRK Information Software Solutions, its directors, developers, or affiliates be liable for any indirect, incidental, consequential, or punitive damages arising from the access to, use of, or inability to use this platform.
                </p>
              </div>
            </div>

            {/* 6. Governing Law & Jurisdiction */}
            <div className="space-y-4 pt-6 border-t border-[#DCD5CB]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A17C55] block">
                06 / Legal Jurisdiction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
                Governing Law & Dispute Resolution
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#6B6C67] leading-relaxed">
                <p>
                  These Terms of Use shall be governed by, interpreted, and construed in accordance with the laws of the Republic of India. Any claims, legal proceedings, or disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
                <Link
                  href="/privacy-policy"
                  className="text-[#A17C55] hover:text-[#242522] underline underline-offset-4 transition-colors"
                >
                  Review Privacy Policy →
                </Link>
                <span className="text-[#DCD5CB]">|</span>
                <Link
                  href="/contact"
                  className="text-[#6B6C67] hover:text-[#242522] transition-colors"
                >
                  Initiate Studio Consultation
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

