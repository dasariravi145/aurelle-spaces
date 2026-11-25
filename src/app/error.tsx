"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Aurelle Spaces — Global Client Error Boundary
 * Provides an elegant, on-brand architectural fallback for unexpected client runtime exceptions.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected errors for monitoring
    if (typeof window !== "undefined") {
      console.error("[Aurelle Global Error Boundary]", {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      });
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24 bg-[#F7F4EF]">
      <Container size="reading" className="text-center">
        {/* Monograph Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DCD5CB] bg-[#FFFFFF]/70 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A17C55]" />
          <span className="text-[0.65rem] font-mono uppercase tracking-[0.22em] text-[#A17C55]">
            Notice 500 — Application Event
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#242522] tracking-tight leading-tight mb-4">
          An Unanticipated Spatial Interruption
        </h1>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-[#6B6C67] leading-relaxed max-w-lg mx-auto mb-8 font-light">
          We encountered an unexpected condition while rendering this perspective.
          Our technical custodians have logged the occurrence. You may attempt to
          re-establish the view or return to our architectural portfolio.
        </p>

        {/* Diagnostic reference code if available */}
        {error.digest && (
          <div className="inline-block px-3 py-1.5 mb-8 rounded-[2px] bg-[#EFECE6] border border-[#DCD5CB] text-[0.68rem] font-mono text-[#6B6C67]">
            Event Digest: <span className="text-[#242522] font-semibold">{error.digest}</span>
          </div>
        )}

        {/* Recovery Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
          >
            Attempt Recovery
          </Button>
          <Button
            href="/portfolio"
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
          >
            Explore Portfolio
          </Button>
          <Link
            href="/contact"
            className="text-xs uppercase tracking-widest font-mono text-[#6B6C67] hover:text-[#242522] transition-colors py-2"
          >
            Contact Studio Concierge →
          </Link>
        </div>
      </Container>
    </div>
  );
}

