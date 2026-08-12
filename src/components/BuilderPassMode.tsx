/**
 * Builder Pass Mode - Functional Generator with Actions Below Window
 * 
 * The actual Builder Pass generator with photo upload,
 * form inputs, and canvas-based generation.
 * 
 * POST-GENERATION: Generated pass fills window aperture,
 * action buttons render BELOW the window frame.
 */

import { useState, useEffect } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { renderBuilderPass, downloadCanvas, generateBuilderId } from '../utils/canvasRenderer'

interface BuilderPassModeProps {
  onGeneratedCanvas?: (canvas: HTMLCanvasElement | null) => void
  onActionHandlers?: (handlers: {
    onDownload: () => void
    onShare: () => void
    onReset: () => void
  } | null) => void
  onError?: (error: string | null) => void
  onMobileGenerateButton?: (button: React.ReactNode | null) => void
}

export function BuilderPassMode({ onGeneratedCanvas, onActionHandlers, onError, onMobileGenerateButton }: BuilderPassModeProps) {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [photoZoom, setPhotoZoom] = useState<number>(1)
  const [showMobileButton, setShowMobileButton] = useState(false)
  // Store generated Builder ID (available for future features like sharing URL)
  const [_builderId, setBuilderId] = useState<string | null>(null)

  const canGenerate = photo && name.trim() && role.trim()

  const handleDownload = async () => {
    if (!generatedCanvas) return

    try {
      await downloadCanvas(generatedCanvas, 'hh-goa-builder-pass.png')
    } catch (err) {
      console.error('Download error:', err)
      const errorMsg = 'Failed to download. Please try again.'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  const handleShareToX = async () => {
    if (!generatedCanvas) return

    const shareText = 'I just created my HH Goa Builder Pass.\n\n#FrameInGoa'
    
    try {
      // Convert canvas to Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        generatedCanvas.toBlob(resolve, 'image/png')
      })

      if (!blob) {
        throw new Error('Failed to create Builder Pass image')
      }

      // Create File from Blob
      const file = new File([blob], 'hh-goa-builder-pass.png', { type: 'image/png' })

      // Try native Web Share API (primarily for mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My HH Goa Builder Pass',
            text: shareText,
          })
          // User completed share or cancelled - both are success cases
          return
        } catch (shareErr: any) {
          // User cancelled share sheet - this is normal, don't show error
          if (shareErr.name === 'AbortError') {
            return
          }
          // Other share errors - fall through to fallback
          console.warn('Native share failed, using fallback:', shareErr)
        }
      }

      // Fallback: Download + open X (desktop or unsupported browsers)
      await downloadCanvas(generatedCanvas, 'hh-goa-builder-pass.png')
      
      // Small delay to ensure download starts
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Open X with pre-filled text
      const xText = encodeURIComponent(
        'Made it to Goa. Built something worth staying for.\n\n' +
        'Just got my official Builder Pass! 🏖️\n\n' +
        'Create yours: https://hhgoa-id-generator-psi.vercel.app\n\n' +
        '#FrameInGoa #BuilderLife #GoaVibes'
      )
      window.open(`https://twitter.com/intent/tweet?text=${xText}`, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Share error:', err)
      const errorMsg = 'Failed to share. Please try again.'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  const handleReset = () => {
    setGeneratedCanvas(null)
    setPhoto(null)
    setName('')
    setRole('')
    setError(null)
    setPhotoZoom(1)
    setBuilderId(null) // Clear ID when making another
    onGeneratedCanvas?.(null)
    onActionHandlers?.(null)
    onError?.(null)
  }

  const handleGenerate = async () => {
    if (!canGenerate || !photo) return

    setError(null)
    onError?.(null)
    setGenerating(true)

    // Generate Builder ID IMMEDIATELY before any expensive operations
    const newBuilderId = generateBuilderId()
    setBuilderId(newBuilderId)

    try {
      const canvas = await renderBuilderPass({
        photo,
        name: name.trim(),
        stack: role.trim(),
        builderTitle: 'HH Goa Builder',
        zoom: photoZoom
      }, newBuilderId) // Pass pre-generated ID
      
      setGeneratedCanvas(canvas)
      onGeneratedCanvas?.(canvas)
    } catch (err) {
      console.error('Generation error:', err)
      const errorMsg = 'Failed to generate. Please try again.'
      setError(errorMsg)
      onError?.(errorMsg)
      setBuilderId(null) // Clear ID on failure
    } finally {
      setGenerating(false)
    }
  }

  // Notify parent of mobile generate button state
  useEffect(() => {
    const checkMobile = () => {
      setShowMobileButton(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pass mobile generate button to parent when on mobile and form is showing
  useEffect(() => {
    if (showMobileButton && !generatedCanvas && onMobileGenerateButton) {
      const mobileButton = (
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          className="rounded-sm px-4 py-2 font-body text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: canGenerate ? '#FEE101' : 'rgba(254,225,1,0.3)',
            color: '#1a3a2e',
            minHeight: '38px',
            width: '280px',
            maxWidth: '90%',
            margin: '0 auto',
            fontSize: '13px',
            padding: '0 16px',
          }}
        >
          {generating ? 'Generating...' : 'Generate Pass'}
        </button>
      )
      onMobileGenerateButton(mobileButton)
    } else if (onMobileGenerateButton) {
      onMobileGenerateButton(null)
    }
  }, [showMobileButton, generatedCanvas, canGenerate, generating, onMobileGenerateButton])

  // Notify parent of action handlers when canvas is generated
  useEffect(() => {
    if (generatedCanvas) {
      onActionHandlers?.({
        onDownload: handleDownload,
        onShare: handleShareToX,
        onReset: handleReset
      })
    } else {
      onActionHandlers?.(null)
    }
  }, [generatedCanvas])

  // GENERATED STATE: Pass fills aperture, buttons render below window
  if (generatedCanvas) {
    return (
      <div className="flex h-full w-full items-center justify-center">
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
    )
  }

  // FORM STATE: Show generator form
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 mobile-form-wrapper">
      <style>{`
        @media (max-width: 768px) {
          .mobile-form-wrapper {
            justify-content: flex-start !important;
            padding-top: 12px !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .mobile-form-content {
            gap: 5px !important;
          }
          
          .mobile-form-label {
            margin-bottom: 2px !important;
            font-size: 10px !important;
            font-weight: 500 !important;
          }
          
          .mobile-form-input {
            min-height: 34px !important;
            height: 34px !important;
            padding: 0 10px !important;
            font-size: 13px !important;
            line-height: 34px !important;
          }
          
          .mobile-form-button {
            min-height: 36px !important;
            height: 36px !important;
            padding: 0 12px !important;
            font-size: 13px !important;
            line-height: 36px !important;
          }
          
          /* Photo section compact layout */
          .mobile-photo-section {
            margin-bottom: 5px !important;
          }
          
          /* Zoom control - compact and inline */
          .mobile-zoom-wrapper {
            margin-top: 3px !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            height: 20px !important;
          }
          
          .mobile-zoom-label {
            font-size: 9px !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
            width: 32px !important;
            line-height: 20px !important;
          }
          
          .mobile-zoom-slider {
            height: 16px !important;
            flex: 1 !important;
          }
        }
      `}</style>
      
      <div className="w-full space-y-2 mobile-form-content" style={{ maxWidth: '300px' }}>
        {/* Photo Upload */}
        <div className="mobile-photo-section">
          <label className="mb-1 block font-body text-xs font-medium text-[#14342a] mobile-form-label">
            Your Photo
          </label>
          <PhotoUploader 
            onPhotoLoaded={setPhoto} 
            currentPhoto={photo || undefined}
            zoom={photoZoom}
          />
          {photo && (
            <div className="mt-2 mobile-zoom-wrapper">
              <label className="block font-body text-xs font-medium text-[#14342a] mobile-zoom-label">
                Zoom
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={photoZoom}
                onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                className="w-full mobile-zoom-slider"
                style={{
                  accentColor: '#1a3a2e',
                }}
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block font-body text-xs font-medium text-[#14342a] mobile-form-label">
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
            className="w-full rounded-sm border px-3 py-2 font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] mobile-form-input"
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
          <label htmlFor="role" className="mb-1 block font-body text-xs font-medium text-[#14342a] mobile-form-label">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Founder / Developer / Designer"
            maxLength={50}
            required
            className="w-full rounded-sm border px-3 py-2 font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] mobile-form-input"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(31,77,58,0.25)',
              color: '#14342a',
              minHeight: '40px',
            }}
          />
        </div>

        {/* Generate Button - Hidden on mobile, shown on desktop */}
        {!showMobileButton && (
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || generating}
            className="w-full rounded-sm px-4 py-2 font-body text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mobile-form-button"
            style={{
              background: canGenerate ? '#FEE101' : 'rgba(254,225,1,0.3)',
              color: '#1a3a2e',
              minHeight: '40px',
            }}
          >
            {generating ? 'Generating...' : 'Generate Pass'}
          </button>
        )}

        {error && (
          <p className="mt-1 font-body text-xs text-[#d85050]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

// Export component that renders action buttons BELOW window
export function BuilderPassActions({
  generatedCanvas,
  onDownload,
  onShare,
  onReset,
  error
}: {
  generatedCanvas: HTMLCanvasElement | null
  onDownload: () => void
  onShare: () => void
  onReset: () => void
  error?: string | null
}) {
  if (!generatedCanvas) return null

  return (
    <div 
      className="flex flex-col items-center gap-2 mobile-action-buttons"
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: 'clamp(16px, 2.5vh, 24px)',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .mobile-action-buttons {
            padding-top: 8px !important;
          }
          .mobile-action-buttons .mobile-main-button {
            min-height: 36px !important;
            padding: 8px 12px !important;
            font-size: 12px !important;
            min-width: 120px !important;
          }
          .mobile-action-buttons .mobile-reset-button {
            min-height: 28px !important;
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <button
          onClick={onDownload}
          className="rounded-sm px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0080] focus-visible:ring-offset-2 mobile-main-button"
          style={{
            background: '#FF0080',
            minHeight: '44px',
            flex: '1 1 auto',
            minWidth: '140px',
          }}
        >
          Download PNG
        </button>

        <button
          onClick={onShare}
          className="rounded-sm px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 mobile-main-button"
          style={{
            background: '#000000',
            minHeight: '44px',
            flex: '1 1 auto',
            minWidth: '140px',
          }}
          title="Downloads image and opens X for sharing"
        >
          Share on X #FrameInGoa
        </button>
      </div>

      <button
        onClick={onReset}
        className="rounded-sm px-4 py-2 font-body text-xs transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7f1e3] focus-visible:ring-offset-2 mobile-reset-button"
        style={{
          color: 'rgba(247,241,227,0.7)',
          minHeight: '36px',
        }}
      >
        Make another
      </button>

      {error && (
        <p className="font-body text-xs" style={{ color: '#ff6b6b' }} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
