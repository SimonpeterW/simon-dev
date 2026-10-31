"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectCard } from "@/components/project-card";
import type { ProjectView } from "@/lib/queries";
import { cn } from "@/lib/utils";

/** Filterable project grid; the active filter lives in ?tech= so it is shareable. */
export function ProjectGrid({ projects }: { projects: ProjectView[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("tech");
  const reduce = useReducedMotion();

  const techs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [projects]);

  const visible = active
    ? projects.filter((p) => p.tech.some((t) => t.toLowerCase() === active.toLowerCase()))
    : projects;

  const select = (tech: string | null) => {
    const next = new URLSearchParams(params);
    if (tech) next.set("tech", tech);
    else next.delete("tech");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const chip = (label: string, value: string | null, count?: number) => {
    const isActive = (active ?? null)?.toLowerCase() === value?.toLowerCase();
    return (
      <button
        key={label}
        type="button"
        onClick={() => select(value)}
        aria-pressed={isActive}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
          isActive
            ? "border-transparent bg-foreground text-background"
            : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
        )}
      >
        {label}
        {count !== undefined && <span className="ml-1.5 text-xs opacity-60">{count}</span>}
      </button>
    );
  };

  return (
    <div>
      <div role="group" aria-label="Filter by tech stack" className="mb-10 flex flex-wrap gap-2">
        {chip("All", null, projects.length)}
        {techs.map(([t, n]) => chip(t, t, n))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} project{visible.length === 1 ? "" : "s"}
        {active ? ` using ${active}` : ""}
      </p>

      {/* Filtered-out cards leave immediately (no exit animation to wait on); the rest re-flow. */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <motion.li
            key={project.id}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <ProjectCard project={project} priority={i < 3} />
          </motion.li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No projects use {active} yet.</p>
      )}
    </div>
  );
}
