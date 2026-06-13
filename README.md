# World Cup Fan Cam

Watch the hype build around World Cup 2026 stadiums through public traffic
cameras, with live scores overlaid. Inspired by
[GardenCam](https://gardencam.wttdotm.com/) by [@wttdotm](https://wttdotm.com/),
which did this for Knicks games around MSG.

```bash
npm run dev   # http://localhost:3000
```

## Architecture

```
lib/venues.ts                 ← THE config. One Venue entry per host city.
lib/types.ts                  ← Venue / Camera / MatchSummary / MatchesResponse
lib/espn.ts                   ← scoreboard fetch + parsing
app/page.tsx                  ← venue index (auto-generated from registry)
app/[venueSlug]/page.tsx      ← one venue's cam page (works for any entry)
app/api/cam/[camId]/route.ts  ← image proxy for hotlink-blocking sources
app/api/matches/route.ts      ← scores endpoint, 60s-cached
components/                   ← CamGrid, CamTile, ScoreBar, MatchDayBanner
```

## Live venues

9 host cities have verified, working cameras:

| Venue | Cams | Source |
|---|---|---|
| BMO Field (Toronto) | Princes' Gates, Liberty Village fan walk, Exhibition Place, Fan Festival, Yonge-Dundas + 2 live video streams | City of Toronto open data, YouTube |
| MetLife Stadium (NY/NJ) | Penn Station, 8th Ave @ 31st & 33rd | NYC DOT |
| Mercedes-Benz Stadium (Atlanta) | Northside Dr & Centennial Park Dr @ MLK | GDOT / 511GA |
| Hard Rock Stadium (Miami) | Turnpike @ Miami Gardens Dr, University @ Miramar | FDOT / FL511 |
| Lincoln Financial Field (Philly) | I-95 @ Broad St & MM 17.4 | PennDOT / 511PA |
| SoFi Stadium (LA) | Prairie still + Manchester & Exposition (Fan Festival exit) live HLS, Venice & Santa Monica boardwalks, roving SoFi match-day walk, DTLA skyline | Caltrans D7, YouTube |
| Levi's Stadium (Bay Area) | SR-237 @ Lafayette & North First | Caltrans D4 |
| Lumen Field (Seattle) | I-5 @ Dearborn & Judkins | WSDOT |
| NRG Stadium (Houston) | I-610 South Loop @ Kirby & Fannin | Houston TranStar |

Notes on the gaps:
- **NY/NJ**: every NJ-side *still* source is unavailable, so the JPEG cams watch
  Penn Station — where fans board NJ Transit to MetLife. The NJTA Turnpike
  MM 112.3 cam adjacent to the stadium is now live as an `hls` feed.
- **Boston**: skipped — MassDOT's snapshot host serves "temporarily
  unavailable" placeholders statewide. Candidate URLs (I-95 @ Exit 17, Sharon):
  `https://public.carsprogram.org/cameras/MA/435513-fullJpeg.jpg` and
  `.../435512-fullJpeg.jpg` — retest later, they may recover.
- **Dallas** (AT&T Stadium, Arlington — TxDOT Fort Worth district): no
  hotlinkable still. TxDOT's current ITS (`its.txdot.gov/its/District/FTW`)
  delivers CCTV snapshots over a SignalR/msgpack hub + a REST API
  (`DistrictIts/GetCctvSnapshotByIcdId`) that returns image *data* keyed by
  `icd_Id`, not a static JPEG URL — so it can't be hotlinked or proxied as-is.
  Revisit if the proxy learns to call that endpoint and re-emit the bytes.
- **Kansas City** (GEHA Field at Arrowhead — KC Scout / MoDOT): cameras are
  tokenized Wowza HLS (`<wowza>/<app>/<file>/playlist.m3u8?<token>`) where the
  token is minted per session, so there's no stable URL to embed. MoDOT's
  still-image "Improve I-70" cams (`modot.org/improvei70kc/live-cameras`) sit
  downtown (Prospect–31st), not out at the I-70/I-435 Truman Sports Complex.

## Data sources

**Scores/fixtures** — ESPN's free, keyless JSON API (verified working):

```
https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard
```

Each event includes `competitions[0].venue.fullName`, which is matched against
`Venue.espnVenueNames` to know which matches happen at which stadium. Add
`?dates=YYYYMMDD-YYYYMMDD` for fixtures beyond today.

**Cameras** — harvested per city from public DOT/511 systems:

- **NYC DOT**: `curl https://webcams.nyctmc.org/api/cameras` lists every cam
  with coordinates and a JPEG `imageUrl` that refreshes ~2s. Hotlinking works,
  but the MetLife entries use `proxy: true` anyway so the edge cache absorbs
  viewer fan-out.
- **City of Toronto** (BMO Field): open-data GeoJSON of 336 street-level cams —
  <https://open.toronto.ca/dataset/traffic-cameras/> — with JPEG stills at
  `opendata.toronto.ca/.../CameraImages/loc<id>.jpg`. Unlike most 511 systems
  these cover pedestrian intersections. Stills regenerate ~1/min at best and
  can stall off-peak; down cams serve a fixed-size "Image Unavailable" JPEG,
  which the proxy detects and converts to a 502.
- **511NJ** (Meadowlands/MetLife): open <https://511nj.org/cameras.aspx>, dev
  tools → Network tab, find the JSON endpoint behind the camera map, copy the
  image/stream URLs for Rt 3 / Rt 120 / Turnpike 16W. Typically blocks
  hotlinking → `proxy: true` so `/api/cam/[id]` fetches it server-side.
- Other host cities have equivalents: 511GA (Atlanta), FL511 (Miami),
  Houston TranStar, Caltrans (LA/SF), WSDOT (Seattle), Mass511 (Boston),
  511PA (Philly), KC Scout (KC), Ontario 511 (Toronto), DriveBC (Vancouver).

Prefer JPEG-still cams. For real video, `kind: "embed"` renders the sourceUrl
in an iframe — used for 24/7 YouTube live streams, embedded by channel id
(`/embed/live_stream?channel=...`) so links survive stream restarts. If a
source only offers HLS video (`.m3u8`), set `kind: "hls"` (`proxy: false`):
CamTile plays it via [hls.js](https://github.com/video-dev/hls.js), lazy-loaded
on the client only when an HLS tile mounts (Safari/iOS use native HLS). The
MetLife NJTA Turnpike cam is the first HLS feed.

## Adding a new host city

Add one `Venue` entry to `lib/venues.ts`. The index page, venue page, cam
proxy, and match filtering all pick it up automatically — no other code
changes.

## Deploying

Built for Vercel (`vercel deploy`). The cam proxy should set
`Cache-Control: public, s-maxage=2, stale-while-revalidate=4` so the edge cache
makes upstream load independent of viewer count; `/api/matches` likewise with
`s-maxage=60` to stay polite to ESPN.
# World-Cam
