import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Space Not Found | Aurelle Spaces",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-16 bg-[#F7F4EF] text-[#242522]">
      <Container size="reading" className="text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#A17C55]">
          Error 404 • Spatial Notice
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#242522]">
          This space could not be found.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6C67] leading-relaxed max-w-md mx-auto">
          The architectural showcase, editorial monograph, or enquiry page you requested does not exist or has been archived.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary" size="md">
            Return to Studio
          </Button>
          <Button href="/portfolio" variant="secondary" size="md">
            Explore Portfolio
          </Button>
        </div>
      </Container>
    </div>
  );
}
