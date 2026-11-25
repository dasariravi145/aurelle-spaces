import React from "react";
import { Eyebrow } from "./eyebrow";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  isDark?: boolean;
  className?: string;
}

/**
 * Editorial Section Heading component pairing a delicate architectural eyebrow,
 * a refined serif title, and a balanced body description.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  isDark = false,
  className = "",
  ...props
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "text-center mx-auto items-center"
      : align === "right"
      ? "text-right ml-auto items-end"
      : "text-left items-start";

  const titleColor = isDark ? "text-[#F7F5F1]" : "text-[#242522]";
  const descColor = isDark ? "text-[#DCD5CB]" : "text-[#62615D]";

  return (
    <div className={`flex flex-col max-w-2xl ${alignmentClass} ${className}`} {...props}>
      {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
      <h2 className={`h2-editorial ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-3.5 text-base sm:text-[1.0625rem] leading-relaxed font-normal ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
