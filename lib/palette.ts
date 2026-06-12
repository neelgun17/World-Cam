/**
 * Poster-palette accents cycled across cam frames and venue tiles. These name
 * the theme tokens defined in app/globals.css, so the hex lives in exactly one
 * place; here we just reference them for per-item accent colouring.
 */
export const ACCENT_TOKENS = [
  "--color-tangerine",
  "--color-teal",
  "--color-flag-red",
  "--color-mustard",
  "--color-navy",
] as const;

/** CSS color value for the i-th item, cycling through the palette. */
export function accentVar(i: number): string {
  return `var(${ACCENT_TOKENS[i % ACCENT_TOKENS.length]})`;
}
