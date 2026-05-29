//ONE job: fetch track data from API


//hook needs to:

//Import useState, useEffect from react
//Import useUserId from ./useUserId
//Import axios from axios
//Three state variables: track (start as null), loading (start as true), error (start as null)
//A useEffect that Fetches from http://localhost:3001/api/track?userId=... and updates states
//Return all three: { track, loading, error }

import { useState, useEffect } from 'react'
import useUserId from './useUserId'
import axios from 'axios' //tool used to send HTTP requests to backend server


type Track = {
    title: string
    artist: string
    cover: string
    preview: string
    reading: string
    cardArt: string
}


const useTrack = () => {
    const userId = useUserId() //get or create user ID
    const [track, setTrack] = useState<Track | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)


    /*
    Run this code block as soon as the component appears on the screen. 
    Also, if the userId ever changes, run it again.
    */

    useEffect(() => {

        const fetchTrack = async () => {
            try {
                const response = await axios.get(`https://audiomancy-api.onrender.com/api/track?userId=${userId}`)
                //const response = await axios.get(`http://localhost:3001/api/track?userId=${userId}`)
                setTrack(response.data)
                setLoading(false)
            } catch (err) {
                setError(err as Error)
                setLoading(false)
            }
        }
        fetchTrack()
    }, [userId])

    return { track, loading, error } //hook passes its internal states out to whichever component called it

}

export default useTrack //makes this file available to be imported elsewhere in the app
