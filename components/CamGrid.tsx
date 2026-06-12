import type { Camera } from "@/lib/types";
import { accentVar } from "@/lib/palette";
import CamTile from "./CamTile";

/**
 * Responsive grid of camera tiles for one venue. Each tile gets a poster
 * accent colour cycled from the palette.
 * TODO: consider passing a faster refreshMs to tiles when the venue is "live".
 */
export default function CamGrid({ cameras }: { cameras: Camera[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cameras.map((camera, i) => (
        <CamTile key={camera.id} camera={camera} accent={accentVar(i)} />
      ))}
    </div>
  );
}
