import useTrack from "./hooks/useTrack"
import TrackCard from "./components/TrackCard"
import { useState } from "react"

function App() {
  const { track, loading, error } = useTrack()
  const [isSplashActive, setIsSplashActive] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center p-4">
      
      {/* LOADING STATE - Show logo */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <img
            src="/logo.png"
            alt="Audiomancy"
            className="w-[450px] h-[450px] object-contain animate-pulse"
          />
        </div>
      )}

      {/* ERROR STATE - Flying cards away */}
      {error && !loading && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Falling cards animation */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-48 bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border-2 border-purple-400/50 shadow-2xl"
              style={{
                animation: `flyAway ${2 + i * 0.2}s ease-in forwards`,
                animationDelay: `${i * 0.1}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-purple-300/40 text-5xl">
                ✦
              </div>
            </div>
          ))}

          {/* Message */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-purple-200 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              The Cards Are Asleep Today
            </h2>
            <p className="text-purple-300 mb-8">Please return later to draw your fate</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/30 hover:bg-white/20 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>

          <style>{`
            @keyframes flyAway {
              0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg) scale(1);
              }
              100% {
                opacity: 0;
                transform: translate(${Math.random() * 600 - 300}px, ${Math.random() * 800 - 400}px) rotate(${Math.random() * 720}deg) scale(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* SUCCESS STATE - Show card with animation */}
      {track && !loading && !error && (
        <>
          {!isSplashActive && (
            <>
              <h1
                className="text-5xl font-bold text-purple-200 mb-2 animate-[fadeIn_1s_ease-in]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Audiomancy
              </h1>
              <p className="text-purple-300 mb-8 animate-[fadeIn_1s_ease-in]">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </>
          )}

          <TrackCard
            title={track.title}
            artist={track.artist}
            cover={track.cover}
            preview={track.preview}
            reading={track.reading}
            onFinishSplash={() => setIsSplashActive(false)}
          />
        </>
      )}
    </div>
  )
}

export default App