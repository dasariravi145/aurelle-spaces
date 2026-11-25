import React from "react";

export interface ProjectInfoItem {
  label: string;
  value: string;
}

export interface ProjectInfoBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  typology: string;
  location: string;
  areaSqFt?: number | string;
  year?: string | number;
  materiality?: string;
  customItems?: ProjectInfoItem[];
  className?: string;
}

/**
 * Minimal Architectural Project Information Block
 * Clean tabular presentation of architectural specifications and project metrics.
 */
export function ProjectInfoBlock({
  typology,
  location,
  areaSqFt,
  year,
  materiality,
  customItems = [],
  className = "",
  ...props
}: ProjectInfoBlockProps) {
  const defaultItems: ProjectInfoItem[] = [
    { label: "Typology", value: typology },
    { label: "Location", value: location },
    ...(areaSqFt ? [{ label: "Built-up Area", value: `${areaSqFt} sq. ft.` }] : []),
    ...(year ? [{ label: "Year of Completion", value: String(year) }] : []),
    ...(materiality ? [{ label: "Primary Materiality", value: materiality }] : []),
    ...customItems,
  ];

  return (
    <div
      className={`border border-[#E7E2D9] bg-[#FFFFFF] p-6 sm:p-8 rounded-[2px] ${className}`}
      {...props}
    >
      <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#A17C55] font-semibold mb-6 pb-3 border-b border-[#E7E2D9]">
        Project Parameters
      </h4>
      <dl className="divide-y divide-[#E7E2D9]/70 text-xs sm:text-sm">
        {defaultItems.map((item, index) => (
          <div key={index} className="py-2.5 flex justify-between items-baseline gap-4">
            <dt className="text-[#6B6C67] uppercase tracking-wider text-[0.72rem] font-sans">
              {item.label}
            </dt>
            <dd className="text-[#242522] font-medium text-right font-sans">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

