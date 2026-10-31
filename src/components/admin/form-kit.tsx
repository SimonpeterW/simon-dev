"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Shared admin form wiring: Zod validation on the client (raw values are sent,
 * the server action re-validates with the same schema), toasts, and redirect.
 */
export function useAdminForm<T extends FieldValues>({
  schema,
  defaultValues,
  save,
  redirectTo,
}: {
  schema: z.ZodTypeAny;
  defaultValues: DefaultValues<T>;
  save: (values: T) => Promise<ActionResult>;
  redirectTo?: string;
}) {
  const router = useRouter();
  const form = useForm<T>({
    resolver: zodResolver(schema, undefined, { raw: true }),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await save(values);
    if (!result.ok) {
      toast.error("Couldn't save", { description: result.error });
      return;
    }
    toast.success("Saved");
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  });

  return { form, onSubmit };
}

export function Field<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
  children,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function Checkbox<T extends FieldValues>({
  form,
  name,
  label,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        className="size-4 rounded border-input accent-[hsl(var(--brand-violet))]"
        {...form.register(name)}
      />
      {label}
    </label>
  );
}

export function SubmitBar({ submitting, label = "Save" }: { submitting: boolean; label?: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 border-t pt-6">
      <Button type="submit" variant="gradient" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" />}
        {submitting ? "Saving…" : label}
      </Button>
      <Button type="button" variant="ghost" onClick={() => router.back()}>
        Cancel
      </Button>
    </div>
  );
}

export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this item? This can't be undone.",
  redirectTo,
}: {
  action: () => Promise<ActionResult>;
  label?: string;
  confirmText?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={pending}
      aria-label={label || "Delete"}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          const result = await action();
          if (!result.ok) return void toast.error(result.error);
          toast.success("Deleted");
          if (redirectTo) router.push(redirectTo);
          router.refresh();
        });
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
      {label}
    </Button>
  );
}
