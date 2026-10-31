import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { db } from "@/lib/db";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${post.title}`} />
      <div className="-mt-4 mb-8 flex items-center gap-4">
        {post.published && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            View on site <ExternalLink className="size-3.5" />
          </Link>
        )}
        <DeleteButton
          action={deletePost.bind(null, post.id)}
          confirmText={`Delete "${post.title}"?`}
          redirectTo="/admin/posts"
        />
      </div>
      <PostForm post={post} />
    </>
  );
}
