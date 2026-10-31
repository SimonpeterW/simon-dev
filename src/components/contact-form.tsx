"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      toast.success("Message sent!", { description: "Thanks — I'll get back to you soon." });
      reset();
    } catch (error) {
      toast.error("Couldn't send your message", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const field = (name: keyof ContactInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactInput) =>
    errors[name] && (
      <p id={`${name}-error`} role="alert" className="text-sm text-destructive">
        {errors[name]?.message}
      </p>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Doe"
            {...register("name")}
            {...field("name")}
          />
          {errorText("name")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            {...register("email")}
            {...field("email")}
          />
          {errorText("email")}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell me about your project, timeline and budget…"
          {...register("message")}
          {...field("message")}
        />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
