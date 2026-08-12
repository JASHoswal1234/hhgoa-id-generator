import { useState } from 'react'
import { GoaWindow } from './GoaWindow'
import { EnvironmentalObjects } from './EnvironmentalObjects'
import { SceneImage } from './environment/SceneImage'
import { palmTall, oceanWaves } from '../assets/registry'

// Additional nature/environmental assets
import palmShortSrc from '../assets/illustrations/nature/palm-tree-short.png'
import sunSrc from '../assets/illustrations/nature/sun-handdrawn.png'
import beachSignSrc from '../assets/illustrations/props/beach-direction-sign.png'
import luggageTagSrc from '../assets/illustrations/travel/vintage-luggage-tag.png'

// Logo assets
import studio247Src from '../assets/logo/2-47.svg'
import hackerHouseGoaSrc from '../assets/logo/Hacker house.png'
import goaHindiSrc from '../assets/logo/goa_hindi.svg'

/**
 * Goa Environment - ONE unified scene where everything happens
 * 
 * Architecture:
 * - Forest green wall (dominant ~75%)
 * - Editorial typography introducing the space
 * - Goan window as central architectural element (NOT a UI card)
 * - 5-8 curated objects with physical relationships to window/wall
 * - Three depth layers: background → architecture → foreground
 * 
 * RESPONSIVE DESIGN:
 * - Desktop (>768px): Current positioning preserved
 * - Mobile (≤768px): Recomposed vertical scene with window as anchor
 * 
 * The window contains the generators. Mode switches INSIDE the aperture.
 * This is ONE scene, not multiple sections.
 */
