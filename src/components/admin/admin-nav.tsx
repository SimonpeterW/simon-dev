"use client";

import {
  Briefcase,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Blog posts", icon: Newspaper },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="border-b bg-card/50 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="font-mono text-sm font-bold">
            &lt;Simon<span className="text-brand-cyan">.dev</span>/&gt;
          </Link>
          <ThemeToggle />
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                active(href) && "bg-accent text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {href === "/admin/messages" && unread > 0 && (
                <span className="ml-auto rounded-full bg-brand-violet px-1.5 text-[11px] font-medium text-white">
                  {unread}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="justify-start self-start text-muted-foreground lg:mt-auto lg:self-stretch"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut /> Sign out
        </Button>
      </div>
    </aside>
  );
}
