import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-between py-12 sm:py-16">
      {/* Studio Brand Header Primitive */}
      <header className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <Container size="lg" className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-medium">
              Architecture &amp; Interior Design
            </span>
            <h1 className="text-xl sm:text-2xl font-light tracking-wide text-stone-900 dark:text-stone-100">
              Aurelle Spaces
            </h1>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Foundation Initialised — Prompt 01
            </span>
          </div>
        </Container>
      </header>

      {/* Main Studio Architectural Showcase Placeholder */}
      <main className="flex-1 flex items-center my-12">
        <Container size="lg">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8c6d48] dark:text-[#bfa17a] font-semibold">
              DRK Information Software Solutions • Demonstration Platform
            </p>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-[1.15]">
              Form, materiality and light in quiet harmony.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-normal leading-relaxed max-w-2xl">
              Aurelle Spaces is undergoing foundational development. Our technical foundation is now
              configured for Cloudflare Workers, Next.js App Router, and responsive design systems.
              The complete original visual identity and design system will arrive in Prompt 02.
            </p>

            {/* Architecture Scope Overview Grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
                <span className="text-xs font-mono text-stone-400 dark:text-stone-500">01 / PUBLIC</span>
                <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1">Spatial Portfolio</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Editorial showcase of residential &amp; commercial architecture case studies.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
                <span className="text-xs font-mono text-stone-400 dark:text-stone-500">02 / INTERACTION</span>
                <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1">Studio Assistant</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Conversational assistant guiding prospective clients through project scopes.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
                <span className="text-xs font-mono text-stone-400 dark:text-stone-500">03 / OPERATIONS</span>
                <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1">Cloudflare &amp; n8n</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Cloudflare D1, R2 media storage, and automated client workflow pipelines.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Semantic Footer Primitive */}
      <footer className="border-t border-stone-200 dark:border-stone-800 pt-6">
        <Container size="lg" className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-2">
          <p>© {new Date().getFullYear()} Aurelle Spaces. All rights reserved.</p>
          <p className="font-mono">
            Planned URL: <span className="text-stone-700 dark:text-stone-300">https://aurelle.dsecops88.online</span>
          </p>
        </Container>
      </footer>
    </div>
  );
}
