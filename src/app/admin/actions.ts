"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { joinList, splitList } from "@/lib/utils";
import { experienceSchema, postSchema, projectSchema, skillSchema } from "@/lib/validations";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function invalid(error: z.ZodError): ActionResult {
  const first = Object.entries(error.flatten().fieldErrors)[0];
  return { ok: false, error: first ? `${first[0]}: ${first[1]?.[0]}` : "Invalid input" };
}

function failure(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { ok: false, error: "That slug/name is already in use — pick another." };
  }
  console.error("[admin action]", error);
  return { ok: false, error: "Something went wrong. Check the server logs." };
}

/** Public pages are ISR-cached; refresh everything after any content change. */
const refresh = () => {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
};

// ---------- Projects ----------

export async function saveProject(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const data = { ...parsed.data, techStack: joinList(splitList(parsed.data.techStack)) };
  try {
    const project = id
      ? await db.project.update({ where: { id }, data })
      : await db.project.create({ data });
    refresh();
    return { ok: true, id: project.id };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.project.delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

// ---------- Posts ----------

export async function savePost(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const data = { ...parsed.data, tags: joinList(splitList(parsed.data.tags)) };
  try {
    const existing = id ? await db.post.findUnique({ where: { id } }) : null;
    // Stamp the publish date the first time a post goes live.
    const publishedAt = data.published ? (existing?.publishedAt ?? new Date()) : null;
    const post = id
      ? await db.post.update({ where: { id }, data: { ...data, publishedAt } })
      : await db.post.create({ data: { ...data, publishedAt } });
    refresh();
    return { ok: true, id: post.id };
  } catch (error) {
    return failure(error);
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.post.delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

// ---------- Skills ----------

export async function saveSkill(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const skill = id
      ? await db.skill.update({ where: { id }, data: parsed.data })
      : await db.skill.create({ data: parsed.data });
    refresh();
    return { ok: true, id: skill.id };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.skill.delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

// ---------- Experience ----------

export async function saveExperience(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const data = {
    ...parsed.data,
    location: parsed.data.location || null,
    endDate: parsed.data.endDate || null,
  };
  try {
    const item = id
      ? await db.experience.update({ where: { id }, data })
      : await db.experience.create({ data });
    refresh();
    return { ok: true, id: item.id };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.experience.delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

// ---------- Messages ----------

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.contactMessage.update({ where: { id }, data: { read } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.contactMessage.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}
