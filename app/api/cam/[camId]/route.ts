import { NextRequest, NextResponse } from "next/server";
import { getCamera } from "@/lib/venues";

/**
 * City of Toronto cams serve a valid "Image Unavailable" JPEG (always exactly
 * this many bytes) when a camera is down. Without this check it would load
 * successfully and the tile would show the frozen placeholder forever instead
 * of entering its failure/retry state.
 */
const TORONTO_PLACEHOLDER_BYTES = "20955";

/**
 * Image proxy for cameras with `proxy: true` (sources that block hotlinking
 * or lack CORS). Client polls /api/cam/<id>?t=<Date.now()>; the s-maxage=2
 * edge cache keeps upstream load at one fetch per 2s regardless of viewers.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ camId: string }> }
) {
  const { camId } = await params;
  const found = getCamera(camId);
  if (!found) {
    return NextResponse.json({ error: "Unknown camera" }, { status: 404 });
  }

  const { camera } = found;
  let upstream: Response;
  try {
    upstream = await fetch(camera.sourceUrl, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        Referer: new URL(camera.sourceUrl).origin + "/",
      },
    });
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Upstream returned ${upstream.status}` },
      { status: 502 }
    );
  }

  if (
    new URL(camera.sourceUrl).hostname === "opendata.toronto.ca" &&
    upstream.headers.get("content-length") === TORONTO_PLACEHOLDER_BYTES
  ) {
    return NextResponse.json({ error: "Camera is down" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, s-maxage=2, stale-while-revalidate=4",
    },
  });
}
