import React from "react";
import { Container } from "@/components/ui/container";

export interface SplitSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  textSlot: React.ReactNode;
  mediaSlot: React.ReactNode;
  reverse?: boolean;
  className?: string;
}

/**
 * Split Text-and-Image Section
 * Balances narrative architectural copy with high-resolution spatial imagery,
 * supporting reversible left/right column orientation.
 */
export function SplitSection({
  textSlot,
  mediaSlot,
  reverse = false,
  className = "",
  ...props
}: SplitSectionProps) {
  return (
    <div className={`w-full py-12 sm:py-20 ${className}`} {...props}>
      <Container size="wide">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div
            className={`col-span-1 lg:col-span-5 ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {textSlot}
          </div>
          <div
            className={`col-span-1 lg:col-span-7 ${
              reverse ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {mediaSlot}
          </div>
        </div>
      </Container>
    </div>
  );
}

