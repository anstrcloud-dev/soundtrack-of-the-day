import useTrack from "./hooks/useTrack"

function App() {
  const { track, loading, error } = useTrack() //call the hook


  return (

    <div>
      <h1>Soundtrack of the day</h1>
      <p>{loading ? 'Loading...' : 'Done!'}</p>
      <p>{JSON.stringify(track)}</p>
      <p>{error? 'ERROR' : ''}</p>
    </div>


  )
}

export default App