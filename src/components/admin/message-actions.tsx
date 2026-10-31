"use client";

import { Mail, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/form-kit";
import { Button } from "@/components/ui/button";

export function MessageActions({ id, read, email }: { id: string; read: boolean; email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button asChild variant="outline" size="sm">
        <a href={`mailto:${email}`}>Reply</a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await setMessageRead(id, !read);
            if (!result.ok) return void toast.error(result.error);
            router.refresh();
          })
        }
      >
        {read ? <Mail /> : <MailOpen />}
        Mark {read ? "unread" : "read"}
      </Button>
      <DeleteButton action={deleteMessage.bind(null, id)} confirmText="Delete this message?" />
    </div>
  );
}
