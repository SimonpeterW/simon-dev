import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, formatDate, isOptimizableImage } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tagList,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [siteConfig.name],
      tags: post.tagList,
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tagList.join(", "),
  };

  return (
    <article className="container max-w-3xl pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All posts
      </Link>

      <Reveal>
        <p className="font-mono text-xs text-muted-foreground">
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time> ·{" "}
          {post.readingTime} min read
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        {post.tagList.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
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
      </Reveal>

      {post.coverImage && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border">
          <Image
            src={post.coverImage}
            unoptimized={!isOptimizableImage(post.coverImage)}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <Markdown content={post.content} className="mt-12" />
    </article>
  );
}
