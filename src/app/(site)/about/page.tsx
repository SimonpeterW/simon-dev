import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoReveal } from "@/components/video-reveal";
import { getExperience, getSkillsByCategory } from "@/lib/queries";
import { siteConfig } from "@/lib/site";
import { cn, isOptimizableImage } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "About SimonPeter — a software engineer from Kisii, Kenya. Skills, experience timeline and resume.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "1.5+", label: "Years building" },
  { value: "40+", label: "Projects completed" },
  { value: "15+", label: "Public repositories" },
];

function LevelDots({ level }: { level: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`Proficiency ${level} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            i < level ? "bg-gradient-to-r from-brand-cyan to-brand-violet" : "bg-border",
          )}
        />
      ))}
    </span>
  );
}

export default async function AboutPage() {
  const [skillGroups, experience] = await Promise.all([getSkillsByCategory(), getExperience()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "Software Engineer",
    address: { "@type": "PostalAddress", addressLocality: "Kisii", addressCountry: "KE" },
    url: siteConfig.url,
    sameAs: Object.values(siteConfig.links),
  };

  return (
    <div className="pb-24 pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Bio */}
      <section className="container grid items-center gap-12 lg:grid-cols-[1fr_420px]">
        <div>
          <SectionHeading as="h1" eyebrow="About me" title="Engineer, builder, lifelong learner." />
          <Reveal
            delay={0.1}
            className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              I&apos;m a passionate software developer from{" "}
              <span className="text-foreground">Kisii, Kenya</span>, creating digital solutions that
              solve real-world problems. I specialise in{" "}
              <span className="text-foreground">
                design systems, AI &amp; ML, UI, databases and back-end integration
              </span>{" "}
              — and I deliver software that users love and businesses value.
            </p>
            <p>
              I&apos;m currently studying at <span className="text-foreground">PLP Academy</span>{" "}
              and <span className="text-foreground">Kisii University</span>, and I&apos;ve taken
              part in multiple Google AI trainings. Most recently I pitched{" "}
              <span className="text-foreground">AgriVision AI</span> at the Gusii Innovation Week
              Agritech Hackathon.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me learning new languages (Korean is the
              current one) or on the basketball court. 🏀
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gradient" size="lg">
              <a href={siteConfig.resume} download>
                <Download /> Download resume
              </a>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-cyan/40 to-brand-violet/40 opacity-60 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border">
            <Image
              src="/images/hackathon-build.jpg"
              alt="SimonPeter building at the Gusii Innovation Week Agritech Hackathon"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover object-[45%_center]"
            />
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="container mt-20">
        <RevealGroup className="grid grid-cols-3 divide-x rounded-2xl border bg-card">
          {stats.map((s) => (
            <RevealItem key={s.label} className="p-5 text-center sm:p-8">
              <p className="text-gradient text-3xl font-semibold tracking-tight sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Skills */}
      <section className="container mt-28">
        <SectionHeading
          eyebrow="Toolbox"
          title="Skills"
          description="Grouped by area — the dots are an honest self-rating."
          className="mb-12"
        />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <RevealItem key={group.category} className="rounded-2xl border bg-card p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
                {group.category}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((skill) => (
                  <li key={skill.id} className="flex items-center justify-between gap-4 text-sm">
                    <span>{skill.name}</span>
                    <LevelDots level={skill.level} />
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Timeline */}
      <section className="container mt-28">
        <SectionHeading eyebrow="Journey" title="Experience & milestones" className="mb-14" />
        <ol className="relative ml-3 border-l pl-8 sm:ml-4 sm:pl-10">
          {experience.map((item, i) => (
            <li key={item.id} className={cn("relative", i !== experience.length - 1 && "pb-14")}>
              <span
                aria-hidden
                className="absolute -left-[calc(2rem+5px)] top-1.5 size-2.5 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet ring-4 ring-background sm:-left-[calc(2.5rem+5px)]"
              />
              <Reveal className="grid gap-6 md:grid-cols-[1fr_260px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {item.startDate}
                      {item.endDate ? ` — ${item.endDate}` : ""}
                    </span>
                    <Badge variant="outline">{item.kind}</Badge>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.organization}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
                {item.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
                    <Image
                      src={item.image}
                      unoptimized={!isOptimizableImage(item.image)}
                      alt={`${item.title} — ${item.organization}`}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Beyond code */}
      <section className="container mt-28">
        <Reveal className="grid items-center gap-8 rounded-3xl border bg-card p-6 sm:p-10 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
              Off the keyboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Ball is life. 🏀</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Basketball keeps me sharp — teamwork, quick decisions and showing up every day carry
              straight over to engineering.
            </p>
          </div>
          <VideoReveal src="/media/basketball.mp4" label="Watch me play" />
        </Reveal>
      </section>
    </div>
  );
}
