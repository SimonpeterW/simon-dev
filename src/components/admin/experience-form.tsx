"use client";

import type { Experience } from "@prisma/client";
import { saveExperience } from "@/app/admin/actions";
import { Field, SubmitBar, useAdminForm } from "@/components/admin/form-kit";
import { ImageUpload } from "@/components/admin/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";

export function ExperienceForm({ item }: { item?: Experience }) {
  const { form, onSubmit } = useAdminForm<ExperienceInput>({
    schema: experienceSchema,
    redirectTo: "/admin/experience",
    save: (values) => saveExperience(item?.id ?? null, values),
    defaultValues: {
      title: item?.title ?? "",
      organization: item?.organization ?? "",
      kind: item?.kind ?? "Work",
      location: item?.location ?? "",
      startDate: item?.startDate ?? "",
      endDate: item?.endDate ?? "",
      description: item?.description ?? "",
      image: item?.image ?? "",
      order: item?.order ?? 0,
    },
  });
  const { register, watch, setValue, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field form={form} name="title" label="Title / role">
          <Input id="title" {...register("title")} />
        </Field>
        <Field form={form} name="organization" label="Organization">
          <Input id="organization" {...register("organization")} />
        </Field>
        <Field form={form} name="kind" label="Type" hint="Work, Education, Community, Hackathon…">
          <Input id="kind" list="experience-kinds" {...register("kind")} />
          <datalist id="experience-kinds">
            {["Work", "Education", "Community", "Hackathon", "Award"].map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
        </Field>
        <Field form={form} name="location" label="Location">
          <Input id="location" {...register("location")} />
        </Field>
        <Field form={form} name="startDate" label="Start" hint="e.g. Jan 2025">
          <Input id="startDate" {...register("startDate")} />
        </Field>
        <Field form={form} name="endDate" label="End" hint="Leave empty or write Present">
          <Input id="endDate" {...register("endDate")} />
        </Field>
      </div>
      <Field form={form} name="description" label="Description">
        <Textarea id="description" rows={4} {...register("description")} />
      </Field>
      <Field form={form} name="image" label="Photo (optional)">
        <ImageUpload
          id="image"
          value={(watch("image") as string) ?? ""}
          onChange={(url) => setValue("image", url, { shouldDirty: true })}
        />
      </Field>
      <Field
        form={form}
        name="order"
        label="Sort order"
        hint="Lower appears first on the timeline"
        className="max-w-[160px]"
      >
        <Input id="order" type="number" min={0} {...register("order")} />
      </Field>
      <SubmitBar submitting={formState.isSubmitting} label={item ? "Save changes" : "Add entry"} />
    </form>
  );
}
