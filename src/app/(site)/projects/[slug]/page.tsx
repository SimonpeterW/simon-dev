import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/motion";
import { ProjectCover } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getProjects } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      ...(project.coverImage && { images: [{ url: project.coverImage }] }),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const all = await getProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const next = all[(index + 1) % all.length];

  const facts = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year?.toString() },
  ].filter((f) => f.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    author: { "@type": "Person", name: siteConfig.name },
    ...(project.liveUrl && { url: project.liveUrl }),
  };

  return (
    <article className="pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container max-w-4xl">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All projects
        </Link>

        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">Case study</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <Button asChild variant="gradient">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Visit live site <ArrowUpRight />
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild variant="outline">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github /> Source code
                </a>
              </Button>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="container mt-12 max-w-5xl">
        <ProjectCover
          project={project}
          priority
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="aspect-[16/9] rounded-3xl border"
        />
      </Reveal>

      <div className="container mt-14 grid max-w-5xl gap-12 lg:grid-cols-[1fr_240px]">
        <Markdown content={project.content} />

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {f.label}
              </p>
              <p className="mt-1.5 font-medium">{f.value}</p>
            </div>
          ))}
          {project.tech.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Tech stack
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t}>
                    <Link href={`/projects?tech=${encodeURIComponent(t)}`}>
                      <Badge variant="tech">{t}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {next && next.id !== project.id && (
        <div className="container mt-20 max-w-5xl">
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between rounded-2xl border bg-card p-6 transition-colors hover:border-brand-violet/40 sm:p-8"
          >
            <div>
              <p className="text-sm text-muted-foreground">Next project</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{next.title}</p>
            </div>
            <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}
