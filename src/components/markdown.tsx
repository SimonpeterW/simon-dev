import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Renders trusted-author Markdown (raw HTML is not enabled). */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand-violet prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
