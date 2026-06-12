import type { MatchSummary, Venue, VenueMatchState } from "@/lib/types";

function formatKickoff(iso: string, timezone: string, withDate: boolean) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    ...(withDate ? { month: "short", day: "numeric" } : {}),
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** Match-day awareness banner for one venue. Purely presentational. */
export default function MatchDayBanner({
  venue,
  state,
  venueMatches,
}: {
  venue: Venue;
  state: VenueMatchState;
  venueMatches: MatchSummary[];
}) {
  const live = venueMatches.find((m) => m.state === "in");
  const next = venueMatches
    .filter((m) => m.state === "pre")
    .sort((a, b) => +new Date(a.kickoff) - +new Date(b.kickoff))[0];

  if (state === "live" && live) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-flag-red px-5 py-4 shadow-block-sm">
        <span className="flex items-center gap-2 font-display text-xl uppercase tracking-wide text-mustard">
          <span className="h-3 w-3 rounded-full bg-mustard" />
          Live
        </span>
        <span className="text-lg font-semibold uppercase tracking-wide text-paper">
          {live.homeTeam} {live.homeScore ?? 0}–{live.awayScore ?? 0}{" "}
          {live.awayTeam}
          {live.clock ? ` · ${live.clock}` : ""}
        </span>
        <span className="ml-auto text-sm uppercase tracking-wide text-paper/80">
          at {venue.name}
        </span>
      </div>
    );
  }

  if (state === "today" && next) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-teal px-5 py-4 shadow-block-sm">
        <span className="font-display text-2xl uppercase tracking-wide text-mustard">
          Match Day
        </span>
        <span className="text-lg font-semibold uppercase tracking-wide text-paper">
          {next.homeTeam} vs {next.awayTeam}
        </span>
        <span className="ml-auto bg-paper px-3 py-1 text-sm font-bold uppercase tracking-wider text-teal">
          Kickoff {formatKickoff(next.kickoff, venue.timezone, false)}
        </span>
      </div>
    );
  }

  return (
    <div className="border-l-[6px] border-navy bg-ink px-5 py-4 text-sm uppercase tracking-wide text-paper/85">
      {next
        ? `Next at ${venue.name} — ${next.homeTeam} vs ${next.awayTeam} · ${formatKickoff(next.kickoff, venue.timezone, true)}`
        : `No matches scheduled at ${venue.name} in the current window`}
    </div>
  );
}
