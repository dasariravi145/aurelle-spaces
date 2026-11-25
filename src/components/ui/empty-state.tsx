import React from "react";
import { Button } from "./button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Architectural Empty State component with clean typography, restrained borders, and optional primary action.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  icon,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`w-full py-16 px-6 border border-dashed border-[#DCD5CB] bg-[#FFFFFF]/50 rounded-[2px] flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 ${className}`}
      {...props}
    >
      {icon ? (
        <div className="mb-4 text-[#A17C55]">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full border border-[#DCD5CB] flex items-center justify-center mb-4 bg-[#F7F4EF]">
          <span className="w-2 h-2 rounded-full bg-[#A17C55]" />
        </div>
      )}
      <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#242522]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#6B6C67] max-w-sm leading-relaxed">
        {description}
      </p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          <Button
            size="sm"
            variant="outline"
            href={actionHref}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

