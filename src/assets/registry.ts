/**
 * The illustration set, with the measurements the layout needs.
 *
 * Every PNG in this project carries a different amount of empty padding around
 * its artwork — the scooter, for instance, is only 10.5% ink. Laying these out
 * by the file's canvas would make every object the wrong visual size and leave
 * it floating off its intended anchor. So each asset records the pixel box of
 * its actual content, and `SceneImage` positions by that box instead.
 *
 * Boxes were measured from the alpha channel (threshold 16/255).
 *
 * The set here is deliberately short. Most of the composition's plaster, shadow
 * and paper is drawn — inline SVG or CSS — rather than dropped in as a PNG,
 * because a drawn element can be told exactly where its edges are. Two files
 * were also removed on purpose: `vintage-luggage-tag` carries readable
 * third-party trademarks and must not ship, and `pinned-note-paper` is now
 * drawn in `Decorations` so its torn edge and pushpin can be placed exactly.
 */
export interface SceneAsset {
  /** Bundled URL. */
  readonly src: string
  /** Intrinsic canvas size, in pixels. */
  readonly canvas: readonly [width: number, height: number]
  /** Artwork bounds within the canvas: [x0, y0, x1, y1]. */
  readonly content: readonly [x0: number, y0: number, x1: number, y1: number]
  /** Empty string marks the asset as decorative for assistive tech. */
  readonly alt: string
}

import windowFrameSrc from './illustrations/architecture/goan-window-frame.webp'
import palmTallSrc from './illustrations/nature/palm-tree-tall.webp'
import wavesSrc from './illustrations/nature/ocean-waves.webp'
import scooterSrc from './illustrations/props/yellow-scooter.webp'
import fishTileSrc from './illustrations/decor/fish-tile-art.webp'

export const windowFrame: SceneAsset = {
  src: windowFrameSrc,
  canvas: [1536, 1024],
  content: [220, 109, 1315, 876],
  alt: 'A Portuguese Goan shuttered window, painted teal, standing open.',
}

/**
 * The one palm, seen through the sliver of outside past the wall's corner.
 *
 * Bounds measured the same way as every other box here: the PNG was drawn to a
 * canvas in Chromium and its alpha channel scanned at threshold 16/255, giving
 * [28, 41, 547, 829] within a 570 x 855 file (83.9% ink). The same script
 * re-measured the window frame as a control and reproduced its existing
 * [220, 109, 1315, 876] exactly, so these agree with the registry's contract.
 *
 * The trunk's axis sits at 47.43% across that content box — the alpha-weighted
 * centroid of the bottom 15% of the artwork — which is how `PalmTrees` stands
 * the trunk on x1565 instead of guessing from the box's centre.
 */
export const palmTall: SceneAsset = {
  src: palmTallSrc,
  canvas: [570, 855],
  content: [28, 41, 547, 829],
  alt: '',
}

/** Where the palm's trunk stands, as a fraction across its content box. */
export const PALM_TRUNK_X = 0.4743

export const scooter: SceneAsset = {
  src: scooterSrc,
  canvas: [736, 736],
  content: [144, 238, 576, 530],
  alt: '',
}

/** Opaque square — a real ceramic tile, not a cut-out. Has no transparency. */
export const fishTile: SceneAsset = {
  src: fishTileSrc,
  canvas: [736, 736],
  content: [0, 0, 736, 736],
  alt: '',
}

/**
 * Ocean waves - watercolor wave artwork with transparent padding.
 * Canvas is 1920 x 551, actual wave artwork occupies y: 210-497.
 * Use SceneImage to position by artwork bounds, not canvas.
 */
export const oceanWaves: SceneAsset = {
  src: wavesSrc,
  canvas: [1920, 551],
  content: [0, 210, 1920, 497],
  alt: '',
}

/** Used as a repeating background band rather than an <img>. */
export const wavesUrl: string = wavesSrc

/**
 * Vertical share of the waves PNG that is actually painted (the rest is
 * transparent padding). `Ocean` uses this to sit the waterline correctly.
 */
export const WAVES_CONTENT_Y = { top: 210 / 551, bottom: 497 / 551 } as const
