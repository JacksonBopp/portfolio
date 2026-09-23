import { ImageResponse } from "next/og";
import { profile, resumeTracks } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          color: "#e7ecee",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#6fd68a",
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              color: "#8b96a0",
              textTransform: "uppercase",
            }}
          >
            JB-01
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              color: "#ffb454",
              textTransform: "uppercase",
            }}
          >
            {profile.tagline}
          </div>
          <div style={{ fontSize: 96, fontWeight: 700, color: "#f5f7f8" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 34, color: "#8b96a0" }}>
            {profile.subtagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {resumeTracks.map((track) => (
            <div
              key={track.id}
              style={{
                display: "flex",
                padding: "10px 20px",
                border: "1px solid #3a8a99",
                borderRadius: 6,
                color: "#5ad1e6",
                fontSize: 22,
              }}
            >
              {track.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
