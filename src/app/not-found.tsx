import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-16 bg-[#faf8f5] dark:bg-[#141312] text-stone-900 dark:text-stone-100">
      <Container size="sm" className="text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8c6d48] dark:text-[#bfa17a]">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
          This space could not be found.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
          The architectural showcase, editorial article, or enquiry page you requested does not exist or has moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white transition-colors"
          >
            Return to Studio
          </Link>
        </div>
      </Container>
    </div>
  );
}

