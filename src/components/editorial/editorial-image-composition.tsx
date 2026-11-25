import React from "react";
import { ImageFrame } from "@/components/ui/image-frame";

export interface EditorialImageCompositionProps extends React.HTMLAttributes<HTMLDivElement> {
  primarySlot: React.ReactNode;
  secondarySlot?: React.ReactNode;
  caption?: string;
  className?: string;
}

/**
 * Editorial Image Composition
 * Renders an asymmetric layered image composition featuring a prominent primary visual
 * balanced by an offset secondary accent frame.
 */
export function EditorialImageComposition({
  primarySlot,
  secondarySlot,
  caption,
  className = "",
  ...props
}: EditorialImageCompositionProps) {
  return (
    <div className={`relative w-full ${className}`} {...props}>
      <div className="grid grid-cols-12 gap-4 sm:gap-6 items-end">
        {/* Main Primary Image Canvas */}
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <ImageFrame aspectRatio="editorial" bordered>
            {primarySlot}
          </ImageFrame>
        </div>

        {/* Secondary Overlapping Accent Canvas */}
        {secondarySlot && (
          <div className="col-span-8 sm:col-span-4 lg:col-span-3 -mt-8 sm:mt-0">
            <ImageFrame aspectRatio="portrait" bordered>
              {secondarySlot}
            </ImageFrame>
          </div>
        )}
      </div>

      {caption && (
        <p className="mt-3 text-xs text-[#6B6C67] font-sans italic tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}

