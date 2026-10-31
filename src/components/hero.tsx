"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MapPin, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const roles = ["Software Engineer", "Full-stack Developer", "AI & ML Builder", "Database Designer"];

function RotatingRole() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <motion.span
        key={roles[index]}
        initial={reduce ? false : { y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.21, 0.7, 0.2, 1] }}
        className="text-gradient animate-shimmer whitespace-nowrap font-semibold"
      >
        {roles[index]}
      </motion.span>
    </span>
  );
}

function PromoDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label="SimonPeter promo video"
      className="w-[min(92vw,960px)] rounded-2xl border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <video
          src={siteConfig.promoVideo}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full bg-black"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3"
          onClick={onClose}
          aria-label="Close video"
          autoFocus
        >
          <X />
        </Button>
      </div>
    </dialog>
  );
}

export function Hero() {
  const [promoOpen, setPromoOpen] = useState(false);

  // CSS (not JS) entrance animation: the hero is server-rendered and paints
  // immediately (good LCP), even before React hydrates.
  const fadeUp = (delayMs: number, className: string) => ({
    className: cn(
      "animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-700 ease-out",
      className,
    ),
    style: { animationDelay: `${delayMs}ms` },
  });

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[560px] rounded-full bg-brand-violet/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-15%] top-1/2 -z-10 size-[480px] rounded-full bg-brand-cyan/15 blur-[120px]"
      />

      <div className="container grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div
            {...fadeUp(
              0,
              "mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300",
            )}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available for work
          </div>

          <h1
            {...fadeUp(
              80,
              "text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl",
            )}
          >
            Hey, I&apos;m <span className="text-gradient animate-shimmer">SimonPeter</span>.
          </h1>

          <p {...fadeUp(160, "mt-5 text-2xl tracking-tight sm:text-3xl")}>
            <RotatingRole />
          </p>

          <p {...fadeUp(240, "mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground")}>
            I build software that users love and businesses value — from AI that diagnoses crop
            disease to full-stack systems with well-designed databases. Student at{" "}
            <span className="text-foreground">PLP Academy</span> and{" "}
            <span className="text-foreground">Kisii University</span>.
          </p>

          <div {...fadeUp(320, "mt-9 flex flex-wrap items-center gap-3")}>
            <Button asChild variant="gradient" size="lg">
              <Link href="/contact">
                Get in touch <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={siteConfig.resume} download>
                <Download /> Resume
              </a>
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setPromoOpen(true)}>
              <Play /> Watch promo
            </Button>
          </div>

          <p
            {...fadeUp(
              400,
              "mt-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground",
            )}
          >
            <MapPin className="size-3.5" /> {siteConfig.location} · {siteConfig.slogan}
          </p>
        </div>

        <div
          className="relative mx-auto w-full max-w-sm duration-1000 ease-out animate-in fade-in zoom-in-95 fill-mode-both lg:max-w-none"
          style={{ animationDelay: "200ms" }}
        >
          <div className="absolute -inset-3 -z-10 rounded-[2.2rem] bg-gradient-to-br from-brand-cyan/50 via-brand-violet/40 to-fuchsia-500/40 opacity-70 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border bg-card p-1.5 shadow-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image
                src={siteConfig.avatar}
                alt="SimonPeter at a Google Developer Group Kisii event"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover object-[28%_center]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                  Latest project
                </p>
                <p className="mt-1 font-medium text-white">AgriVision AI · Agritech Hackathon 🌱</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {promoOpen && <PromoDialog onClose={() => setPromoOpen(false)} />}
    </section>
  );
}
