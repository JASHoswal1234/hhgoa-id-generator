import { BEAT, LAYER, SCENE_VARS, fx } from './scene'
import { SceneImage } from './SceneImage'
import { PinnedNote } from './PinnedNote'
import { fishTile, scooter } from '../../assets/registry'

/**
 * The three objects that live on the wall and on the ground.
 *
 * Three, out of nineteen illustrations in the set. The camera, the postage
 * stamp and the floral cluster are gone; so are the luggage-tag and note PNGs,
 * which are now drawn. What is left is what the scene needs to be a place: a
 * scooter parked in the lane, a tile set into the plaster, and a note left for
 * whoever arrives. (See ASSET_INVENTORY.md for what was set aside and why.)
 *
 * Everything here sits on a surface or is set into one. Nothing floats, and
 * nothing is set down on the sill — the bare sill is load-bearing, and so is
 * the empty aperture. The scooter's maximum x is 360, which clears the
 * aperture's left edge at 703 by 343px, so nothing here can collide with what
 * Phase 2 renders into the opening.
 */
export function Decorations() {
  return (
    <div className={`pointer-events-none absolute inset-0 ${LAYER.foreground}`} aria-hidden="true">
      {/* Scooter, bottom-left, mirrored so it faces the viewer rather than
          showing its back. Cropped by the left *and* bottom edges — a vehicle
          cut by the frame is a vehicle that continues past it, which is what
          puts the visitor in a real lane instead of in front of a backdrop.
          On mobile it moves nearer (1.3m against the wall's 2m) and crosses the
          plinth, ground seam and lane: that single overlap is what makes the
          phone read as one picture rather than as stacked bands. */}
      <div
        className="hh-settle absolute"
        style={{
          left: SCENE_VARS.scooterLeft,
          top: SCENE_VARS.scooterTop,
          width: SCENE_VARS.scooterWidth,
          animationDelay: `${BEAT.objects}ms`,
        }}
      >
        <div style={{ transform: 'scaleX(-1) rotate(2deg)' }}>
          <SceneImage asset={scooter} width="100%" className="relative" still />
        </div>
      </div>

      {/* Fish tile, set *into* the plaster left of the window — mortar seam on
          all four sides, and a hairline shadow on the top edge only, because a
          tile bedded in a wall is only overhung from above. It has no drop
          shadow: the old boxShadow made it read as hung, which it is not. It
          survives on mobile, where it sits in the thumb column below the tags. */}
      <div
        className="hh-settle absolute"
        style={{
          left: SCENE_VARS.tileLeft,
          top: SCENE_VARS.tileTop,
          width: SCENE_VARS.tileWidth,
          animationDelay: `${BEAT.objectsTile}ms`,
        }}
      >
        <div className="relative" style={{ transform: 'rotate(-3deg)' }}>
          {/* Mortar: a recessed seam, so the tile is proud of nothing and level
              with everything. Four sides, drawn as an inset ring rather than a
              border so it stays hairline at every width. */}
          <div
            className="absolute"
            style={{
              inset: `calc(-1 * ${fx(3)})`,
              background: 'var(--color-plaster-shade)',
              boxShadow: 'inset 0 1px 1px rgba(22,52,43,0.18)',
            }}
          />
          <img
            src={fishTile.src}
            alt=""
            width={fishTile.canvas[0]}
            height={fishTile.canvas[1]}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="relative block w-full select-none"
          />
          {/* The overhang: shade along the top edge only. */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: fx(3),
              background:
                'linear-gradient(to bottom, rgba(22,52,43,0.22) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>
      </div>

      {/* The note. Drawn, not photographed — see PinnedNote. */}
      <div
        className="hh-settle absolute"
        style={{
          left: SCENE_VARS.noteLeft,
          top: SCENE_VARS.noteTop,
          width: SCENE_VARS.noteWidth,
          animationDelay: `${BEAT.objects}ms`,
        }}
      >
        <PinnedNote />
      </div>
    </div>
  )
}
