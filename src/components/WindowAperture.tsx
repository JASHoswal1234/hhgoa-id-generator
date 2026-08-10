import { BuilderPassMode } from './BuilderPassMode'
import { BuilderIdentityMode } from './BuilderIdentityMode'

interface WindowApertureProps {
  mode: 'pass' | 'identity'
  onGeneratedCanvas?: (canvas: HTMLCanvasElement | null) => void
  onActionHandlers?: (handlers: {
    onDownload: () => void
    onShare: () => void
    onReset: () => void
  } | null) => void
  onError?: (error: string | null) => void
  onMobileGenerateButton?: (button: React.ReactNode | null) => void
}

/**
 * Window Aperture - The opening where generators live
 * 
 * This is the space INSIDE/BEHIND the window frame.
 * Content switches between Builder Pass and Builder Identity modes.
 * 
 * The frame remains visually dominant. Content lives inside the architecture,
 * not over it.
 */
export function WindowAperture({ mode, onGeneratedCanvas, onActionHandlers, onError, onMobileGenerateButton }: WindowApertureProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Warm cream interior - visible through window */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #f7f1e3 0%, #f5f1e8 100%)',
          boxShadow: 'inset 0 8px 16px -8px rgba(22,52,43,0.35)',
        }}
      />

      {/* Generator content */}
      <div className="relative z-10 h-full w-full">
        {mode === 'pass' ? (
          <BuilderPassMode 
            onGeneratedCanvas={onGeneratedCanvas}
            onActionHandlers={onActionHandlers}
            onError={onError}
            onMobileGenerateButton={onMobileGenerateButton}
          />
        ) : (
          <BuilderIdentityMode />
        )}
      </div>
    </div>
  )
}
