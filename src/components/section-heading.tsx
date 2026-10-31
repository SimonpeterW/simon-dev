import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, className, as: Tag = "h2" }: Props) {
  const content = (
    <>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
          {eyebrow}
        </p>
      )}
      <Tag className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</Tag>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </>
  );

  // Page titles are above the fold: animate with CSS so they paint before hydration.
  if (Tag === "h1") {
    return (
      <div
        className={cn(
          "max-w-2xl duration-700 ease-out animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return <Reveal className={cn("max-w-2xl", className)}>{content}</Reveal>;
}
