import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Add experience" };

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader title="Add experience" />
      <ExperienceForm />
    </>
  );
}
