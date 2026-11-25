import React from "react";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Editorial Eyebrow Label
 * Displays an understated, well-proportioned contextual cue in Muted Bronze.
 */
export function Eyebrow({
  children,
  className = "",
  as: Component = "span",
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={`inline-block text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#A17C55] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
