"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Loads a (large) video only after the visitor asks for it. */
export function VideoReveal({ src, label }: { src: string; label: string }) {
  const [show, setShow] = useState(false);
  if (!show) {
    return (
      <Button variant="outline" onClick={() => setShow(true)}>
        <Play /> {label}
      </Button>
    );
  }
  return (
    <video
      src={src}
      controls
      autoPlay
      playsInline
      aria-label={label}
      className="aspect-video w-full rounded-xl border bg-black"
    />
  );
}
