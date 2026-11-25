import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/design-system",
        ],
      },
    ],
    sitemap: canonicalUrl("/sitemap.xml"),
  };
}

