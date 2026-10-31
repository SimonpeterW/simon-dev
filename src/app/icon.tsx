import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
// Edge runtime avoids a Next 14 @vercel/og path bug on Windows and is faster to render.
export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
        color: "white",
        fontSize: 40,
        fontWeight: 800,
      }}
    >
      S
    </div>,
    size,
  );
}
