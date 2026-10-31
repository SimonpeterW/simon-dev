import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 10 * 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: `Too many messages — please try again in ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { company, ...data } = parsed.data;
  // Honeypot filled in: pretend success so bots don't learn anything.
  if (company) return NextResponse.json({ ok: true });

  try {
    const message = await db.contactMessage.create({ data: { ...data, ip } });
    const emailed = await sendContactEmail(data).catch((error) => {
      console.error("[contact] email failed", error);
      return false;
    });
    if (emailed) await db.contactMessage.update({ where: { id: message.id }, data: { emailed } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[contact] failed to save message", error);
    return NextResponse.json(
      { error: "Something went wrong on my side. Please try again later." },
      { status: 500 },
    );
  }
}
