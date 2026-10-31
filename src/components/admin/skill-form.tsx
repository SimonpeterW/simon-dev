"use client";

import type { Skill } from "@prisma/client";
import { saveSkill } from "@/app/admin/actions";
import { Field, SubmitBar, useAdminForm } from "@/components/admin/form-kit";
import { Input } from "@/components/ui/input";
import { skillSchema, type SkillInput } from "@/lib/validations";

export function SkillForm({ skill, categories }: { skill?: Skill; categories: string[] }) {
  const { form, onSubmit } = useAdminForm<SkillInput>({
    schema: skillSchema,
    redirectTo: "/admin/skills",
    save: (values) => saveSkill(skill?.id ?? null, values),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? categories[0] ?? "",
      level: skill?.level ?? 3,
      order: skill?.order ?? 0,
    },
  });
  const { register, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-6">
      <Field form={form} name="name" label="Skill">
        <Input id="name" {...register("name")} />
      </Field>
      <Field
        form={form}
        name="category"
        label="Category"
        hint="Pick an existing one or type a new category."
      >
        <Input id="category" list="skill-categories" {...register("category")} />
        <datalist id="skill-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field form={form} name="level" label="Level (1–5)">
          <Input id="level" type="number" min={1} max={5} {...register("level")} />
        </Field>
        <Field form={form} name="order" label="Sort order">
          <Input id="order" type="number" min={0} {...register("order")} />
        </Field>
      </div>
      <SubmitBar submitting={formState.isSubmitting} label={skill ? "Save changes" : "Add skill"} />
    </form>
  );
}
