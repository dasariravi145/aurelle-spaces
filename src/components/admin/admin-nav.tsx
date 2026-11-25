"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminUserRecord } from "@/lib/db/types";
import { getRoleDisplayName } from "@/lib/security/rbac";

interface AdminNavProps {
  user: AdminUserRecord;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "⊞", exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "🏛" },
  { href: "/admin/services", label: "Services", icon: "✦" },
  { href: "/admin/journal", label: "Journal", icon: "📖" },
  { href: "/admin/media", label: "Media Library", icon: "🖼" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "✉" },
  { href: "/admin/chat", label: "Studio Chatbot", icon: "💬" },
  { href: "/admin/automations", label: "Automations", icon: "⚡" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminNav({ user, children }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // Continue redirect even on network blip
    }
    router.push("/admin/login");
    router.refresh();
  };

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const roleLabel = getRoleDisplayName(user.role);

  return (
    <div className="min-h-screen w-full flex bg-[#F7F4EF] text-[#242522]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#242522] text-[#F7F4EF] border-r border-[#3A3B37] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col">
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-[#3A3B37] space-y-1">
            <Link
              href="/admin"
              className="font-serif text-2xl tracking-tight text-[#F7F4EF] hover:text-[#A17C55] transition-colors block"
            >
              Aurelle Spaces
            </Link>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#A17C55] block">
              Studio Administration
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-[#A17C55] text-[#F7F4EF] font-medium"
                      : "text-[#DCD5CB] hover:bg-[#2E2F2C] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span className="text-sm opacity-80">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#3A3B37] space-y-3 bg-[#1E1F1C]">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-[#F7F4EF] truncate">
              {user.display_name}
            </p>
            <p className="text-[0.68rem] text-[#DCD5CB]/60 truncate font-mono">
              {user.email}
            </p>
            <div className="pt-1">
              <span className="inline-block px-2 py-0.5 text-[0.62rem] font-mono uppercase tracking-wider text-[#A17C55] border border-[#A17C55]/40 rounded-[2px]">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-[#2A2B27]">
            <Link
              href="/"
              target="_blank"
              className="text-[#DCD5CB]/70 hover:text-[#F7F4EF] text-[0.7rem] transition-colors"
            >
              View Site ↗
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-[#DCD5CB]/70 hover:text-[#A14B3A] text-[0.7rem] transition-colors cursor-pointer"
            >
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 w-full bg-[#FFFFFF] border-b border-[#DCD5CB] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#242522] hover:bg-[#F7F4EF] rounded-[2px] transition-colors"
              aria-label="Toggle admin navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb / Section Name */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B6C67]">
              <span>Admin</span>
              <span>/</span>
              <span className="text-[#242522] font-medium">
                {NAV_ITEMS.find((item) => isItemActive(item.href, item.exact))?.label || "Console"}
              </span>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-wider text-[#A17C55] bg-[#F7F4EF] border border-[#DCD5CB] rounded-[2px]">
              {roleLabel}
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] transition-colors"
            >
              Live Site ↗
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#242522]/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Content */}
            <div className="relative w-72 max-w-xs bg-[#242522] text-[#F7F4EF] flex flex-col justify-between h-full p-6 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#3A3B37] pb-4">
                  <span className="font-serif text-2xl tracking-tight text-[#F7F4EF]">
                    Aurelle Spaces
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 text-[#DCD5CB] hover:text-[#FFFFFF]"
                  >
                    ✕
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item.href, item.exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-colors ${
                          active
                            ? "bg-[#A17C55] text-[#F7F4EF] font-medium"
                            : "text-[#DCD5CB] hover:bg-[#2E2F2C]"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#3A3B37] pt-4 space-y-3">
                <p className="text-xs text-[#F7F4EF] font-medium">{user.display_name}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-xs font-mono uppercase tracking-wider text-[#A14B3A]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

