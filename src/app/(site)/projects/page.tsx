import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid } from "@/components/project-grid";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies of SimonPeter's work — AI & ML, full-stack web apps, health systems and more.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="container pb-24 pt-36">
      <SectionHeading
        as="h1"
        eyebrow="Work"
        title="Projects"
        description="Things I've designed, built and shipped. Filter by technology to find what's relevant to you."
        className="mb-10"
      />
      <Suspense>
        <ProjectGrid projects={projects} />
      </Suspense>
    </div>
  );
}
