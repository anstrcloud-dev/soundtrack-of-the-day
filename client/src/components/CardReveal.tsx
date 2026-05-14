import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type CardRevealProps = {
  children: ReactNode
  onFinishSplash?: () => void //test
}

//const CardReveal = ({ children }: CardRevealProps) => {
const CardReveal = ({ children, onFinishSplash }: CardRevealProps) => {
  const [phase, setPhase] = useState<'splash' | 'shuffle' | 'settle' | 'flip' | 'revealed'>('splash')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    //test
    const splashTimer = setTimeout(() => {
      setPhase('shuffle');
      onFinishSplash?.(); // Tell the parent splash is done
    }, 1500)
    //
    //const splashTimer = setTimeout(() => setPhase('shuffle'), 1500)      // show logo 
    const shuffleTimer = setTimeout(() => setPhase('settle'), 3500)       // shuffle
    const settleTimer = setTimeout(() => setPhase('flip'), 4500)          // settle
    const contentTimer = setTimeout(() => setShowContent(true), 5000)     // halfway through flip
    const revealTimer = setTimeout(() => setPhase('revealed'), 5500)      // reveal

    return () => {
      clearTimeout(splashTimer)
      clearTimeout(shuffleTimer)
      clearTimeout(settleTimer)
      clearTimeout(contentTimer)
      clearTimeout(revealTimer)
    }
  }, [onFinishSplash])

  if (phase === 'splash') {
    return (
      <div className="flex items-center justify-center h-[450px] animate-[fadeIn_0.5s_ease-in]">
        <img
          src="/logo.png"
          alt="Audiomancy"
          className="w-[450px] h-[450px] object-contain animate-pulse"
        />
      </div>
    )
  }

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