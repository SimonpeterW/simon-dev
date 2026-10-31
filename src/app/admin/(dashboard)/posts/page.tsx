import Link from "next/link";
import { deletePost } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { EmptyRow, PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog posts" };

export default async function AdminPosts() {
  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Blog posts"
        description="Markdown posts shown on /blog."
        newHref="/admin/posts/new"
        newLabel="New post"
      />
      {posts.length === 0 ? (
        <EmptyRow>No posts yet.</EmptyRow>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/posts/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {p.published
                    ? `Published ${formatDate(p.publishedAt)}`
                    : `Draft · edited ${formatDate(p.updatedAt)}`}
                </p>
              </div>
              <Badge variant={p.published ? "success" : "outline"}>
                {p.published ? "Published" : "Draft"}
              </Badge>
              <DeleteButton
                action={deletePost.bind(null, p.id)}
                confirmText={`Delete "${p.title}"?`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
