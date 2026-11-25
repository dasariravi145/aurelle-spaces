"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/content/home-data";
import { MobileNavigation } from "./mobile-navigation";

/**
 * Premium Studio Navigation Header (Requirement 7)
 * Features an elegant wordmark linking to Home, balanced desktop navigation in Title Case,
 * compact height, refined active indicator, and accessible mobile menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F5F1]/95 backdrop-blur-md border-b border-[#E6E0D8] py-3.5 shadow-xs"
            : "bg-[#F7F5F1] border-b border-[#E6E0D8]/70 py-4.5"
        }`}
      >
        <Container size="wide" className="flex items-center justify-between">
          {/* Brand Wordmark linking to Home */}
          <Link
            href="/"
            aria-label="Aurelle Spaces Home"
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
          >
            <span className="font-serif text-2xl sm:text-[1.65rem] font-normal tracking-tight text-[#242522] leading-none">
              Aurelle Spaces
            </span>
            <span className="text-[0.68rem] font-sans tracking-widest uppercase text-[#7E7F7A] mt-1 group-hover:text-[#A17C55] transition-colors">
              Architecture &amp; Interiors
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {navigationLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.9375rem] font-medium transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs ${
                    isActive
                      ? "text-[#A17C55] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#A17C55]"
                      : "text-[#62615D] hover:text-[#242522]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-block">
              <Button href="/contact" variant="primary" size="sm">
                Discuss Your Project
              </Button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open mobile navigation menu"
              className="lg:hidden p-2 rounded-[2px] border border-[#E6E0D8] text-[#242522] hover:bg-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Accessible Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navigationLinks}
        currentPath={pathname}
      />
    </>
  );
}
