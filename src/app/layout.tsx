import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StudioChatbot } from "@/components/chat/studio-chatbot";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/structured-data";
import { CloudflareAnalytics } from "@/components/analytics/cloudflare-analytics";
import { SITE_NAME, DEFAULT_SEO, DEFAULT_LOCALE, getBaseUrl } from "@/lib/seo/config";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: DEFAULT_SEO.title,
    template: DEFAULT_SEO.titleTemplate,
  },
  description: DEFAULT_SEO.description,
  authors: [...DEFAULT_SEO.authors],
  creator: DEFAULT_SEO.creator,
  publisher: DEFAULT_SEO.publisher,
  keywords: [...DEFAULT_SEO.keywords],
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: getBaseUrl(),
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
    type: "website",
    images: [
      {
        url: DEFAULT_SEO.defaultOgImage.url,
        width: DEFAULT_SEO.defaultOgImage.width,
        height: DEFAULT_SEO.defaultOgImage.height,
        alt: DEFAULT_SEO.defaultOgImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [DEFAULT_SEO.defaultOgImage.url],
    creator: "@AurelleSpaces",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <CloudflareAnalytics />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#F7F4EF] text-[#242522]">
        {/* Accessible Skip-to-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#242522] focus:text-[#F7F4EF] focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:outline-none focus:ring-2 focus:ring-[#A17C55] rounded-[2px] shadow-lg transition-transform"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <StudioChatbot />
      </body>
    </html>
  );
}
