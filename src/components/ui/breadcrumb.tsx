import React from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/structured-data";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  className?: string;
  includeJsonLd?: boolean;
}

/**
 * Accessible Breadcrumb navigation component formatted with semantic navigation,
 * aria-current attributes, and automatic Schema.org BreadcrumbList structured data.
 */
export function Breadcrumb({
  items,
  className = "",
  includeJsonLd = true,
  ...props
}: BreadcrumbProps) {
  const jsonLdItems = [
    { name: "Studio", item: "/" },
    ...items.map((it) => ({
      name: it.label,
      item: it.href || "",
    })),
  ].filter((it) => Boolean(it.name));

  return (
    <>
      {includeJsonLd && <BreadcrumbJsonLd items={jsonLdItems} />}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-[#6B6C67] tracking-wider font-sans ${className}`}
        {...props}
      >
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/"
              className="hover:text-[#242522] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
            >
              Studio
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-[#DCD5CB]" aria-hidden="true">
                  /
                </span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#242522] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#242522] font-medium" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
