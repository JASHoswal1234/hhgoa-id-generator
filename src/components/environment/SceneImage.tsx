import type { CSSProperties } from 'react'
import type { SceneAsset } from '../../assets/registry'
import type { SceneStyle } from './scene'

interface SceneImageProps {
  asset: SceneAsset
  /**
   * Width of the *artwork*, not of the source file. Any CSS length —
   * `clamp(...)` and viewport units are expected here.
   */
  width: string
  /** Positioning + sizing classes for the outer box. */
  className?: string
  /**
   * Positional styles (top/left/right/bottom) for the outer box.
   *
   * `SceneStyle` rather than `CSSProperties` because this element carries the
   * entrance animation: an asset with a designed opacity must pass it as
   * `--hh-o` so the wash scales it instead of overriding it.
   */
  style?: SceneStyle
  /** Degrees. Applied about the artwork's own centre. */
  rotate?: number
  /** Entrance delay in ms. */
  delay?: number
  /** Skips the entrance animation for elements that should simply be there. */
  still?: boolean
  /** Only the window is worth fetching eagerly. */
  priority?: boolean
}

/**
 * Places an illustration by its *artwork* rather than by its file.
 *
 * The outer box is exactly the artwork's bounding box, so `left: 12%` means the
 * ink starts at 12% — not the file's transparent margin. The image is scaled up
 * and shifted underneath so its content lands flush inside that box.
 *
 * Layering, from outside in:
 *   box      — anchors and animates (owns the entrance transform)
 *   frame    — holds the artwork's aspect ratio and any rotation
 *   img      — oversized and offset so its content fills `frame`
 *
 * Keeping the entrance transform and the placement transform on separate
 * elements is what stops the two from cancelling each other out.
 */
export function SceneImage({
  asset,
  width,
  className = '',
  style,
  rotate = 0,
  delay = 0,
  still = false,
  priority = false,
}: SceneImageProps) {
  const [canvasW, canvasH] = asset.canvas
  const [x0, y0, x1, y1] = asset.content
  const contentW = x1 - x0
  const contentH = y1 - y0

  const imgStyle: CSSProperties = {
    width: `${(canvasW / contentW) * 100}%`,
    maxWidth: 'none',
    transform: `translate(${(-x0 / canvasW) * 100}%, ${(-y0 / canvasH) * 100}%)`,
  }

  return (
    <div
      className={`${className} ${still ? '' : 'hh-settle'}`}
      style={{ width, animationDelay: still ? undefined : `${delay}ms`, ...style }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: `${contentW} / ${contentH}`,
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
        }}
      >
        <img
          src={asset.src}
          alt={asset.alt}
          width={canvasW}
          height={canvasH}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          className="absolute left-0 top-0 h-auto select-none"
          style={imgStyle}
          aria-hidden={asset.alt === '' ? true : undefined}
        />
      </div>
    </div>
  )
}
