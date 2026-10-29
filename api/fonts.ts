/// <reference types="node" />

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export async function GET() {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  console.log("Google Fonts API key available:", Boolean(apiKey));

  if (!apiKey) {
    return Response.json(
      { error: "Google Fonts API key is not configured." },
      { status: 500 },
    );
  }

  try {
    const googleResponse = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
    );

    if (!googleResponse.ok) {
      console.error("Google Fonts API error:", googleResponse.status);

      return Response.json(
        { error: "Failed to fetch Google Fonts." },
        { status: 502 },
      );
    }

    const data = await googleResponse.json();

    return Response.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Google Fonts request failed:", error);

    return Response.json(
      { error: "Unable to retrieve Google Fonts." },
      { status: 500 },
    );
  }
}
