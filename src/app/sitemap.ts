import type { MetadataRoute } from "next";
import { getAllTags, getPosts, getProjects } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, tags] = await Promise.all([getProjects(), getPosts(), getAllTags()]);
  const now = new Date();

  const staticRoutes = ["/", "/projects", "/about", "/blog", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...tags.map(({ tag }) => ({
      url: absoluteUrl(`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`),
      lastModified: now,
      priority: 0.3,
    })),
  ];
}
