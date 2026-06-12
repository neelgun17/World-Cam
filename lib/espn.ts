import type { MatchSummary, Venue, VenueMatchState } from "./types";

/**
 * ESPN's unofficial-but-stable scoreboard API. Free, no key, includes venue
 * names per match (real stadium names, e.g. "MetLife Stadium", not FIFA's
 * sponsored aliases). The ?dates range covers the whole tournament so
 * "next match at this venue" works even on quiet days.
 */
export const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const TOURNAMENT_DATES = "20260611-20260719";

interface EspnCompetitor {
  homeAway?: string;
  score?: string;
  team?: { displayName?: string; abbreviation?: string };
}

interface EspnEvent {
  id: string;
  date: string;
  status?: {
    displayClock?: string;
    type?: { state?: string; description?: string };
  };
  competitions?: {
    venue?: { fullName?: string };
    competitors?: EspnCompetitor[];
  }[];
}

function parseState(state: string | undefined): MatchSummary["state"] {
  return state === "in" || state === "post" ? state : "pre";
}

export async function fetchScoreboard(): Promise<MatchSummary[]> {
  const res = await fetch(`${ESPN_SCOREBOARD_URL}?dates=${TOURNAMENT_DATES}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`ESPN scoreboard request failed: ${res.status}`);
  }
  const data: { events?: EspnEvent[] } = await res.json();

  return (data.events ?? []).map((event) => {
    const competition = event.competitions?.[0];
    const home = competition?.competitors?.find((c) => c.homeAway === "home");
    const away = competition?.competitors?.find((c) => c.homeAway === "away");
    const state = parseState(event.status?.type?.state);

    return {
      id: event.id,
      homeTeam: home?.team?.displayName ?? "TBD",
      awayTeam: away?.team?.displayName ?? "TBD",
      homeAbbr: home?.team?.abbreviation ?? "TBD",
      awayAbbr: away?.team?.abbreviation ?? "TBD",
      homeScore: state !== "pre" && home?.score != null ? Number(home.score) : null,
      awayScore: state !== "pre" && away?.score != null ? Number(away.score) : null,
      state,
      status: event.status?.type?.description ?? "Scheduled",
      clock: state === "in" ? event.status?.displayClock ?? null : null,
      kickoff: event.date,
      venueName: competition?.venue?.fullName ?? "",
    };
  });
}

export function getMatchesForVenue(
  matches: MatchSummary[],
  venue: Venue
): MatchSummary[] {
  return matches.filter((match) =>
    venue.espnVenueNames.some((name) =>
      match.venueName.toLowerCase().includes(name.toLowerCase())
    )
  );
}

export function getVenueMatchState(
  matches: MatchSummary[],
  venue: Venue
): VenueMatchState {
  const venueMatches = getMatchesForVenue(matches, venue);
  if (venueMatches.some((m) => m.state === "in")) return "live";

  const dayAtVenue = new Intl.DateTimeFormat("en-CA", {
    timeZone: venue.timezone,
  });
  const today = dayAtVenue.format(new Date());
  const hasMatchToday = venueMatches.some(
    (m) => m.state === "pre" && dayAtVenue.format(new Date(m.kickoff)) === today
  );
  return hasMatchToday ? "today" : "upcoming";
}

export function getLiveMatches(matches: MatchSummary[]): MatchSummary[] {
  return matches.filter((m) => m.state === "in");
}
