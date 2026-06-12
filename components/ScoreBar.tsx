import type { MatchSummary } from "@/lib/types";

/** Ticker of all live World Cup matches anywhere. Purely presentational. */
export default function ScoreBar({ matches }: { matches: MatchSummary[] }) {
  if (matches.length === 0) {
    return (
      <div className="border-l-[6px] border-ink bg-paper px-5 py-2.5 text-sm uppercase tracking-wide text-ink/60">
        No World Cup matches live right now
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-ink px-5 py-2.5">
      <span className="flex items-center gap-1.5 font-display text-sm uppercase tracking-[0.2em] text-flag-red">
        <span className="h-2 w-2 rounded-full bg-flag-red" />
        Live
      </span>
      {matches.map((m) => (
        <span
          key={m.id}
          className="bg-paper/10 px-2 py-0.5 text-sm uppercase tracking-wide text-paper"
        >
          {m.homeAbbr} {m.homeScore ?? 0}–{m.awayScore ?? 0} {m.awayAbbr}
          {m.clock ? ` · ${m.clock}` : ""}
        </span>
      ))}
    </div>
  );
}
