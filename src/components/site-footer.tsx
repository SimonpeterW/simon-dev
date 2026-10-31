import Link from "next/link";
import { siteConfig } from "@/lib/site";

const socials = [
  { href: siteConfig.links.github, label: "GitHub" },
  { href: siteConfig.links.linkedin, label: "LinkedIn" },
  { href: siteConfig.links.leetcode, label: "LeetCode" },
  { href: siteConfig.links.codewars, label: "CodeWars" },
  { href: siteConfig.links.x, label: "X" },
  { href: siteConfig.links.instagram, label: "Instagram" },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm font-bold">
            &lt;Simon<span className="text-brand-cyan">.dev</span>/&gt;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.slogan}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {socials.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
