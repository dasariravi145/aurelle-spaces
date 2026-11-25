import React from "react";
import type { MaterialSwatch } from "@/lib/content/portfolio-data";

export interface MaterialPaletteProps {
  swatches: MaterialSwatch[];
  className?: string;
}

/**
 * Architectural Material Palette Component
 * Displays tactile material swatches with authentic tones, finishes, and architectural roles.
 */
export function MaterialPalette({ swatches, className = "" }: MaterialPaletteProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {swatches.map((swatch, idx) => (
          <div
            key={idx}
            className="border border-[#E6E0D8] bg-[#FFFFFF] p-5 rounded-[2px] shadow-studio flex flex-col justify-between space-y-4"
          >
            {/* Color Swatch Block */}
            <div
              className="w-full h-20 rounded-xs border border-black/5 flex items-end p-2.5 shadow-inner"
              style={{ backgroundColor: swatch.toneHex }}
            >
              <span className="text-[0.68rem] font-sans font-medium text-[#F7F5F1] bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                {swatch.toneHex}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-xl font-normal text-[#242522]">
                {swatch.name}
              </h4>
              <p className="text-xs text-[#62615D]">
                <strong className="font-medium text-[#242522]">Finish:</strong> {swatch.finish}
              </p>
              <p className="text-xs text-[#7E7F7A]">
                <strong className="font-medium text-[#62615D]">Role:</strong> {swatch.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
