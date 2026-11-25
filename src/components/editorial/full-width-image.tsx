import React from "react";
import { Container } from "@/components/ui/container";

export interface FullWidthImageProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaSlot: React.ReactNode;
  caption?: string;
  location?: string;
  year?: string | number;
  className?: string;
}

/**
 * Full-Width Architectural Image Section
 * Delivers panoramic spatial imagery with a subtle architectural metadata footer.
 */
export function FullWidthImage({
  mediaSlot,
  caption,
  location,
  year,
  className = "",
  ...props
}: FullWidthImageProps) {
  return (
    <div className={`w-full overflow-hidden my-12 sm:my-20 ${className}`} {...props}>
      <div className="w-full relative bg-[#EFECE6] border-y border-[#E7E2D9]">
        {mediaSlot}
      </div>

      {(caption || location || year) && (
        <div className="py-3 bg-[#F7F4EF]">
          <Container size="wide" className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#6B6C67] gap-2">
            {caption && <span className="italic">{caption}</span>}
            <div className="flex items-center gap-4 text-[0.68rem] font-mono tracking-widest uppercase">
              {location && <span>Location: {location}</span>}
              {year && <span>Completed: {year}</span>}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

