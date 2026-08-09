interface GeneratorModeSwitchProps {
  currentMode: 'pass' | 'identity'
  onModeChange: (mode: 'pass' | 'identity') => void
}

/**
 * Generator Mode Switch - Physical element, NOT generic tabs
 * 
 * Integrated with the window sill/architecture. Visual metaphor:
 * painted wooden sign or brass plaque attached to sill.
 * 
 * NOT: Generic web tabs, radio buttons, or SaaS UI components
 * IS: Physical labels/tags that feel part of the window's architecture
 */
export function GeneratorModeSwitch({ currentMode, onModeChange }: GeneratorModeSwitchProps) {
  return (
    <div
      className="absolute flex gap-2"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '-9%',
        zIndex: 40,
      }}
      role="tablist"
      aria-label="Generator mode"
    >
      {/* Builder Pass Label */}
      <button
        role="tab"
        aria-selected={currentMode === 'pass'}
        aria-controls="window-aperture"
        onClick={() => onModeChange('pass')}
        className="group relative flex items-center justify-center font-body text-sm font-medium transition-all duration-200"
        style={{
          // IMPROVED sizing - comfortable padding, not squashed
          padding: 'clamp(10px, 2.2vw, 14px) clamp(16px, 3.5vw, 22px)',
          background: currentMode === 'pass' 
            ? 'linear-gradient(135deg, #d8a830 0%, #c49528 100%)'
            : 'linear-gradient(135deg, #1f4d3a 0%, #16342b 100%)',
          color: currentMode === 'pass' ? '#16342b' : '#8a9a6a',
          border: currentMode === 'pass'
            ? '1px solid rgba(22,52,43,0.3)'
            : '1px solid rgba(247,241,227,0.15)',
          borderRadius: '4px',
          boxShadow: currentMode === 'pass'
            ? '0 2px 5px rgba(22,52,43,0.22), inset 0 1px 0 rgba(255,255,255,0.16)'
            : '0 1px 3px rgba(0,0,0,0.2)',
          textShadow: currentMode === 'pass' ? '0 1px 0 rgba(255,255,255,0.2)' : 'none',
          minWidth: 'clamp(110px, 24vw, 140px)',
        }}
      >
        <span className="relative">Builder Pass</span>
        
        {/* Active indicator */}
        {currentMode === 'pass' && (
          <div
            className="absolute"
            style={{
              top: '-5px',
              right: '-5px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #e0c080 0%, #b88c42 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Builder Identity Label */}
      <button
        role="tab"
        aria-selected={currentMode === 'identity'}
        aria-controls="window-aperture"
        onClick={() => onModeChange('identity')}
        className="group relative flex items-center justify-center font-body text-sm font-medium transition-all duration-200"
        style={{
          // IMPROVED sizing - comfortable padding, not squashed
          padding: 'clamp(10px, 2.2vw, 14px) clamp(16px, 3.5vw, 22px)',
          background: currentMode === 'identity'
            ? 'linear-gradient(135deg, #d8a830 0%, #c49528 100%)'
            : 'linear-gradient(135deg, #1f4d3a 0%, #16342b 100%)',
          color: currentMode === 'identity' ? '#16342b' : '#8a9a6a',
          border: currentMode === 'identity'
            ? '1px solid rgba(22,52,43,0.3)'
            : '1px solid rgba(247,241,227,0.15)',
          borderRadius: '4px',
          boxShadow: currentMode === 'identity'
            ? '0 2px 5px rgba(22,52,43,0.22), inset 0 1px 0 rgba(255,255,255,0.16)'
            : '0 1px 3px rgba(0,0,0,0.2)',
          textShadow: currentMode === 'identity' ? '0 1px 0 rgba(255,255,255,0.2)' : 'none',
          minWidth: 'clamp(110px, 24vw, 140px)',
        }}
      >
        <span className="relative">Builder Identity</span>
        
        {/* Active indicator */}
        {currentMode === 'identity' && (
          <div
            className="absolute"
            style={{
              top: '-5px',
              right: '-5px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #e0c080 0%, #b88c42 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  )
}
