"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter your admin email"),
  password: z.string().min(1, "Enter your password"),
});
type Values = z.infer<typeof schema>;

export function LoginForm({ github }: { github: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl")?.startsWith("/admin")
    ? params.get("callbackUrl")!
    : "/admin";
  const urlError = params.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    const res = await signIn("credentials", { ...values, redirect: false, callbackUrl });
    if (!res || res.error) {
      toast.error("Sign in failed", {
        description: "Wrong email or password, or too many attempts.",
      });
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <div className="space-y-6">
      {urlError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {urlError === "AccessDenied"
            ? "That GitHub account isn't allowed to access the dashboard."
            : "Sign in failed. Please try again."}
        </p>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />}
          Sign in
        </Button>
      </form>
      {github && (
        <>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <Github /> Continue with GitHub
          </Button>
        </>
      )}
    </div>
  );
}
