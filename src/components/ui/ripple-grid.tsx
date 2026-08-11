/**
 * RippleGrid Background Component
 * 
 * Subtle interactive background for HH Goa website
 * - Forest green background (#036836)
 * - Yellow ripple effect (#F4C542)
 * - Respects prefers-reduced-motion
 */

import { useEffect, useRef, useState } from "react"

interface RippleGridProps {
  size?: number
  filledCells?: Array<{ row: number; col: number }>
  cellSize?: number
  cellColor?: string
  filledCellColor?: string
  pulseColor?: string
  borderColor?: string
  borderWidth?: number
  pulseScale?: number
  pulseDuration?: number
  rippleDelay?: number
  triggerCell?: { row: number; col: number } | null
}

export function RippleGrid({
  size = 5,
  filledCells = [],
  cellSize = 36,
  cellColor = "#036836",
  filledCellColor = "#036836",
  pulseColor = "#F4C542",
  borderColor = "rgba(244, 197, 66, 0.08)",
  borderWidth = 1,
  pulseScale = 1.03,
  pulseDuration = 350,
  rippleDelay = 50,
  triggerCell = null,
}: RippleGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Trigger ripple when triggerCell changes
  useEffect(() => {
    if (!triggerCell || reducedMotion || !gridRef.current) return

    const { row: clickedRow, col: clickedCol } = triggerCell
    const cells = gridRef.current.querySelectorAll(".cell")

    cells.forEach((cell) => {
      const htmlCell = cell as HTMLElement
      const row = Number.parseInt(htmlCell.dataset.row || "0")
      const col = Number.parseInt(htmlCell.dataset.col || "0")

      // Manhattan distance
      const distance = Math.abs(row - clickedRow) + Math.abs(col - clickedCol)

      setTimeout(() => {
        htmlCell.classList.add("pulse")
        setTimeout(() => {
          htmlCell.classList.remove("pulse")
        }, pulseDuration + 200)
      }, distance * rippleDelay)
    })
  }, [triggerCell, pulseDuration, rippleDelay, reducedMotion])

  const isFilled = (row: number, col: number) => {
    return filledCells.some((cell) => cell.row === row && cell.col === col)
  }

  const renderGrid = () => {
    const cells = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`cell ${isFilled(row, col) ? "filled" : ""}`}
            data-row={row}
            data-col={col}
          />,
        )
      }
    }
    return cells
  }

  return (
    <div
      ref={gridRef}
      className="grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
      }}
    >
      {renderGrid()}
      <style dangerouslySetInnerHTML={{
        __html: `
          .cell {
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: ${cellColor};
            border: ${borderWidth}px solid ${borderColor};
            box-sizing: border-box;
            cursor: pointer;
          }

          .cell.filled {
            background-color: ${filledCellColor};
          }

          .cell.pulse:not(.filled) {
            animation: pulse-animation ${pulseDuration}ms forwards;
          }

          @keyframes pulse-animation {
            0% {
              background-color: ${cellColor};
              transform: scale(1);
            }
            50% {
              background-color: ${pulseColor};
              transform: scale(${pulseScale});
            }
            100% {
              background-color: ${cellColor};
              transform: scale(1);
            }
          }
        `
      }} />
    </div>
  )
}
