import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://aurelle.dsecops88.online"),
  title: {
    default: "Aurelle Spaces | Architecture & Interior Design Studio",
    template: "%s | Aurelle Spaces",
  },
  description:
    "Aurelle Spaces is a bespoke architecture and interior design studio crafting timeless residential and commercial spaces across India. Demonstrated by DRK Information Software Solutions.",
  authors: [{ name: "DRK Information Software Solutions" }],
  keywords: [
    "Architecture Studio India",
    "Luxury Interior Design",
    "Bespoke Spatial Design",
    "Residential Architecture",
    "Commercial Interiors",
    "Aurelle Spaces",
  ],
  openGraph: {
    title: "Aurelle Spaces | Architecture & Interior Design Studio",
    description:
      "Bespoke spatial design, contextual architecture, and refined interiors across India.",
    url: "https://aurelle.dsecops88.online",
    siteName: "Aurelle Spaces",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#8c6d48] selection:text-white">
        {children}
      </body>
    </html>
  );
}
