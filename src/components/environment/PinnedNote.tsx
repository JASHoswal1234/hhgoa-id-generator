/**
 * The pinned note — drawn inline, 92 × 63, +3°.
 *
 * It replaces a PNG that carried a border, printed rules and small charms. All
 * three are gone: a torn scrap with one line of handwriting reads as something
 * a person left, and a bordered card with decoration reads as a UI component
 * dressed as one.
 *
 * The tear is on the bottom edge only, with an irregular deckle — a sheet torn
 * off a pad keeps three clean edges. The pushpin sits top-*left* rather than
 * centred, so the sheet hangs slightly off-axis and the paper's own weight is
 * visible in the tilt.
 */
export function PinnedNote() {
  return (
    <svg
      viewBox="0 0 92 63"
      className="block w-full"
      style={{ transform: 'rotate(3deg)', overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Contact shade under the torn edge, where the sheet lifts off the wall. */}
      <path
        d="M 6 52 L 88 50 L 88 60 L 6 62 Z"
        fill="var(--color-ink-soft)"
        opacity="0.14"
        transform="translate(1.5 2.5)"
        style={{ filter: 'blur(1.6px)' }}
      />

      {/* The sheet. Three ruled edges, one torn: the deckle is a run of short
          irregular steps rather than a wave, because paper tears in fibres. */}
      <path
        d="M 3 1 L 89 2 L 88.4 49.2
           L 84 51.6 L 79 49.4 L 74 52.2 L 69 50.1 L 63 53 L 58 50.4
           L 52 53.4 L 47 51 L 41 53.8 L 36 51.2 L 30 54.1 L 25 51.6
           L 19 54.2 L 14 51.8 L 8 54 L 3.4 51.4 Z"
        fill="var(--color-paper-warm)"
      />

      {/* Handwriting. The only copy on the note, and it is a stage direction
          for the lane, not for the interface.

          FLAG: the spec asks for handwriting, and no handwriting face is loaded
          in this project. Adding a typeface is a design decision, so this uses
          Fraunces italic — the nearest hand available, and the same face the
          tag's inked name uses, so the two read as one person's writing. Needs
          `hhgoa-art-director` to confirm or nominate a script face. */}
      <text
        x="13"
        y="30"
        fill="var(--color-forest)"
        style={{
          font: 'italic 500 15px/1 var(--font-display)',
          letterSpacing: '0.01em',
        }}
      >
        Mind the step.
      </text>

      {/* Pushpin, ⌀8, top-left. Flat drawn: a teal head, the lower third in
          teal-deep, one paper-warm crescent upper left. One highlight, no
          chrome, no gradient ramp. */}
      <g transform="translate(17 8)">
        <circle cx="0" cy="0" r="4" fill="var(--color-teal)" />
        <path d="M -4 1.1 A 4 4 0 0 0 4 1.1 Z" fill="var(--color-teal-deep)" />
        <path
          d="M -2.6 -1.5 A 2.9 2.9 0 0 1 -0.2 -3.1 A 3.6 3.6 0 0 0 -2.6 -1.5 Z"
          fill="var(--color-paper-warm)"
          opacity="0.9"
        />
      </g>
    </svg>
  )
}
