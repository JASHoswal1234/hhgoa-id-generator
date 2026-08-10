import { useState } from 'react'
import { SceneImage } from './environment/SceneImage'
import { windowFrame } from '../assets/registry'
import { WindowAperture } from './WindowAperture'
import { BuilderPassActions } from './BuilderPassMode'
import lighthousePosterSrc from '../assets/illustrations/decor/goa-lighthouse-poster.png'
import keychainSrc from '../assets/illustrations/travel/travel-keychain.png'

interface GoaWindowProps {
  mode: 'pass' | 'identity'
  onModeChange: (mode: 'pass' | 'identity') => void
}

/**
 * The Goan Window - Central architectural element
 * 
 * This is NOT a UI card. This is architecture:
 * - Window frame embedded in wall
 * - Reveals showing wall thickness/depth
 * - Wooden sill as physical surface
 * - Aperture contains generator content BEHIND frame
 * - Action buttons render BELOW window frame after generation
 * 
 * Mobile-first positioning: designed for 375px first
 */
export function GoaWindow({ mode }: GoaWindowProps) {
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [actionHandlers, setActionHandlers] = useState<{
    onDownload: () => void
    onShare: () => void
    onReset: () => void
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mobileGenerateButton, setMobileGenerateButton] = useState<React.ReactNode | null>(null)

  return (
    <>
      {/* Heading above window */}
      <div
        className="absolute mobile-heading"
        style={{
          left: '50%',
          top: 'clamp(160px, 24vh, 240px)',
          transform: 'translateX(-50%)',
          width: 'clamp(330px, 88vw, 720px)',
          maxWidth: '720px',
          textAlign: 'center',
          zIndex: 29,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-heading {
              top: 120px !important;
              width: 92vw !important;
              max-width: 440px !important;
            }
            .mobile-heading h2 {
              font-size: 0.95rem !important;
              line-height: 1.2 !important;
              white-space: nowrap !important;
            }
          }
        `}</style>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 600,
            color: '#f7f1e3',
            margin: 0,
            padding: '0 1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Create your personalized Builder Pass
        </h2>
      </div>

      <div
        className="absolute mobile-window"
        style={{
          left: '50%',
          top: 'clamp(240px, 32vh, 320px)',
          transform: 'translateX(-50%)',
          // SUBSTANTIALLY LARGER - window is the dominant visual object
          // Desktop: ~50% viewport width, Mobile: ~88% viewport width
          width: 'clamp(330px, 88vw, 720px)',
          maxWidth: '720px',
          zIndex: 30,
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .mobile-window {
              top: 170px !important;
              width: 92vw !important;
              max-width: 440px !important;
            }
          }
        `}</style>
        {/* Aperture - sits BEHIND the window frame */}
        <div
          className="absolute"
          style={{
            left: '25.2%',
            top: '8%',
            width: '49%',
            height: '84%',
            zIndex: 1,
          }}
        >
          <WindowAperture 
            mode={mode} 
            onGeneratedCanvas={setGeneratedCanvas}
            onActionHandlers={setActionHandlers}
            onError={setError}
            onMobileGenerateButton={setMobileGenerateButton}
          />
        </div>

        {/* Wall reveals - architectural depth */}
        <div
          className="pointer-events-none absolute"
          style={{
            inset: '-1.8% -1.2% -1.2% -1.2%',
            zIndex: -2,
          }}
          aria-hidden="true"
        >
          {/* Top lintel - weathered forest green */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: '1.8%',
              background: 'linear-gradient(to bottom, #2f5745 0%, #1f4d3a 100%)',
              boxShadow: 'inset 0 1px 0 rgba(47,87,69,0.5)',
            }}
          />
          {/* Left reveal - catches light */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: '1.2%',
              background: 'linear-gradient(to right, rgba(47,87,69,0.45) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
          {/* Right reveal - in shade */}
          <div
            className="absolute inset-y-0 right-0"
            style={{
              width: '1.2%',
              background: 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        {/* The window frame itself - allows clicks through to aperture */}
        <div style={{ pointerEvents: 'none' }}>
          <SceneImage asset={windowFrame} width="100%" priority still />
        </div>

        {/* Lighthouse Poster - ON window frame (upper right) */}
        <div
          className="absolute"
          style={{
            right: '6%',
            top: '17%',
            width: '13%',
            zIndex: 31,
          }}
        >
          <div style={{ transform: 'rotate(-4deg)' }}>
            <img
              src={lighthousePosterSrc}
              alt=""
              className="w-full"
              loading="lazy"
              draggable={false}
            />
            {/* Poster shadow */}
            <div
              className="absolute inset-0"
              style={{
                opacity: 0.18,
                boxShadow: '2px 4px 8px rgba(0,0,0,0.40)',
                zIndex: -1,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Travel Keychain - ON left shutter bottom pane */}
        <div
          className="absolute"
          style={{
            left: '8%',
            bottom: '20%',
            width: '10%',
            zIndex: 31,
          }}
        >
          <div style={{ transform: 'rotate(8deg)' }}>
            <img
              src={keychainSrc}
              alt=""
              className="w-full"
              loading="lazy"
              draggable={false}
            />
            {/* Keychain shadow */}
            <div
              className="absolute inset-0"
              style={{
                opacity: 0.18,
                boxShadow: '2px 4px 8px rgba(0,0,0,0.40)',
                zIndex: -1,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Sill cast shadow - ledge weight on wall */}
        <div
          className="absolute"
          style={{
            left: '6%',
            right: '6%',
            top: '99.5%',
            height: '38px',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0) 100%)',
            filter: 'blur(3px)',
            zIndex: -2,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Action Buttons - rendered BELOW the window frame */}
      {generatedCanvas && actionHandlers && (
        <div
          className="absolute mobile-actions"
          style={{
            left: '50%',
            top: 'clamp(780px, 101vh, 960px)',
            transform: 'translateX(-50%)',
            width: 'clamp(330px, 88vw, 720px)',
            maxWidth: '720px',
            zIndex: 30,
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .mobile-actions {
                top: 480px !important;
                width: 92vw !important;
                max-width: 440px !important;
              }
            }
          `}</style>
          <BuilderPassActions
            generatedCanvas={generatedCanvas}
            onDownload={actionHandlers.onDownload}
            onShare={actionHandlers.onShare}
            onReset={actionHandlers.onReset}
            error={error}
          />
        </div>
      )}

      {/* Mobile Generate Button - rendered BELOW the window frame on mobile only */}
      {mobileGenerateButton && !generatedCanvas && (
        <div
          className="mobile-generate-button-container"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92vw',
            maxWidth: '440px',
            zIndex: 30,
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .mobile-generate-button-container {
                top: 480px !important;
              }
            }
            @media (min-width: 769px) {
              .mobile-generate-button-container {
                display: none !important;
              }
            }
          `}</style>
          {mobileGenerateButton}
        </div>
      )}
    </>
  )
}
