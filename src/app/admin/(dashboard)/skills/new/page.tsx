import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { db } from "@/lib/db";

export const metadata = { title: "Add skill" };

export default async function NewSkillPage() {
  const categories = await db.skill.findMany({
    distinct: ["category"],
    select: { category: true },
  });
  return (
    <>
      <PageHeader title="Add skill" />
      <SkillForm categories={categories.map((c) => c.category)} />
    </>
  );
}
