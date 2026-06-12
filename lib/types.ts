/**
 * Core domain types. Everything in the app hangs off these — adding a new
 * host city means adding one `Venue` entry in lib/venues.ts, nothing else.
 */

export type CameraKind = "jpeg" | "hls" | "embed";

export interface Camera {
  /** Unique across ALL venues — used in /api/cam/[camId]. Convention: "<venueSlug>-<short-name>". */
  id: string;
  /** Display label, e.g. "Rt 3 EB @ Stadium" */
  name: string;
  /** Human-readable location for the tile caption. */
  location: string;
  /**
   * Upstream image/stream URL.
   * - "jpeg": URL returning a still that refreshes server-side (poll with a cache-busting param)
   * - "hls": .m3u8 video stream (needs hls.js on the client)
   * - "embed": iframe URL (e.g. YouTube live embed) — rendered directly, never proxied
   */
  sourceUrl: string;
  kind: CameraKind;
  /** Poll interval override in ms. Default 2000; raise for cams that only update every minute or two (Caltrans, WSDOT). */
  refreshMs?: number;
  /**
   * true  -> client loads /api/cam/[id] (server proxies upstream; use for sources
   *          that block hotlinking / lack CORS, e.g. 511NJ)
   * false -> client hotlinks sourceUrl directly (fine for NYC DOT)
   */
  proxy: boolean;
  /** Feed owner, shown in the footer, e.g. "NJDOT / 511NJ" */
  attribution: string;
}

export interface Venue {
  /** URL slug: /[venueSlug] */
  slug: string;
  /** Stadium name, e.g. "MetLife Stadium" */
  name: string;
  city: string;
  /** IANA timezone for kickoff-time display, e.g. "America/New_York" */
  timezone: string;
  /**
   * Strings to match (case-insensitive substring) against the venue name in
   * ESPN scoreboard events (`events[].competitions[].venue.fullName`) so we
   * can tell which matches happen HERE.
   */
  espnVenueNames: string[];
  cameras: Camera[];
}

/** Where this venue is in its match cycle — drives the banner + refresh cadence. */
export type VenueMatchState = "live" | "today" | "upcoming";

export interface MatchSummary {
  id: string;
  homeTeam: string;
  awayTeam: string;
  /** Short codes for the ticker, e.g. "MEX" (ESPN team.abbreviation) */
  homeAbbr: string;
  awayAbbr: string;
  homeScore: number | null;
  awayScore: number | null;
  /** "pre" | "in" | "post" (ESPN status.type.state) */
  state: "pre" | "in" | "post";
  /** e.g. "Scheduled" | "In Progress" | "Final" (ESPN status.type.description) */
  status: string;
  /** Clock/period display, e.g. "67'" — ESPN status.displayClock */
  clock: string | null;
  kickoff: string; // ISO date
  venueName: string;
}

/** Shape returned by /api/matches?venue=<slug> */
export interface MatchesResponse {
  venueState: VenueMatchState;
  /** Matches at THIS venue (live or upcoming next). */
  venueMatches: MatchSummary[];
  /** All currently-live World Cup matches anywhere, for the ticker. */
  liveMatches: MatchSummary[];
}
