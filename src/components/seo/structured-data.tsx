/**
 * Aurelle Spaces — Schema.org Structured Data Components (JSON-LD)
 * 
 * Injects valid, search-engine compliant JSON-LD structured data into page heads.
 * Strictly adheres to verified studio information without fabricating addresses,
 * phone numbers, ratings, customer reviews, or unverified awards.
 */

import React from "react";
import { SITE_NAME, DEFAULT_PRODUCTION_URL, canonicalUrl } from "@/lib/seo/config";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 1. Global Studio Organization Schema
 * Strictly represents Aurelle Spaces as an architectural and interior design studio concept
 * demonstrated by DRK Information Software Solutions. Never fabricates physical addresses.
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: DEFAULT_PRODUCTION_URL,
    logo: `${DEFAULT_PRODUCTION_URL}/icon.png`,
    description:
      "A bespoke architecture and interior design studio crafting timeless residential and commercial spaces across India. Demonstrated by DRK Information Software Solutions.",
    parentOrganization: {
      "@type": "Organization",
      name: "DRK Information Software Solutions",
    },
    sameAs: [
      "https://aurelle.dsecops88.online",
    ],
  };

  return <JsonLd data={schema} />;
}

/**
 * 2. WebSite Schema
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: DEFAULT_PRODUCTION_URL,
    inLanguage: "en-IN",
    description:
      "A bespoke architecture and interior design studio crafting timeless residential and commercial spaces across India.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: DEFAULT_PRODUCTION_URL,
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * 3. BreadcrumbList Schema
 */
export interface BreadcrumbItemSchema {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItemSchema[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : canonicalUrl(item.item),
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * 4. Service Schema (for /services/[slug])
 */
export interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}

export function ServiceJsonLd({ name, description, url, serviceType }: ServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url.startsWith("http") ? url : canonicalUrl(url),
    serviceType,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: DEFAULT_PRODUCTION_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * 5. Article Schema (for /journal/[slug])
 */
export interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Aurelle Spaces Editorial",
  imageUrl,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : canonicalUrl(url),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: DEFAULT_PRODUCTION_URL,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  };

  return <JsonLd data={schema} />;
}

/**
 * 6. WebPage / Portfolio Study Schema (for /portfolio/[slug] and static pages)
 */
export interface WebPageJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function WebPageJsonLd({ name, description, url }: WebPageJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: url.startsWith("http") ? url : canonicalUrl(url),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: DEFAULT_PRODUCTION_URL,
    },
  };

  return <JsonLd data={schema} />;
}

