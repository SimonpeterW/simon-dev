import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";

export const metadata = { title: "Edit experience" };

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const item = await db.experience.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${item.title}`} />
      <ExperienceForm item={item} />
    </>
  );
}
