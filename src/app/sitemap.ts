import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo/config";
import { getPublicServices, getPublicProjects, getPublicArticles } from "@/lib/cms/content-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Core public static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl("/"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: canonicalUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("/services"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: canonicalUrl("/process"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("/portfolio"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: canonicalUrl("/journal"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: canonicalUrl("/privacy-policy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: canonicalUrl("/terms-of-use"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic published services
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const services = await getPublicServices();
    serviceRoutes = services.map((s) => ({
      url: canonicalUrl(`/services/${s.slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Graceful fallback if CMS repository is uninitialized
  }

  // 3. Dynamic published portfolio projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getPublicProjects();
    projectRoutes = projects.map((p) => ({
      url: canonicalUrl(`/portfolio/${p.slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Graceful fallback
  }

  // 4. Dynamic published journal articles
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getPublicArticles();
    articleRoutes = articles.map((a) => ({
      url: canonicalUrl(`/journal/${a.slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Graceful fallback
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...articleRoutes,
  ];
}

