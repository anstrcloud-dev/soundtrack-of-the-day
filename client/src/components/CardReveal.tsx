import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type CardRevealProps = {
  children: ReactNode
}

const CardReveal = ({ children }: CardRevealProps) => {
  const [phase, setPhase] = useState<'shuffle' | 'settle' | 'flip' | 'revealed'>('shuffle')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const shuffleTimer = setTimeout(() => setPhase('settle'), 2000)
    const settleTimer = setTimeout(() => setPhase('flip'), 3000)
    const contentTimer = setTimeout(() => setShowContent(true), 3500) // halfway through flip
    const revealTimer = setTimeout(() => setPhase('revealed'), 4000)
    
    return () => {
      clearTimeout(shuffleTimer)
      clearTimeout(settleTimer)
      clearTimeout(contentTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  if (phase === 'shuffle' || phase === 'settle') {
    return (
      <div className="relative w-[320px] h-[450px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 border-2 border-purple-400/70 rounded-lg shadow-2xl transition-all duration-700`}
            style={{
              animation: phase === 'shuffle' ? `shuffle 0.6s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.15}s`,
              transform: phase === 'settle' ? 'translateX(0) rotate(0deg)' : `translateX(${i * 12}px) rotate(${i * 3}deg)`,
              opacity: phase === 'settle' && i !== 1 ? 0 : 1,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-7xl text-purple-300/40">✦</div>
            </div>
          </div>
        ))}
        <style>{`
          @keyframes shuffle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
        `}</style>
      </div>
    )
  }

  if (phase === 'flip') {
    return (
      <div style={{ animation: 'flip 1s ease-in-out' }}>
        {showContent ? (
          children
        ) : (
          <div className="w-[320px] h-[450px] bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 border-2 border-purple-400/70 rounded-lg shadow-2xl flex items-center justify-center">
            <div className="text-7xl text-purple-300/40">✦</div>
          </div>
        )}
        <style>{`
          @keyframes flip {
            0% { transform: perspective(1000px) rotateY(0deg); }
            50% { transform: perspective(1000px) rotateY(90deg); }
            100% { transform: perspective(1000px) rotateY(0deg); }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}

export default CardReveal