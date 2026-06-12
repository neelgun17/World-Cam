import Link from "next/link";
import { getAllVenues } from "@/lib/venues";
import { accentVar, ACCENT_TOKENS } from "@/lib/palette";

/** Venue index — every entry in lib/venues.ts shows up here automatically. */
export default function Home() {
  const venues = getAllVenues();

  return (
    <>
      <header className="relative overflow-hidden bg-tangerine">
        <div aria-hidden className="sunrays absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-paper">
            ⚽ World Cup 2026 · Fan Cam
          </p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-[0.82] tracking-tight sm:text-8xl">
            <span className="block text-paper">World Cup</span>
            <span className="block text-navy">
              Fan Cam <span className="text-mustard">&apos;26</span>
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg uppercase tracking-wide text-paper">
            Watch the hype build outside every host stadium through public street
            cams — grainy, live, and gloriously low-res. Inspired by{" "}
            <a
              href="https://gardencam.wttdotm.com/"
              className="underline decoration-2 underline-offset-2"
            >
              GardenCam
            </a>
            .
          </p>
        </div>
        <div className="flex h-3">
          {ACCENT_TOKENS.map((token) => (
            <div
              key={token}
              className="flex-1"
              style={{ background: `var(${token})` }}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <h2 className="mb-6 font-display text-3xl uppercase tracking-tight sm:text-4xl">
          {venues.length} Host Cities
        </h2>
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {venues.map((venue, i) => {
            const accent = accentVar(i);
            return (
              <li key={venue.slug}>
                <Link
                  href={`/${venue.slug}`}
                  className="block bg-paper p-1.5 shadow-block-sm transition-transform hover:-translate-y-0.5"
                  style={{ border: `5px solid ${accent}` }}
                >
                  <div
                    className="h-full px-3 py-4"
                    style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: accent }}
                    >
                      {venue.cameras.length} cams
                    </span>
                    <h3 className="mt-1 font-display text-xl uppercase leading-none tracking-tight text-ink">
                      {venue.name}
                    </h3>
                    <p className="mt-1.5 text-sm uppercase tracking-wide text-ink/70">
                      {venue.city}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="border-t-4 border-ink bg-tangerine px-6 py-6">
        <p className="mx-auto max-w-6xl text-sm uppercase tracking-wide text-paper">
          Feeds courtesy of public DOT cams · cams can be buggy · inspired by{" "}
          <a href="https://gardencam.wttdotm.com/" className="underline">
            GardenCam
          </a>{" "}
          by @wttdotm · built by{" "}
          <a
            href="https://www.neelgundlapally.com/?ref=worldcup-fancam"
            className="underline"
          >
            Neel
          </a>
        </p>
      </footer>
    </>
  );
}
