import { ArrivalExperience } from './components/ArrivalExperience'
import { RippleBackground } from './components/RippleBackground'

export default function App() {
  return (
    <>
      {/* Background layer - fixed with z-index 10 */}
      <RippleBackground />
      
      {/* Main content - positioned above background with higher z-index, pointer-events disabled on wrapper */}
      <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ArrivalExperience />
        </div>
      </div>
    </>
  )
}
