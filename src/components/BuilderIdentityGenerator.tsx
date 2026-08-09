/**
 * Builder Identity Generator
 * 
 * Functional generator for Builder Identity (PFP frame)
 */

import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { renderBuilderIdentity, downloadCanvas } from '../utils/canvasRenderer'

export function BuilderIdentityGenerator() {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canGenerate = !!photo

  const handleGenerate = async () => {
    if (!canGenerate || !photo) return

    setError(null)
    setGenerating(true)

    try {
      const canvas = await renderBuilderIdentity({ photo })
      setGeneratedCanvas(canvas)
    } catch (err) {
      console.error('Generation error:', err)
      setError('Failed to generate. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedCanvas) return

    try {
      await downloadCanvas(generatedCanvas, 'hh-goa-builder-identity.png')
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download. Please try again.')
    }
  }

  const handleShareToX = () => {
    const text = encodeURIComponent('Building in Goa.\n\n#FrameInGoa')
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleReset = () => {
    setGeneratedCanvas(null)
    setPhoto(null)
    setError(null)
  }

  // Show generated result
  if (generatedCanvas) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div 
          className="relative mb-4 overflow-hidden"
          style={{
            maxWidth: 'min(80vw, 400px)',
            maxHeight: '60vh',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(22,52,43,0.15)',
          }}
        >
          <img
            src={generatedCanvas.toDataURL()}
            alt="Generated Builder Identity"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex w-full max-w-md flex-col gap-2">
          <button
            onClick={handleDownload}
            className="w-full rounded px-4 py-3 font-body text-sm font-medium text-[#f7f1e3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2"
            style={{
              background: '#1a3a2e',
            }}
          >
            Download PNG
          </button>

          <button
            onClick={handleShareToX}
            className="w-full rounded px-4 py-3 font-body text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2"
            style={{
              background: 'rgba(31,77,58,0.12)',
              color: '#14342a',
            }}
          >
            Share to X
          </button>

          <button
            onClick={handleReset}
            className="w-full rounded px-4 py-2 font-body text-xs text-[#8a9a6a] transition-colors hover:text-[#40584d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2"
          >
            Make another
          </button>
        </div>

        {error && (
          <p className="mt-2 font-body text-sm text-[#d85050]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  // Show form
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md space-y-4">
        <div className="mb-2 text-center">
          <h3 className="mb-1 font-display text-lg font-medium text-[#14342a]">
            Builder Identity
          </h3>
          <p className="font-body text-sm text-[#8a9a6a]">
            Upload your photo to get your HH Goa profile frame
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <PhotoUploader onPhotoLoaded={setPhoto} currentPhoto={photo || undefined} />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          className="w-full rounded px-4 py-3 font-body text-sm font-medium text-[#f7f1e3] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: canGenerate ? '#1a3a2e' : 'rgba(31,77,58,0.3)',
          }}
        >
          {generating ? 'Generating...' : 'Generate Identity Frame'}
        </button>

        {error && (
          <p className="font-body text-sm text-[#d85050]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
