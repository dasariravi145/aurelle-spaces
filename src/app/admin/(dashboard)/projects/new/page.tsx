import React from "react";
import { requireAdminSession } from "@/lib/security/auth";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Portfolio CMS
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Create Project Monograph
        </h1>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}

