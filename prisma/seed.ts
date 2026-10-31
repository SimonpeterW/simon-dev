/**
 * Seeds the database with the portfolio's starting content.
 * Safe to re-run: records are upserted by their unique keys.
 * Everything here can be edited afterwards from /admin.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const projects = [
  {
    slug: "agrivision-ai",
    title: "AgriVision AI",
    summary:
      "AI image recognition that diagnoses crop pests and diseases from a smartphone photo, recommends treatments and links farmers to trusted suppliers.",
    coverImage: "/images/hackathon-pitch.jpg",
    techStack: "AI & ML,Image Recognition,Python,Mobile,Marketplace",
    role: "Builder & pitch presenter",
    year: 2025,
    featured: true,
    order: 0,
    repoUrl: null,
    liveUrl: null,
    content: `## The problem

The FAO estimates that **20–40% of global crop production** is lost every year to pests and diseases. Traditional detection is slow, costly and often inaccurate — by the time a farmer knows what's wrong, the damage is done.

## The idea

AgriVision AI puts a plant doctor in every farmer's pocket. It was pitched at the **Agritech Hackathon during Gusii Innovation Week** (powered by Fie_Labs Innovation Hub).

1. **Snap & upload** — the farmer photographs an affected plant.
2. **Instant analysis** — a deep-learning image-recognition model identifies the pest or disease early.
3. **Actionable plan** — the app recommends approved, eco-friendly treatments with dosage and safety guidance.

## Beyond diagnosis

- **Integrated marketplace** — buy the exact recommended products from trusted local and global suppliers.
- **Inclusive crop support** — designed for local and minor crop varieties that other tools neglect.
- **Accessibility** — offline-first and multilingual for remote farming communities.

## Business model

Tiered farmer subscriptions, marketplace commissions with agrochemical partners, and data insights for agribusinesses and extension services.

## What I learned

Pitching under hackathon time pressure forced a sharp focus on the user — a smallholder farmer with a phone and patchy connectivity — and on telling a clear story from problem to business model.`,
  },
  {
    slug: "njoki-homestays",
    title: "Njoki Homestays",
    summary:
      "A booking website for a homestay business — browse rooms, see what's on offer and get in touch with the host.",
    coverImage: null,
    techStack: "TypeScript,React,Tailwind CSS,Vercel",
    role: "Full-stack developer",
    year: 2025,
    featured: true,
    order: 1,
    liveUrl: "https://njoki-homestays.vercel.app",
    repoUrl: "https://github.com/SimonpeterW/njoki-homestays",
    content: `## Overview

Njoki Homestays is a production website for a homestay business, built with TypeScript and deployed on Vercel.

## Goals

- Present the rooms and the experience clearly on any device
- Make it effortless for guests to reach the host
- Keep it fast and easy to maintain

## Build

- Typed, component-driven front end in **TypeScript**
- Responsive, mobile-first layout
- Continuous deployment on **Vercel** from GitHub

[Visit the live site →](https://njoki-homestays.vercel.app)`,
  },
  {
    slug: "he-health-management",
    title: "HE — Health Management System",
    summary: "A full-stack health management system for handling patients and medical records.",
    coverImage: null,
    techStack: "HTML,CSS,JavaScript,Node.js,MySQL",
    role: "Full-stack developer",
    year: 2025,
    featured: true,
    order: 2,
    liveUrl: null,
    repoUrl: "https://github.com/SimonpeterW/HE",
    content: `## Overview

HE is a full-stack health management system: patient records, appointments and the data model behind them.

## Focus areas

- **Database design** — modelling patients, visits and records so the data stays consistent and secure
- **Back-end integration** — wiring the UI to a server and database
- **Usability** — clear flows for busy healthcare staff

[View the code on GitHub →](https://github.com/SimonpeterW/HE)`,
  },
  {
    slug: "tech-care-dashboard",
    title: "Tech.Care Dashboard",
    summary:
      "A patient health dashboard implemented pixel-by-pixel from an Adobe XD design specification.",
    coverImage: null,
    techStack: "HTML,CSS,JavaScript,Adobe XD",
    role: "Front-end developer",
    year: 2024,
    featured: false,
    order: 3,
    liveUrl: null,
    repoUrl: "https://github.com/SimonpeterW/Tech.Care",
    content: `## Overview

Tech.Care is a patient dashboard built from an Adobe XD design spec — vitals, diagnosis history and lab results in one view.

## What it exercised

- Translating a designer's spec into faithful, responsive UI
- Data-heavy layouts: charts, lists and patient cards
- Clean, reusable CSS

[View the code on GitHub →](https://github.com/SimonpeterW/Tech.Care)`,
  },
  {
    slug: "kcg-prod-management",
    title: "KCG Production Management",
    summary: "A production management system for KCG to track production work end to end.",
    coverImage: null,
    techStack: "Back-end,Database Design",
    role: "Developer",
    year: 2025,
    featured: false,
    order: 4,
    liveUrl: null,
    repoUrl: "https://github.com/SimonpeterW/Prod.management",
    content: `## Overview

A production management system for KCG, focused on modelling production data and the workflows around it.

_Work in progress — more details coming soon._

[View the code on GitHub →](https://github.com/SimonpeterW/Prod.management)`,
  },
  {
    slug: "see-plp-e-learning-portal",
    title: "SEE.plp — E-learning Portal",
    summary:
      "Coursework from the PLP Academy software engineering programme, including an e-learning portal, Python and database assignments.",
    coverImage: null,
    techStack: "HTML,CSS,Python,MySQL",
    role: "Student developer",
    year: 2025,
    featured: false,
    order: 5,
    liveUrl: null,
    repoUrl: "https://github.com/SimonpeterW/SEE.plp",
    content: `## Overview

The repository behind my PLP Academy software engineering journey: web development, Python (including OOP), databases and specification work — capped with an e-learning portal.

[View the code on GitHub →](https://github.com/SimonpeterW/SEE.plp)`,
  },
];

const skills: Array<{ category: string; items: Array<[string, number]> }> = [
  {
    category: "Frontend",
    items: [
      ["HTML & CSS", 5],
      ["JavaScript", 4],
      ["TypeScript", 4],
      ["React", 4],
      ["Next.js", 3],
      ["Tailwind CSS", 4],
    ],
  },
  {
    category: "Backend",
    items: [
      ["Node.js", 4],
      ["Express", 4],
      ["Python", 4],
      ["Django", 3],
    ],
  },
  {
    category: "Databases",
    items: [
      ["MySQL", 4],
      ["MongoDB", 3],
      ["MariaDB", 3],
      ["PostgreSQL", 3],
    ],
  },
  {
    category: "AI & ML",
    items: [
      ["Machine Learning", 3],
      ["Image Recognition", 3],
      ["Automation", 3],
    ],
  },
  {
    category: "Mobile & Design",
    items: [
      ["React Native", 3],
      ["UI/UX", 4],
      ["Adobe XD", 3],
      ["User Research", 4],
    ],
  },
  {
    category: "Tools",
    items: [
      ["Git & GitHub", 4],
      ["Vercel", 3],
      ["Technical Writing", 4],
    ],
  },
];

// Dates are best guesses — update them from /admin/experience.
const experience = [
  {
    title: "Agritech Hackathon — pitched AgriVision AI",
    organization: "Gusii Innovation Week · Fie_Labs Innovation Hub",
    kind: "Hackathon",
    location: "Kisii, Kenya",
    startDate: "2025",
    endDate: null,
    description:
      "Built and pitched AgriVision AI, an image-recognition tool that diagnoses crop pests and diseases and connects farmers to trusted suppliers.",
    image: "/images/hackathon-build.jpg",
    order: 0,
  },
  {
    title: "Experience AI programme",
    organization: "GDG Kisii · Google DeepMind × Raspberry Pi Foundation",
    kind: "Community",
    location: "Kisii, Kenya",
    startDate: "2025",
    endDate: null,
    description:
      "Took part in Google AI training through the Experience AI programme with the Google Developer Group Kisii community.",
    image: "/images/simon-gdg.jpg",
    order: 1,
  },
  {
    title: "Software Engineering",
    organization: "PLP Academy",
    kind: "Education",
    location: "Remote",
    startDate: "2025",
    endDate: "Present",
    description:
      "Full-stack software engineering programme: web development, Python, databases, specification and a capstone e-learning portal.",
    image: null,
    order: 2,
  },
  {
    title: "Student",
    organization: "Kisii University",
    kind: "Education",
    location: "Kisii, Kenya",
    startDate: "—",
    endDate: "Present",
    description: "University studies alongside building real-world software projects.",
    image: null,
    order: 3,
  },
];

async function main() {
  for (const project of projects) {
    await db.project.upsert({ where: { slug: project.slug }, update: project, create: project });
  }

  for (const group of skills) {
    for (const [index, [name, level]] of group.items.entries()) {
      await db.skill.upsert({
        where: { name_category: { name, category: group.category } },
        update: { level, order: index },
        create: { name, category: group.category, level, order: index },
      });
    }
  }

  if ((await db.experience.count()) === 0) {
    await db.experience.createMany({ data: experience });
  }

  // A draft so the blog has a starting point — publish or delete it from /admin/posts.
  await db.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Hello, world — the new Simon.dev",
      excerpt: "Why I rebuilt my portfolio as a full-stack Next.js app, and what's coming next.",
      tags: "Next.js,Portfolio,Meta",
      published: false,
      content: `This is a draft post. Edit it in **/admin/posts**, then tick _Published_ to make it live.

## Ideas for first posts

- Lessons from pitching AgriVision AI at the Gusii Innovation Week hackathon
- Designing a database schema for a health management system
- What the PLP Academy programme taught me`,
    },
  });

  console.log(
    `Seeded ${projects.length} projects, ${skills.reduce((n, g) => n + g.items.length, 0)} skills, ${experience.length} experience entries, 1 draft post.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
