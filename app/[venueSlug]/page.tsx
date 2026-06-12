import Link from "next/link";
import { notFound } from "next/navigation";
import CamGrid from "@/components/CamGrid";
import LivePanel from "@/components/LivePanel";
import { getAllVenues, getVenue } from "@/lib/venues";

/** One venue's fan-cam page. Works for any registry entry — no per-city pages. */
export default async function VenuePage({
  params,
}: {
  params: Promise<{ venueSlug: string }>;
}) {
  const { venueSlug } = await params;
  const venue = getVenue(venueSlug);
  if (!venue) notFound();

  return (
    <>
      <header className="relative overflow-hidden bg-tangerine">
        <div aria-hidden className="sunrays absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/90 hover:text-paper"
          >
            ← All host cities
          </Link>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-tight text-paper sm:text-7xl">
            {venue.name}
          </h1>
          <p className="mt-2 text-lg uppercase tracking-wide text-navy">
            {venue.city} · {venue.cameras.length} cams
          </p>
        </div>
        <div className="h-3 bg-mustard" />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="space-y-6">
          <LivePanel venue={venue} />
          <CamGrid cameras={venue.cameras} />
        </div>
      </main>

      <footer className="border-t-4 border-ink bg-tangerine px-6 py-6">
        <p className="mx-auto max-w-6xl text-sm uppercase tracking-wide text-paper">
          Feeds courtesy of{" "}
          {[...new Set(venue.cameras.map((c) => c.attribution))].join(", ")} ·
          cams can be buggy · inspired by{" "}
          <a href="https://gardencam.wttdotm.com/" className="underline">
            GardenCam
          </a>{" "}
          by @wttdotm.
        </p>
      </footer>
    </>
  );
}

export function generateStaticParams() {
  return getAllVenues().map((venue) => ({ venueSlug: venue.slug }));
}
