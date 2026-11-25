/**
 * Aurelle Spaces — Metadata Builder Helper
 * 
 * Standardises page metadata, canonical URLs, Open Graph, and Twitter card generation
 * across static and dynamic Next.js App Router pages.
 */

import type { Metadata } from "next";
import { SITE_NAME, DEFAULT_SEO, DEFAULT_LOCALE, canonicalUrl, getBaseUrl } from "./config";

export interface PageMetadataParams {
  title: string;
  description?: string;
  path: string;
  ogImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  } | string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds a uniform Next.js App Router Metadata object.
 */
export function createMetadata({
  title,
  description = DEFAULT_SEO.description,
  path,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: PageMetadataParams): Metadata {
  const url = canonicalUrl(path);
  const baseUrl = getBaseUrl();

  let resolvedOgImage = DEFAULT_SEO.defaultOgImage;
  if (typeof ogImage === "string") {
    resolvedOgImage = {
      url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
      width: 1200,
      height: 630,
      alt: title,
      type: "image/jpeg",
    };
  } else if (ogImage && typeof ogImage === "object") {
    resolvedOgImage = {
      url: ogImage.url.startsWith("http") ? ogImage.url : `${baseUrl}${ogImage.url}`,
      width: ogImage.width || 1200,
      height: ogImage.height || 630,
      alt: ogImage.alt || title,
      type: "image/jpeg",
    };
  }

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: ogType,
      images: [
        {
          url: resolvedOgImage.url,
          width: resolvedOgImage.width,
          height: resolvedOgImage.height,
          alt: resolvedOgImage.alt,
        },
      ],
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      ...(ogType === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(ogType === "article" && authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage.url],
      creator: "@AurelleSpaces",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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

  return metadata;
}

