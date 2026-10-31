import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { getSession, githubAuthEnabled } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user?.role === "admin") redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-mono text-sm font-bold">
          &lt;Simon<span className="text-brand-cyan">.dev</span>/&gt;
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Dashboard sign in</h1>
        <p className="mb-8 mt-1 text-sm text-muted-foreground">Admins only.</p>
        <Suspense>
          <LoginForm github={githubAuthEnabled()} />
        </Suspense>
      </div>
    </main>
  );
}
