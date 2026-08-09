import { useRef, useState } from 'react'
import { BEAT, LAYER, SCENE_VARS, prefersReducedMotion } from './scene'
import { TagShape } from './TagShape'
import { TagString } from './TagString'
import { useIdleNudge } from './useIdleNudge'

/**
 * Two tags on a nail, and the only interaction on the page.
 *
 * There is no button and no kicker anywhere in this composition, so the tags
 * have to be found rather than read. Three things make that happen, and all
 * three are physical rather than typographic:
 *
 *   1. They are the only object in the frame standing just past the edge of a
 *      shadow, in light. The shutter's cast shadow stops at x1348; the tags
 *      begin at x1350.
 *   2. One tag has a name on it and the other does not. Same house number,
 *      missing name — the blank one is *yours*, and no copy has to say so.
 *   3. The blank tag is overlapped by nothing and overlaps the named one, so
 *      the silhouette you read whole is the empty one.
 *
 * The blank tag is a real `<button>`. Its accessible name carries the sentence
 * that was cut from the deck, which is why the deck could lose it: the
 * instruction now lives on the control it describes.
 */
interface TagsProps {
  /** Phase 2 will issue the Builder ID here. */
  onTake?: () => void
}

export function Tags({ onTake }: TagsProps) {
  const [taken, setTaken] = useState(false)
  const [hot, setHot] = useState(false)
  const reduced = prefersReducedMotion()
  const region = useRef<HTMLDivElement>(null)
  const nudge = useIdleNudge({ scope: region, disabled: reduced || taken })

  const handleTake = () => {
    if (taken) return
    setTaken(true)
    // Phase 2: this is where the Builder ID card gets issued into the aperture.
    onTake?.()
  }

  return (
    <div
      ref={region}
      className={`pointer-events-none absolute ${LAYER.tags}`}
      style={{
        left: SCENE_VARS.tagsLeft,
        top: SCENE_VARS.tagsTop,
        width: SCENE_VARS.tagsWidth,
      }}
    >
      {/* The container spans x1350 → 1446, the full width of both tags. Each
          tag is 56px of that 96px span (58.333%), and the blank one starts
          40px in (41.667%) — which overlaps the named tag by 16px, i.e. 29% of
          a tag's width, so the silhouette you read whole is the empty one. */}
      <div className="relative" style={{ aspectRatio: '96 / 178' }}>
        {/* Named tag: behind, −7°, and it settles a degree or two when the
            blank one leaves, because the thing resting against it just left. */}
        <div
          className="hh-settle absolute"
          style={{
            left: '0%',
            top: '21.5%',
            width: '58.333%',
            animationDelay: `${BEAT.tagNamed}ms`,
          }}
        >
          <div style={{ rotate: '-7deg', transformOrigin: '50% 12%' }}>
            <div className={taken ? 'hh-settle-back' : undefined}>
              <TagShape idPrefix="tag-named" name="Ana" />
            </div>
          </div>
        </div>

        {/* Blank tag: in front, +4°. */}
        <div
          className="hh-settle absolute"
          style={{
            left: '41.667%',
            top: '21.5%',
            width: '58.333%',
            animationDelay: `${BEAT.tagBlank}ms`,
          }}
        >
          <div style={{ rotate: '4deg', transformOrigin: '50% 12%' }}>
            {/* Three motions, all rotation about the eyelet so the tag always
                hangs from the nail: the ambient breath, the one idle rung, and
                the lift. They are mutually exclusive by construction — one
                class at a time — which is what keeps them from compounding
                into something that reads as a UI pulse. */}
            <div className={taken ? 'hh-lift' : nudge ? 'hh-rung' : 'hh-breath'}>
              {/* The one real control on the page. Its accessible name carries
                  the sentence that was cut from the deck — the instruction now
                  lives on the thing it describes rather than above it. The
                  min-height holds the 44px touch target on mobile, where the
                  tag is drawn narrower than the thumb needs. */}
              <button
                type="button"
                onClick={handleTake}
                onPointerEnter={() => setHot(true)}
                onPointerLeave={() => setHot(false)}
                onFocus={() => setHot(true)}
                onBlur={() => setHot(false)}
                disabled={taken}
                aria-label="Take the blank tag off the nail"
                className="pointer-events-auto block w-full min-h-[60px] min-w-[44px] cursor-grab"
              >
                <TagShape idPrefix="tag-blank" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact shade for both tags. Lives here rather than in `Light` so it
            can respond to hover: on hover it softens and spreads a hair, as if
            the tag has come a millimetre off the wall. Not a scale, not a glow —
            the tag does not change size, the shadow under it changes. */}
        <div
          className="absolute"
          aria-hidden="true"
          style={{
            left: '3%',
            top: '75.5%',
            width: '94%',
            height: '8%',
            opacity: taken ? 0.07 : hot ? 0.1 : 0.14,
            filter: `blur(${hot ? 4.5 : 2.5}px)`,
            transform: hot ? 'scale(1.06)' : 'scale(1)',
            transition: reduced
              ? undefined
              : 'opacity 260ms ease-out, filter 260ms ease-out, transform 260ms ease-out',
            background:
              'radial-gradient(60% 100% at 50% 0%, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* The rim of light along the tags' bottom edge — they sit fractionally
            proud of the wall, so the low sun catches under them. Static and
            permanent: this is physics, not feedback. */}
        <div
          className="absolute"
          aria-hidden="true"
          style={{
            left: '5%',
            top: '74.2%',
            width: '90%',
            height: '1.2%',
            opacity: taken ? 0.3 : 0.55,
            filter: 'blur(1px)',
            background:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, var(--color-plaster-lit) 30%, var(--color-plaster-lit) 70%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Nail and cords, drawn over the whole container so their endpoints can
            land on the tags' eyelets rather than on a nested box's edge. */}
        <div className="absolute inset-0">
          <TagString lift={taken ? 1 : 0} />
        </div>
      </div>
    </div>
  )
}
