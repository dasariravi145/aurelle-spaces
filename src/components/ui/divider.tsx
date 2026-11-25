import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "subtle" | "bronze" | "dark";
  className?: string;
}

const variantStyles = {
  subtle: "border-[#E7E2D9]",
  bronze: "border-[#A17C55]/40",
  dark: "border-[#3A3B37]",
};

/**
 * Architectural Divider component for clear horizontal cadence or vertical partitioning.
 */
export function Divider({
  label,
  orientation = "horizontal",
  variant = "subtle",
  className = "",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block h-full border-l ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center w-full my-6 ${className}`}
        {...props}
      >
        <div className={`flex-1 border-t ${variantStyles[variant]}`} />
        <span className="px-4 text-[0.68rem] font-mono uppercase tracking-[0.2em] text-[#6B6C67]">
          {label}
        </span>
        <div className={`flex-1 border-t ${variantStyles[variant]}`} />
      </div>
    );
  }

  return (
    <hr
      className={`w-full border-0 border-t ${variantStyles[variant]} my-6 ${className}`}
      {...props}
    />
  );
}

