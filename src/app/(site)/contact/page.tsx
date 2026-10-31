import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hire SimonPeter or start a conversation about your next project.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: Linkedin, label: "LinkedIn", value: "simonpeter", href: siteConfig.links.linkedin },
  { icon: Github, label: "GitHub", value: "@SimonpeterW", href: siteConfig.links.github },
];

export default function ContactPage() {
  return (
    <div className="container grid gap-14 pb-24 pt-36 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's work together."
          description="Ready to start your next project? Tell me what you're building and I'll get back to you — usually within a day or two."
        />
        <Reveal delay={0.1} className="mt-10 space-y-3">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-brand-violet/40"
            >
              <span className="grid size-10 place-items-center rounded-xl border bg-muted">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </span>
            </a>
          ))}
          <p className="flex items-center gap-2 pt-3 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden /> {siteConfig.location} · open to remote work
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet text-white">
            <Mail className="size-5" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold">Send a message</h2>
        </div>
        <ContactForm />
      </Reveal>
    </div>
  );
}
