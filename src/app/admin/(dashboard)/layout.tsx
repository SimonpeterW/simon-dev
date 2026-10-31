import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unread = await db.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <AdminNav unread={unread} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-12">{children}</main>
    </div>
  );
}
