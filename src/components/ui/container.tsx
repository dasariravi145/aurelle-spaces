import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "reading" | "standard" | "wide" | "max" | "full";
}

const sizeClasses = {
  reading: "max-w-[680px]",
  standard: "max-w-[1120px]",
  wide: "max-w-[1360px]",
  max: "max-w-[1536px]",
  full: "max-w-full",
};

/**
 * Responsive layout container primitive adhering to canonical spatial gutters.
 */
export function Container({
  children,
  className = "",
  as: Component = "div",
  size = "standard",
  ...props
}: ContainerProps) {
  const maxWidth = sizeClasses[size] || sizeClasses.standard;
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 ${maxWidth} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
