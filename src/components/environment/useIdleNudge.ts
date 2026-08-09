import { useEffect, useRef, useState } from 'react'

const IDLE_MS = 14_000
const SWAY_MS = 900

interface UseIdleNudgeOptions {
  /** Pointer activity anywhere in this element's third of the page resets the timer. */
  scope: React.RefObject<HTMLElement | null>
  disabled?: boolean
}

/**
 * One harder sway after ~14s of no pointer activity near the tags.
 *
 * The ambient breath is deliberately sub-threshold, which means a visitor who
 * missed the entrance and never moves their pointer to the right third of the
 * page could plausibly not notice the tags at all. This is the one rung of
 * escalation for that case: a single sway, once. No text, no arrow, no second
 * rung — a page that keeps asking is a page that has stopped trusting its own
 * composition.
 *
 * Returns true for the length of the sway, then latches off for the session.
 */
export function useIdleNudge({ scope, disabled }: UseIdleNudgeOptions): boolean {
  const [swaying, setSwaying] = useState(false)
  const spent = useRef(false)

  useEffect(() => {
    if (disabled || spent.current) return

    let idle: number | undefined
    let clear: number | undefined

    const arm = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (spent.current) return
        spent.current = true
        setSwaying(true)
        clear = window.setTimeout(() => setSwaying(false), SWAY_MS)
      }, IDLE_MS)
    }

    /* Only activity in the right third counts — a visitor reading the headline
       on the left has not yet had the chance to notice the tags, so their
       mouse drifting over the type should not cancel the nudge. */
    const onMove = (event: PointerEvent) => {
      if (spent.current) return
      const node = scope.current
      if (!node) return
      const box = node.getBoundingClientRect()
      const nearby =
        event.clientX > window.innerWidth * (2 / 3) &&
        event.clientY > box.top - 240 &&
        event.clientY < box.bottom + 240
      if (nearby) arm()
    }

    arm()
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.clearTimeout(idle)
      window.clearTimeout(clear)
      window.removeEventListener('pointermove', onMove)
    }
  }, [disabled, scope])

  return swaying
}
