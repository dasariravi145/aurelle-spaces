"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/lib/content/home-data";
import { Button } from "@/components/ui/button";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  links?: { label: string; href: string }[];
  currentPath?: string;
}

/**
 * Accessible Mobile Navigation Drawer (Requirement 7)
 * Features focus trapping, escape-key listener, body scroll locking, and comfortable touch targets.
 * Logo explicitly links to Home.
 */
export function MobileNavigation({ isOpen, onClose, links = navigationLinks }: MobileNavigationProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll, handle Escape key, and enforce strict focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-nav-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#F7F5F1] text-[#242522] p-6 sm:p-10 animate-[fadeIn_200ms_ease-out]"
      ref={drawerRef}
    >
      {/* Top Header Row with Wordmark (Linked to Home) and Close Button */}
      <div className="flex items-center justify-between border-b border-[#E6E0D8] pb-6">
        <Link
          href="/"
          onClick={onClose}
          aria-label="Aurelle Spaces Home"
          className="group flex flex-col focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A17C55] rounded-xs"
        >
          <span className="font-serif text-2xl font-normal text-[#242522]">
            Aurelle Spaces
          </span>
          <span className="text-xs text-[#7E7F7A] tracking-wider uppercase block mt-0.5 group-hover:text-[#A17C55] transition-colors">
            Architecture &amp; Interior Design
          </span>
        </Link>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2.5 rounded-[2px] border border-[#E6E0D8] text-[#242522] hover:bg-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav List */}
      <nav className="my-auto py-6" aria-label="Mobile primary navigation">
        <ul className="flex flex-col space-y-4">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between py-2 text-2xl font-serif tracking-tight transition-colors ${
                    isActive ? "text-[#A17C55] font-normal" : "text-[#242522] hover:text-[#A17C55]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-sm text-[#A17C55] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Drawer Bottom Actions */}
      <div className="pt-6 border-t border-[#E6E0D8] space-y-4">
        <Button href="/contact" variant="primary" size="lg" className="w-full">
          Discuss Your Project
        </Button>
        <div className="flex justify-between items-center text-xs text-[#7E7F7A]">
          <span>Architecture &amp; Interiors</span>
          <span>India</span>
        </div>
      </div>
    </div>
  );
}
