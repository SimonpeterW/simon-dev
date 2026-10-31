import { EmptyRow, PageHeader } from "@/components/admin/page-header";
import { MessageActions } from "@/components/admin/message-actions";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages" };

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminMessages() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <PageHeader title="Messages" description="Submissions from the contact form." />
      {messages.length === 0 ? (
        <EmptyRow>No messages yet.</EmptyRow>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn("rounded-2xl border bg-card p-5", !m.read && "border-brand-violet/40")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {m.name}
                    {!m.read && <Badge variant="success">New</Badge>}
                    {!m.emailed && <Badge variant="outline">Not emailed</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">{m.email}</p>
                </div>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={m.createdAt.toISOString()}
                >
                  {dateTime.format(m.createdAt)}
                </time>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
              <div className="mt-4 border-t pt-3">
                <MessageActions id={m.id} read={m.read} email={m.email} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
