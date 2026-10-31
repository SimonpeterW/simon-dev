"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-transparent pl-5 pr-2 transition-all duration-300",
          (scrolled || open) && "glass border-border shadow-lg shadow-black/5",
        )}
      >
        <Link href="/" className="font-mono text-sm font-bold tracking-tight" aria-label="Home">
          &lt;Simon<span className="text-brand-cyan">.dev</span>/&gt;
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  isActive(item.href) && "text-foreground",
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="gradient" size="sm" className="hidden h-9 px-4 sm:inline-flex">
            <Link href="/contact">Hire me</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-[1200px] rounded-3xl p-2 shadow-xl md:hidden"
          >
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base text-muted-foreground hover:bg-accent hover:text-foreground",
                    isActive(item.href) && "bg-accent text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
