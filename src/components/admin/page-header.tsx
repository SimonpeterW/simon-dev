import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  newHref,
  newLabel,
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {newHref && (
        <Button asChild variant="gradient">
          <Link href={newHref}>
            <Plus /> {newLabel ?? "New"}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
