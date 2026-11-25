import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  className?: string;
}

const variantStyles = {
  primary:
    "bg-[#242421] text-[#F7F5F1] hover:bg-[#383935] border border-[#242421] focus-visible:ring-[#A17C55]",
  secondary:
    "bg-[#A17C55] text-[#FFFFFF] hover:bg-[#8A6742] border border-[#A17C55] focus-visible:ring-[#242421]",
  outline:
    "bg-transparent text-[#242421] border border-[#E6E0D8] hover:border-[#242421] hover:bg-[#FFFFFF]/60 focus-visible:ring-[#A17C55]",
  ghost:
    "bg-transparent text-[#242421] border border-transparent hover:bg-[#E6E0D8]/40 focus-visible:ring-[#A17C55]",
  inverse:
    "bg-[#F7F5F1] text-[#242421] hover:bg-[#FFFFFF] border border-[#F7F5F1] focus-visible:ring-[#A17C55]",
};

const sizeStyles = {
  sm: "text-xs px-4 py-2 tracking-wider",
  md: "text-xs px-6 py-2.5 tracking-wider",
  lg: "text-sm px-8 py-3.5 tracking-wider",
};

/**
 * Accessible architectural button component supporting button actions and next/link navigation.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const appliedClass = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={appliedClass}>
        {isLoading ? <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={appliedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
