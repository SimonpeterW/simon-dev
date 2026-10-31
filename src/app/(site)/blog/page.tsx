import type { Metadata } from "next";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getAllTags, getPosts } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on software engineering, AI, databases and building products — by SimonPeter.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()]);

  return (
    <div className="container max-w-5xl pb-24 pt-36">
      <SectionHeading
        as="h1"
        eyebrow="Writing"
        title="Blog"
        description="Notes on engineering, AI and building things that matter."
        className="mb-10"
      />

      {tags.length > 0 && (
        <nav aria-label="Tags" className="mb-10 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              #{tag} <span className="text-xs opacity-60">{count}</span>
            </Link>
          ))}
        </nav>
      )}

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">First posts are on the way ✍️</p>
          <p className="mt-2 text-muted-foreground">Check back soon.</p>
        </div>
      ) : (
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
