/**
 * The nail, and the two strings looped over it.
 *
 * Drawn once for both tags rather than once per tag, because the strings share
 * a nail and the loops have to sit on it consistently. Each string is a single
 * tapered stroke — `--color-paper-edge` carrying a thinner `--color-forest`
 * core, which is how a waxed cord reads at this size — looped once over the
 * nail head. No fibre texture, no braid, no second colour.
 *
 * The nail stays in the wall after the blank tag leaves. That empty nail is the
 * evidence that something was taken; repopulating it would undo the only state
 * change the page has.
 */
interface TagStringProps {
  /** How far the front tag has travelled, 0 at rest, 1 fully lifted. */
  lift: number
}

export function TagString({ lift }: TagStringProps) {
  return (
    // The viewBox is the tag container's own 96 × 178 box, so cord endpoints can
    // be written as the eyelets' actual positions: each tag is 58.333% of 96
    // (= 56) wide with its eyelet at 50% across and 12% down, which puts the
    // named tag's eyelet at (28, 49.7) and the blank tag's at (68, 49.7).
    <svg
      viewBox="0 0 96 178"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {/* Named tag's cord: hangs from the nail down-left to its eyelet. */}
      <g>
        <path
          d="M 48 14 C 44 25 35 37 28 49.7"
          fill="none"
          stroke="var(--color-paper-edge)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 48 14 C 44 25 35 37 28 49.7"
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* Blank tag's cord: down-right, and it leaves with the tag. Fades as the
          tag clears the nail head so the cord is never left hanging in air. */}
      <g style={{ opacity: 1 - lift, transition: 'opacity 220ms linear' }}>
        <path
          d="M 48 14 C 52 25 61 37 68 49.7"
          fill="none"
          stroke="var(--color-paper-edge)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 48 14 C 52 25 61 37 68 49.7"
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* The loop over the nail head, and the nail: a drawn head with one flat
          highlight. No chrome, no ramp, no metal gradient. */}
      <path
        d="M 43.4 16 C 43.4 8.4 52.6 8.4 52.6 16"
        fill="none"
        stroke="var(--color-paper-edge)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="48" cy="11.6" r="3.6" fill="var(--color-forest)" />
      <circle cx="46.8" cy="10.4" r="1.2" fill="var(--color-paper-edge)" opacity="0.7" />
    </svg>
  )
}
