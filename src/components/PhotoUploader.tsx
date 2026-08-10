/**
 * Photo Uploader Component
 * 
 * Handles photo upload with preview
 * Supports JPG, PNG, and HEIC
 */

import { useState, useRef, type ChangeEvent } from 'react'
import { loadImage, validateImageFile, isHEIC, convertHEICToJPEG } from '../utils/imageProcessing'

interface PhotoUploaderProps {
  onPhotoLoaded: (image: HTMLImageElement) => void
  currentPhoto?: HTMLImageElement
  zoom?: number
}

export function PhotoUploader({ onPhotoLoaded, currentPhoto, zoom = 1 }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setLoading(true)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        setLoading(false)
        return
      }

      // Handle HEIC conversion if needed
      let processedFile = file
      if (isHEIC(file)) {
        try {
          processedFile = await convertHEICToJPEG(file)
        } catch (conversionError) {
          setError('HEIC format not supported in your browser. Please use JPG or PNG.')
          setLoading(false)
          return
        }
      }

      // Load image
      const img = await loadImage(processedFile)
      const previewUrl = URL.createObjectURL(processedFile)
      
      setPreview(previewUrl)
      onPhotoLoaded(img)
    } catch (err) {
      console.error('Photo upload error:', err)
      setError('Failed to load image. Please try another file.')
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const hasPhoto = preview || currentPhoto

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload photo"
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5a52] focus-visible:ring-offset-2 photo-upload-button"
        style={{
          background: hasPhoto ? 'transparent' : 'rgba(31,77,58,0.08)',
          border: '2px dashed rgba(31,77,58,0.3)',
          borderRadius: '4px',
          height: '120px',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .photo-upload-button {
              height: 65px !important;
            }
          }
        `}</style>
      
        {loading ? (
          <div className="flex flex-col items-center justify-center p-2">
            <div 
              className="mb-1.5"
              style={{
                width: '24px',
                height: '24px',
                border: '3px solid rgba(31,77,58,0.2)',
                borderTopColor: '#1f4d3a',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p className="font-body text-xs text-[#40584d]">Loading...</p>
          </div>
        ) : hasPhoto ? (
          <div className="relative h-full overflow-hidden">
            <img
              src={preview || currentPhoto?.src}
              alt="Uploaded photo preview"
              className="h-full w-full mobile-photo-preview"
              style={{
                height: '120px',
                borderRadius: '2px',
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
                objectFit: 'contain',
              }}
            />
            <style>{`
              @media (max-width: 768px) {
                .mobile-photo-preview {
                  height: 65px !important;
                }
              }
            `}</style>
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
              style={{
                background: 'rgba(26,58,46,0.85)',
              }}
            >
              <p className="font-body text-xs font-medium text-[#f7f1e3]">
                Click to change
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 mobile-upload-content">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-1 mobile-upload-icon"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#1f4d3a" strokeWidth="1.5" strokeOpacity="0.4" />
              <circle cx="8" cy="9" r="2" fill="#1f4d3a" fillOpacity="0.3" />
              <path d="M2 15L7 10L12 15" stroke="#1f4d3a" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 13L15 10L22 17" stroke="#1f4d3a" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-body text-xs font-medium text-[#14342a] mobile-upload-text">
              Upload photo
            </p>
            <p className="font-body text-xs text-[#8a9a6a] mobile-upload-subtext" style={{ fontSize: '10px' }}>
              JPG, PNG, HEIC
            </p>
            <style>{`
              @media (max-width: 768px) {
                .mobile-upload-content {
                  padding: 0.5rem 0.25rem !important;
                }
                .mobile-upload-icon {
                  width: 20px !important;
                  height: 20px !important;
                  margin-bottom: 0.25rem !important;
                }
                .mobile-upload-text {
                  font-size: 11px !important;
                  line-height: 1.3 !important;
                  margin-bottom: 0.125rem !important;
                }
                .mobile-upload-subtext {
                  font-size: 9px !important;
                  line-height: 1.2 !important;
                }
              }
            `}</style>
          </div>
        )}
      </button>

      {error && (
        <p 
          className="mt-2 font-body text-sm text-[#d85050]"
          role="alert"
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
