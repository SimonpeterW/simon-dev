import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProjectView } from "@/lib/queries";
import { cn, isOptimizableImage } from "@/lib/utils";

/** Cover image, or a generated gradient monogram when a project has none. */
export function ProjectCover({
  project,
  className,
  priority,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
}: {
  project: Pick<ProjectView, "title" | "coverImage">;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", className)}>
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          unoptimized={!isOptimizableImage(project.coverImage)}
          alt={`${project.title} cover`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_20%_20%,hsl(var(--brand-cyan)/0.35),transparent_55%),radial-gradient(circle_at_80%_80%,hsl(var(--brand-violet)/0.45),transparent_55%)]"
        >
          <div className="bg-grid absolute inset-0 opacity-60" />
          <span className="relative font-mono text-5xl font-bold tracking-tighter text-foreground/80 transition-transform duration-500 group-hover:scale-110">
            {project.title
              .split(/\s+/)
              .filter((w) => /^[a-z0-9]/i.test(w))
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </span>
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, priority }: { project: ProjectView; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-violet/40 hover:shadow-xl hover:shadow-brand-violet/10">
      <ProjectCover project={project} priority={priority} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{project.year ?? ""}</span>
          {project.liveUrl && <Badge variant="success">Live</Badge>}
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.tech.slice(0, 5).map((t) => (
            <li key={t}>
              <Badge variant="tech">{t}</Badge>
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex items-center gap-4 pt-6 text-sm">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            Case study
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              aria-label={`${project.title} source code on GitHub`}
            >
              <Github className="size-4" /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
