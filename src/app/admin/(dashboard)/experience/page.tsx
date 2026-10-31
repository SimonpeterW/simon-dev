import Link from "next/link";
import { deleteExperience } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { EmptyRow, PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { getExperience } from "@/lib/queries";

export const metadata = { title: "Experience" };

export default async function AdminExperience() {
  const items = await getExperience();

  return (
    <>
      <PageHeader
        title="Experience"
        description="The timeline on /about."
        newHref="/admin/experience/new"
        newLabel="Add entry"
      />
      {items.length === 0 ? (
        <EmptyRow>No entries yet.</EmptyRow>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {items.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/experience/${e.id}`} className="font-medium hover:underline">
                  {e.title}
                </Link>
                <p className="truncate text-sm text-muted-foreground">
                  {e.organization} · {e.startDate}
                  {e.endDate ? ` — ${e.endDate}` : ""}
                </p>
              </div>
              <Badge variant="outline">{e.kind}</Badge>
              <DeleteButton
                action={deleteExperience.bind(null, e.id)}
                confirmText={`Delete "${e.title}"?`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
