import { NextRequest, NextResponse } from "next/server";
import {
  fetchScoreboard,
  getLiveMatches,
  getMatchesForVenue,
  getVenueMatchState,
} from "@/lib/espn";
import { getVenue } from "@/lib/venues";
import type { MatchesResponse } from "@/lib/types";

/** GET /api/matches?venue=<slug>  ->  MatchesResponse (see lib/types.ts) */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("venue");
  const venue = slug ? getVenue(slug) : undefined;
  if (!venue) {
    return NextResponse.json({ error: "Unknown venue" }, { status: 404 });
  }

  let response: MatchesResponse;
  try {
    // fetchScoreboard caches upstream for 60s, so polling clients don't
    // multiply requests to ESPN.
    const matches = await fetchScoreboard();
    response = {
      venueState: getVenueMatchState(matches, venue),
      venueMatches: getMatchesForVenue(matches, venue),
      liveMatches: getLiveMatches(matches),
    };
  } catch {
    return NextResponse.json({ error: "Scoreboard unavailable" }, { status: 502 });
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
