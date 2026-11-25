import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aurelle Spaces — Architecture & Interior Design Studio";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1615",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#A17C55",
            marginBottom: "20px",
            fontFamily: "sans-serif",
          }}
        >
          Bespoke Spatial Studio · India
        </div>
        <div
          style={{
            fontSize: "64px",
            letterSpacing: "0.15em",
            color: "#FAF8F5",
            fontWeight: 300,
            textTransform: "uppercase",
            marginBottom: "20px",
            textAlign: "center",
            fontFamily: "serif",
          }}
        >
          Aurelle Spaces
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#DCD5CB",
            fontWeight: 300,
            maxWidth: "750px",
            textAlign: "center",
            lineHeight: 1.6,
            fontFamily: "sans-serif",
          }}
        >
          Timeless residential and commercial spaces crafted with proportion, craft, and functional clarity.
        </div>
        <div
          style={{
            marginTop: "36px",
            padding: "8px 20px",
            border: "1px solid #3A3532",
            borderRadius: "2px",
            fontSize: "12px",
            color: "#8E8F8A",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          aurelle.dsecops88.online
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

