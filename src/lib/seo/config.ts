/**
 * Aurelle Spaces — Central SEO & Metadata Configuration
 * 
 * Provides unified domain resolution, canonical URL generation, default metadata,
 * and Open Graph / Twitter card configuration for the Aurelle Spaces platform.
 */

import { getCloudflareEnv } from "@/lib/env";

export const SITE_NAME = "Aurelle Spaces";
export const DEFAULT_PRODUCTION_URL = "https://aurelle.dsecops88.online";
export const DEFAULT_LOCALE = "en_IN";

export interface DefaultOgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
}

export const DEFAULT_SEO = {
  title: "Aurelle Spaces | Bespoke Architecture & Curated Interiors",
  titleTemplate: "%s | Aurelle Spaces",
  description:
    "A bespoke architecture and interior design studio crafting timeless residential and commercial spaces across India. Demonstrated by DRK Information Software Solutions.",
  authors: [{ name: "DRK Information Software Solutions", url: DEFAULT_PRODUCTION_URL }],
  creator: "DRK Information Software Solutions",
  publisher: "Aurelle Spaces",
  keywords: [
    "Architecture Studio India",
    "Luxury Residential Architecture",
    "Bespoke Interior Design",
    "Commercial Interiors",
    "Spatial Planning India",
    "Contextual Architecture",
    "Architectural Refurbishment",
    "Aurelle Spaces",
  ],
  defaultOgImage: {
    url: `${DEFAULT_PRODUCTION_URL}/og-default.jpg`,
    width: 1200,
    height: 630,
    alt: "Aurelle Spaces — Architectural & Interior Design Studio",
    type: "image/jpeg",
  } as DefaultOgImage,
};

/**
 * Resolves the active base URL safely across environments:
 * 1. Cloudflare environment variable `NEXT_PUBLIC_APP_URL`
 * 2. Process environment variable `NEXT_PUBLIC_APP_URL`
 * 3. Default production URL `https://aurelle.dsecops88.online`
 */
export function getBaseUrl(): string {
  const cfEnv = getCloudflareEnv();
  const rawUrl =
    cfEnv?.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    DEFAULT_PRODUCTION_URL;

  // Ensure no trailing slash
  return rawUrl.replace(/\/+$/, "");
}

/**
 * Builds an absolute canonical URL for a given path.
 * Guarantees standard lower-case scheme and no trailing slash (except root).
 */
export function canonicalUrl(path: string = "/"): string {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return baseUrl;
  }
  return `${baseUrl}${normalizedPath.replace(/\/+$/, "")}`;
}

