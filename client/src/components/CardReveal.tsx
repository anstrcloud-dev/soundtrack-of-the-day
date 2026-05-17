/*import { useState, useEffect } from 'react'
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
*/

//TEST VERSION 
import { useState, useEffect } from 'react'

type CardRevealProps = {
  children: React.ReactNode
  onFinishSplash?: () => void
}

const CardReveal = ({ children, onFinishSplash }: CardRevealProps) => {
  const [showSplash, setShowSplash] = useState(true)
  const [cardsRevealed, setCardsRevealed] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const [randomStarts] = useState(() => [
    { x: -400, y: -300 },
    { x: 400, y: -300 },
    { x: -400, y: 300 },
    { x: 400, y: 300 },
    { x: 0, y: -400 },
    { x: 0, y: 400 },
    { x: -500, y: 0 },
    { x: 500, y: 0 },
  ])

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setCardsRevealed(prev => {
        if (prev >= 8) {
          clearInterval(cardInterval)
          //spinning
          setIsSpinning(true)
          
          // after spin, select random card
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * 8)
            setSelectedCard(randomIndex)
            setIsSpinning(false)
            
            //flip the selected card
            setTimeout(() => {
              setIsFlipping(true)
              
              // Show actual content after flip
              setTimeout(() => {
                setShowSplash(false)
                onFinishSplash?.()
              }, 800)
            }, 500)
          }, 3000)
          return prev
        }
        return prev + 1
      })
    }, 300)

    return () => clearInterval(cardInterval)
  }, [onFinishSplash])

  if (!showSplash) {
    return <>{children}</>
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0b2e] to-[#0d0520]">
      {/* Glowing aura ring */}
      {cardsRevealed === 8 && (
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
      )}

      {/* Circular card arrangement */}
      <div className={`relative w-96 h-96 ${isSpinning ? 'animate-spin-slow' : ''}`}>
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8
          const radius = 120
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius
          const startPos = randomStarts[i]

          const isSelected = selectedCard === i
          const shouldFadeOut = selectedCard !== null && !isSelected

          return (
            <div
              key={i}
              className={`absolute top-1/2 left-1/2 w-32 h-48 rounded-lg shadow-2xl transition-all ${
                i < cardsRevealed ? 'opacity-100' : 'opacity-0'
              } ${shouldFadeOut ? 'opacity-0 scale-0 duration-500' : ''} ${
                isSelected ? 'duration-1000 z-50' : 'duration-1000'
              }`}
              style={{
                transform: i < cardsRevealed
                  ? isSelected
                    ? `translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1.5) ${isFlipping ? 'rotateY(180deg)' : ''}`
                    : `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`
                  : `translate(-50%, -50%) translate(${startPos.x}px, ${startPos.y}px) rotate(${i * 45}deg)`,
                background: 'linear-gradient(135deg, #1a0b2e 0%, #4a148c 100%)',
                border: '2px solid rgba(147, 51, 234, 0.5)',
              }}
            >
              <div className="w-full h-full p-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-2 border-2 border-purple-300/30 rounded"></div>
                
                <div className="text-purple-200/40 text-center space-y-1">
                  <div className="text-3xl">✦</div>
                  <div className="text-2xl">☾</div>
                  <div className="text-xl">✧</div>
                  <div className="text-2xl">☆</div>
                  <div className="text-3xl">✦</div>
                </div>

                <div className="absolute top-2 left-2 text-purple-300/40 text-xs">✧</div>
                <div className="absolute top-2 right-2 text-purple-300/40 text-xs">✧</div>
                <div className="absolute bottom-2 left-2 text-purple-300/40 text-xs">✧</div>
                <div className="absolute bottom-2 right-2 text-purple-300/40 text-xs">✧</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CardReveal