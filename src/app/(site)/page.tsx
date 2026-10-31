import {
  ArrowRight,
  BrainCircuit,
  Database,
  Globe,
  Server,
  Smartphone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects, getPosts } from "@/lib/queries";

export const revalidate = 60;

const services = [
  {
    icon: BrainCircuit,
    title: "AI & ML",
    body: "Real-world problem solving with AI — from image recognition to automation. Alumni of multiple Google AI trainings.",
  },
  {
    icon: Database,
    title: "Database design",
    body: "Secure, efficient data models in MySQL, MongoDB, MariaDB and PostgreSQL.",
  },
  {
    icon: Server,
    title: "Back-end",
    body: "APIs and business logic with Node.js, Express, Python and Django.",
  },
  {
    icon: Globe,
    title: "Web",
    body: "Fast, responsive, accessible sites with React, Next.js and Tailwind CSS.",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    body: "Cross-platform iOS and Android apps with React Native.",
  },
  {
    icon: Search,
    title: "User research",
    body: "Understanding users first — backed by solid documentation and research writing.",
  },
];

export default async function HomePage() {
  const [featured, posts] = await Promise.all([getFeaturedProjects(3), getPosts()]);

  return (
    <>
      <Hero />

      <section className="container py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects"
            description="A few things I've designed, built and shipped."
          />
          <Reveal>
            <Button asChild variant="outline">
              <Link href="/projects">
                All projects <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <RevealItem key={project.id}>
              <ProjectCard project={project} priority={i === 0} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-y bg-muted/30 py-24">
        <div className="container">
          <SectionHeading
            eyebrow="What I do"
            title="From data model to user interface"
            description="I work across the stack, so ideas go from whiteboard to production without getting lost in hand-offs."
            className="mb-12"
          />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, body }) => (
              <RevealItem
                key={title}
                className="group rounded-2xl border bg-card p-6 transition-colors hover:border-brand-cyan/40"
              >
                <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl border bg-gradient-to-br from-brand-cyan/15 to-brand-violet/15">
                  <Icon className="size-5 text-brand-violet" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container py-24">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Writing" title="Latest from the blog" />
            <Button asChild variant="outline">
              <Link href="/blog">
                All posts <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="container py-24">
        <Reveal className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_0%,hsl(var(--brand-violet)/0.25),transparent_50%),radial-gradient(circle_at_80%_100%,hsl(var(--brand-cyan)/0.2),transparent_50%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s build <span className="text-gradient">something great.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Have a project, role or idea in mind? I&apos;m available for freelance work and
              opportunities.
            </p>
            <Button asChild variant="gradient" size="lg" className="mt-8">
              <Link href="/contact">
                Start a conversation <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
