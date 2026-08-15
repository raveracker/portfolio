import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/content/experience";
import { navItems, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...navItems.map((item) => item.href),
    ...caseStudySlugs.map((slug) => `/work/${slug}`),
  ];

  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
