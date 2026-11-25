import React from "react";
import Link from "next/link";

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  direction?: "right" | "up-right" | "none";
  className?: string;
  isExternal?: boolean;
}

/**
 * Editorial Text Link component featuring subtle directional cues and restrained underline transitions.
 */
export function TextLink({
  href,
  children,
  direction = "right",
  className = "",
  isExternal = false,
  ...props
}: TextLinkProps) {
  const isTargetBlank = isExternal || props.target === "_blank";

  return (
    <Link
      href={href}
      target={isTargetBlank ? "_blank" : undefined}
      rel={isTargetBlank ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-widest font-medium text-[#242522] hover:text-[#A17C55] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] rounded-sm ${className}`}
      {...props}
    >
      <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:opacity-40 group-hover:after:opacity-100 after:transition-opacity">
        {children}
      </span>
      {direction === "right" && (
        <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
          →
        </span>
      )}
      {direction === "up-right" && (
        <span className="inline-block transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true">
          ↗
        </span>
      )}
    </Link>
  );
}

