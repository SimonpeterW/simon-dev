import Link from "next/link";
import { deleteSkill } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { EmptyRow, PageHeader } from "@/components/admin/page-header";
import { getSkillsByCategory } from "@/lib/queries";

export const metadata = { title: "Skills" };

export default async function AdminSkills() {
  const groups = await getSkillsByCategory();

  return (
    <>
      <PageHeader
        title="Skills"
        description="Grouped by category on /about."
        newHref="/admin/skills/new"
        newLabel="Add skill"
      />
      {groups.length === 0 && <EmptyRow>No skills yet.</EmptyRow>}
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.category} className="rounded-2xl border bg-card">
            <h2 className="border-b px-4 py-3 font-mono text-xs uppercase tracking-widest text-brand-cyan">
              {g.category}
            </h2>
            <ul className="divide-y">
              {g.items.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <Link href={`/admin/skills/${s.id}`} className="flex-1 hover:underline">
                    {s.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{s.level}/5</span>
                  <DeleteButton
                    action={deleteSkill.bind(null, s.id)}
                    label=""
                    confirmText={`Delete "${s.name}"?`}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
