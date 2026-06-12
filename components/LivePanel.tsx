"use client";

import { useEffect, useState } from "react";
import MatchDayBanner from "./MatchDayBanner";
import ScoreBar from "./ScoreBar";
import type { MatchesResponse, Venue } from "@/lib/types";

const POLL_MS = 60_000;

/**
 * Polls /api/matches for one venue and feeds the presentational banner +
 * ticker. The 60s client poll matches the server's 60s ESPN cache.
 */
export default function LivePanel({ venue }: { venue: Venue }) {
  const [data, setData] = useState<MatchesResponse | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/matches?venue=${venue.slug}`);
        if (!res.ok) return;
        const json: MatchesResponse = await res.json();
        if (active) setData(json);
      } catch {
        // keep showing the last good data; next poll retries
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [venue.slug]);

  return (
    <div className="space-y-4">
      <MatchDayBanner
        venue={venue}
        state={data?.venueState ?? "upcoming"}
        venueMatches={data?.venueMatches ?? []}
      />
      <ScoreBar matches={data?.liveMatches ?? []} />
    </div>
  );
}
