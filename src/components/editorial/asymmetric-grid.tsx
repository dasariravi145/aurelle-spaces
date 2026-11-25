import React from "react";
import { Container } from "@/components/ui/container";

export interface AsymmetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  leftSlot: React.ReactNode;
  rightSlot: React.ReactNode;
  ratio?: "60-40" | "40-60" | "70-30";
  className?: string;
}

const ratioStyles = {
  "60-40": {
    left: "lg:col-span-7",
    right: "lg:col-span-5",
  },
  "40-60": {
    left: "lg:col-span-5",
    right: "lg:col-span-7",
  },
  "70-30": {
    left: "lg:col-span-8",
    right: "lg:col-span-4",
  },
};

/**
 * Asymmetric Two-Column Section
 * Implements architectural golden-ratio proportions to avoid rigid, monotonous layouts.
 */
export function AsymmetricGrid({
  leftSlot,
  rightSlot,
  ratio = "60-40",
  className = "",
  ...props
}: AsymmetricGridProps) {
  const chosenRatio = ratioStyles[ratio] || ratioStyles["60-40"];

  return (
    <div className={`w-full ${className}`} {...props}>
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className={`col-span-1 ${chosenRatio.left}`}>{leftSlot}</div>
          <div className={`col-span-1 ${chosenRatio.right}`}>{rightSlot}</div>
        </div>
      </Container>
    </div>
  );
}

