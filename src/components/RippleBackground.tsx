/**
 * Ripple Background - Full-page interactive background
 * 
 * Positions RippleGrid as a fixed background layer
 * behind all HH Goa content
 * 
 * Uses document-level click detection to trigger ripples
 * without blocking foreground UI interactions
 */

import { useEffect, useState, useRef } from 'react'
import { RippleGrid } from './ui/ripple-grid'

export function RippleBackground() {
  const [gridSize, setGridSize] = useState({ cols: 30, rows: 30, cellSize: 36 })
  const gridRef = useRef<HTMLDivElement>(null)
  const [triggerRipple, setTriggerRipple] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    const calculateGrid = () => {
      const isMobile = window.innerWidth <= 768
      const cellSize = isMobile ? 28 : 36
      const cols = Math.ceil(window.innerWidth / cellSize) + 1
      const rows = Math.ceil(window.innerHeight / cellSize) + 1

      setGridSize({ cols, rows, cellSize })
    }

    calculateGrid()
    window.addEventListener('resize', calculateGrid)
    return () => window.removeEventListener('resize', calculateGrid)
  }, [])

  // Document-level click handler
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Don't trigger ripple if clicking on interactive UI elements
      if (target.closest('button, input, textarea, select, a, [role="button"], label, [data-interactive]')) {
        return
      }

      // Calculate which grid cell was clicked
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect()
        const col = Math.floor((event.clientX - rect.left) / gridSize.cellSize)
        const row = Math.floor((event.clientY - rect.top) / gridSize.cellSize)

        // Clamp to valid grid range
        const clampedCol = Math.max(0, Math.min(col, gridSize.cols - 1))
        const clampedRow = Math.max(0, Math.min(row, gridSize.rows - 1))

        // Trigger ripple
        setTriggerRipple({ row: clampedRow, col: clampedCol })
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [gridSize])

  // Calculate size for grid (use max of cols/rows for square grid)
  const gridDimension = Math.max(gridSize.cols, gridSize.rows)

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: 10,
        pointerEvents: 'none', // Don't block clicks
      }}
      aria-hidden="true"
    >
      <div className="absolute top-0 left-0">
        <RippleGrid
          size={gridDimension}
          cellSize={gridSize.cellSize}
          cellColor="#036836"
          filledCellColor="#036836"
          pulseColor="#FFE500"
          borderColor="rgba(244, 197, 66, 0.08)"
          borderWidth={1}
          pulseScale={1.03}
          pulseDuration={350}
          rippleDelay={50}
          filledCells={[]}
          triggerCell={triggerRipple}
        />
      </div>
    </div>
  )
}
