import React from "react";

export interface QuotationProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote: string;
  author: string;
  role?: string;
  affiliation?: string;
  className?: string;
}

/**
 * Refined Architectural Quotation Treatment
 * Delivers editorial quotes or design manifestos with restrained typography and understated attribution.
 */
export function Quotation({
  quote,
  author,
  role,
  affiliation,
  className = "",
  ...props
}: QuotationProps) {
  return (
    <blockquote
      className={`relative pl-6 sm:pl-8 border-l-2 border-[#A17C55] my-8 sm:my-12 ${className}`}
      {...props}
    >
      <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.25] text-[#242522] tracking-tight">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#6B6C67]">
        <cite className="not-italic font-medium text-[#242522] font-sans">
          {author}
        </cite>
        {role && (
          <span className="text-[#8E8F8A]">
            <span className="hidden sm:inline">· </span>
            {role}
          </span>
        )}
        {affiliation && (
          <span className="text-[#8E8F8A]">
            <span className="hidden sm:inline">· </span>
            {affiliation}
          </span>
        )}
      </footer>
    </blockquote>
  );
}

