import useTrack from "./hooks/useTrack"
import TrackCard from "./components/TrackCard"

function App() {
  const { track, loading, error } = useTrack()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-2">Soundtrack of the day</h1>
      <p className="text-gray-300 mb-8">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-400">Failed to load track</p>}
      {track && (
        <TrackCard 
          title={track.title}
          artist={track.artist}
          cover={track.cover}
          preview={track.preview}
        />
      )}
    </div>
  )
}

export default App