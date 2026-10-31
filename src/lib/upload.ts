import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const cloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );

/** Uploads an image and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (cloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "portfolio", resource_type: "image" }, (err, res) =>
          err || !res ? reject(err ?? new Error("Upload failed")) : resolve(res),
        )
        .end(buffer);
    });
    return result.secure_url;
  }

  // Local fallback for development only — serverless file systems are read-only.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Image uploads need Cloudinary credentials in production.");
  }
  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}
