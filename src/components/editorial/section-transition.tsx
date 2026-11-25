import React from "react";

export interface SectionTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  className?: string;
}

/**
 * Section Transition Treatment
 * An understated inter-section divider marking thematic transitions.
 */
export function SectionTransition({
  label = "Aurelle Spaces",
  className = "",
  ...props
}: SectionTransitionProps) {
  return (
    <div
      role="separator"
      className={`relative w-full flex items-center justify-center my-10 sm:my-14 ${className}`}
      {...props}
    >
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-[#E8E3DA]" />
      </div>
      <div className="relative bg-[#F7F4EF] px-5 flex items-center gap-2.5 text-xs font-sans tracking-[0.12em] text-[#7E7F7A] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
        <span>{label}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" aria-hidden="true" />
      </div>
    </div>
  );
}
