import useTrack from "./hooks/useTrack"
import TrackCard from "./components/TrackCard"

function App() {
  const { track, loading, error } = useTrack()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center p-4">
      <h1
        className="text-5xl font-bold text-purple-200 mb-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Audiomancy
      </h1>
      <p className="text-purple-300 mb-8">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-400">Failed to load track</p>}
      {track && (
        <TrackCard
          title={track.title}
          artist={track.artist}
          cover={track.cover}
          preview={track.preview}
          reading={track.reading}
        />
      )}
    </div>
  )
}

export default App