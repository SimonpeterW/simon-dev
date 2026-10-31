import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations";

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Sends the contact notification through Resend.
 * Returns false (without throwing) when email isn't configured, so the message
 * is still saved to the database and visible in /admin.
 */
export async function sendContactEmail(input: Pick<ContactInput, "name" | "email" | "message">) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: input.email,
    subject: `New portfolio message from ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return false;
  }
  return true;
}
