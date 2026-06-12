"use client";

import { useEffect, useRef, useState } from "react";
import type { Camera } from "@/lib/types";

const MAX_FAILURES = 3;

/**
 * Plays an HLS (.m3u8) live stream. Safari/iOS play HLS natively, so we just
 * point the <video> at the playlist; everywhere else we lazy-load hls.js the
 * first time an HLS tile mounts (dynamic import keeps it out of the main bundle
 * — see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md). A fatal
 * stream error swaps in a "stream offline" panel rather than a frozen frame.
 */
function HlsVideo({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setOffline(false);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // native HLS (Safari / iOS)
      return;
    }

    let destroyed = false;
    let hls: import("hls.js").default | null = null;
    import("hls.js").then(({ default: Hls }) => {
      if (destroyed) return;
      if (!Hls.isSupported()) {
        setOffline(true);
        return;
      }
      hls = new Hls({ liveSyncDurationCount: 3 });
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) setOffline(true);
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    });

    return () => {
      destroyed = true;
      hls?.destroy();
    };
  }, [src]);

  if (offline) {
    return (
      <div
        className={`flex items-center justify-center bg-black text-sm uppercase tracking-[0.25em] text-paper/40 ${className}`}
      >
        stream offline
      </div>
    );
  }

  return (
    <video ref={videoRef} className={className} autoPlay muted playsInline />
  );
}

/**
 * One camera feed.
 * - "jpeg": polls a fresh frame every `refreshMs`, preloading each frame
 *   off-screen and swapping only on load so the tile never goes blank. After
 *   repeated failures it dims and shows a "cam buggy" badge but keeps
 *   retrying — public DOT cams drop out and recover all the time.
 * - "embed": renders the sourceUrl in an iframe (muted autoplay), e.g. a
 *   YouTube live stream.
 * - "hls": plays an .m3u8 stream via <HlsVideo> (e.g. an untokened 511 feed).
 * Tiles enlarge into a lightbox (Escape or backdrop click to close); jpeg
 * tiles enlarge on click, embeds via the caption button since the iframe
 * swallows clicks.
 *
 * The cam image itself stays untouched (clean feed); all the retro character
 * lives in the `accent`-coloured frame and caption.
 */
export default function CamTile({
  camera,
  accent = "var(--color-tangerine)",
  refreshMs = 2000,
}: {
  camera: Camera;
  accent?: string;
  refreshMs?: number;
}) {
  const base = camera.proxy ? `/api/cam/${camera.id}` : camera.sourceUrl;
  const pollMs = camera.refreshMs ?? refreshMs;
  const isEmbed = camera.kind === "embed";
  const isHls = camera.kind === "hls";
  // embed + hls are both autoplaying video; jpeg is the polled-still path.
  const isLiveVideo = isEmbed || isHls;
  const [src, setSrc] = useState<string | null>(null);
  const [buggy, setBuggy] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const failures = useRef(0);

  useEffect(() => {
    if (isLiveVideo) return;
    let active = true;
    const sep = base.includes("?") ? "&" : "?";

    const load = () => {
      // Quantize to the poll window so all concurrent viewers share one URL
      // per interval — that's what lets the proxy's s-maxage edge cache absorb
      // the fan-out instead of every viewer hitting the upstream cam.
      const next = `${base}${sep}t=${Math.floor(Date.now() / pollMs) * pollMs}`;
      const img = new Image();
      img.onload = () => {
        if (!active) return;
        failures.current = 0;
        setBuggy(false);
        setSrc(next);
      };
      img.onerror = () => {
        if (!active) return;
        failures.current += 1;
        if (failures.current >= MAX_FAILURES) setBuggy(true);
      };
      img.src = next;
    };

    load();
    const id = setInterval(load, pollMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [base, pollMs, isLiveVideo]);

  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEnlarged(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enlarged]);

  const cadence = isLiveVideo
    ? "live video"
    : pollMs >= 1000
      ? `still · ${Math.round(pollMs / 1000)}s`
      : "live";

  const embedSrc = isEmbed
    ? `${camera.sourceUrl}${camera.sourceUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&playsinline=1`
    : null;

  const renderEmbed = (className: string) => (
    <iframe
      src={embedSrc!}
      title={camera.name}
      className={className}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );

  // The autoplaying-video media (embed → iframe, hls → <video>), shared by the
  // tile and the lightbox.
  const renderLiveMedia = (className: string) =>
    isEmbed ? (
      renderEmbed(className)
    ) : (
      <HlsVideo src={camera.sourceUrl} className={className} />
    );

  // Shared "● LIVE" bug pinned to the top-left of the media area.
  const liveBug = (
    <span className="pointer-events-none absolute left-0 top-3 z-10 flex items-center gap-1.5 bg-flag-red py-1 pl-2 pr-3 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
      <span className="h-2 w-2 rounded-full bg-paper" />
      Live
    </span>
  );

  return (
    <figure
      className="overflow-hidden bg-ink shadow-block"
      style={{ border: `6px solid ${accent}` }}
    >
      {isLiveVideo ? (
        <div className="relative aspect-video bg-black">
          {liveBug}
          {/* unmount the tile player while enlarged so two streams don't run */}
          {!enlarged && renderLiveMedia("h-full w-full object-cover")}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => src && setEnlarged(true)}
          className="relative block aspect-video w-full cursor-zoom-in bg-black"
          aria-label={`Enlarge ${camera.name}`}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- re-polled raw JPEGs; next/image would only add latency
            <img
              src={src}
              alt={camera.name}
              className={`h-full w-full object-cover ${buggy ? "opacity-40" : ""}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.25em] text-paper/40">
              connecting…
            </div>
          )}
          {liveBug}
          {buggy && (
            <span className="absolute right-2 top-3 bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-mustard">
              cam buggy
            </span>
          )}
        </button>
      )}
      <figcaption className="px-3 py-2.5" style={{ background: accent }}>
        <p className="text-base font-semibold uppercase leading-tight tracking-wide text-paper">
          {camera.name}
        </p>
        <div className="mt-0.5 flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-wide text-paper/80">
          <span>{camera.location}</span>
          {isLiveVideo ? (
            <button
              type="button"
              onClick={() => setEnlarged(true)}
              className="shrink-0 text-paper/70 underline hover:text-paper"
            >
              enlarge
            </button>
          ) : (
            <span className="shrink-0 text-paper/60">{cadence}</span>
          )}
        </div>
      </figcaption>

      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-ink/95 p-6"
          onClick={() => setEnlarged(false)}
          role="dialog"
          aria-modal="true"
          aria-label={camera.name}
        >
          {isLiveVideo ? (
            <div
              className="aspect-video w-full max-w-6xl cursor-default"
              onClick={(e) => e.stopPropagation()}
              style={{ border: `6px solid ${accent}` }}
            >
              {renderLiveMedia("h-full w-full object-contain")}
            </div>
          ) : (
            src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={camera.name}
                className="max-h-[85vh] max-w-full object-contain"
                style={{ border: `6px solid ${accent}` }}
              />
            )
          )}
          <p className="text-sm uppercase tracking-wide text-paper">
            {camera.name} · {camera.location}
            <span className="ml-2 text-paper/50">{cadence} · esc to close</span>
          </p>
        </div>
      )}
    </figure>
  );
}
