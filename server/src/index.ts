// Creates an Express app
// Has one route: GET /api/track that just responds with { message: "hello" } for now
// Listens on port 3001


import express, { Request, Response } from 'express'
import axios from 'axios'
import cors from 'cors'


const app = express() // creates actual server instance
app.use(cors())  

const port = 3001



//builds number out of string
const hashSeed = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000
  }
  return hash
}

const GENRES = ['pop', 'rock', 'jazz', 'electronic', 'classical', 'hip-hop', 'soul', 'indie']

//route handler
app.get('/api/track', async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  const date = new Date().toISOString().slice(0, 10)
  const seed = hashSeed(date + userId)
  const genre = GENRES[seed % GENRES.length] //same gene for the same seed
  const offset = seed % 50
  const response = await axios.get(`https://api.deezer.com/search?q=genre:${genre}&limit=1&index=${offset}`)
  
  const track = response.data.data[0] //the first .data is axios unwrapping the response, the second .data is the Deezer array, and [0] gets the first (only) track.
  console.log('genre:', genre, 'offset:', offset, 'results:', response.data.data.length)
  if (!track) {
  res.status(404).json({ error: 'No track found' })
  return
}

  res.json({
  title: track.title,
  artist: track.artist.name,
  cover: track.album.cover_medium,
  preview: track.preview
})

})


// app.listen(port, callback) — starts the server and tells it to watch for requests on port 3001
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


