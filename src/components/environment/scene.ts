import type { CSSProperties } from 'react'

/**
 * Shared geometry for the arrival scene.
 *
 * IMPORTANT — two coordinate spaces.
 *
 * 1. The *window artwork box*. `SceneImage` sizes its box to an asset's
 *    artwork bounds, not to the source file. For the window that box is the
 *    pixel rect (220, 109) → (1315, 876), i.e. 1095 × 767. Every percentage
 *    in `WINDOW_APERTURE` / `WINDOW_SILL` is expressed against that box, so it
 *    can be dropped straight onto a child of the rendered window.
 *
 * 2. The *frame*. The approved composition was drawn against a 1600 × 1000
 *    frame, and the spec's object coordinates (the tags at x1350, the shutter
 *    shadow terminating at x1348, the corner return at x1512) are literal
 *    pixels in that frame. `fx`/`fy` convert those numbers to viewport units
 *    so the relationships between them survive at any width — most critically
 *    the 2px gap between the shutter shadow's edge and the tags, which is the
 *    page's only findability mechanism on desktop.
 *
 * Anything that has to differ between mobile and desktop lives as a CSS custom
 * property on `.hh-scene` in index.css, because inline styles cannot carry a
 * media query. Those properties are catalogued in `SCENE_VARS` below so this
 * file stays the single index of the scene's geometry.
 */

/** Window artwork box, in source pixels. */
const BOX = { x: 220, y: 109, w: 1095, h: 767 } as const

const pctX = (px: number) => `${(((px - BOX.x) / BOX.w) * 100).toFixed(3)}%`
const pctY = (px: number) => `${(((px - BOX.y) / BOX.h) * 100).toFixed(3)}%`
const spanX = (px: number) => `${((px / BOX.w) * 100).toFixed(3)}%`
const spanY = (px: number) => `${((px / BOX.h) * 100).toFixed(3)}%`

/**
 * The window's opening, measured from the alpha channel of
 * `goan-window-frame.png`: it spans x 492 → 1035 and y 165 → 791.
 *
 * Phase 1 leaves this deliberately empty — it is the reserved slot for the
 * Builder ID. Because the numbers are measured rather than eyeballed, whatever
 * Phase 2 renders here registers against the frame at every viewport size.
 */
export const WINDOW_APERTURE = {
  left: pctX(492),
  top: pctY(165),
  width: spanX(543),
  height: spanY(626),
} as const

/** Aperture proportions, for sizing whatever eventually sits inside it. */
export const APERTURE_ASPECT = 543 / 626

/**
 * The window artwork's own ratio (1095 × 767). Used to size the frame against
 * the height that is actually left on screen, so the scene always fits in one
 * viewport instead of pushing its own ground line past the fold.
 */
export const WINDOW_ASPECT = BOX.w / BOX.h

/**
 * The wooden sill: the only true horizontal surface in the entire asset set.
 * Nothing is set down on it — the bare sill is one of the four load-bearing
 * voids — but the objects on the wall beside the window measure themselves
 * against its line, so the numbers still matter.
 */
export const WINDOW_SILL = {
  top: pctY(791),
  bottom: pctY(871),
  left: pctX(419),
  right: pctX(1120),
} as const

/* --------------------------------------------------------------------------
   Frame space — 1600 x 1000, the space the composition was drawn in.
-------------------------------------------------------------------------- */

export const FRAME = { w: 1600, h: 1000 } as const

/** Frame x, in vw. */
export const fx = (px: number) => `${((px / FRAME.w) * 100).toFixed(4)}vw`
/** Frame y, in vh. */
export const fy = (px: number) => `${((px / FRAME.h) * 100).toFixed(4)}vh`

/**
 * Key horizontals of the composition, in frame pixels. Kept together so the
 * numbers that have to agree with each other are visibly adjacent.
 *
 * The window box lands at x 528 → 1232, top y 340, which puts its mass at
 * (880, 590): right of frame centre by 80px, below it by 90px, so it sits down
 * into the wall rather than floating on it. Everything below is measured
 * against that box.
 */
export const FRAME_MARKS = {
  /** Window box, desktop. */
  windowLeft: 528,
  windowRight: 1232,
  windowTop: 340,
  /** Bottom of the wooden sill — the horizontal that reads across the scene. */
  sillLine: 830,
  /** The aperture's left edge. Nothing may cross it. */
  apertureLeft: 703,
  /** Where the right shutter's cast shadow stops. */
  shadowEdge: 1348,
  /** Where the tags start — 2px past the shadow. Do not round this away. */
  tagsLeft: 1350,
  /** The wall's corner return. */
  cornerReturn: 1512,
  /** Everything right of here is outside. */
  outsideLeft: 1520,
} as const

/**
 * Depth order, named so the stacking reads as a physical scene rather than a
 * pile of magic numbers.
 */
export const LAYER = {
  sky: 'z-0',
  ocean: 'z-20',
  palms: 'z-30',
  wall: 'z-[35]',
  light: 'z-[36]',
  wallGraphics: 'z-[38]',
  window: 'z-40',
  tags: 'z-[45]',
  foreground: 'z-50',
} as const

/**
 * Entrance beats, in ms. Ground first, then the light that falls on it, then
 * the window, then the objects — and the tags last and separately.
 *
 * The stagger between `objects`, `objectsTile` and the two tag beats is the
 * point, not an accident: the browsing moment this page is built on depends on
 * those arriving as separate visits rather than as one reveal.
 * Total ~1.29s + ease.
 */
export const BEAT = {
  sky: 0,
  light: 60,
  ocean: 120,
  palms: 240,
  heading: 320,
  window: 420,
  windowShade: 480,
  objects: 620,
  objectsTile: 710,
  tagNamed: 800,
  tagBlank: 890,
} as const

/**
 * The scene's responsive geometry lives in CSS custom properties on
 * `.hh-scene` (index.css), because it changes at the `md` breakpoint and an
 * inline style cannot carry a media query. Named here so this file remains the
 * index of the scene's geometry.
 */
export const SCENE_VARS = {
  windowLeft: 'var(--hh-win-l)',
  windowTop: 'var(--hh-win-t)',
  windowWidth: 'var(--hh-win-w)',

  tagsLeft: 'var(--hh-tags-l)',
  tagsTop: 'var(--hh-tags-t)',
  tagsWidth: 'var(--hh-tags-w)',

  tileLeft: 'var(--hh-tile-l)',
  tileTop: 'var(--hh-tile-t)',
  tileWidth: 'var(--hh-tile-w)',

  noteLeft: 'var(--hh-note-l)',
  noteTop: 'var(--hh-note-t)',
  noteWidth: 'var(--hh-note-w)',

  scooterLeft: 'var(--hh-scooter-l)',
  scooterTop: 'var(--hh-scooter-t)',
  scooterWidth: 'var(--hh-scooter-w)',

  typeMargin: 'var(--hh-type-x)',
} as const

/**
 * One reduced-motion check, hoisted here so every component reads the same
 * signal. Read at render rather than subscribed to: the preference does not
 * change mid-visit in practice, and a listener per object would cost more than
 * it earns.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * An inline style that may also set CSS custom properties.
 *
 * React's `CSSProperties` rejects `--foo` keys, and the scene needs one:
 * `--hh-o` carries an element's *designed* opacity so the entrance animation
 * can scale it rather than overwrite it. Animating `opacity` directly would
 * drag a 6% shadow to 100%, because an animation with `forwards` outranks an
 * inline style — which is exactly the bug this type exists to prevent.
 */
export type SceneStyle = CSSProperties & {
  '--hh-o'?: number
}
