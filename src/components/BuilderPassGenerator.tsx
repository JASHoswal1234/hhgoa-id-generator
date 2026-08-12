/**
 * Builder Pass Generator - SIMPLIFIED
 * 
 * Only 3 inputs: Photo, Name, Role
 * No internal scroll, compact layout
 * 
 * POST-GENERATION: Generated pass fills the window aperture,
 * action buttons appear BELOW the window frame
 */

import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { renderBuilderPass, downloadCanvas, generateBuilderId } from '../utils/canvasRenderer'

export function BuilderPassGenerator() {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [photoZoom, setPhotoZoom] = useState<number>(1)

  const canGenerate = photo && name.trim() && role.trim()

  const handleGenerate = async () => {
    if (!canGenerate || !photo) return

    setError(null)
    setGenerating(true)

    // Generate Builder ID immediately
    const builderId = generateBuilderId()

    try {
      const canvas = await renderBuilderPass({
        photo,
        name: name.trim(),
        stack: role.trim(),
        builderTitle: 'HH Goa Builder',
        zoom: photoZoom
      }, builderId)
      
      setGeneratedCanvas(canvas)
    } catch (err) {
      console.error('Generation error:', err)
      setError('Failed to generate. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Show generated result - FILLS THE ENTIRE WINDOW APERTURE
  if (generatedCanvas) {
    return (
      <>
        {/* Generated Pass - fills the window aperture */}
        <div 
          className="flex h-full w-full items-center justify-center"
          style={{
            padding: '0',
          }}
        >
          <img
            src={generatedCanvas.toDataURL()}
            alt="Generated Builder Pass"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Action buttons - placed BELOW the window by parent */}
        {/* This container is rendered separately - see BuilderPassMode */}
      </>
    )
  }

  // Show form - COMPACT, NO INTERNAL SCROLL, FITS IN APERTURE
  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-6 mobile-form-container" style={{ paddingTop: '20px' }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-form-container {
            padding-top: 4px !important;
          }
          .mobile-form-spacing {
            gap: 0.125rem !important;
          }
          .mobile-input-field {
            min-height: 14px !important;
            height: 14px !important;
            font-size: 10px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            line-height: 14px !important;
          }
          .mobile-generate-btn {
            min-height: 12px !important;
            height: 12px !important;
            margin-top: 1px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            font-size: 9px !important;
            line-height: 12px !important;
          }
          .mobile-label {
            margin-bottom: 0.125rem !important;
            font-size: 8px !important;
          }
          .mobile-zoom-section {
            margin-top: 0.125rem !important;
          }
        }
      `}</style>
      <div className="w-full space-y-2 mobile-form-spacing" style={{ maxWidth: '300px' }}>
        {/* Photo Upload - EXTRA COMPACT */}
        <div>
          <label className="mb-1 mobile-label block font-body text-xs font-medium text-[#14342a]">
            Your Photo
          </label>
          <PhotoUploader 
            onPhotoLoaded={setPhoto} 
            currentPhoto={photo || undefined}
            zoom={photoZoom}
          />
          {photo && (
            <div className="mt-2 mobile-zoom-section">
              <label className="mb-1 mobile-label block font-body text-xs font-medium text-[#14342a]">
                Zoom
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={photoZoom}
                onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                className="w-full"
                style={{
                  accentColor: '#1a3a2e',
                }}
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 mobile-label block font-body text-xs font-medium text-[#14342a]">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
            className="w-full rounded-sm border px-3 py-2 font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] mobile-input-field"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(31,77,58,0.25)',
              color: '#14342a',
              minHeight: '40px',
            }}
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="mb-1 mobile-label block font-body text-xs font-medium text-[#14342a]">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Founder, Developer"
            maxLength={50}
            required
            className="w-full rounded-sm border px-3 py-2 font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] mobile-input-field"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(31,77,58,0.25)',
              color: '#14342a',
              minHeight: '40px',
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          className="w-full rounded-sm px-4 py-2 font-body text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mobile-generate-btn"
          style={{
            background: canGenerate ? '#FEE101' : 'rgba(254,225,1,0.3)',
            color: '#1a3a2e',
            minHeight: '40px',
          }}
        >
          {generating ? 'Generating...' : 'Generate Pass'}
        </button>

        {error && (
          <p className="mt-1 font-body text-xs text-[#d85050]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

// Export state accessors for parent component to render action buttons
export function useBuilderPassActions() {
  return {
    handleDownload: async (canvas: HTMLCanvasElement) => {
      try {
        await downloadCanvas(canvas, 'hh-goa-builder-pass.png')
      } catch (err) {
        console.error('Download error:', err)
      }
    },
    handleShareToX: () => {
      const text = encodeURIComponent('Made it to Goa. Built something worth staying for.\n\n#FrameInGoa')
      const url = `https://twitter.com/intent/tweet?text=${text}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }
}
