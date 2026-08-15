/**
 * Twilight Hues, as raw values for the handful of components that take colours
 * as props rather than reading CSS. These mirror the `--twilight-*` custom
 * properties in app/globals.css; change both or neither.
 */
export const twilight = {
  sky: "#87ceeb",
  orchid: "#ba55d3",
  darkorchid: "#9932cc",
  darkviolet: "#9400d3",
  blueviolet: "#8a2be2",
} as const;

/** Page backdrops, matching --background / --surface in each theme. */
export const backdrop = {
  dark: "#0d0c15",
  darkMid: "#241a3d",
  light: "#f4f7fb",
} as const;

/**
 * The aurora is a night-sky effect and its shader only ever adds light to the
 * base colour, so a pale base blows out to white. Dark mode gets the real
 * thing; light mode gets a CSS wash instead.
 */
export const auroraDark = {
  baseColor: backdrop.dark,
  midColor: backdrop.darkMid,
  sheenColor: twilight.sky,
  accentColor: twilight.orchid,
} as const;
