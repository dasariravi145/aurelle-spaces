import React from "react";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/security/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Studio Administration | Aurelle Spaces",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce session check on all dashboard pages
  const authContext = await requireAdminSession();

  return <AdminNav user={authContext.user}>{children}</AdminNav>;
}

