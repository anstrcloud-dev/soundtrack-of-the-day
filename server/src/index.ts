// Creates an Express app
// Has one route: GET /api/track that just responds with { message: "hello" } for now
// Listens on port 3001


import express, { Request, Response } from 'express'
import axios from 'axios' // An HTTP client used to fetch data from the external Deezer API
import cors from 'cors' // Cross-Origin Resource Sharing middleware
import 'dotenv/config' // Loads environment variables from a .env file
import Groq from 'groq-sdk'

// Initialize groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const app = express()
app.use(cors())

const port = 3001

// In-memory cache for readings
const readingCache = new Map<string, { reading: string, date: string }>()

// Atmospheric word pool to inject deep search variety and stop track repetition
const SEARCH_WORDS = [
  'ghost', 'shadow', 'dream', 'mirror', 'neon', 'velvet', 'echo', 'river', 
  'glass', 'smoke', 'night', 'midnight', 'fever', 'static', 'wild', 'secret',
  'breeze', 'wire', 'heart', 'stone', 'rebel', 'lost', 'found', 'vortex',
  'velvet', 'glitch', 'desert', 'astral', 'chrome', 'signal', 'haze', 'depth'
]

const GENRES = [
  'pop', 'rock', 'jazz', 'electronic', 'classical', 'hip-hop', 'soul', 'indie',
  'r&b', 'country', 'reggae', 'latin', 'blues', 'metal', 'punk', 'folk',
  'disco', 'funk', 'techno', 'house', 'ambient', 'world', 'afrobeat', 'k-pop'
]

// Builds number out of string
const hashSeed = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000
  }
  return hash
}

// Prediction generator
const generateReading = async (title: string, artist: string, genre: string, userId: string, date: string) => {
  const cacheKey = `${userId}-${date}`
  const cached = readingCache.get(cacheKey)

  if (cached) {
    return cached.reading
  }

  const prompt = `You are an oracle generating strange predictions inspired by music.

Requirements:
- under 40 words
- each prediction should feel personal and distinct
- avoid generic mystical language
- avoid inspirational quote style
- avoid random absurdism
- use vivid but meaningful imagery
- leave some ambiguity
- sound like a fragment from a dream, memory, or future event
- sometimes intimate, sometimes unsettling, sometimes beautiful

The oracle listened to this soundtrack before speaking:

Song: "${title}"
Artist: ${artist}
Genre: ${genre}

Write like the user will think about this sentence again later tonight.
Return ONLY the prediction.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
    })

    const newReading = completion.choices[0]?.message?.content || "The cards remain silent today."
    readingCache.set(cacheKey, { reading: newReading, date })
    return newReading
  } catch (error) {
    console.error('Groq API Error:', error)
    return "The stars are obscured by noise right now."
  }
}

// Tarot card art URL generator
const generateCardArt = (reading: string, genre: string) => {
  const theme = reading.split(',')[0].trim()
  const prompt = `Modern illustrated tarot card in flat graphic style, single symbolic figure or object representing ${theme}, minimalist composition, ${genre} music aesthetic, rich jewel tones with deep purples blues and gold accents, clean geometric shapes, Art Deco border frame, mystical symbols, vintage poster art style, digital illustration, no text no words no letters, simple bold shapes`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true&model=flux`
}

