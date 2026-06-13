import { NextRequest, NextResponse } from "next/server";

/**
 * Resolves a YouTube channel's CURRENT live stream and 302-redirects to its
 * embed player. Iframes follow redirects, so kind:"embed" cams can point at
 * /api/yt-live/<channelId> and survive stream restarts.
 *
 * Why: YouTube's own /embed/live_stream?channel= endpoint is unreliable — it
 * shows "This video is unavailable" for channels with multiple concurrent
 * streams (Venice) or per-event broadcasts (Walking in LA), and 24/7 stream
 * video ids rotate whenever the streamer restarts. /channel/<id>/live always
 * resolves to the channel's designated live video, so we scrape the id from
 * there. Resolution is cached 5 min (data cache + edge) to stay polite.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  if (!/^UC[\w-]{22}$/.test(channelId)) {
    return NextResponse.json({ error: "Bad channel id" }, { status: 404 });
  }

  // Fall back to YouTube's own resolver if we can't scrape an id — worst case
  // that's the old behavior, not a dead tile.
  let target = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
  try {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const videoId = (await res.text()).match(/"videoId":"([\w-]{11})"/)?.[1];
      if (videoId) target = `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    // keep fallback target
  }

  const url = new URL(target);
  request.nextUrl.searchParams.forEach((value, key) =>
    url.searchParams.set(key, value)
  );
  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
