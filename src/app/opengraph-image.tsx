import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge runtime avoids a Next 14 @vercel/og path bug on Windows and is faster to render.
export const runtime = "edge";

// Default social card for every page that doesn't set its own image.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#07080f",
        backgroundImage:
          "radial-gradient(circle at 85% 10%, rgba(139,92,246,0.45), transparent 45%), radial-gradient(circle at 10% 95%, rgba(34,211,238,0.3), transparent 45%)",
        color: "#eef0fb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
        {"<Simon"}
        <span style={{ color: "#22d3ee" }}>.dev</span>
        {"/>"}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
          SimonPeter
        </div>
        <div style={{ fontSize: 44, marginTop: 18, color: "#a78bfa" }}>
          Software Engineer · AI & ML · Full-stack
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9aa0c3" }}
      >
        <span>{siteConfig.location}</span>
        <span>{siteConfig.slogan}</span>
      </div>
    </div>,
    size,
  );
}
