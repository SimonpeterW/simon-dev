import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container grid min-h-screen place-items-center text-center">
      <div>
        <p className="text-gradient font-mono text-7xl font-bold">404</p>
        <h1 className="mt-4 text-2xl font-semibold">This page wandered off.</h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild variant="gradient" className="mt-8">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
