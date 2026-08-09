import { FRAME_MARKS, LAYER, fx, fy } from './scene'

/**
 * The wall: full-bleed plaster, rendered beneath everything solid.
 *
 * This is the load-bearing change of the whole composition. The scene is a
 * lane in front of a house — you stand two metres back from the wall and see
 * wall, not floor, not sky, not cream. No page ground survives anywhere below
 * `LAYER.wall`: the plaster bleeds off every edge of the frame, so the aperture
 * is the only cream in the picture. The upper-right void — 16% of the frame,
 * bare plaster and the shadow's tail — *is* the navigation on a page with no
 * button: the eye ranges, finds nothing above, and drops onto the tags.
 *
 * Light is painted, not pasted: a sun-side wash raking in from the upper left,
 * a shade creeping in from the right edge and up from the bottom, and a
 * blistering of the same ink used everywhere else at 6–10% so the wall reads
 * as weathered lime rather than as one flat fill.
 *
 * `hh-grain` covers the whole field via HeroEnvironment.
 */
export function Wall() {
  return (
    <div className={`pointer-events-none absolute inset-0 ${LAYER.wall}`} aria-hidden="true">
      {/* The field itself. Bleeds top/bottom/left; on the right the field is
          cut to x1512 and the corner return + outside sliver take over. */}
      <div
        className="absolute inset-0"
        style={{
          right: 'var(--hh-wall-r)',
          background: 'var(--color-plaster)',
        }}
      />

      {/* Sun-side wash. Light gathers at 18% 22% and falls off down and right,
          agreeing with where the sun stands. */}
      <div
        className="absolute inset-0"
        style={{
          right: 'var(--hh-wall-r)',
          background:
            'radial-gradient(55% 55% at 18% 22%, var(--color-plaster-lit) 0%, var(--color-plaster) 60%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Shade. From the right edge past 68% width, and up from the bottom 18%.
          The corner return is not drawn but *wrapped*, so its right face is the
          continuation of this shade — the outside reads as true overcast. */}
      <div
        className="absolute inset-0"
        style={{
          right: 'var(--hh-wall-r)',
          background:
            'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 68%, var(--color-plaster-shade) 100%), linear-gradient(to top, var(--color-plaster-shade) 0%, rgba(0,0,0,0) 18%)',
        }}
      />

      {/* Blistering: uneven weathering, densest in the bottom 22% and in a band
          around the window's reveal, thinning away in the upper right — the
          clean quarter above the tags must stay felt, not seen. */}
      <div
        className="absolute inset-0"
        style={{
          right: 'var(--hh-wall-r)',
          opacity: 0.08,
          mixBlendMode: 'multiply',
          background:
            'radial-gradient(46% 24% at 50% 88%, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%), radial-gradient(58% 13% at 40% 100%, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%), radial-gradient(24% 20% at 31% 79%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(18% 16% at 44% 70%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(15% 13% at 70% 72%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(17% 14% at 58% 59%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(22% 16% at 74% 62%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(21% 17% at 59% 80%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(15% 12% at 87% 54%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(16% 13% at 91% 66%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(14% 11% at 83% 76%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(19% 15% at 27% 38%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(16% 13% at 36% 51%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(14% 11% at 64% 44%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(18% 14% at 78% 49%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%), radial-gradient(13% 11% at 47% 90%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--color-ink-soft) 55%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Ghost patch — approved refinement 1. A hand's-width area of unweathered
          plaster immediately left of the nail, where something used to hang.
          Slightly lighter than the field, no hard edge, no chroma. It must read
          as *less weathering*, which is why it is achieved by locally removing
          the blistering above rather than by painting a lighter shape on top —
          and it is deliberately over this layer stack, so it lightens the
          plaster's own shade too, exactly as washed lime would. Subtle enough
          to be felt, not seen. */}
      <div
        className="absolute"
        style={{
          left: fx(1330),
          top: fy(560),
          width: fx(112),
          height: fy(118),
          background:
            'radial-gradient(46% 44% at 50% 50%, rgba(223,201,162,0.5) 0%, rgba(223,201,162,0.2) 45%, rgba(0,0,0,0) 78%)',
        }}
      />

      {/* Corner return: the wall wraps, and the wrap shows a hand-drawn edge —
          an 8px vertical band at x1512 wobbled ±3px so it is never a ruled
          line. It caps below paper-warm so the aperture stays the only cream. */}
      <div className="absolute" style={{ left: fx(FRAME_MARKS.cornerReturn - 8), top: 0, bottom: 0, width: fx(8) }}>
        <svg
          viewBox="0 0 8 1000"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M 2 0 L 6.5 82 L 2.5 176 L 7 262 L 3 351 L 6.8 447 L 2.4 538 L 6.6 634 L 2.9 731 L 5.8 829 L 3.2 919 L 5.4 1000"
            fill="none"
            stroke="var(--color-plaster-edge)"
            strokeWidth="4.4"
            strokeLinecap="round"
            opacity="0.92"
          />
        </svg>
      </div>

      {/* Outside sliver, x1520 → 1600: sky, sea, and the lane's far side,
          glimpsed past the corner. Capped below paper-warm so it never
          competes with the aperture. */}
      <div
        className="absolute inset-y-0 hidden md:block"
        style={{ left: fx(FRAME_MARKS.outsideLeft), right: 0 }}
      >
        <div className="absolute inset-0" style={{ background: 'var(--color-sky-far)' }} />
        {/* The sea band. Held at the same desaturation `Ocean` applies to the
            painted waves that sit on top of it — a flat, fully saturated
            --color-sea here would be the loudest chroma in the frame and would
            pull the eye off the aperture, which is the one thing this sliver
            must never do. */}
        <div
          className="absolute inset-x-0"
          style={{
            top: fy(596),
            height: fy(26),
            background: 'var(--color-sea)',
            filter: 'saturate(0.45) brightness(1.24)',
          }}
        />
        <div className="absolute inset-x-0" style={{ top: fy(622), bottom: 0 }}>
          <div className="absolute inset-0" style={{ background: 'var(--color-lane-far)' }} />
          <div className="absolute inset-x-0" style={{ top: 0, height: '100%', opacity: 0.35 }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(64,88,77,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 68%, rgba(64,88,77,0.5) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* The ground, and the seam where it meets the wall. On desktop the ground
          line falls at y1065 — off-frame — so none of this exists: you see wall,
          not floor. On mobile the ground is in frame, so the wall gains a 3px
          contact seam and the lane below it. */}
      <div
        className="absolute inset-x-0"
        style={{ top: 'var(--hh-ground)', bottom: 0, display: 'var(--hh-ground-display, none)' }}
      >
        <div
          className="absolute inset-x-0"
          style={{
            top: 0,
            height: '3px',
            background: 'var(--color-ink-soft)',
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-x-0"
          style={{
            top: 3,
            bottom: 0,
            background:
              'linear-gradient(to bottom, var(--color-lane) 0%, var(--color-plaster-shade) 100%)',
          }}
        />
      </div>
    </div>
  )
}

