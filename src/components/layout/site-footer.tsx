"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { navigationLinks } from "@/lib/content/home-data";

/**
 * Professional Studio Footer (Part 17 Spec)
 * Displays studio provenance, discipline routes, legal links, and demonstration attribution.
 * Suppressed automatically on administrative routes (/admin/*).
 */
export function SiteFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const serviceLinks = [
    { label: "Residential Interiors", href: "/services/residential-interiors" },
    { label: "Commercial Interiors", href: "/services/commercial-interiors" },
    { label: "Architecture & Space Planning", href: "/services/architecture-space-planning" },
    { label: "Renovation & Refurbishment", href: "/services/renovation-refurbishment" },
  ];

  return (
    <footer className="w-full bg-[#222320] text-[#F7F5F1] border-t border-[#383935] pt-16 pb-12">
      <Container size="wide">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#383935]">
          {/* Studio Brand & Editorial Mission */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#A17C55] font-medium block">
              Architecture &amp; Interior Design
            </span>
            <h3 className="font-serif text-3xl font-normal tracking-tight text-[#F7F5F1]">
              Aurelle Spaces
            </h3>
            <p className="text-sm text-[#DCD5CB] leading-relaxed max-w-sm font-light">
              A bespoke architecture and interior design studio crafting residential and
              commercial spaces across India. Grounded in functional clarity, regional materiality,
              and meticulous spatial execution.
            </p>
            <p className="text-xs text-[#8E8F8A] pt-2">
              Concept demonstration platform developed for DRK Information Software Solutions.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#A17C55] font-medium mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DCD5CB]">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#A17C55] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Disciplines */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#A17C55] font-medium mb-4">
              Design Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DCD5CB]">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="hover:text-[#A17C55] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55]"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 text-xs text-[#8E8F8A] space-y-1">
              <p>Demonstration Project Contexts Across India: Hyderabad · Bengaluru · Mumbai · Delhi NCR · Pune</p>
              <p>Studio Inquiries: enquiries@aurelle.dsecops88.online</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-[#8E8F8A] gap-4">
          <p>© {currentYear} Aurelle Spaces. All rights reserved.</p>

          <div className="flex flex-wrap gap-6">
            <Link href="/privacy-policy" className="hover:text-[#DCD5CB] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-[#DCD5CB] transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap.xml" className="hover:text-[#DCD5CB] transition-colors">
              Sitemap
            </Link>
            <Link href="/admin/login" className="hover:text-[#DCD5CB] transition-colors">
              Studio Portal
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
