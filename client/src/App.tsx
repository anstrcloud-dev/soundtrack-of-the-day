import useTrack from "./hooks/useTrack"
import TrackCard from "./components/TrackCard"


function App() {
  const { track, loading, error } = useTrack() //call the hook


  return (

    <div>
      <h1>Soundtrack of the day</h1>
      <p>{loading ? 'Loading...' : 'Done!'}</p>
      {track && <TrackCard title={track.title} artist={track.artist} cover={track.cover} preview={track.preview} />}
      <p>{error? 'ERROR' : ''}</p>
    </div>


  )
}

export default App