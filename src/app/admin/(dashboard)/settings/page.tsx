import React from "react";
import { requireAdminSession } from "@/lib/security/auth";
import { getRoleDisplayName } from "@/lib/security/rbac";

export default async function AdminSettingsPage() {
  const { user } = await requireAdminSession();
  const roleLabel = getRoleDisplayName(user.role);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#A17C55] block">
          Studio Configuration
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#242522]">
          Settings &amp; Accounts
        </h1>
        <p className="text-xs text-[#6B6C67] pt-1">
          Manage administrative privileges, studio contact routing, and deployment configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Account Card */}
        <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-4">
          <h2 className="font-serif text-xl font-normal text-[#242522]">
            Your Administrative Profile
          </h2>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#6B6C67] font-mono uppercase text-[0.68rem] block">Full Name</span>
              <p className="font-medium text-[#242522]">{user.display_name}</p>
            </div>
            <div>
              <span className="text-[#6B6C67] font-mono uppercase text-[0.68rem] block">Email Address</span>
              <p className="font-medium text-[#242522]">{user.email}</p>
            </div>
            <div>
              <span className="text-[#6B6C67] font-mono uppercase text-[0.68rem] block">Assigned Role</span>
              <p className="font-mono text-[#A17C55]">{roleLabel}</p>
            </div>
            <div>
              <span className="text-[#6B6C67] font-mono uppercase text-[0.68rem] block">Account Status</span>
              <span className="inline-block px-2 py-0.5 text-[0.65rem] font-mono uppercase bg-[#EAE4D9] text-[#242522] rounded-[2px]">
                {user.account_status}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="p-6 bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] space-y-4">
          <h2 className="font-serif text-xl font-normal text-[#242522]">
            Studio Security Posture
          </h2>
          <ul className="space-y-2 text-xs text-[#6B6C67]">
            <li className="flex items-start gap-2">
              <span className="text-[#A17C55] font-mono">✓</span>
              <span>Web Crypto PBKDF2-SHA256 password verification (100,000 iterations).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A17C55] font-mono">✓</span>
              <span>Server-managed sessions with SHA-256 token hashing in Cloudflare D1.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A17C55] font-mono">✓</span>
              <span>HttpOnly, Secure, SameSite=Lax authentication cookies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A17C55] font-mono">✓</span>
              <span>Brute-force lockout: Max 5 failed attempts per IP/email in 15 minutes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A17C55] font-mono">✓</span>
              <span>Audit trail logging for all administrative authentications and mutations.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

