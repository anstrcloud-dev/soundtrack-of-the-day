// Creates an Express app
// Has one route: GET /api/track that just responds with { message: "hello" } for now
// Listens on port 3001

const readingCache = new Map<string, { reading: string, date: string }>()

import express, { Request, Response } from 'express'
import axios from 'axios'
import cors from 'cors'
import 'dotenv/config'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

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

const GENRES = [
  'pop', 'rock', 'jazz', 'electronic', 'classical', 'hip-hop', 'soul', 'indie',
  'r&b', 'country', 'reggae', 'latin', 'blues', 'metal', 'punk', 'folk',
  'disco', 'funk', 'techno', 'house', 'ambient', 'world', 'afrobeat', 'k-pop'
]



//prediction
const generateReading = async (title: string, artist: string, genre: string, userId: string, date: string) => {
  const cacheKey = `${userId}-${date}`
  const cached = readingCache.get(cacheKey)

  if (cached) {
    return cached.reading
  }





  const prompt = `You are a mystical music oracle.

Given this song, generate a short poetic prediction for the user's day.

Keep it:
- under 40 words
- mysterious
- emotionally evocative
- never cheesy
- never mention AI or being an assistant

Song: "${title}"
Artist: ${artist}
Genre: ${genre}

Generate ONLY the reading, nothing else.`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
  })

  const newReading = completion.choices[0]?.message?.content || "The cards remain silent today."

  readingCache.set(cacheKey, { reading: newReading, date })

  return newReading
}

//tarot card art
const generateCardArt = (reading: string, genre: string) => {
  // Extract key theme from reading
  const theme = reading.split(',')[0].trim()
  
  const prompt = `Modern illustrated tarot card in flat graphic style, single symbolic figure or object representing ${theme}, minimalist composition, ${genre} music aesthetic, rich jewel tones with deep purples blues and gold accents, clean geometric shapes, Art Deco border frame, mystical symbols, vintage poster art style, digital illustration, no text no words no letters, simple bold shapes`
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true&model=flux`
}


//route handler
app.get('/api/track', async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  const date = new Date().toISOString().slice(0, 10)
  const seed = hashSeed(date + userId)
  const dateNumber = new Date().getDate() + new Date().getMonth() * 31  // changes daily
  const userSeed = hashSeed(userId) //user-specific variation
  const genre = GENRES[seed % GENRES.length] //same gene for the same seed
  const offset = ((seed * 7 + userSeed * 13 + dateNumber * 137) % 2000) 
  //const offset = (seed + dateNumber * 137) % 500
  //const response = await axios.get(`https://api.deezer.com/search?q=genre:${genre}&limit=1&index=${offset}`)



  //const track = response.data.data[0] //the first .data is axios unwrapping the response, the second .data is the Deezer array, and [0] gets the first (only) track.
  //console.log('genre:', genre, 'offset:', offset, 'results:', response.data.data.length)

  let track = null
  let attempts = 0
  let currentOffset = offset
  let currentGenre = genre

  while (!track && attempts < 10) {
    const response = await axios.get(`https://api.deezer.com/search?q=genre:${currentGenre}&limit=1&index=${currentOffset}`)

    if (response.data.data[0]) {
      track = response.data.data[0]
    } else {
      currentOffset = (currentOffset + 50) % 500
      if (attempts % 2 === 1) {  // every other attempt, try a new genre
        currentGenre = GENRES[(seed + attempts) % GENRES.length]
      }
      attempts++
    }
  }


  if (!track) {
    res.status(404).json({ error: 'No track found' })
    return
  }

  const reading = await generateReading(track.title, track.artist.name, currentGenre, userId, date)
  //const cardArt = generateCardArt(reading, currentGenre)

  res.json({
    title: track.title,
    artist: track.artist.name,
    cover: track.album.cover_medium,
    preview: track.preview,
    reading: reading,
    //cardArt: cardArt using album cover for now
  })

})


// app.listen(port, callback) — starts the server and tells it to watch for requests on port 3001
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


