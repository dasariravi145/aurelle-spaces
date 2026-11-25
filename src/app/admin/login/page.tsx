"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setErrorMessage(
          data?.error?.message || "Invalid administrative credentials. Please check your details."
        );
        setLoading(false);
        return;
      }

      // Successful login - redirect to dashboard shell
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("A network error occurred while signing in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#F7F4EF] text-[#242522] px-4 py-12">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center space-y-2 mb-8">
        <Link
          href="/"
          className="inline-block font-serif text-3xl sm:text-4xl tracking-tight text-[#242522] hover:text-[#A17C55] transition-colors"
        >
          Aurelle Spaces
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#A17C55] block">
          Studio Administration Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#DCD5CB] shadow-[0_4px_20px_rgba(36,37,34,0.04)] rounded-[2px] p-8 sm:p-10 space-y-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-normal text-[#242522]">
            Sign in to Studio
          </h1>
          <p className="text-xs text-[#6B6C67] leading-relaxed">
            Enter your authorized studio credentials to manage portfolio monographs, design disciplines, and client briefs.
          </p>
        </div>

        {/* Error Advisory */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-[#FAF2EF] border-l-2 border-[#A14B3A] text-xs text-[#A14B3A] rounded-[2px]"
          >
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="block text-xs font-mono uppercase tracking-wider text-[#242522]"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="director@aurelle.dsecops88.online"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] placeholder:text-[#6B6C67]/50 focus:outline-none focus:ring-1 focus:ring-[#A17C55] focus:border-[#A17C55] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono uppercase tracking-wider text-[#242522]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[0.7rem] font-mono uppercase tracking-wider text-[#A17C55] hover:text-[#242522] focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DCD5CB] rounded-[2px] text-[#242522] placeholder:text-[#6B6C67]/50 focus:outline-none focus:ring-1 focus:ring-[#A17C55] focus:border-[#A17C55] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#242522] hover:bg-[#3A3B37] text-[#F7F4EF] text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17C55] focus-visible:ring-offset-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#F7F4EF]/30 border-t-[#F7F4EF] rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign in to Studio →</span>
              )}
            </button>
          </div>
        </form>

        {/* Security & Access Notice */}
        <div className="pt-4 border-t border-[#DCD5CB] space-y-2 text-[0.7rem] text-[#6B6C67]">
          <div className="flex items-start gap-2">
            <span className="text-[#A17C55] font-mono font-bold">ℹ</span>
            <p>
              Access is restricted to authorized studio principals. Administrative accounts are provisioned via secure server CLI deployment. Self-registration is disabled.
            </p>
          </div>
        </div>
      </div>

      {/* Return to Public Site */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-[#6B6C67] hover:text-[#242522] transition-colors"
        >
          ← Return to Aurelle Spaces Website
        </Link>
      </div>
    </div>
  );
}

