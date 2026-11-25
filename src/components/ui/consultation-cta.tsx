import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export interface ConsultationCTAProps {
  heading?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  background?: "primary" | "surface" | "subtle" | "dark";
  className?: string;
}

const backgroundStyles = {
  primary: "bg-[#F7F5F1] border-[#E6E0D8]",
  surface: "bg-[#FFFFFF] border-[#E6E0D8]",
  subtle: "bg-[#F0ECE4] border-[#E6E0D8]",
  dark: "bg-[#222320] text-[#F7F5F1] border-[#383935]",
};

/**
 * Reusable Consultation Call-to-Action Component
 * Features architectural proportion, refined typography, and clear consultation conversion cues.
 */
export function ConsultationCTA({
  heading = "Let's discuss what you have in mind.",
  description = "Whether you are planning a new residence, an executive workspace, or a sensitive renovation, we welcome an exploratory discussion.",
  actionLabel = "Start Your Project",
  actionHref = "/contact",
  secondaryActionLabel = "Explore Our Work",
  secondaryActionHref = "/portfolio",
  background = "subtle",
  className = "",
}: ConsultationCTAProps) {
  const isDark = background === "dark";

  return (
    <section className={`w-full py-16 sm:py-20 border-t ${backgroundStyles[background]} ${className}`}>
      <Container size="standard">
        <div className="text-center space-y-5 max-w-2xl mx-auto">
          <Eyebrow>Start a Conversation</Eyebrow>

          <h2 className="h2-editorial mx-auto">
            {heading}
          </h2>

          <p
            className={`body-large max-w-xl mx-auto ${
              isDark ? "text-[#DCD5CB]" : "text-[#62615D]"
            }`}
          >
            {description}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Button href={actionHref} variant="primary" size="md">
              {actionLabel}
            </Button>
            {secondaryActionLabel && secondaryActionHref && (
              <Button href={secondaryActionHref} variant={isDark ? "inverse" : "outline"} size="md">
                {secondaryActionLabel}
              </Button>
            )}
          </div>

          <div
            className={`pt-6 mt-6 border-t flex flex-col sm:flex-row justify-between items-center text-xs gap-2 ${
              isDark
                ? "border-[#383935] text-[#8E8F8A]"
                : "border-[#E6E0D8] text-[#7E7F7A]"
            }`}
          >
            <span>Direct Studio Dialogue · Confidential Consultations</span>
            <span>Aurelle Spaces · Demonstration Contexts: Hyderabad · Bengaluru · Mumbai · Delhi NCR · Pune</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
