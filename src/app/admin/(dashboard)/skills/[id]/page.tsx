import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { db } from "@/lib/db";

export const metadata = { title: "Edit skill" };

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const [skill, categories] = await Promise.all([
    db.skill.findUnique({ where: { id: params.id } }),
    db.skill.findMany({ distinct: ["category"], select: { category: true } }),
  ]);
  if (!skill) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${skill.name}`} />
      <SkillForm skill={skill} categories={categories.map((c) => c.category)} />
    </>
  );
}
