import type { Post, Project } from "@prisma/client";
import { cache } from "react";
import { db } from "@/lib/db";
import { readingTime, splitList } from "@/lib/utils";

export type ProjectView = Project & { tech: string[] };
export type PostView = Post & { tagList: string[]; readingTime: number };

const projectOrder = [
  { featured: "desc" as const },
  { order: "asc" as const },
  { year: "desc" as const },
];

const toProject = (p: Project): ProjectView => ({ ...p, tech: splitList(p.techStack) });

const toPost = (p: Post): PostView => ({
  ...p,
  tagList: splitList(p.tags),
  readingTime: readingTime(p.content),
});

export const getProjects = cache(async () => {
  const projects = await db.project.findMany({ where: { published: true }, orderBy: projectOrder });
  return projects.map(toProject);
});

export const getFeaturedProjects = cache(async (take = 3) => {
  const projects = await db.project.findMany({
    where: { published: true, featured: true },
    orderBy: projectOrder,
    take,
  });
  return projects.map(toProject);
});

export const getProjectBySlug = cache(async (slug: string) => {
  const project = await db.project.findFirst({ where: { slug, published: true } });
  return project ? toProject(project) : null;
});

export const getPosts = cache(async (tag?: string) => {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  const views = posts.map(toPost);
  if (!tag) return views;
  const wanted = tag.toLowerCase();
  return views.filter((p) => p.tagList.some((t) => t.toLowerCase() === wanted));
});

export const getPostBySlug = cache(async (slug: string) => {
  const post = await db.post.findFirst({ where: { slug, published: true } });
  return post ? toPost(post) : null;
});

export const getAllTags = cache(async () => {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts)
    for (const tag of post.tagList) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
});

export const getSkillsByCategory = cache(async () => {
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  const groups = new Map<string, typeof skills>();
  for (const skill of skills)
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
  return [...groups.entries()].map(([category, items]) => ({ category, items }));
});

export const getExperience = cache(() => db.experience.findMany({ orderBy: { order: "asc" } }));
