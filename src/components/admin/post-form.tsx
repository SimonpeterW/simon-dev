"use client";

import type { Post } from "@prisma/client";
import { savePost } from "@/app/admin/actions";
import { Checkbox, Field, SubmitBar, useAdminForm } from "@/components/admin/form-kit";
import { ImageUpload } from "@/components/admin/image-upload";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { postSchema, type PostInput } from "@/lib/validations";

export function PostForm({ post }: { post?: Post }) {
  const { form, onSubmit } = useAdminForm<PostInput>({
    schema: postSchema,
    redirectTo: "/admin/posts",
    save: (values) => savePost(post?.id ?? null, values),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      tags: post?.tags.split(",").join(", ") ?? "",
      published: post?.published ?? false,
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
                if (!post && !formState.dirtyFields.slug) setValue("slug", slugify(e.target.value));
              },
            })}
          />
        </Field>
        <Field form={form} name="slug" label="Slug" hint="Used in the URL: /blog/your-slug">
          <Input id="slug" {...register("slug")} />
        </Field>
      </div>

      <Field
        form={form}
        name="excerpt"
        label="Excerpt"
        hint="Shown on cards and as the SEO description."
      >
        <Textarea id="excerpt" rows={3} {...register("excerpt")} />
      </Field>

      <Field form={form} name="tags" label="Tags" hint="Comma-separated, e.g. AI, Next.js">
        <Input id="tags" {...register("tags")} />
      </Field>

      <Field form={form} name="coverImage" label="Cover image (optional)">
        <ImageUpload
          id="coverImage"
          value={(watch("coverImage") as string) ?? ""}
          onChange={(url) => setValue("coverImage", url, { shouldDirty: true })}
        />
      </Field>

      <Field form={form} name="content" label="Body">
        <MarkdownEditor id="content" defaultValue={post?.content ?? ""} {...register("content")} />
      </Field>

      <Checkbox form={form} name="published" label="Published (visible on the blog)" />

      <SubmitBar
        submitting={formState.isSubmitting}
        label={post ? "Save changes" : "Create post"}
      />
    </form>
  );
}
