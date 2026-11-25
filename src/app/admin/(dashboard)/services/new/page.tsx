import React from "react";
import { requireAdminSession } from "@/lib/security/auth";
import { ServiceForm } from "@/components/admin/service-form";

export default async function NewServicePage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Services CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Create Design Discipline
        </h1>
      </div>

      <ServiceForm mode="create" />
    </div>
  );
}

