import { BEAT, LAYER, fx, fy } from './scene'
import { SceneImage } from './SceneImage'
import { PALM_TRUNK_X, palmTall } from '../../assets/registry'

/**
 * The one palm, seen through the sliver of outside.
 *
 * There used to be two palms framing the window. There is one now, and it
 * barely exists: it grows in the 80px of outside past the wall's corner return,
 * occluded on the left by the corner and cropped on the right by the frame
 * edge, at 45% desaturation, 20% lighter, 0.55 opacity. At that treatment it
 * stops being a character and becomes the street outside — the promise that
 * the wall you are standing at faces a lane that goes somewhere.
 *
 * The trunk's axis is pinned to x1565 (measured: it stands at 47.43% across
 * the artwork box), so the palm grows out of the ground, not out of the
 * centre of its frame. Dropped below `md`, with the rest of the outside.
 */
export function PalmTrees() {
  /* Place by trunk, not by artwork edge: the trunk must land on x1565, so the
     artwork's left edge sits wherever that requires. Solving for it here rather
     than hardcoding an offset keeps the number honest if the art is ever
     re-measured. */
  const left = `calc(${fx(1565)} - ${fx(250)} * ${PALM_TRUNK_X})`

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${LAYER.palms} hidden md:block`}
      aria-hidden="true"
    >
      {/* Clipped to the frame's right edge so the palm is cropped by the picture
          rather than overflowing it. The wall's corner return, drawn above this
          layer, does the occluding on the left. */}
      <div className="absolute inset-y-0 overflow-hidden" style={{ left: fx(1512), right: 0 }}>
        <SceneImage
          asset={palmTall}
          width={fx(250)}
          className="absolute"
          style={{
            left: `calc(${left} - ${fx(1512)})`,
            top: fy(300),
            '--hh-o': 0.55,
            filter: 'saturate(0.55) brightness(1.2)',
          }}
          rotate={1}
          delay={BEAT.palms}
        />
      </div>
    </div>
  )
}
