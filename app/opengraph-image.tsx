import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

/**
 * The portrait was doing this job at 512x512, which is below the 1200x630 that
 * every card renderer wants - Twitter silently downgraded the card to the
 * small `summary` layout because of it. Generated at build time, so there is
 * no image to keep in sync by hand.
 */
export const alt = `${profile.name} - ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#0d0c15";
const FOREGROUND = "#d5d3dc";
const BRAND = "#87ceeb";
const SIGNAL = "#c96ee0";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BACKGROUND,
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* A wash in the corner so the card is not a flat rectangle. */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -180,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${SIGNAL}33 0%, ${BACKGROUND}00 70%)`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: BRAND,
          }}
        >
          {profile.title} · {profile.location}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -2,
            color: "#ffffff",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: 30,
            lineHeight: 1.4,
            color: FOREGROUND,
          }}
        >
          {profile.summary}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 24,
          color: FOREGROUND,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: SIGNAL,
          }}
        />
        {profile.availability.line}
      </div>
    </div>,
    size,
  );
}
