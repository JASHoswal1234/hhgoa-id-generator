import { BEAT, LAYER, fx, fy } from './scene'
import type { SceneStyle } from './scene'
import { wavesUrl } from '../../assets/registry'

/**
 * The sea — reduced to the outside sliver only.
 *
 * The sea used to cross the whole composition; it doesn't any more, because
 * that is what makes the wall opaque. You stand two metres back from a wall
 * and what you see is wall — sea only exists where the wall has an edge, past
 * the corner return. So the water lives in the sliver x1520→1600, y596→622,
 * behind the palm, overlapped by the wall's corner.
 *
 * Further desaturated from `--color-sea`, because at this distance the sea
 * has already lost most of its colour, and capped below paper-warm so it never
 * competes with the aperture. Dropped entirely below `md`: on a phone there is
 * no corner, no outside, and no room for a second story.
 */
export function Ocean() {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${LAYER.ocean} hidden md:block`}
      aria-hidden="true"
    >
      <div
        className="hh-wash absolute"
        style={{
          left: fx(1520),
          top: fy(596),
          width: fx(80),
          height: fy(26),
          animationDelay: `${BEAT.ocean}ms`,
          '--hh-o': 0.6,
        } as SceneStyle}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${wavesUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'saturate(0.45) brightness(1.28)',
          }}
        />
      </div>
    </div>
  )
}
