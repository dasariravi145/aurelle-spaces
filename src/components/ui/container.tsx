import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

/**
 * Reusable layout container primitive with responsive horizontal padding and standard maximum widths.
 */
export function Container({
  children,
  className = "",
  as: Component = "div",
  size = "lg",
  ...props
}: ContainerProps) {
  const maxWidth = sizeClasses[size] || sizeClasses.lg;
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

