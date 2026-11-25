import React from "react";

export interface ProcessItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: string | number;
  title: string;
  description: string;
  deliverables?: string[];
  className?: string;
}

/**
 * Numbered Process Item
 * Outlines architectural stages (briefing, schematic design, detailed execution, site handover)
 * with precise typography and restrained stone borders.
 */
export function ProcessItem({
  stepNumber,
  title,
  description,
  deliverables,
  className = "",
  ...props
}: ProcessItemProps) {
  const formattedNumber =
    typeof stepNumber === "number" && stepNumber < 10
      ? `0${stepNumber}`
      : stepNumber;

  return (
    <div
      className={`border-t border-[#DCD5CB] pt-6 pb-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 ${className}`}
      {...props}
    >
      <span className="text-sm font-mono tracking-widest text-[#A17C55] font-medium">
        [{formattedNumber}]
      </span>
      <div className="flex-1 space-y-3">
        <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#242522]">
          {title}
        </h4>
        <p className="text-sm sm:text-base text-[#6B6C67] leading-relaxed max-w-xl">
          {description}
        </p>
        {deliverables && deliverables.length > 0 && (
          <ul className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#242522]">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#A17C55]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