// Route handler
app.get('/api/track', async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  
  if (!userId) {
    res.status(400).json({ error: 'Missing userId query parameter' })
    return
  }

  const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  
  // Create deterministic seeds based on date and identity
  const dateSeed = hashSeed(date)
  const userSeed = hashSeed(userId)
  const combinedSeed = hashSeed(date + userId)

  // Dynamically select parameters using layered entropy
  const initialGenre = GENRES[combinedSeed % GENRES.length]
  const randomWord = SEARCH_WORDS[(userSeed + dateSeed) % SEARCH_WORDS.length]
  
  // Shift the offset within a safe index window
  let offset = ((combinedSeed * 17 + userSeed * 31) % 300)

  let track = null
  let attempts = 0
  let currentGenre = initialGenre

  while (!track && attempts < 10) {
    try {
      // Combining the genre and a dynamic concept word cleanly broadens Deezer's catalog matches
      const query = `${currentGenre} ${randomWord}`
      
      const response = await axios.get('https://api.deezer.com/search', {
        params: {
          q: query,
          limit: 10,
          index: offset
        }
      })

      const tracksFound = response.data.data
      
      if (tracksFound && tracksFound.length > 0) {
        // Instead of always picking index 0, pseudo-randomly pick from the 10 results returned
        const chosenIndex = (combinedSeed + attempts) % tracksFound.length
        track = tracksFound[chosenIndex]
      } else {
        // Shuffle parameters if no tracks are encountered
        offset = (offset + 40) % 400
        currentGenre = GENRES[(combinedSeed + attempts) % GENRES.length]
        attempts++
      }
    } catch (error) {
      console.error('Deezer search error during attempt ' + attempts, error)
      offset = (offset + 25) % 400
      attempts++
    }
  }

  if (!track) {
    res.status(404).json({ error: 'No track found after searching alternative wavelengths.' })
    return
  }

  // Fetch the poetic oracle reading
  const reading = await generateReading(track.title, track.artist.name, currentGenre, userId, date)
  const cardArt = generateCardArt(reading, currentGenre)

  res.json({
    title: track.title,
    artist: track.artist.name,
    cover: track.album.cover_medium,
    preview: track.preview,
    reading: reading,
    cardArt: cardArt 
  })
})

// Start server
app.listen(port, () => {
  console.log(`Oracle engine listening on port ${port}`)
})

/*const readingCache = new Map<string, { reading: string, date: string }>() //in memory cache for readings

import express, { Request, Response } from 'express' 
import axios from 'axios' //An HTTP client used to fetch data from the external Deezer API
import cors from 'cors' //Cross-Origin Resource Sharing middleware, which allows your frontend application to talk to this backend
import 'dotenv/config' //Loads environment variables from a .env file (like your API keys) into process.env
import Groq from 'groq-sdk'

//initialize groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const app = express() // creates actual server instance
app.use(cors()) //Cross-Origin Resource Sharing

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





  const prompt = /*`You are a mystical music oracle.

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

Generate ONLY the reading, nothing else.`*/


/*`You are an oracle generating strange predictions inspired by music.

Requirements:
- under 40 words
- each prediction should feel personal and distinct
- avoid generic mystical language
- avoid inspirational quote style
- avoid random absurdism
- use vivid but meaningful imagery
- leave some ambiguity
- sound like a fragment from a dream, memory, or future event
- sometimes intimate, sometimes unsettling, sometimes beautiful

The oracle listened to this soundtrack before speaking:

Song: "${title}"
Artist: ${artist}
Genre: ${genre}

Write like the user will think about this sentence again later tonight.
Return ONLY the prediction.`

/*
Sends the prompt to Groq using the highly efficient llama-3.3-70b-versatile model. 
The temperature of 0.8 allows the model to be creative and poetic rather than overly literal. 
It grabs the text response, caches it for next time, and returns it. 
If anything breaks, it defaults to a mystical fallback string.
*/
 /* const completion = await groq.chat.completions.create({
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
  const userId = req.query.userId as string//extracts the userId from the URL parameters
  const date = new Date().toISOString().slice(0, 10)//creates an YYYY-MM-DD string.
  const seed = hashSeed(date + userId)
  const dateNumber = new Date().getDate() + new Date().getMonth() * 31  // changes daily
  const userSeed = hashSeed(userId) //user-specific variation
  const genre = GENRES[seed % GENRES.length] //same gene for the same seed
  const offset = ((seed * 7 + userSeed * 13 + dateNumber * 137) % 2000) 
  //const offset = (seed + dateNumber * 137) % 500
  //const response = await axios.get(`https://api.deezer.com/search?q=genre:${genre}&limit=1&index=${offset}`)



  //const track = response.data.data[0] //the first .data is axios unwrapping the response, the second .data is the Deezer array, and [0] gets the first (only) track.
  //console.log('genre:', genre, 'offset:', offset, 'results:', response.data.data.length)

  /*
  fallback loop
  if Deezer won't find a song if the calculated offset index is too high for smaller genres
   runs up to 10 times
    If it hits an empty result, it shifts the index offset and switches up the genre until it successfully lands a valid track
  */
  /*let track = null
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




//triggers AI oracle function
//shoots it back to the client application
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
*/


