import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "primary" | "surface" | "subtle" | "dark";
  borderTop?: boolean;
  borderBottom?: boolean;
  as?: React.ElementType;
}

const spacingClasses = {
  none: "py-0",
  sm: "py-10 sm:py-14",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-28",
  xl: "py-28 sm:py-36",
};

const backgroundClasses = {
  primary: "bg-[#F7F5F1] text-[#242421]",
  surface: "bg-[#FFFFFF] text-[#242421]",
  subtle: "bg-[#F0ECE4] text-[#242421]",
  dark: "bg-[#222320] text-[#F7F5F1]",
};

/**
 * Architectural Section Wrapper component providing consistent vertical cadence and surface backgrounds.
 */
export function Section({
  children,
  className = "",
  spacing = "md",
  background = "primary",
  borderTop = false,
  borderBottom = false,
  as: Component = "section",
  ...props
}: SectionProps) {
  const spaceClass = spacingClasses[spacing] || spacingClasses.md;
  const bgClass = backgroundClasses[background] || backgroundClasses.primary;
  const topBorder = borderTop ? (background === "dark" ? "border-t border-[#383935]" : "border-t border-[#E6E0D8]") : "";
  const bottomBorder = borderBottom ? (background === "dark" ? "border-b border-[#383935]" : "border-b border-[#E6E0D8]") : "";

  return (
    <Component
      className={`w-full relative ${spaceClass} ${bgClass} ${topBorder} ${bottomBorder} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
