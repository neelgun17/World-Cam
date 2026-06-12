import type { Venue } from "./types";

/**
 * THE venue registry. Adding a host city = adding one entry here.
 * Pages, API routes, and components all derive from this list.
 *
 * espnVenueNames are matched against the real stadium names ESPN uses
 * (verified against the live scoreboard, e.g. "MetLife Stadium",
 * "GEHA Field at Arrowhead Stadium").
 */
export const VENUES: Venue[] = [
  {
    slug: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    timezone: "America/New_York",
    espnVenueNames: ["MetLife"],
    // NJ-side sources (511NJ, NJ Turnpike) are HLS video only — no public
    // JPEG stills. These NYC DOT cams cover Penn Station, where fans board
    // NJ Transit to the stadium. If HLS support lands, the NJTA cam at
    // Turnpike MM 112.3 (adjacent to MetLife) is:
    // https://wink.njta.com/204/public/hls/WF05-24B0-46EE-1F2E-1932_nj.m3u8
    cameras: [
      {
        id: "metlife-8th-ave-33rd-st",
        name: "8th Ave @ 33rd St",
        location: "8th Ave & W 33rd St — Penn Station / Moynihan entrance, Manhattan",
        sourceUrl:
          "https://webcams.nyctmc.org/api/cameras/6a85384f-d82e-4bff-b5f1-15c22cca70e6/image",
        kind: "jpeg",
        proxy: true,
        attribution: "NYC DOT",
      },
      {
        id: "metlife-8th-ave-31st-st",
        name: "8th Ave @ 31st St",
        location: "8th Ave & W 31st St — Penn Station southwest corner, Manhattan",
        sourceUrl:
          "https://webcams.nyctmc.org/api/cameras/ec9ffb62-e3bf-4352-8bcf-7c9adf5fbe9c/image",
        kind: "jpeg",
        proxy: true,
        attribution: "NYC DOT",
      },
    ],
  },
  {
    slug: "atlanta",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    timezone: "America/New_York",
    espnVenueNames: ["Mercedes-Benz"],
    cameras: [
      // 511GA serves PNG stills; refresh can be slow off-peak.
      {
        id: "atlanta-northside-dr-mlk",
        name: "Northside Dr @ MLK Jr Dr",
        location: "Northside Dr at MLK Jr Dr — points at the stadium, Atlanta, GA",
        sourceUrl: "https://511ga.org/map/Cctv/19223",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "GDOT / 511GA",
      },
      {
        id: "atlanta-centennial-park-dr-mlk",
        name: "Centennial Olympic Park Dr @ MLK Jr Dr",
        location: "Centennial Olympic Park Dr at MLK Jr Dr, Atlanta, GA",
        sourceUrl: "https://511ga.org/map/Cctv/19234",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "GDOT / 511GA",
      },
    ],
  },
  {
    slug: "miami",
    name: "Hard Rock Stadium",
    city: "Miami Gardens, FL",
    timezone: "America/New_York",
    espnVenueNames: ["Hard Rock"],
    cameras: [
      // Cams nearest the stadium are video-only; these are the closest stills (~1.7 mi).
      {
        id: "miami-tpke-miami-gardens-dr",
        name: "Florida's Turnpike @ Miami Gardens Dr",
        location: "Florida's Turnpike at Miami Gardens Dr, Miami Gardens, FL",
        sourceUrl: "https://fl511.com/map/Cctv/5563",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "FDOT / FL511",
      },
      {
        id: "miami-university-dr-miramar-pkwy",
        name: "University Dr @ Miramar Pkwy",
        location: "University Dr at Miramar Pkwy, Miramar, FL",
        sourceUrl: "https://fl511.com/map/Cctv/5784",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "FDOT / FL511",
      },
    ],
  },
  {
    slug: "philadelphia",
    name: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    timezone: "America/New_York",
    espnVenueNames: ["Lincoln Financial"],
    cameras: [
      {
        id: "philadelphia-i95-broad-st",
        name: "I-95 SB @ Broad St / Sports Complex",
        location: "I-95 southbound at Broad St exit, South Philadelphia, PA",
        sourceUrl: "https://www.511pa.com/map/Cctv/5494",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "PennDOT / 511PA",
      },
      {
        id: "philadelphia-i95-mm174",
        name: "I-95 @ MM 17.4",
        location: "I-95 at mile marker 17.4, north of Broad St, Philadelphia, PA",
        sourceUrl: "https://www.511pa.com/map/Cctv/5915",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "PennDOT / 511PA",
      },
    ],
  },
  {
    slug: "los-angeles",
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    timezone: "America/Los_Angeles",
    espnVenueNames: ["SoFi"],
    cameras: [
      {
        id: "los-angeles-i105-prairie-ave",
        name: "I-105 at Prairie Ave Off-Ramp",
        location: "I-105 EB at Prairie Ave off-ramp, Inglewood, CA",
        sourceUrl:
          "https://cwwp2.dot.ca.gov/data/d7/cctv/image/i105848prairieaveofframp/i105848prairieaveofframp.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "Caltrans D7",
      },
      {
        id: "los-angeles-i405-century-blvd",
        name: "I-405 at WB Century Blvd On-Ramp",
        location: "I-405 at Century Blvd westbound on-ramp, Inglewood, CA",
        sourceUrl:
          "https://cwwp2.dot.ca.gov/data/d7/cctv/image/i405869wbcenturyblvdonramp/i405869wbcenturyblvdonramp.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "Caltrans D7",
      },
    ],
  },
  {
    slug: "bay-area",
    name: "Levi's Stadium",
    city: "Santa Clara, CA",
    timezone: "America/Los_Angeles",
    espnVenueNames: ["Levi's"],
    cameras: [
      {
        id: "bay-area-sr237-lafayette",
        name: "SR-237 at Lafayette St",
        location: "SR-237 at Lafayette St EB on-ramp, Santa Clara, CA",
        sourceUrl:
          "https://cwwp2.dot.ca.gov/data/d4/cctv/image/tvc97sr237atlafayetteebonramp/tvc97sr237atlafayetteebonramp.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "Caltrans D4",
      },
      {
        id: "bay-area-sr237-north-first",
        name: "SR-237 at North First St",
        location: "SR-237 at North First St, San Jose/Santa Clara border, CA",
        sourceUrl:
          "https://cwwp2.dot.ca.gov/data/d4/cctv/image/tvc98sr237northfirststreet/tvc98sr237northfirststreet.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "Caltrans D4",
      },
    ],
  },
  {
    slug: "toronto",
    name: "BMO Field",
    city: "Toronto, ON",
    timezone: "America/Toronto",
    espnVenueNames: ["BMO"],
    // City of Toronto open-data cams (336 citywide) — street-level JPEG stills,
    // ~1/min refresh. Unlike most 511 networks these cover pedestrian
    // intersections, so we get actual fan-walk views. Full list:
    // https://open.toronto.ca/dataset/traffic-cameras/
    // FIFA Fan Festival runs at Fort York & The Bentway (Jun 11–Jul 19).
    cameras: [
      {
        id: "toronto-strachan-fleet",
        name: "Strachan Ave @ Fleet St",
        location: "Strachan Ave at Fleet St — Princes' Gates entrance to Exhibition Place",
        sourceUrl:
          "https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc8175.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "City of Toronto",
      },
      {
        id: "toronto-strachan-east-liberty",
        name: "Strachan Ave @ East Liberty St",
        location: "Strachan Ave at East Liberty St — Liberty Village fan walk to the stadium",
        sourceUrl:
          "https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc8255.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "City of Toronto",
      },
      {
        id: "toronto-british-columbia-saskatchewan",
        name: "British Columbia Rd @ Saskatchewan Rd",
        location: "Inside Exhibition Place grounds, on the road BMO Field sits on",
        sourceUrl:
          "https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc8241.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "City of Toronto",
      },
      {
        id: "toronto-bathurst-fort-york",
        name: "Bathurst St @ Fort York Blvd",
        location: "Bathurst St at Fort York Blvd — FIFA Fan Festival entrance (Fort York & The Bentway)",
        sourceUrl:
          "https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc8105.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "City of Toronto",
      },
      {
        id: "toronto-yonge-dundas",
        name: "Yonge St @ Dundas St",
        location: "Sankofa Square (Yonge-Dundas) scramble crossing — downtown watch-party hub",
        sourceUrl:
          "https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc8032.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "City of Toronto",
      },
      // Real video: 24/7 YouTube streams, embedded by channel id
      // (/embed/live_stream?channel=...) so the link survives stream restarts.
      // Third-party streams — they can occasionally go offline.
      {
        id: "toronto-skyline-live",
        name: "Downtown Skyline (live video)",
        location: "CN Tower & Lake Ontario skyline — 24/7 stream",
        sourceUrl:
          "https://www.youtube.com/embed/live_stream?channel=UC28IT4ghbKO988OzkIfRCbw",
        kind: "embed",
        proxy: false,
        attribution: "TorontoLive4k (YouTube)",
      },
      {
        id: "toronto-cn-tower-spadina",
        name: "CN Tower & Spadina (live video)",
        location: "CN Tower over Spadina Ave & Gardiner — 24/7 stream",
        sourceUrl:
          "https://www.youtube.com/embed/live_stream?channel=UCuUtTm7v20_S-qIx5G8P_gg",
        kind: "embed",
        proxy: false,
        attribution: "TorontoCNTowerLive (YouTube)",
      },
    ],
  },
  {
    slug: "seattle",
    name: "Lumen Field",
    city: "Seattle, WA",
    timezone: "America/Los_Angeles",
    espnVenueNames: ["Lumen"],
    cameras: [
      {
        id: "seattle-i5-dearborn",
        name: "I-5 at S Dearborn St",
        location: "I-5 at S Dearborn St, just east of Lumen Field, Seattle, WA",
        sourceUrl: "https://images.wsdot.wa.gov/nw/005vc16465.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "WSDOT",
      },
      {
        id: "seattle-i5-judkins",
        name: "I-5 at S Judkins St",
        location: "I-5 at S Judkins St, Seattle, WA",
        sourceUrl: "https://images.wsdot.wa.gov/nw/005vc16440.jpg",
        kind: "jpeg",
        proxy: true,
        refreshMs: 60_000,
        attribution: "WSDOT",
      },
    ],
  },
];

export function getAllVenues(): Venue[] {
  return VENUES;
}

export function getVenue(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug);
}

export function getCamera(camId: string) {
  for (const venue of VENUES) {
    const camera = venue.cameras.find((c) => c.id === camId);
    if (camera) return { venue, camera };
  }
  return undefined;
}
