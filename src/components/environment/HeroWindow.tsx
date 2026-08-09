import { BEAT, LAYER, SCENE_VARS, WINDOW_APERTURE } from './scene'
import { SceneImage } from './SceneImage'
import { windowFrame } from '../../assets/registry'

/**
 * The hero: the open window.
 *
 * Its interior is intentionally empty. That emptiness is the point of the page
 * — it is the slot the Builder ID will be issued into — so it has to read as
 * *held open for you*, not as a failed image. Two things do that work, and
 * neither of them puts anything inside the opening:
 *
 *   1. The opening is warmer and brighter than the plaster around it, so it
 *      reads as light coming through rather than as a hole in the wall.
 *   2. A shadow falls from the frame's inner top edge, which gives the void
 *      depth — you are looking *into* somewhere, not *at* nothing.
 *
 * Geometry comes from `WINDOW_APERTURE`, measured off the PNG's alpha channel,
 * so Phase 2 can render a card here and it will register against the frame
 * exactly.
 *
 * Placement: centre 55vw, not 50. There is no mirror in this composition — the
 * window stands right of the type so the page reads left to right, type then
 * window, and then, two pixels past the window's own cast shadow, the tags. Its
 * mass lands at (880, 590): right of frame centre by 80px, below it by 90px, so
 * it is set down *into* the wall rather than floating on it.
 *
 * The sill stays bare. Nothing is set down on it, at any viewport.
 */
export function HeroWindow() {
  return (
    <div
      className={`absolute ${LAYER.window}`}
      style={{
        left: SCENE_VARS.windowLeft,
        top: SCENE_VARS.windowTop,
        width: SCENE_VARS.windowWidth,
      }}
    >
      <div className="relative">
        {/* The reserved interior. Sits behind the frame so the painted timber
            overlaps its edges and the join never shows.

            Announced as an empty labelled region rather than hidden: it is the
            one part of the scene that is not decoration. It stays empty at every
            viewport, and `data-aperture` is the hook the screenshot audit uses
            to assert that nothing has drifted into it. */}
        <div
          data-aperture
          role="region"
          aria-label="Reserved for your Builder ID card"
          className="absolute"
          style={WINDOW_APERTURE}
        >
          <div
            className="hh-wash absolute inset-0"
            aria-hidden="true"
            style={{
              animationDelay: `${BEAT.window + 260}ms`,
              /* Capped at --color-paper-warm and never brighter. The opening
                 must read as light coming through, but the instant it washes
                 toward white it stops being warm afternoon and starts being a
                 blown-out image. Hard edge, no feather: a wall has thickness,
                 so its opening has a real edge. */
              background:
                'linear-gradient(to bottom, var(--color-paper-warm) 0%, var(--color-paper-warm) 44%, #f1e6cc 100%)',
              boxShadow: 'inset 0 14px 26px -14px rgba(22,52,43,0.45)',
            }}
          />
        </div>

        <SceneImage
          asset={windowFrame}
          width="100%"
          className="relative"
          delay={BEAT.window}
          priority
        />

        {/* The wall's thickness at the opening. A plaster lintel over the top,
            and a 12px reveal down each side — lit on the sun side, a hairline
            of shade on the shaded one. This is what stops the window reading as
            a decal on a flat surface: you can see the wall is a wall thick. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute"
            style={{
              left: '-1.5%',
              right: '-1.5%',
              top: '-2.4%',
              height: '2.4%',
              background:
                'linear-gradient(to bottom, var(--color-plaster-lit) 0%, var(--color-plaster) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(223,201,162,0.8), 0 1px 2px rgba(22,52,43,0.14)',
            }}
          />
          <div
            className="absolute inset-y-0"
            style={{
              left: 0,
              width: '1.1%',
              background:
                'linear-gradient(to right, var(--color-plaster-lit) 0%, rgba(223,201,162,0) 100%)',
            }}
          />
          <div
            className="absolute inset-y-0"
            style={{
              right: 0,
              width: '1.1%',
              background:
                'linear-gradient(to left, rgba(64,88,77,0.16) 0%, rgba(64,88,77,0) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
