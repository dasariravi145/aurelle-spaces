import React from "react";

export interface ImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  aspectRatio?: "square" | "landscape" | "portrait" | "widescreen" | "editorial";
  caption?: string;
  className?: string;
  bordered?: boolean;
}

const aspectClasses = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  widescreen: "aspect-[16/9]",
  editorial: "aspect-[16/10]",
};

/**
 * Architectural Image Frame
 * Constrains imagery to strict architectural aspect ratios with optional tactile borders and captions.
 */
export function ImageFrame({
  children,
  aspectRatio = "landscape",
  caption,
  bordered = true,
  className = "",
  ...props
}: ImageFrameProps) {
  const borderClass = bordered ? "border border-[#E7E2D9] p-1.5 bg-[#FFFFFF]" : "";
  const aspectClass = aspectClasses[aspectRatio] || aspectClasses.landscape;

  return (
    <figure className={`flex flex-col ${className}`} {...props}>
      <div className={`relative overflow-hidden w-full ${aspectClass} ${borderClass}`}>
        <div className="w-full h-full relative overflow-hidden bg-[#EFECE6]">
          {children}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs text-[#6B6C67] tracking-normal font-sans italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

