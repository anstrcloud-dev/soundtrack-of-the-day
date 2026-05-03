# Soundtrack of the Day

A fullstack TypeScript web application that gives you a personalized soundtrack for each day. Built as a hands-on learning project.

## What it does

- Generates a unique track for each user every day
- Same track all day, new one at midnight
- 30-second preview with custom audio player
- Glassmorphic UI with progress bar

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Custom hooks for state management

**Backend:**
- Node.js + Express + TypeScript
- Axios for API requests
- CORS middleware

**External API:**
- Deezer API (free music search)

## How it works

1. Frontend generates/retrieves a unique userId from localStorage
2. Backend combines userId + today's date → seed number
3. Seed picks a genre and offset consistently
4. Deezer API returns a track
5. Frontend displays cover, title, artist, and playable preview