export function GoaEnvironment() {
  const [generatorMode, setGeneratorMode] = useState<'pass' | 'identity'>('pass')

  return (
    <section
      className="hh-grain relative w-full overflow-hidden"
      style={{
        // RESPONSIVE HEIGHT
        // Desktop: 140dvh for full scene
        // Mobile: auto-height based on content flow
        minHeight: '140dvh',
        backgroundColor: 'transparent', // Background now handled by RippleGrid
        pointerEvents: 'none', // Allow clicks to pass through to RippleGrid
      }}
      aria-label="Hacker House Goa"
    >
      {/* Mobile-specific COMPACT height */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Hacker House Goa"] {
            min-height: 100vh !important;
            max-height: none !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>

      {/* LAYER 1: Environmental Base - Subtle overlays only (background now via RippleGrid) */}
      <div className="absolute inset-0" style={{ zIndex: 1, pointerEvents: 'none' }}>
        {/* Sun-side wash - light from upper left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(58% 58% at 16% 18%, rgba(31,77,58,0.7) 0%, rgba(26,58,46,0) 68%)',
            pointerEvents: 'none',
          }}
        />

        {/* Shade - from right and bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.16) 100%), linear-gradient(to top, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 20%)',
            pointerEvents: 'none',
          }}
        />

        {/* Weathering - subtle texture variation */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.07,
            mixBlendMode: 'multiply',
            background:
              'radial-gradient(circle at 50% 82%, rgba(64,88,77,1) 0%, rgba(0,0,0,0) 55%), radial-gradient(circle at 28% 68%, rgba(64,88,77,1) 0%, rgba(0,0,0,0) 38%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* LAYER 2: Background Elements - Tropical Environment */}
      
      {/* BRANDING LAYER - Logo Assets */}
      
      {/* 2:47 PM Studio - TOP LEFT */}
      <div
        className="pointer-events-none absolute z-20 mobile-logo-247"
        style={{
          left: 'clamp(20px, 5vw, 40px)',
          top: 'clamp(20px, 4vh, 35px)',
          width: 'clamp(70px, 15vw, 110px)',
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-logo-247 {
              left: 15px !important;
              top: 20px !important;
              width: 60px !important;
            }
          }
        `}</style>
        <img
          src={studio247Src}
          alt="2:47 PM Studio"
          className="w-full"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />
      </div>

      {/* Hacker House Goa - CENTERED TOP (Primary Brand) */}
      <div
        className="pointer-events-none absolute z-20 mobile-logo-hhgoa"
        style={{
          left: '50%',
          top: 'clamp(25px, 5vh, 45px)',
          transform: 'translateX(-50%)',
          width: 'clamp(200px, 45vw, 380px)',
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-logo-hhgoa {
              top: 18px !important;
              width: 200px !important;
            }
          }
        `}</style>
        <div className="relative">
          {/* Main Hacker House Goa logo */}
          <img
            src={hackerHouseGoaSrc}
            alt="Hacker House Goa"
            className="w-full"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
          
          {/* Goa Hindi element with levitation animation - positioned so bottom of animation aligns with logo bottom */}
          <div
            className="absolute hh-levitate"
            style={{
              left: '47%',
              top: '25%',
              transform: 'translate(-50%, -50%)',
              width: '18%',
              animation: 'levitate 4s ease-in-out infinite',
            }}
          >
            <img
              src={goaHindiSrc}
              alt=""
              className="w-full"
              loading="eager"
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Tropical Environment Elements */}
      
      {/* Sun - atmospheric background (upper right) */}
      <div
        className="pointer-events-none absolute mobile-sun"
        style={{
          right: 'clamp(40px, 8vw, 100px)',
          top: 'clamp(30px, 5vh, 60px)',
          width: 'clamp(90px, 18vw, 140px)',
          opacity: 0.90,
          zIndex: 8,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-sun {
              right: 15px !important;
              top: 20px !important;
              width: 65px !important;
            }
          }
        `}</style>
        <img src={sunSrc} alt="" className="w-full" loading="lazy" draggable={false} />
      </div>

      {/* Palm Tall - DOMINANT tree (LEFT, GROUNDED - trunk enters from bottom) */}
      <div
        className="pointer-events-none absolute mobile-palm-tall-left"
        style={{
          left: 'clamp(-60px, -12vw, -40px)',
          bottom: 'clamp(-80px, -14vh, -50px)',
          width: 'clamp(280px, 56vw, 460px)',
          opacity: 0.48,
          zIndex: 11,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-palm-tall-left {
              left: -80px !important;
              bottom: 0 !important;
              width: 260px !important;
              opacity: 0.45 !important;
            }
          }
        `}</style>
        <SceneImage asset={palmTall} width="100%" still />
      </div>

      {/* Palm Short - Right side, prominent and visible */}
      <div
        className="pointer-events-none absolute mobile-palm-short-right"
        style={{
          right: 'clamp(-20px, -4vw, -10px)',
          bottom: 'clamp(-100px, -18vh, -70px)',
          width: 'clamp(260px, 52vw, 400px)',
          opacity: 0.90,
          zIndex: 10,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-palm-short-right {
              right: -90px !important;
              bottom: 0 !important;
              width: 280px !important;
              opacity: 0.70 !important;
            }
          }
        `}</style>
        <img src={palmShortSrc} alt="" className="w-full" loading="lazy" draggable={false} />
      </div>

      {/* Palm Tall - BEHIND scooter (left side, filling empty space) */}
      <div
        className="pointer-events-none absolute mobile-palm-tall-back"
        style={{
          left: 'clamp(-80px, -16vw, -60px)',
          bottom: 'clamp(-100px, -16vh, -70px)',
          width: 'clamp(160px, 32vw, 240px)',
          opacity: 0.35,
          zIndex: 12,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-palm-tall-back {
              display: none !important;
            }
          }
        `}</style>
        <SceneImage asset={palmTall} width="100%" still />
      </div>

      {/* Luggage Tag - HANGING from window (left shutter area) */}
      <div
        className="pointer-events-none absolute mobile-luggage-tag"
        style={{
          left: '50%',
          top: 'clamp(220px, 32vh, 300px)',
          transform: 'translateX(calc(-50% - clamp(140px, 36vw, 310px)))',
          width: 'clamp(40px, 10vw, 68px)',
          zIndex: 34,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-luggage-tag {
              left: 25px !important;
              top: 200px !important;
              transform: none !important;
              width: 45px !important;
            }
          }
        `}</style>
        <div style={{ transform: 'rotate(-11deg)' }}>
          <img src={luggageTagSrc} alt="" className="w-full" loading="lazy" draggable={false} />
          {/* Hang point shadow */}
          <div
            className="absolute"
            style={{
              left: '46%',
              top: '2%',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              opacity: 0.18,
              background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(2px)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Frond shadow - cast by off-screen palm upper left */}
      <div
        className="absolute mobile-frond-shadow"
        style={{
          left: 0,
          top: 'clamp(40px, 6vh, 70px)',
          width: 'min(62vw, 560px)',
          height: 'min(32vh, 280px)',
          opacity: 0.085,
          filter: 'blur(2px)',
          zIndex: 10,
        }}
        aria-hidden="true"
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-frond-shadow {
              top: 30px !important;
              width: 280px !important;
              height: 140px !important;
            }
          }
        `}</style>
        <svg
          viewBox="0 0 700 300"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <g fill="#16342b">
            <path d="M 0 96 C 96 104 210 132 330 176 C 420 208 520 234 640 250 C 520 244 414 226 322 196 C 206 158 92 122 0 118 Z" />
            <path d="M 0 62 C 88 66 176 82 268 112 C 352 140 424 166 486 186 C 408 172 330 152 252 126 C 164 96 82 78 0 76 Z" />
            <path d="M 0 140 C 74 148 152 168 236 200 C 300 224 356 244 404 262 C 336 246 268 226 202 200 C 128 170 64 154 0 152 Z" />
          </g>
        </svg>
      </div>

      {/* LAYER 4: CENTRAL ARCHITECTURE - The Goan Window */}
      <div style={{ pointerEvents: 'auto' }}>
        <GoaWindow mode={generatorMode} onModeChange={setGeneratorMode} />
      </div>

      {/* LAYER 5: WAVE BOUNDARY - BOTTOM OF MOBILE SCENE */}
      {/* Ocean Waves - THE FINAL LAYER, NOTHING BELOW THIS */}
      <div
        className="pointer-events-none absolute mobile-waves"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: 'clamp(840px, 122vh, 1100px)',
          width: 'clamp(1200px, 150vw, 2880px)',
          display: 'flex',
          zIndex: 35,
          opacity: 0.5,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-waves {
              left: 0 !important;
              transform: none !important;
              bottom: 0 !important;
              top: auto !important;
              width: 1400px !important;
              margin-left: -200px !important;
              height: 150px !important;
              overflow: hidden !important;
            }
            .mobile-waves > div {
              height: 300px !important;
              margin-top: 0 !important;
            }
          }
        `}</style>
        {/* Left wave */}
        <div style={{ flex: '0 0 33.33%' }}>
          <SceneImage 
            asset={oceanWaves} 
            width="100%" 
            still 
          />
        </div>
        {/* Center wave */}
        <div style={{ flex: '0 0 33.33%' }}>
          <SceneImage 
            asset={oceanWaves} 
            width="100%" 
            still 
          />
        </div>
        {/* Right wave */}
        <div style={{ flex: '0 0 33.33%' }}>
          <SceneImage 
            asset={oceanWaves} 
            width="100%" 
            still 
          />
        </div>
      </div>

      {/* Beach Direction Sign - RIGHT SIDE, overlapping waves */}
      <div
        className="pointer-events-none absolute mobile-beach-sign"
        style={{
          right: 'clamp(-20px, -4vw, -10px)',
          top: 'clamp(820px, 118vh, 1080px)',
          width: 'clamp(180px, 36vw, 280px)',
          zIndex: 36,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-beach-sign {
              right: -15px !important;
              bottom: 0 !important;
              top: auto !important;
              width: 180px !important;
            }
          }
        `}</style>
        <div style={{ transform: 'rotate(-6deg)' }}>
          <img src={beachSignSrc} alt="" className="w-full" loading="lazy" draggable={false} />
          {/* Ground shadow - sign embedded in ground */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '94%',
              height: '18px',
              opacity: 0.22,
              background:
                'radial-gradient(ellipse 55% 100% at center top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 63%)',
              filter: 'blur(6px)',
              zIndex: -1,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* LAYER 6: Environmental Objects - physical relationships with window */}
      <div style={{ pointerEvents: 'auto' }}>
        <EnvironmentalObjects />
      </div>
    </section>
  )
}
