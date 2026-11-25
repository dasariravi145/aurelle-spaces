import React from "react";

export interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-0.5 max-w-[120px]",
  md: "h-1 max-w-[200px]",
  lg: "h-1.5 max-w-[320px]",
};

/**
 * Architectural Loading Indicator
 * An understated, minimalist linear geometric loader that avoids noisy spinners.
 */
export function LoadingIndicator({
  label = "Loading architectural data...",
  size = "md",
  className = "",
  ...props
}: LoadingIndicatorProps) {
  const barHeight = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}
      {...props}
    >
      <div className={`w-full ${barHeight} bg-[#DCD5CB] overflow-hidden rounded-full relative`}>
        <div className="absolute inset-y-0 left-0 bg-[#A17C55] w-1/3 animate-[shimmer_1.8s_ease-in-out_infinite] rounded-full" />
      </div>
      {label && (
        <span className="text-[0.7rem] uppercase tracking-[0.2em] font-mono text-[#6B6C67]">
          {label}
        </span>
      )}
    </div>
  );
}

