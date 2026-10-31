"use client";

import type { Project } from "@prisma/client";
import { saveProject } from "@/app/admin/actions";
import { Checkbox, Field, SubmitBar, useAdminForm } from "@/components/admin/form-kit";
import { ImageUpload } from "@/components/admin/image-upload";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { projectSchema, type ProjectInput } from "@/lib/validations";

export function ProjectForm({ project }: { project?: Project }) {
  const { form, onSubmit } = useAdminForm<ProjectInput>({
    schema: projectSchema,
    redirectTo: "/admin/projects",
    save: (values) => saveProject(project?.id ?? null, values),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      content: project?.content ?? "",
      coverImage: project?.coverImage ?? "",
      techStack: project?.techStack.split(",").join(", ") ?? "",
      liveUrl: project?.liveUrl ?? "",
      repoUrl: project?.repoUrl ?? "",
      role: project?.role ?? "",
      year: project?.year ?? new Date().getFullYear(),
      featured: project?.featured ?? false,
      published: project?.published ?? true,
      order: project?.order ?? 0,
    },
  });
  const { register, watch, setValue, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field form={form} name="title" label="Title">
          <Input
            id="title"
            {...register("title", {
              onChange: (e) => {
                if (!project && !formState.dirtyFields.slug) {
                  setValue("slug", slugify(e.target.value));
                }
              },
            })}
          />
        </Field>
        <Field form={form} name="slug" label="Slug" hint="Used in the URL: /projects/your-slug">
          <Input id="slug" {...register("slug")} />
        </Field>
      </div>

      <Field
        form={form}
        name="summary"
        label="Summary"
        hint="One or two sentences for cards and SEO."
      >
        <Textarea id="summary" rows={3} {...register("summary")} />
      </Field>

      <Field form={form} name="coverImage" label="Cover image">
        <ImageUpload
          id="coverImage"
          value={(watch("coverImage") as string) ?? ""}
          onChange={(url) => setValue("coverImage", url, { shouldDirty: true })}
        />
      </Field>

      <Field
        form={form}
        name="techStack"
        label="Tech stack"
        hint="Comma-separated, e.g. React, Node.js, MySQL"
      >
        <Input id="techStack" {...register("techStack")} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field form={form} name="liveUrl" label="Live URL">
          <Input id="liveUrl" placeholder="https://…" {...register("liveUrl")} />
        </Field>
        <Field form={form} name="repoUrl" label="Repository URL">
          <Input id="repoUrl" placeholder="https://github.com/…" {...register("repoUrl")} />
        </Field>
        <Field form={form} name="role" label="Your role">
          <Input id="role" {...register("role")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field form={form} name="year" label="Year">
            <Input id="year" type="number" {...register("year")} />
          </Field>
          <Field form={form} name="order" label="Sort order" hint="Lower comes first">
            <Input id="order" type="number" {...register("order")} />
          </Field>
        </div>
      </div>

      <Field form={form} name="content" label="Case study">
        <MarkdownEditor
          id="content"
          defaultValue={project?.content ?? ""}
          {...register("content")}
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Checkbox form={form} name="published" label="Published" />
        <Checkbox form={form} name="featured" label="Featured on home page" />
      </div>

      <SubmitBar
        submitting={formState.isSubmitting}
        label={project ? "Save changes" : "Create project"}
      />
    </form>
  );
}
