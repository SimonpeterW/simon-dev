import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PostView } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostView }) {
  return (
    <article className="group relative rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand-violet/40 hover:shadow-lg">
      <p className="font-mono text-xs text-muted-foreground">
        <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time> ·{" "}
        {post.readingTime} min read
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      {post.tagList.length > 0 && (
        <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {post.tagList.map((tag) => (
            <li key={tag}>
              <Link href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}>
                <Badge variant="outline" className="hover:bg-accent">
                  #{tag}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
