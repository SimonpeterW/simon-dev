import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, AVIF or GIF images" }, { status: 415 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 413 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
