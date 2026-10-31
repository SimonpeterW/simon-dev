"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Upload an image (Cloudinary, or public/uploads in dev) or paste a URL/path. */
export function ImageUpload({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl border bg-muted">
          <Image
            src={value}
            alt="Preview"
            fill
            sizes="384px"
            unoptimized
            className="object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 size-8"
            onClick={() => onChange("")}
            aria-label="Remove image"
          >
            <X />
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/cover.jpg or https://…"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          Upload
        </Button>
      </div>
    </div>
  );
}
