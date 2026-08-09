import { SceneImage } from './environment/SceneImage'
import { scooter, fishTile } from '../assets/registry'

// Travel objects with physical placement
import cameraSrc from '../assets/illustrations/travel/vintage-camera.png'
import passportSrc from '../assets/illustrations/travel/passport-template.png'
import postageSrc from '../assets/illustrations/travel/paradise-postage-stamp.png'

/**
 * Environmental Objects - Physical relationships with window and wall
 * 
 * CORRECTED PHYSICAL PLACEMENT:
 * - Camera ON window sill (NOT floating over shutter)
 * - Passport beside/below window (NOT covering shutter)
 * - Fish tile on wall near window (architectural element)
 * - Postage stamp small accent on wall
 * - Scooter scaled down, grounded at bottom
 * 
 * HIERARCHY: Window dominates, objects support
 */
export function EnvironmentalObjects() {
  return (
    <>
      {/* Camera - ON THE SILL (moved up and smaller) */}
      <div
        className="pointer-events-none absolute"
        style={{
          // Positioned higher up, smaller
          left: '50%',
          bottom: 'clamp(260px, 40vh, 360px)',
          transform: 'translateX(calc(-50% - clamp(90px, 24vw, 210px)))',
          width: 'clamp(75px, 19vw, 140px)',
          zIndex: 35,
        }}
      >
        <div style={{ transform: 'rotate(-8deg)' }}>
          <img
            src={cameraSrc}
            alt=""
            className="w-full"
            loading="lazy"
            draggable={false}
          />
          {/* Strong contact shadow - rests on sill */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '96%',
              height: '18px',
              opacity: 0.22,
              background:
                'radial-gradient(ellipse 70% 100% at center top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 68%)',
              filter: 'blur(5px)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Passport - BESIDE window (NOT covering shutter) */}
      <div
        className="pointer-events-none absolute"
        style={{
          // Moved away from window center, smaller, supporting role
          left: '50%',
          bottom: 'clamp(130px, 21vh, 200px)',
          transform: 'translateX(calc(-50% + clamp(150px, 38vw, 340px)))',
          width: 'clamp(85px, 22vw, 160px)',
          zIndex: 32,
        }}
      >
        <div style={{ transform: 'rotate(11deg)' }}>
          <img
            src={passportSrc}
            alt=""
            className="w-full"
            loading="lazy"
            draggable={false}
          />
          {/* Paper edge shadow - on wall */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.16,
              boxShadow: '3px 4px 8px rgba(0,0,0,0.28)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Fish Tile - ARCHITECTURAL element on wall beside window */}
      <div
        className="pointer-events-none absolute"
        style={{
          // Wall placement, near but not touching window
          left: '50%',
          top: '50%',
          transform: 'translate(calc(-50% + clamp(180px, 46vw, 400px)), -50%)',
          width: 'clamp(65px, 16vw, 115px)',
          zIndex: 26,
        }}
      >
        {/* Mortar joint - embedded in wall */}
        <div
          className="absolute"
          style={{
            inset: '-3px',
            background: 'rgba(22,52,43,0.2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
            zIndex: -1,
          }}
          aria-hidden="true"
        />
        <div style={{ transform: 'rotate(7deg)' }}>
          <SceneImage asset={fishTile} width="100%" still />
        </div>
        {/* Top edge shadow */}
        <div
          className="absolute inset-x-0"
          style={{
            top: 0,
            height: '3px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Postage Stamp - ON WINDOW FRAME (upper right area) */}
      <div
        className="pointer-events-none absolute"
        style={{
          // Positioned on the window frame
          left: '50%',
          top: 'clamp(150px, 22vh, 220px)',
          transform: 'translateX(calc(-50% + clamp(100px, 26vw, 230px)))',
          width: 'clamp(65px, 16vw, 105px)',
          zIndex: 33,
        }}
      >
        <div style={{ transform: 'rotate(-14deg)' }}>
          <img
            src={postageSrc}
            alt=""
            className="w-full"
            loading="lazy"
            draggable={false}
          />
          {/* Paper shadow */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.15,
              boxShadow: '2px 3px 6px rgba(0,0,0,0.32)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Scooter - GROUNDED at bottom edge */}
      <div
        className="pointer-events-none absolute"
        style={{
          // Touch bottom screen edge
          left: 'clamp(-30px, -6vw, -15px)',
          bottom: 'clamp(-20px, -3vh, -10px)',
          width: 'clamp(160px, 40vw, 320px)',
          zIndex: 50,
        }}
      >
        <div style={{ transform: 'rotate(-3deg)' }}>
          <SceneImage asset={scooter} width="100%" still />
          {/* Ground shadow - grounded */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '98%',
              height: '22px',
              opacity: 0.26,
              background:
                'radial-gradient(ellipse 65% 100% at center top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 62%)',
              filter: 'blur(9px)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  )
}
