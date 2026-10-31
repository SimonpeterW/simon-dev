import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getAllTags, getPosts } from "@/lib/queries";

export const revalidate = 60;

type Props = { params: { tag: string } };

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag: tag.toLowerCase() }));
}

const label = (tag: string) => decodeURIComponent(tag);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = label(params.tag);
  return {
    title: `Posts tagged #${tag}`,
    description: `Articles about ${tag} by SimonPeter.`,
    alternates: { canonical: `/blog/tags/${params.tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const tag = label(params.tag);
  const posts = await getPosts(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="container max-w-5xl pb-24 pt-36">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All posts
      </Link>
      <SectionHeading
        as="h1"
        eyebrow="Tag"
        title={`#${posts[0].tagList.find((t) => t.toLowerCase() === tag.toLowerCase()) ?? tag}`}
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
        className="mb-10"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
