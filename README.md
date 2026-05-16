# Audiomancy — Your Daily Musical Oracle

<p align="center">
  <img src="client/public/audiomancy-preview.png" alt="Audiomancy Card Preview" width="600"/>
</p>

A mystical fullstack TypeScript web application that draws a personalized soundtrack for you each day, accompanied by an AI-generated poetic reading. Like pulling a daily tarot card, but with music.

🔗 **[Live Demo](https://audiomancy.vercel.app)**

## ✦ What it does

- Reveals your unique track through a ceremonial card shuffle and flip animation
- Generates a mystical AI reading based on the song's mood and genre
- Same track and reading all day, new draw at midnight
- Personal to you — different users get different draws
- Save your card as an image or share it instantly

## ✦ The Experience

1. Cards shuffle mysteriously
2. One card settles face-down
3. The card flips to reveal your soundtrack
4. A poetic oracle reading appears below
5. Listen to a preview, then find it on Spotify or Apple Music

Each day feels like drawing a tarot card from a musical deck.

## 🎴 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (glassmorphism styling)
- Custom animations (card shuffle, flip reveal)
- Google Fonts (Cinzel — ceremonial typeface)
- html2canvas (card image generation)

**Backend:**
- Node.js + Express + TypeScript
- Groq API (AI-generated mystical readings)
- Deezer API (music search and previews)
- In-memory caching (daily reading persistence)
- CORS middleware

**Deployment:**
- Frontend: Vercel
- Backend: Render (free tier)

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
- Native share API integration
- Screenshot generation with hidden UI elements

**Design:**
- Tarot card metaphor throughout
- Ceremonial reveal sequence
- Dark mystical color palette (#1a0b2e base)
- Cinzel typeface (ancient/ceremonial feel)
- Short poetic readings (never chatbot-like)
- Glassmorphic action buttons (share/save)

## 🎨 Design Philosophy

**The Tarot Metaphor**  
Everything mirrors the ritual of drawing a tarot card: the shuffle builds anticipation, the flip is the reveal, the reading is the interpretation. Even the language ("Your Card", "oracle", "draw") reinforces this frame.

**Mystical Aesthetics**  
Deep purple (#1a0b2e) evokes night and mystery. Glassmorphism adds ethereal depth. Cinzel font brings ceremonial gravitas. The reading is always poetic, never conversational.

**Deterministic Magic**  
The same seed produces the same result — like how a tarot deck's order is fixed. This makes the experience feel fated rather than random.


## 📝 License

MIT

## 👤 Author

[GitHub](https://github.com/anstrcloud-dev)  
Fullstack TypeScript Developer

---

*Built to demonstrate React expertise, API orchestration, creative UI/UX design, and AI prompt engineering.*