# Audiomancy — Your Daily Musical Oracle

A mystical fullstack TypeScript web application that draws a personalized soundtrack for you each day, accompanied by an AI-generated poetic reading. Like pulling a daily tarot card, but with music.

## ✦ What it does

- Reveals your unique track through a ceremonial card shuffle and flip animation
- Generates a mystical AI reading based on the song's mood and genre
- Same track and reading all day, new draw at midnight
- Personal to you — different users get different draws

## ✦ The Experience

1. Cards shuffle mysteriously
2. One card settles face-down
3. The card flips to reveal your soundtrack
4. A poetic oracle reading appears below

Each day feels like drawing a tarot card from a musical deck.

## 🎴 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (glassmorphism styling)
- Custom animations (card shuffle, flip reveal)
- Google Fonts (Cinzel — ceremonial typeface)

**Backend:**
- Node.js + Express + TypeScript
- Groq API (AI-generated mystical readings)
- Deezer API (music search and previews)
- In-memory caching (daily reading persistence)
- CORS middleware

**APIs:**
- Deezer — free music catalog with 30s previews
- Groq (Llama 3.3 70B) — poetic fortune-cookie style readings

## 🔮 How the Magic Works

1. **User Identity:** Frontend generates/retrieves unique userId from localStorage
2. **Seeded Selection:** Backend combines userId + today's date → deterministic seed
3. **Track Selection:** Seed picks genre + offset consistently → Deezer returns track
4. **Oracle Reading:** AI receives song metadata → generates mystical 40-word prediction
5. **Caching:** Reading stored in memory so it stays the same all day
6. **Reveal Animation:** Cards shuffle → settle → flip to show your draw

## ✨ Key Features

**Technical:**
- Seed-based randomization for consistency
- AI prompt engineering for mystical tone
- Response caching (one reading per user per day)
- Custom React animation sequencing
- HTML5 Audio API with custom controls
- Progress bar with real-time updates
- Glassmorphism UI with backdrop blur

**Design:**
- Tarot card metaphor throughout
- Ceremonial reveal sequence
- Dark mystical color palette
- Cinzel typeface (ancient/ceremonial feel)
- Short poetic readings (never chatbot-like)

## 🎯 Learning Outcomes

This project demonstrates:
- Fullstack TypeScript architecture
- React hooks (useState, useEffect, useRef)
- Custom hooks for reusable logic
- AI API integration (Groq/LLaMA)
- Prompt engineering for creative outputs
- Animation sequencing and timing
- REST API design with caching
- Seed-based deterministic randomization
- Modern CSS (Tailwind + glassmorphism)
- Product thinking (tarot card framing)
