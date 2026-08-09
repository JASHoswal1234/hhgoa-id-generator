/**
 * One drawn tag. Inline SVG, not a PNG — the tag has to be recoloured, tilted,
 * and have its name field filled or left empty, and a raster can do none of
 * that honestly.
 *
 * The silhouette is 1:1.7 portrait with a stepped notched shoulder: three
 * descending steps each side, the way a real luggage tag is die-cut. Stock is
 * `--color-paper-deep`, which is *lighter* than the plaster it hangs on — if
 * the tag were darker than the wall it would read as a hole in it rather than
 * as paper on it.
 *
 * Everything here is drawn: the eyelet is two concentric forest circles, not a
 * grommet; the string is a single tapered stroke with a forest core, not a
 * braid; the stock has no fibre texture. A drawn tag next to a photographed
 * tag is the difference between a set of things and a collection of assets.
 */

/** The tag's viewBox, and therefore the coordinate space of everything below. */
const W = 100
const H = 170

/**
 * The die-cut outline: stepped shoulders, then straight down to a flat foot.
 *
 * Drawn to fill the viewBox edge to edge, leaving only room for the stroke. An
 * earlier version was inset to x8→92, which cost ~10px of apparent width at the
 * placed size and pushed the tag's visible left edge well clear of the shutter
 * shadow's terminator — the 2px relationship at x1348/1350 is the page's
 * findability mechanism, so the drawn silhouette has to reach its box.
 */
const OUTLINE = [
  'M 50 1',
  'L 63 8 L 63 17',
  'L 77 25 L 77 35',
  'L 92 44 L 92 55',
  'L 99 62',
  'L 99 162',
  'Q 99 169 92 169',
  'L 8 169',
  'Q 1 169 1 162',
  'L 1 62',
  'L 8 55 L 8 44',
  'L 23 35 L 23 25',
  'L 37 17 L 37 8',
  'Z',
].join(' ')

interface TagShapeProps {
  /** Rendered on the writing rule. Absent means the tag is blank. */
  name?: string
  /** Unique per instance — SVG ids are global. */
  idPrefix: string
}

export function TagShape({ name, idPrefix }: TagShapeProps) {
  const rule = `${idPrefix}-rule`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {/* The stock. Paper, lighter than plaster. */}
      <path d={OUTLINE} fill="var(--color-paper-deep)" />

      {/* The outline, drawn twice at different weights so the line varies the
          way an inked line does — one pass carries the whole silhouette thinly,
          the second thickens only the shaded lower right. */}
      <path
        d={OUTLINE}
        fill="none"
        stroke="var(--color-forest)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M 99 62 L 99 162 Q 99 169 92 169 L 8 169"
        fill="none"
        stroke="var(--color-forest)"
        strokeWidth="2.3"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Eyelet: a drawn ring at 12% down. No grommet, no gradient, no metal. */}
      <circle cx="50" cy="20.4" r="7.2" fill="none" stroke="var(--color-forest)" strokeWidth="1.5" />
      <circle cx="50" cy="20.4" r="3.4" fill="none" stroke="var(--color-forest)" strokeWidth="1.2" />

      {/* House numeral, letterpress-heavy, top left. Ochre fails legibility on
          this stock, so it is --color-tag-numeral. */}
      <text
        x="11"
        y="70"
        fontFamily="var(--font-display)"
        fontSize="26"
        fontWeight="600"
        fill="var(--color-tag-numeral)"
        letterSpacing="-0.5"
      >
        07
      </text>

      {/* The writing rule: one hairline at 62% height. Same rule on both tags —
          on the named one it carries a name, on the blank one it is empty, and
          that single difference is the whole story. */}
      <line
        id={rule}
        x1="9"
        y1="105.4"
        x2="91"
        y2="105.4"
        stroke="var(--color-ink-soft)"
        strokeWidth="0.9"
        opacity="0.55"
      />

      {name ? (
        /* Hand-inked, sitting on the rule and running slightly uphill to the
           right, because a person writing on a tag hanging from a nail does
           not write level. */
        <text
          x="13"
          y="102"
          fontFamily="var(--font-display)"
          fontSize="17"
          fontStyle="italic"
          fontWeight="500"
          fill="var(--color-ink)"
          transform="rotate(-2.4 13 102)"
        >
          {name}
        </text>
      ) : null}
    </svg>
  )
}
