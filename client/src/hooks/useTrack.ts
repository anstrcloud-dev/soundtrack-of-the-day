//hook needs to:

//Import useState, useEffect from react
//Import useUserId from ./useUserId
//Import axios from axios
//Three state variables: track (start as null), loading (start as true), error (start as null)
//A useEffect that Fetches from http://localhost:3001/api/track?userId=... and updates states
//Return all three: { track, loading, error }

import { useState, useEffect } from 'react';
import useUserId from './useUserId'
import axios from 'axios'


type Track = {
  title: string
  artist: string
  cover: string
  preview: string
}


const useTrack = () => {
    const userId = useUserId()
    const [track, setTrack] = useState<Track | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/track?userId=${userId}`)
                setTrack(response.data)
                setLoading(false)
            } catch (err) {
                setError(err as Error)
                setLoading(false)
            }
        }
        fetchTrack()
    }, [])

    return { track, loading, error }

}

export default useTrack
