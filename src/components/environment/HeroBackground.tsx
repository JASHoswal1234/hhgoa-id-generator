import { LAYER } from './scene'

/**
 * The base wash, beneath the plaster.
 *
 * The sun used to stand here as a drawn object. It doesn't any more — it
 * survives as light. The wash now gathers at 18% 22% and falls off down and
 * right, which is where the sun actually is, and every shadow in `Light.tsx`
 * rakes away from that same point. One light source, agreed on in two files.
 *
 * The wall bleeds over almost all of this, so what remains visible of it is the
 * outside sliver past the corner return. It stays as the layer that guarantees
 * no untreated page background can ever show through at any viewport.
 */
export function HeroBackground() {
  return (
    <div className={`absolute inset-0 ${LAYER.sky}`} aria-hidden="true">
      <div
        className="hh-wash absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 18% 22%, var(--color-plaster-lit) 0%, var(--color-plaster) 46%, var(--color-plaster-shade) 100%)',
        }}
      />
    </div>
  )
}
