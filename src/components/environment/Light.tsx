import { BEAT, LAYER, fx, fy } from './scene'
import type { SceneStyle } from './scene'

/**
 * The light on the wall.
 *
 * This layer does the work objects would otherwise have been added to do. A
 * wall with five things hung on it is a mood board; a wall with nothing on it
 * but the shadows of things outside the frame is a place at four in the
 * afternoon. Everything here is `--color-ink-soft` at single-digit opacity,
 * everything is `aria-hidden`, and nothing here is an object.
 *
 * It renders on the plaster, under everything solid, and passes *behind* the
 * headline's letterforms — light falls on the wall, not on the type.
 *
 * One relationship in here is not decorative. The right shutter's cast shadow
 * terminates at x1348 and the tags hang at x1350. That 2px is the page's entire
 * findability mechanism: the tags are the only object in the frame standing
 * just past a shadow's edge, catching light, which is what makes the eye stop
 * on them without a button or a label. Both edges derive from the same
 * variable, so the gap survives every viewport. Do not round it away.
 */
export function Light() {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${LAYER.light}`}
      aria-hidden="true"
    >
      {/* Frond shadow, cast by a palm standing off-frame to the upper left.
          Rakes in across the empty left third and reaches (640, 250) with one
          long frond — stopping above the window, never touching it. Soft
          because it is cast from a long way away. */}
      <div
        className="hh-wash absolute"
        style={{
          left: 0,
          top: fy(40),
          width: fx(700),
          height: fy(300),
          animationDelay: `${BEAT.light}ms`,
          '--hh-o': 0.085,
          filter: 'blur(2px)',
        } as SceneStyle}
      >
        <svg
          viewBox="0 0 700 300"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          <g fill="var(--color-ink-soft)">
            {/* The long frond — the one that crosses the left mid-field void. */}
            <path d="M 0 96 C 96 104 210 132 330 176 C 420 208 520 234 640 250 C 520 244 414 226 322 196 C 206 158 92 122 0 118 Z" />
            <path d="M 0 62 C 88 66 176 82 268 112 C 352 140 424 166 486 186 C 408 172 330 152 252 126 C 164 96 82 78 0 76 Z" />
            <path d="M 0 140 C 74 148 152 168 236 200 C 300 224 356 244 404 262 C 336 246 268 226 202 200 C 128 170 64 154 0 152 Z" />
            <path d="M 0 24 C 70 26 142 38 216 62 C 278 82 330 102 372 120 C 310 106 250 90 190 70 C 122 48 62 38 0 36 Z" />
            {/* Two short leaflets, so the mass is not a fan of even strokes. */}
            <path d="M 0 178 C 58 188 118 208 180 238 C 128 220 66 200 0 190 Z" />
            <path d="M 0 8 C 52 8 108 14 166 28 C 106 20 50 16 0 18 Z" />
          </g>
        </svg>
      </div>

      {/* Right shutter's cast shadow. The lean is carried on the left edge —
          the sun is low and left, so the shadow's *foot* swings out from the
          shutter. The right edge is held vertical at x1348, because that edge
          is not a shadow's shape, it is the page's findability mechanism: the
          tags stand 2px past it, in light. */}
      <div
        className="hh-wash absolute"
        style={{
          left: 'var(--hh-win-r)',
          top: fy(380),
          width: 'calc(var(--hh-shadow-edge) - var(--hh-win-r))',
          height: fy(450),
          animationDelay: `${BEAT.windowShade}ms`,
          '--hh-o': 0.08,
          background: 'var(--color-ink-soft)',
          clipPath: 'polygon(6% 0%, 100% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(2px)',
        } as SceneStyle}
      />

      {/* Sill cast shadow: the ledge's own weight thrown on the wall below it,
          offset right because the light comes from the left. */}
      <div
        className="hh-wash absolute"
        style={{
          left: 'calc(var(--hh-win-l) + 0.9375vw)',
          top: 'var(--hh-sill)',
          width: 'var(--hh-win-w)',
          height: fy(42),
          animationDelay: `${BEAT.windowShade}ms`,
          '--hh-o': 0.12,
          background:
            'linear-gradient(to bottom, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%)',
          filter: 'blur(2px)',
        } as SceneStyle}
      />

      {/* Contact shade. Every object that touches the wall gets one: the tags,
          the note's torn lower edge, the tile. Without these the objects are
          stickers; with them they are things resting against plaster. The tags'
          own shade lives in `Tags` so it can respond to hover. */}
      <div
        className="hh-wash absolute"
        style={{
          left: 'var(--hh-note-l)',
          top: 'calc(var(--hh-note-t) + var(--hh-note-w) * 0.6848)',
          width: 'var(--hh-note-w)',
          height: fy(14),
          animationDelay: `${BEAT.objects}ms`,
          '--hh-o': 0.14,
          background:
            'radial-gradient(70% 100% at 50% 0%, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%)',
          filter: 'blur(1.5px)',
        } as SceneStyle}
      />

      <div
        className="hh-wash absolute"
        style={{
          left: 'var(--hh-tile-l)',
          top: 'calc(var(--hh-tile-t) + var(--hh-tile-w))',
          width: 'var(--hh-tile-w)',
          height: fy(10),
          animationDelay: `${BEAT.objectsTile}ms`,
          '--hh-o': 0.14,
          background:
            'radial-gradient(80% 100% at 50% 0%, var(--color-ink-soft) 0%, rgba(0,0,0,0) 100%)',
          filter: 'blur(1.5px)',
        } as SceneStyle}
      />

      {/* The visitor — approved refinement 2. You are standing two metres back
          with the sun low and behind your left shoulder, so something of you
          falls into the bottom-right, which is already shade. 6%, abstract,
          never a readable silhouette: the moment it resolves into a person it
          becomes a character in the scene, and the scene has no characters yet.
          If in doubt this is weaker, never stronger. */}
      <div
        className="hh-wash absolute"
        style={{
          right: 0,
          bottom: 0,
          width: fx(560),
          height: fy(420),
          animationDelay: `${BEAT.objects + 300}ms`,
          '--hh-o': 0.06,
          background:
            'radial-gradient(78% 88% at 88% 108%, var(--color-ink-soft) 0%, var(--color-ink-soft) 34%, rgba(0,0,0,0) 78%)',
          filter: 'blur(14px)',
        } as SceneStyle}
      />
    </div>
  )
}
