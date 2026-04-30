// Creates an Express app
// Has one route: GET /api/track that just responds with { message: "hello" } for now
// Listens on port 3001


import express, { Request, Response } from 'express'

const app = express() // creates actual server instance
const port = 3001

app.get('/api/track', (req: Request, res: Response) => {
  res.json({ message: "hello" })
})


// app.listen(port, callback) — starts the server and tells it to watch for requests on port 3001
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})