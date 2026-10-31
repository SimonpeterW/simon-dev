import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/"), {
    message: "Must be a full URL (https://…) or a site path (/images/…)",
  })
  .transform((v) => (v === "" ? null : v));

const slug = z
  .string()
  .trim()
  .min(2, "Slug is required")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (10+ characters)")
    .max(5000, "Please keep it under 5000 characters"),
  /** Honeypot — real visitors never fill this in. Accepted here so the API can fake success for bots. */
  company: z.string().max(200).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  summary: z.string().trim().min(10).max(300),
  content: z.string().trim().min(10, "Write a short case study"),
  coverImage: optionalUrl,
  techStack: z.string().trim().max(400),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  role: z.string().trim().max(120).optional().default(""),
  year: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.coerce.number().int().min(2000).max(2100).nullable(),
  ),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(999).default(0),
});
export type ProjectInput = z.input<typeof projectSchema>;

export const postSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(10),
  coverImage: optionalUrl,
  tags: z.string().trim().max(300),
  published: z.boolean().default(false),
});
export type PostInput = z.input<typeof postSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(60),
  category: z.string().trim().min(2).max(40),
  level: z.coerce.number().int().min(1).max(5),
  order: z.coerce.number().int().min(0).max(999).default(0),
});
export type SkillInput = z.input<typeof skillSchema>;

export const experienceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(120),
  kind: z.string().trim().min(2).max(40),
  location: z.string().trim().max(120).optional().default(""),
  startDate: z.string().trim().min(2).max(40),
  endDate: z.string().trim().max(40).optional().default(""),
  description: z.string().trim().min(5).max(2000),
  image: optionalUrl,
  order: z.coerce.number().int().min(0).max(999).default(0),
});
export type ExperienceInput = z.input<typeof experienceSchema>;
