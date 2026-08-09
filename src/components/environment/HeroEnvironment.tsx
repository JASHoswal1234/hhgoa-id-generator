import { BEAT, SCENE_VARS } from './scene'
import { HeroBackground } from './HeroBackground'
import { Wall } from './Wall'
import { Light } from './Light'
import { Ocean } from './Ocean'
import { PalmTrees } from './PalmTrees'
import { HeroWindow } from './HeroWindow'
import { Tags } from './Tags'
import { Decorations } from './Decorations'

/**
 * Arrivals — the whole of Phase 1.
 *
 * One held frame rather than a scrolling page: you arrive somewhere, and a
 * place does not reveal itself a paragraph at a time. Everything is composed to
 * sit inside a single viewport, so the first thing a visitor does is *look
 * around* rather than scroll. `min-h-dvh` keeps that true on mobile browsers
 * whose toolbars eat the viewport.
 *
 * Depth runs back to front: sky, sea, palm, wall, light, window, tags,
 * foreground. The wall is the load-bearing layer — it bleeds off every edge, so
 * no cream page ground survives anywhere and the aperture is the only cream in
 * the picture.
 *
 * Type is absolutely positioned rather than in flow. The composition places the
 * H1 entirely above the window box against a 112px margin, ranged left and
 * ragged right, and a centred flow column cannot express that. There is no
 * eyebrow and no kicker: on a page with no button, every line of text that is
 * not the headline or the deck is a line competing with the tags.
 */
export function HeroEnvironment() {
  return (
    <section
      className="hh-scene hh-grain relative min-h-dvh w-full overflow-hidden"
      aria-label="Hacker House Goa — arrivals"
    >
      <HeroBackground />
      <Ocean />
      <PalmTrees />
      <Wall />
      <Light />

      {/* Editorial column. z-[38] puts it in `wallGraphics`: on the plaster,
          under the window, and — critically — above `light`, so the frond
          shadow passes behind the letterforms rather than over them. */}
      <div
        className="absolute z-[38] flex flex-col"
        style={{
          left: SCENE_VARS.typeMargin,
          top: 'var(--hh-type-t)',
          width: 'var(--hh-h1-w)',
        }}
      >
        <h1
          className="hh-settle font-display text-ink-display"
          style={{
            animationDelay: `${BEAT.heading}ms`,
            fontSize: 'var(--hh-h1-size)',
            lineHeight: 'var(--hh-h1-leading)',
            letterSpacing: '-0.02em',
            fontWeight: 560,
            fontVariationSettings: "'WONK' 1, 'opsz' 144, 'SOFT' 0",
            textWrap: 'pretty',
            hangingPunctuation: 'allow-end',
          }}
        >
          {/* TODO: H1 copy pending client sign-off */}
          Come in through
          <br />
          the window.
        </h1>

        <p
          className="hh-settle font-body text-forest"
          style={{
            animationDelay: `${BEAT.heading + 120}ms`,
            marginTop: 'var(--hh-deck-gap)',
            maxWidth: 'min(var(--hh-deck-measure), var(--hh-deck-col))',
            fontSize: 'var(--hh-deck-size)',
            lineHeight: 1.7,
            textWrap: 'pretty',
          }}
        >
          The door is for guests. Builders use the window.
        </p>
      </div>

      <HeroWindow />
      <Tags />
      <Decorations />
    </section>
  )
}
