import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminOverview() {
  const [projects, posts, drafts, skills, messages, unread, recent] = await Promise.all([
    db.project.count(),
    db.post.count({ where: { published: true } }),
    db.post.count({ where: { published: false } }),
    db.skill.count(),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { read: false } }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    {
      label: "Published posts",
      value: posts,
      sub: `${drafts} draft${drafts === 1 ? "" : "s"}`,
      href: "/admin/posts",
    },
    { label: "Skills", value: skills, href: "/admin/skills" },
    { label: "Messages", value: messages, sub: `${unread} unread`, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader title="Overview" description="Everything on the site, at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border bg-card p-5 transition-colors hover:border-brand-violet/40"
          >
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{c.value}</p>
            {c.sub && <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent messages</h2>
          <Link
            href="/admin/messages"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {recent.map((m) => (
              <li key={m.id} className="flex items-start gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    {m.name} {!m.read && <Badge variant="success">New</Badge>}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(m.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/"
        target="_blank"
        className="mt-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        View live site <ExternalLink className="size-3.5" />
      </Link>
    </>
  );
}
