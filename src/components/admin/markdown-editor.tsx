"use client";

import { forwardRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Textarea> & { value?: string };

/** Markdown textarea with a Write / Preview toggle. Works with react-hook-form's register(). */
export const MarkdownEditor = forwardRef<HTMLTextAreaElement, Props>(function MarkdownEditor(
  { className, onChange, ...props },
  ref,
) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [text, setText] = useState(String(props.defaultValue ?? ""));

  return (
    <div className="rounded-xl border">
      <div role="tablist" className="flex gap-1 border-b p-1.5">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm capitalize text-muted-foreground",
              tab === t && "bg-accent text-foreground",
            )}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto self-center pr-2 text-xs text-muted-foreground">Markdown</span>
      </div>
      <Textarea
        ref={ref}
        rows={18}
        className={cn(
          "rounded-none border-0 font-mono text-sm shadow-none",
          tab !== "write" && "hidden",
          className,
        )}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e);
        }}
        {...props}
      />
      {tab === "preview" && (
        <div className="min-h-[300px] p-5">
          {text.trim() ? (
            <Markdown content={text} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
});
