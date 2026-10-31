import Link from "next/link";
import { deleteProject } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { EmptyRow, PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";

export const metadata = { title: "Projects" };

export default async function AdminProjects() {
  const projects = await db.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies shown on /projects."
        newHref="/admin/projects/new"
        newLabel="New project"
      />
      {projects.length === 0 ? (
        <EmptyRow>No projects yet.</EmptyRow>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="truncate text-sm text-muted-foreground">/projects/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.featured && <Badge variant="tech">Featured</Badge>}
                <Badge variant={p.published ? "success" : "outline"}>
                  {p.published ? "Published" : "Hidden"}
                </Badge>
                <DeleteButton
                  action={deleteProject.bind(null, p.id)}
                  confirmText={`Delete "${p.title}"?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
