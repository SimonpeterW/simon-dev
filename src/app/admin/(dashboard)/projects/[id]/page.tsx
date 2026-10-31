import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/lib/db";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await db.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${project.title}`} />
      <div className="-mt-4 mb-8 flex items-center gap-4">
        <Link
          href={`/projects/${project.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          View on site <ExternalLink className="size-3.5" />
        </Link>
        <DeleteButton
          action={deleteProject.bind(null, project.id)}
          confirmText={`Delete "${project.title}"?`}
          redirectTo="/admin/projects"
        />
      </div>
      <ProjectForm project={project} />
    </>
  );
}
